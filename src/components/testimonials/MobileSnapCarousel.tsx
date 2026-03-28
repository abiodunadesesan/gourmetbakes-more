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
};

/**
 * Horizontal scroll-snap carousel (touch swipe + dot controls).
 * Active dot follows scroll position.
 */
export function MobileSnapCarousel({
  items,
  className = "",
  dotClassName = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div>
      <div
        ref={ref}
        className={[
          "flex overflow-x-auto snap-x snap-mandatory gap-0 touch-pan-x",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        ].join(" ")}
      >
        {items.map((node, i) => (
          <div
            key={i}
            className="min-w-full shrink-0 snap-center snap-always box-border px-0.5"
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
