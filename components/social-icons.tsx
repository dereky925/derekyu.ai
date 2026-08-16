import { site, socials } from "@/lib/site";

const icons = {
  Email: "/icons/gmail.svg",
  GitHub: "/icons/github.svg",
  X: "/icons/x.svg",
  LinkedIn: "/icons/linkedin.svg",
} as const;

export function SocialLinks() {
  const links = [
    { label: "Email" as const, href: `mailto:${site.email}` },
    ...socials,
  ];

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
      {links.map((link) => {
        const icon = icons[link.label];
        const external = link.href.startsWith("http");
        return (
          <li key={link.href}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <img
                src={icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 invert"
              />
              <span>{link.label === "Email" ? site.email : link.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
