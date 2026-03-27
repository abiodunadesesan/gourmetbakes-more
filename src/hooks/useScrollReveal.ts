"use client";

import { useEffect, useRef } from "react";

/**
 * Adds IntersectionObserver-based scroll-reveal to any element with
 * the class `.reveal` or `.reveal-stagger` inside `containerRef`.
 * Adding `.visible` triggers the CSS transitions defined in globals.css.
 */
export function useScrollReveal() {
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger");
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target); // animate once
                    }
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return containerRef;
}
