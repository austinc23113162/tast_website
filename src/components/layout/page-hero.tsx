import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
};

export function PageHero({
  title,
  description,
  eyebrow = "TAST",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-primary",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--accent)_35%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,color-mix(in_oklch,var(--primary-foreground)_12%,transparent),transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-sm font-medium tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

type PageShellProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  eyebrow,
  children,
}: PageShellProps) {
  return (
    <main id="main-content" className="flex-1">
      <PageHero title={title} description={description} eyebrow={eyebrow} />
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </div>
    </main>
  );
}
