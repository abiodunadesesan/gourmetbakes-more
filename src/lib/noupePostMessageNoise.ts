/**
 * Noupe's widget posts many internal UI events over postMessage (embed ready, context changes, etc.).
 * The browser bridge must not treat those as chat transcripts or the shop gets empty "lead" emails.
 */

/** Known non-conversational `action` values from Noupe embed postMessages. */
export const IGNORED_NOUPE_ACTIONS = new Set([
    "embed-listener-ready",
    "copilot-selected-questions",
    "active-context-changed",
    "chat-mode-changed",
    "agent-response-received",
    "agent-has-user-messages",
    "agent-owner-username-passed",
]);

const CONVERSATION_KEYS = [
    "text",
    "content",
    "message",
    "body",
    "userMessage",
    "assistantMessage",
    "answer",
    "question",
] as const;

function hasConversationLikeString(obj: Record<string, unknown>, minLen: number): boolean {
    for (const k of CONVERSATION_KEYS) {
        const v = obj[k];
        if (typeof v === "string" && v.trim().length >= minLen) return true;
    }
    const msgs = obj.messages;
    if (Array.isArray(msgs)) {
        for (const m of msgs) {
            if (m && typeof m === "object") {
                const c = (m as Record<string, unknown>).content;
                if (typeof c === "string" && c.trim().length >= minLen) return true;
            }
        }
    }
    return false;
}

/**
 * Returns true if this postMessage payload should not be buffered for /api/integrations/noupe-chat.
 */
export function shouldIgnoreNoupePostMessage(data: unknown): boolean {
    let obj: Record<string, unknown> | null = null;

    if (typeof data === "string") {
        const t = data.trim();
        if (t.length === 0) return true;
        try {
            const p = JSON.parse(t) as unknown;
            if (p && typeof p === "object" && !Array.isArray(p)) obj = p as Record<string, unknown>;
            else return false;
        } catch {
            return false;
        }
    } else if (data && typeof data === "object" && !Array.isArray(data)) {
        obj = data as Record<string, unknown>;
    } else {
        return false;
    }

    if (hasConversationLikeString(obj, 8)) {
        return false;
    }

    const action = obj.action;
    if (typeof action === "string" && IGNORED_NOUPE_ACTIONS.has(action)) {
        return true;
    }

    const keys = Object.keys(obj);
    if (keys.length === 1 && obj.chatID != null) {
        return true;
    }
    if (keys.length === 1 && obj.chatMode != null) {
        return true;
    }
    if (keys.length <= 2 && obj.chatID != null && obj.chatMode != null) {
        return true;
    }

    if (obj.isFirstQuestion === true && obj.source === "ai-agent-conversation" && !hasConversationLikeString(obj, 8)) {
        return true;
    }

    return false;
}

/**
 * After debouncing, skip emailing if the combined buffer is only Noupe UI noise (browser bridge).
 */
export function isBrowserBridgeNoiseOnlyTranscript(text: string): boolean {
    const trimmed = text.trim();
    if (trimmed.length < 12) return true;

    const blocks = trimmed.split(/\n\n---\n\n/);
    let sawSubstantive = false;

    for (let block of blocks) {
        block = block.replace(/^\[[^\]]+]\n?/m, "").trim();
        if (!block) continue;

        try {
            const obj = JSON.parse(block) as Record<string, unknown>;
            if (hasConversationLikeString(obj, 10)) {
                sawSubstantive = true;
                break;
            }
            const action = obj.action;
            if (typeof action === "string" && IGNORED_NOUPE_ACTIONS.has(action)) {
                continue;
            }
            if (Object.keys(obj).length === 1 && obj.chatID != null) continue;
            if (Object.keys(obj).length === 1 && obj.chatMode != null) continue;

            const letters = block.replace(/[^\p{L}]/gu, "");
            if (letters.length >= 15) {
                sawSubstantive = true;
                break;
            }
        } catch {
            const letters = block.replace(/[^\p{L}]/gu, "");
            if (letters.length >= 15) {
                sawSubstantive = true;
                break;
            }
        }
    }

    return !sawSubstantive;
}
