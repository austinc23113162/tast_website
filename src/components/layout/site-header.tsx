import Link from "next/link";

import { SiteNav } from "@/components/layout/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          TAST
          <span className="ml-2 hidden font-normal text-muted-foreground sm:inline">
            at Tufts
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
