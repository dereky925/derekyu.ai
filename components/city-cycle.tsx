"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const cities = [
  "New York City, NY",
  "Baltimore, MD",
  "Phoenix, AZ",
  "Los Angeles, CA",
] as const;

const HOLD_MS = 2600;

/**
 * Cycles lived-in cities with a rainbow shimmer underline
 * (replaces the old “NYC → LA” line on the About hero).
 */
export function CityCycle({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % cities.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const city = cities[index]!;

  return (
    <span className={`relative inline-flex min-h-[1.15em] items-end ${className}`}>
      <span className="relative inline-block overflow-hidden pb-[0.14em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={city}
            className="inline-block whitespace-nowrap text-foreground"
            initial={reduce ? false : { y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: "-110%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {city}
          </motion.span>
        </AnimatePresence>
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[length:220%_100%] ${
            reduce ? "" : "animate-city-rainbow"
          }`}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #ff4d6d, #ff9f1c, #ffd60a, #80ed99, #4cc9f0, #7b2cbf, #ff4d6d)",
          }}
        />
      </span>
    </span>
  );
}
