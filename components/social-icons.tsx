import { site, socials } from "@/lib/site";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 6.5h16v11H4v-11Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M13.6 10.47 20.4 3h-1.6l-5.9 6.5L8.1 3H3.2l7.1 10.04L3.2 21h1.6l6.2-6.84L15.9 21h4.9L13.6 10.47ZM9.2 4.3l8.6 15.4h-1.7L7.4 4.3H9.2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M6.54 8.57H3.96V20h2.58V8.57ZM5.25 4C4.37 4 3.7 4.68 3.7 5.52c0 .83.66 1.52 1.53 1.52h.02c.88 0 1.54-.69 1.54-1.52C6.77 4.68 6.12 4 5.25 4ZM20 20h-2.57v-5.9c0-1.4-.5-2.36-1.75-2.36-.95 0-1.52.65-1.77 1.27-.09.23-.11.54-.11.86V20H11.2s.03-9.3 0-10.26h2.58v1.45c.34-.53 1.03-1.3 2.51-1.3 1.83 0 3.21 1.21 3.21 3.8V20Z" />
    </svg>
  );
}

const icons = {
  Email: MailIcon,
  GitHub: GitHubIcon,
  X: XIcon,
  LinkedIn: LinkedInIcon,
} as const;

export function SocialLinks() {
  const links = [
    { label: "Email" as const, href: `mailto:${site.email}` },
    ...socials,
  ];

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
      {links.map((link) => {
        const Icon = icons[link.label];
        const external = link.href.startsWith("http");
        return (
          <li key={link.href}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              {Icon ? <Icon /> : null}
              <span>{link.label === "Email" ? site.email : link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
