"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroField } from "@/components/hero-field";
import { SocialLinks } from "@/components/social-icons";
import { site } from "@/lib/site";

export function HomeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={rootRef}
      className="relative left-1/2 min-h-[100svh] w-screen -translate-x-1/2 overflow-hidden -mt-14"
    >
      <HeroField />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
      <motion.div
        className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-6 pb-16 pt-28 sm:pb-24"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="text-sm text-muted"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          Costa Mesa, CA
        </motion.p>
        <motion.h1
          className="mt-3 max-w-4xl text-5xl font-medium tracking-tight sm:text-7xl lg:text-8xl"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
        >
          {site.name}
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-lg leading-snug tracking-tight text-muted sm:text-2xl"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          Modeling & Simulation Engineer at Anduril.
          <br />
          Aerospace Engineer by trade. Closeted tech bro.
        </motion.p>
        <motion.div
          className="pointer-events-auto"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
