import { Mail } from "lucide-react";

const socialLinks = [
  {
    href: "#",
    label: "Instagram",
    hint: "Link coming soon",
  },
  {
    href: "#",
    label: "Facebook",
    hint: "Link coming soon",
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">TAST</span>
          <span className="mx-2 text-border">·</span>
          Taiwanese Association of Students at Tufts
        </p>
        <ul className="flex flex-row flex-wrap items-center gap-x-5 gap-y-1">
          {socialLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                aria-label={`${item.label} (${item.hint})`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="mailto:tast@tufts.edu"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              tast@tufts.edu
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
