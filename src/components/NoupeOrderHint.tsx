"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "gb-noupe-order-hint-dismissed";

/**
 * Small notice near the chat FAB: chat does not place orders; checkout is on /menu.
 * Only mounts when `NEXT_PUBLIC_NOUPE_SCRIPT_URL` is set.
 */
export function NoupeOrderHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_NOUPE_SCRIPT_URL?.trim()) return;
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        return;
      }
    } catch {
      /* ignore */
    }
    setShow(true);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-24 left-4 z-[90] max-w-[min(calc(100vw-2rem),18.5rem)] rounded-xl border border-slate-200/80 bg-white/95 p-3 pr-9 text-xs leading-snug text-slate-600 shadow-lg shadow-slate-900/10 backdrop-blur-md sm:bottom-28 sm:left-6 sm:text-[13px]"
      role="status"
    >
      <p className="font-medium text-slate-800">
        Chat is for questions only — it does{" "}
        <span className="font-bold text-slate-900">not</span> send orders to our kitchen or email.
      </p>
      <p className="mt-2">
        <Link
          href="/menu"
          className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-2 hover:text-orange-700"
        >
          Order on the Menu
        </Link>{" "}
        and use checkout so we receive your order.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Dismiss notice"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
