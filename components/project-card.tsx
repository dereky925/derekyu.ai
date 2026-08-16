"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
  priority?: boolean;
};

export function ProjectCard({
  project,
  featured = false,
  priority = false,
}: ProjectCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div
          className={`relative overflow-hidden rounded-2xl bg-surface ${
            featured ? "aspect-[16/9]" : "aspect-[16/10]"
          }`}
        >
          <Image
            src={project.poster}
            alt={`${project.title} still`}
            fill
            priority={priority}
            sizes={
              featured
                ? "100vw"
                : "(min-width: 768px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div>
            <h2
              className={`tracking-tight text-foreground ${
                featured ? "text-2xl sm:text-3xl" : "text-lg"
              }`}
            >
              {project.title}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              {project.summary}
            </p>
          </div>
          <p className="shrink-0 text-sm text-muted">
            {project.year} · {project.role}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
