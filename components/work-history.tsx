import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import {
  education,
  employers,
  extras,
  licenses,
} from "@/lib/experience";
import { site } from "@/lib/site";

export function WorkHistory() {
  return (
    <div className="max-w-3xl">
      <FadeIn>
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm text-muted">Experience</p>
            <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
              Work history
            </h2>
          </div>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </FadeIn>

      <ol className="divide-y divide-border border-t border-border">
        {employers.map((employer, index) => (
          <FadeIn key={employer.company} delay={Math.min(index * 0.04, 0.12)}>
            <li className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-[8.5rem_1fr] sm:gap-8">
              <p className="text-sm text-muted">{employer.period}</p>
              <div>
                <h3 className="text-lg tracking-tight">{employer.company}</h3>
                <div className="mt-6 space-y-8">
                  {employer.roles.map((role) => (
                    <div key={`${role.title}-${role.period}`}>
                      <p className="text-foreground">{role.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {[role.team, role.location, role.period]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {role.summary ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {role.summary}
                        </p>
                      ) : null}
                      {role.href ? (
                        <a
                          href={role.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm text-muted transition-colors hover:text-foreground"
                        >
                          {role.linkLabel ?? "Link"}
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </FadeIn>
        ))}
      </ol>

      <FadeIn>
        <h2 className="mt-20 text-sm text-muted">Education</h2>
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {education.map((item) => (
            <li
              key={item.school}
              className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
            >
              <p className="text-sm text-muted">{item.period}</p>
              <div>
                <p>{item.school}</p>
                <p className="mt-1 text-sm text-muted">{item.credential}</p>
                {item.detail ? (
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn>
        <h2 className="mt-16 text-sm text-muted">Licenses</h2>
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {licenses.map((item) => (
            <li
              key={item.name}
              className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
            >
              <p className="text-sm text-muted">{item.period}</p>
              <div>
                <p>{item.name}</p>
                <p className="mt-1 text-sm text-muted">{item.issuer}</p>
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn>
        <h2 className="mt-16 text-sm text-muted">Also</h2>
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {extras.map((item) => (
            <li
              key={`${item.period}-${item.title}`}
              className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-8"
            >
              <p className="text-sm text-muted">{item.period}</p>
              <div>
                {item.title === "xAI Hackathon" && item.period === "2026" ? (
                  <Link
                    href="/projects/grokeye"
                    className="transition-opacity hover:opacity-70"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <p>{item.title}</p>
                )}
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
