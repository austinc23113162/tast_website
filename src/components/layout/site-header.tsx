import Link from "next/link";

import { SiteNav } from "@/components/layout/site-nav";
import { getAuthUserId } from "@/lib/auth/session";

export async function SiteHeader() {
  const signedIn = Boolean(await getAuthUserId());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-foreground"
        >
          TAST
        </Link>
        <SiteNav signedIn={signedIn} />
      </div>
    </header>
  );
}
