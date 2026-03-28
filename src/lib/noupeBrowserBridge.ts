"use client";

declare global {
    interface Window {
        /** Populated by `NoupeChatbot`; use in DevTools to confirm the bridge. */
        __GB_NOUPE_BRIDGE__?: {
            listening: boolean;
            ingestKeyConfigured: boolean;
            noupeScriptUrlConfigured: boolean;
        };
    }
}

/**
 * Listens for postMessage events from Noupe / Jotform chat iframes and POSTs debounced
 * payloads to `/api/integrations/noupe-chat` → Resend.
 *
 * Noupe does not document this channel; if their widget never posts to the parent window,
 * nothing is sent — use the webhook + Zapier path or Noupe’s own email in that case.
 */

const DEBOUNCE_MS = 5000;
const ORDER_DEBOUNCE_MS = 1200;
const MIN_CHARS = 24;
const MAX_SENDS_PER_HOUR = 14;
const STORAGE_COUNT = "gb-noupe-ingest-hour-count";
const STORAGE_RESET = "gb-noupe-ingest-hour-reset";
const STORAGE_LAST_HASH = "gb-noupe-ingest-last-hash";
const DEDUPE_WINDOW_MS = 120_000;

/**
 * Normalized (lowercase, punctuation collapsed) phrases → `kind: order_intent` in the API payload.
 * Extend if Noupe’s copy differs; use dev `console.debug` on each postMessage to inspect real text.
 */
const ORDER_INTENT_PHRASES: string[] = [
    "thank you for your order",
    "thanks for your order",
    "thank you for shopping",
    "thanks for shopping",
    "order submitted",
    "your order has been",
    "order has been received",
    "payment request received",
    "submission complete",
    "we will process",
    "will be delivered to",
    "your order for",
    "order confirmation",
    "confirmed your order",
];

function normalizeForOrderIntent(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function detectOrderIntentFromText(text: string): boolean {
    const n = normalizeForOrderIntent(text);
    if (!n) return false;
    for (const p of ORDER_INTENT_PHRASES) {
        if (n.includes(p)) return true;
    }
    if (n.includes("thank you") && n.includes("order")) return true;
    if (n.includes("thanks") && n.includes("order")) return true;
    return false;
}

/**
 * Verbose bridge logs: on in local `next dev`; on Vercel only if `NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG=1` (unset after debugging).
 */
const BRIDGE_DEBUG =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG === "1";

const rejectedOriginLog = new Set<string>();
const MAX_REJECTED_ORIGIN_LOGS = 40;

function previewPayload(s: string, max = 220): string {
    const t = s.replace(/\s+/g, " ").trim();
    return t.length <= max ? t : `${t.slice(0, max)}…`;
}

/**
 * Hosts that may embed the chat iframe. Suffix-based only (no broad substring match on "jotform").
 * If messages are ignored in dev, enable Verbose in the console and check `postMessage seen` origins.
 */
export function isAllowedBridgeOrigin(origin: string): boolean {
    try {
        const hostname = new URL(origin).hostname.toLowerCase();
        if (hostname === "noupe.com" || hostname.endsWith(".noupe.com")) return true;
        if (hostname === "jotform.com" || hostname.endsWith(".jotform.com")) return true;
        if (hostname === "jotfor.ms" || hostname.endsWith(".jotfor.ms")) return true;
        return false;
    } catch {
        return false;
    }
}

function stringifyMessageData(data: unknown): string {
    if (data == null) return "";
    if (typeof data === "string") {
        try {
            const p = JSON.parse(data) as unknown;
            return typeof p === "object" && p !== null ? JSON.stringify(p, null, 2) : data;
        } catch {
            return data;
        }
    }
    if (typeof data === "object") {
        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return String(data);
        }
    }
    return String(data);
}

function simpleHash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return String(h);
}

function hourBucketOk(): boolean {
    try {
        const now = Date.now();
        const reset = parseInt(sessionStorage.getItem(STORAGE_RESET) || "0", 10);
        if (!reset || now - reset > 3_600_000) {
            sessionStorage.setItem(STORAGE_RESET, String(now));
            sessionStorage.setItem(STORAGE_COUNT, "0");
        }
        const c = parseInt(sessionStorage.getItem(STORAGE_COUNT) || "0", 10);
        if (c >= MAX_SENDS_PER_HOUR) return false;
        sessionStorage.setItem(STORAGE_COUNT, String(c + 1));
        return true;
    } catch {
        return true;
    }
}

function dedupeOk(hash: string): boolean {
    try {
        const prev = sessionStorage.getItem(STORAGE_LAST_HASH);
        const prevAt = parseInt(sessionStorage.getItem(`${STORAGE_LAST_HASH}-at`) || "0", 10);
        const now = Date.now();
        if (prev === hash && now - prevAt < DEDUPE_WINDOW_MS) return false;
        sessionStorage.setItem(STORAGE_LAST_HASH, hash);
        sessionStorage.setItem(`${STORAGE_LAST_HASH}-at`, String(now));
        return true;
    } catch {
        return true;
    }
}

let bridgeAttached = false;

/** True after `initNoupeBrowserBridge()` attached the `message` listener (requires ingest key). */
export function isNoupeBrowserBridgeListening(): boolean {
    return bridgeAttached;
}

export function initNoupeBrowserBridge(): void {
    const raw = process.env.NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY?.trim();
    if (!raw) return;
    if (bridgeAttached) return;
    bridgeAttached = true;
    const ingestKey: string = raw;

    const buffer: string[] = [];
    let timer: ReturnType<typeof setTimeout> | null = null;

    function sendPayload(text: string, orderIntent: boolean) {
        if (text.length < MIN_CHARS) {
            if (BRIDGE_DEBUG) {
                console.warn("[Noupe bridge] skip POST: combined text shorter than MIN_CHARS", {
                    length: text.length,
                    min: MIN_CHARS,
                });
            }
            return;
        }
        if (!hourBucketOk()) {
            if (BRIDGE_DEBUG) {
                console.warn("[Noupe bridge] skip POST: hourly send cap reached (see sessionStorage gb-noupe-ingest-*)");
            }
            return;
        }

        const hash = simpleHash(text.slice(-2000));
        if (!dedupeOk(hash)) {
            if (BRIDGE_DEBUG) {
                console.info("[Noupe bridge] skip POST: duplicate payload hash within dedupe window", hash);
            }
            return;
        }

        const body = JSON.stringify({
            kind: orderIntent ? "order_intent" : "transcript",
            text,
            pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
            metadata: { source: "noupe-browser-bridge" },
        });

        if (BRIDGE_DEBUG) {
            console.info("[Noupe bridge] forwarding to POST /api/integrations/noupe-chat", {
                kind: orderIntent ? "order_intent" : "transcript",
                textChars: text.length,
            });
        }

        void fetch("/api/integrations/noupe-chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-noupe-browser-ingest-key": ingestKey,
            },
            body,
        })
            .then(async (res) => {
                const snippet = previewPayload(await res.text(), 400);
                if (BRIDGE_DEBUG) {
                    if (res.ok) {
                        console.info("[Noupe bridge] API response OK", res.status, snippet);
                    } else {
                        console.warn("[Noupe bridge] API response error", res.status, snippet);
                    }
                }
            })
            .catch((err) => {
                if (BRIDGE_DEBUG) {
                    console.error("[Noupe bridge] fetch failed", err);
                }
            });
    }

    function flushFromBuffer() {
        const text = buffer.join("\n\n---\n\n");
        buffer.length = 0;
        const orderIntent = detectOrderIntentFromText(text);
        if (BRIDGE_DEBUG) {
            console.info("[Noupe bridge] flush buffer → sendPayload", {
                chars: text.length,
                orderIntent,
            });
        }
        sendPayload(text, orderIntent);
    }

    function scheduleDebounced() {
        if (timer) clearTimeout(timer);
        const joined = buffer.join("\n\n---\n\n");
        const ms = detectOrderIntentFromText(joined) ? ORDER_DEBOUNCE_MS : DEBOUNCE_MS;
        timer = setTimeout(() => {
            timer = null;
            flushFromBuffer();
        }, ms);
    }

    function handleMessage(ev: MessageEvent) {
        if (BRIDGE_DEBUG) {
            console.debug("[Noupe bridge] postMessage seen", { origin: ev.origin });
        }

        if (!isAllowedBridgeOrigin(ev.origin)) {
            if (
                BRIDGE_DEBUG &&
                rejectedOriginLog.size < MAX_REJECTED_ORIGIN_LOGS &&
                !rejectedOriginLog.has(ev.origin)
            ) {
                rejectedOriginLog.add(ev.origin);
                console.info(
                    "[Noupe bridge] ignored postMessage (origin not allowed). Compare with Verbose `postMessage seen` logs; edit isAllowedBridgeOrigin() if Noupe uses a new host (keep suffix rules strict).",
                    ev.origin
                );
            }
            return;
        }

        const line = stringifyMessageData(ev.data);
        if (line.length < 2) {
            if (BRIDGE_DEBUG) {
                console.info("[Noupe bridge] accepted origin but payload empty/too short after stringify", {
                    origin: ev.origin,
                    rawType: typeof ev.data,
                });
            }
            return;
        }

        if (BRIDGE_DEBUG) {
            console.info("[Noupe bridge] accepted postMessage", {
                origin: ev.origin,
                extractedChars: line.length,
                preview: previewPayload(line),
            });
        }

        buffer.push(`[${ev.origin}]\n${line}`);

        const joined = buffer.join("\n\n---\n\n");
        if (detectOrderIntentFromText(joined)) {
            if (BRIDGE_DEBUG) {
                console.info("[Noupe bridge] order-intent phrase detected → short debounce flush", ORDER_DEBOUNCE_MS);
            }
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                flushFromBuffer();
            }, ORDER_DEBOUNCE_MS);
            return;
        }
        if (BRIDGE_DEBUG) {
            console.info("[Noupe bridge] debounce scheduled (ms)", DEBOUNCE_MS);
        }
        scheduleDebounced();
    }

    window.addEventListener("message", handleMessage);

    if (BRIDGE_DEBUG) {
        console.info(
            "[Noupe bridge] listener registered → debounced POST /api/integrations/noupe-chat. Allowed origins (suffix match): *.noupe.com, *.jotform.com, *.jotfor.ms. Enable Console → Verbose to see every postMessage origin."
        );
    }
}
