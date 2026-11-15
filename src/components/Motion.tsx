"use client";

import { useEffect } from "react";

/**
 * Drives the page's scroll animations.
 *
 * Progressive enhancement: the document only opts into the hidden starting
 * state once this mounts, so every `[data-reveal]` section stays visible when
 * JavaScript is unavailable. Honours `prefers-reduced-motion`, in which case
 * elements are revealed immediately and counters jump to their final value.
 *
 * Markup contract:
 *   data-reveal              — fade and rise into view
 *   data-reveal-delay="120"  — stagger, in milliseconds
 *   data-count-to="220"      — count up to this number when scrolled into view
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const counters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count-to]"),
    );

    if (reduced) {
      revealTargets.forEach((el) => el.setAttribute("data-reveal-in", "true"));
      counters.forEach((el) => {
        el.textContent = el.getAttribute("data-count-to") ?? el.textContent;
      });
      return;
    }

    root.setAttribute("data-reveal-ready", "true");

    revealTargets.forEach((el) => {
      const delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.transitionDelay = `${delay}ms`;
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal-in", "true");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    const frames: number[] = [];
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          countObserver.unobserve(el);

          const target = Number(el.getAttribute("data-count-to") ?? "0");
          if (!Number.isFinite(target) || target <= 0) return;

          const duration = 1100;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = String(Math.round(target * eased));
            if (progress < 1) frames.push(requestAnimationFrame(tick));
          };

          frames.push(requestAnimationFrame(tick));
        });
      },
      { threshold: 0.4 },
    );
    counters.forEach((el) => countObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      frames.forEach((id) => cancelAnimationFrame(id));
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
