"use client";

import { useEffect } from "react";
import { initNoupeBrowserBridge, isNoupeBrowserBridgeListening } from "@/lib/noupeBrowserBridge";

const SCRIPT_ID = "gourmetbakes-noupe-chatbot";

/** Matches bridge verbose mode: dev server, or `NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG=1` on Vercel. */
const NOUPE_VERBOSE_LOGS =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_NOUPE_BRIDGE_DEBUG === "1";

/**
 * Loads the [Noupe](https://www.noupe.com/) AI support widget.
 *
 * **Train Noupe on production:** `https://gourmetbakes.vercel.app` (public pages only;
 * Noupe cannot crawl localhost.)
 *
 * 1. Noupe dashboard → **Train** → enter `https://gourmetbakes.vercel.app` → Train.
 * 2. Noupe dashboard → **Get Your Code** (or equivalent) → copy the `<script src="...">` URL (and optional ID).
 * 3. Set `NEXT_PUBLIC_NOUPE_SCRIPT_URL` in **Vercel → Project → Settings → Environment Variables**
 *    (Production) and redeploy. Use `.env.local` for local dev only.
 *
 * If your snippet uses a separate widget/site ID attribute, set `NEXT_PUBLIC_NOUPE_WIDGET_ID`
 * (`data-widget-id` on the script tag). If the ID is already in the script URL, omit it.
 *
 * **Orders vs chat:** Chat is not website checkout. With `NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY` set,
 * the browser bridge forwards iframe postMessages to `/api/integrations/noupe-chat` → Resend when
 * Noupe’s host allows it. See README → “Noupe + Resend”.
 * Noupe may not offer a custom system-prompt UI; see “Orders vs chat (Noupe widget limits)” for training,
 * `NoupeOrderHint`, and optional text to send Noupe support.
 *
 * @see https://www.noupe.com/embed-guide
 */
export function NoupeChatbot() {
    useEffect(() => {
        const src = process.env.NEXT_PUBLIC_NOUPE_SCRIPT_URL?.trim();
        const ingestKeyConfigured = !!process.env.NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY?.trim();

        if (!src) {
            if (typeof window !== "undefined") {
                window.__GB_NOUPE_BRIDGE__ = {
                    listening: false,
                    ingestKeyConfigured,
                    noupeScriptUrlConfigured: false,
                };
                if (NOUPE_VERBOSE_LOGS && ingestKeyConfigured) {
                    console.warn(
                        "[Noupe] NEXT_PUBLIC_NOUPE_SCRIPT_URL is not set — widget and bridge will not load. Status:",
                        window.__GB_NOUPE_BRIDGE__
                    );
                }
            }
            return;
        }

        initNoupeBrowserBridge();

        if (typeof window !== "undefined") {
            window.__GB_NOUPE_BRIDGE__ = {
                listening: isNoupeBrowserBridgeListening(),
                ingestKeyConfigured,
                noupeScriptUrlConfigured: true,
            };
            if (NOUPE_VERBOSE_LOGS) {
                if (ingestKeyConfigured && isNoupeBrowserBridgeListening()) {
                    console.info(
                        "[Noupe] Browser bridge initialized — postMessage → /api/integrations/noupe-chat. Status:",
                        window.__GB_NOUPE_BRIDGE__
                    );
                } else {
                    console.warn(
                        "[Noupe] Widget script URL is set but browser bridge is inactive — add NEXT_PUBLIC_NOUPE_BROWSER_INGEST_KEY and restart dev. Status:",
                        window.__GB_NOUPE_BRIDGE__
                    );
                }
            }
        }

        if (document.getElementById(SCRIPT_ID)) return;

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = src;
        script.async = true;

        const widgetId = process.env.NEXT_PUBLIC_NOUPE_WIDGET_ID?.trim();
        if (widgetId) {
            script.setAttribute("data-widget-id", widgetId);
        }

        document.body.appendChild(script);

        return () => {
            document.getElementById(SCRIPT_ID)?.remove();
        };
    }, []);

    return null;
}
