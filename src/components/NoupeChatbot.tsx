"use client";

import { useEffect } from "react";

const SCRIPT_ID = "gourmetbakes-noupe-chatbot";

/**
 * Loads the [Noupe](https://www.noupe.com/) AI support widget.
 *
 * 1. Sign up at Noupe → **Train** with your live site URL (it crawls public pages).
 * 2. Customize → **Get Your Code** → copy the `<script src="...">` URL (and optional ID).
 * 3. Set `NEXT_PUBLIC_NOUPE_SCRIPT_URL` in `.env.local` to that script `src` value.
 *
 * If your snippet uses a separate widget/site ID attribute, set `NEXT_PUBLIC_NOUPE_WIDGET_ID`
 * (sent as `data-widget-id` on the script tag). If the ID is already in the script URL, omit it.
 *
 * @see https://www.noupe.com/embed-guide
 */
export function NoupeChatbot() {
    useEffect(() => {
        const src = process.env.NEXT_PUBLIC_NOUPE_SCRIPT_URL?.trim();
        if (!src) return;

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
