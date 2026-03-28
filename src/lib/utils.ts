import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Textareas: long text wraps inside the field; extra height scrolls vertically.
 * Pair with `rows` / `min-h-*` as needed.
 */
export const textareaFitClasses =
    "min-w-0 break-words [overflow-wrap:anywhere] whitespace-pre-wrap resize-y overflow-y-auto max-h-[min(24rem,50vh)]";

/** Shorter max height for small message fields */
export const textareaFitCompactClasses =
    "min-w-0 break-words [overflow-wrap:anywhere] whitespace-pre-wrap resize-y overflow-y-auto max-h-[min(14rem,35vh)]";

/** Format a number as Nigerian Naira: ₦1,234.50 */
export function formatCurrency(amount: number): string {
    return (
        "₦" +
        amount.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    )
}

/** Format a date as "15 Jan 2024" */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

/** Format a date as relative time (e.g. "2 days ago") */
export function formatTimeAgo(date: string | Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
}
