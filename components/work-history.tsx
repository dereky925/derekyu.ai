import { FadeIn } from "@/components/fade-in";
import { education, employers } from "@/lib/experience";
import { site } from "@/lib/site";

export function WorkHistory() {
  return (
    <div className="max-w-3xl">
      <FadeIn>
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-sm text-muted">Experience</h2>
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
        {employers.map((employer) => (
          <li
            key={employer.company}
            className="grid grid-cols-[6.5rem_1fr] gap-6 py-5 sm:grid-cols-[8.5rem_1fr]"
          >
            <p className="text-sm text-muted">{employer.period}</p>
            <div>
              <p>{employer.company}</p>
              <p className="mt-1 text-sm text-muted">{employer.headline}</p>
            </div>
          </li>
        ))}
      </ol>

      <FadeIn>
        <h2 className="mt-16 text-sm text-muted">School</h2>
        <ul className="mt-4 divide-y divide-border border-t border-border">
          {education.map((item) => (
            <li
              key={item.school}
              className="grid grid-cols-[6.5rem_1fr] gap-6 py-5 sm:grid-cols-[8.5rem_1fr]"
            >
              <p className="text-sm text-muted">{item.period}</p>
              <div>
                <p>{item.school}</p>
                <p className="mt-1 text-sm text-muted">{item.credential}</p>
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
