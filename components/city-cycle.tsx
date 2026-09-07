"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const cities = [
  "New York City, NY",
  "Baltimore, MD",
  "Phoenix, AZ",
  "Los Angeles, CA",
] as const;

/** Must match `.animate-city-rainbow-pulse` duration in globals.css */
const PULSE_MS = 1700;
/** Brief beat after the gleam exits, before flipping */
const GRAY_HOLD_MS = 60;
const REDUCE_HOLD_MS = 2400;

/**
 * Cycles lived-in cities with a gray underline that gets a
 * left→right rainbow pulse (like the reference screen recording).
 * City only flips after the gleam has crossed and the bar is gray again.
 */
export function CityCycle({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const delay = reduce ? REDUCE_HOLD_MS : PULSE_MS + GRAY_HOLD_MS;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % cities.length);
    }, delay);
    return () => window.clearTimeout(id);
  }, [index, reduce]);

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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/35"
        >
          {!reduce ? (
            <span
              key={`gleam-${city}`}
              className="absolute inset-y-0 left-0 w-[140%] animate-city-rainbow-pulse rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, #7b2cbf, #ff4d6d, #ff9f1c, #ffd60a, #80ed99, #4cc9f0, transparent)",
              }}
            />
          ) : null}
        </span>
      </span>
    </span>
  );
}
