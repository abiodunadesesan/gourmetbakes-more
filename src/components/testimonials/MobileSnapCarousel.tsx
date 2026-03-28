"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Props = {
  /** One slide per item; each slide should be full width of the viewport strip. */
  items: ReactNode[];
  /** Extra classes on the scroll container */
  className?: string;
  dotClassName?: string;
  /**
   * Auto-advance interval in milliseconds. Set to `0` to disable.
   * Disabled automatically when `prefers-reduced-motion: reduce`.
   * @default 3000
   */
  autoPlayMs?: number;
  /**
   * After the last slide, jump to the first (instant) so the loop never ends.
   * @default true
   */
  infinite?: boolean;
  /**
   * After the user swipes, taps a dot, or touches the carousel, pause autoplay
   * for this many ms before resuming.
   * @default 6000
   */
  pauseAfterInteractionMs?: number;
};

const DEFAULT_AUTO_MS = 3000;
const DEFAULT_PAUSE_RESUME_MS = 6000;

/**
 * Horizontal scroll-snap carousel (touch swipe + dot controls).
 * Optional autoplay with infinite loop; dots stay in sync via scroll events only.
 */
export function MobileSnapCarousel({
  items,
  className = "",
  dotClassName = "",
  autoPlayMs = DEFAULT_AUTO_MS,
  infinite = true,
  pauseAfterInteractionMs = DEFAULT_PAUSE_RESUME_MS,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pausedAfterInteractionRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const effectiveAutoPlay =
    reducedMotion || autoPlayMs <= 0 ? 0 : autoPlayMs;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseAutoplayForInteraction = useCallback(() => {
    pausedAfterInteractionRef.current = true;
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      pausedAfterInteractionRef.current = false;
      resumeTimerRef.current = null;
    }, pauseAfterInteractionMs);
  }, [clearResumeTimer, pauseAfterInteractionMs]);

  const updateActive = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setActive(Math.max(0, Math.min(idx, items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    const ro = new ResizeObserver(updateActive);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateActive);
      ro.disconnect();
    };
  }, [updateActive]);

  const advance = useCallback(() => {
    const el = ref.current;
    if (!el || items.length <= 1 || document.hidden) return;
    if (pausedAfterInteractionRef.current) return;

    const w = el.clientWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    const n = items.length;
    const clamped = Math.max(0, Math.min(idx, n - 1));
    const next = (clamped + 1) % n;

    if (infinite && clamped === n - 1 && next === 0) {
      el.scrollTo({ left: 0, behavior: "auto" });
      return;
    }
    el.scrollTo({ left: next * w, behavior: "smooth" });
  }, [items.length, infinite]);

  useEffect(() => {
    if (items.length <= 1 || effectiveAutoPlay <= 0) return;

    const id = window.setInterval(advance, effectiveAutoPlay);
    return () => window.clearInterval(id);
  }, [advance, effectiveAutoPlay, items.length]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const goTo = (i: number) => {
    pauseAutoplayForInteraction();
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div
      onPointerDownCapture={() => pauseAutoplayForInteraction()}
      className="min-w-0 w-full max-w-full"
    >
      <div
        ref={ref}
        className={[
          "flex min-h-0 min-w-0 w-full max-w-full overflow-x-auto snap-x snap-mandatory gap-0 touch-pan-x",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        ].join(" ")}
      >
        {items.map((node, i) => (
          <div
            key={i}
            className="box-border flex min-h-0 min-w-0 w-full max-w-full shrink-0 snap-center snap-always flex-col items-stretch justify-start px-1"
          >
            {node}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div
          className={["flex justify-center gap-2 mt-6", dotClassName].join(" ")}
          role="tablist"
          aria-label="Slide indicators"
        >
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial ${i + 1} of ${items.length}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
                i === active ? "w-8 bg-orange-500" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
