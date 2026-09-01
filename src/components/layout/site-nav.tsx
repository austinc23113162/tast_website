"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOutAction } from "@/lib/auth/actions";
import { isNavItemActive, publicNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SiteNavProps = {
  signedIn: boolean;
  isAdmin: boolean;
};

function AuthControls({
  signedIn,
  isAdmin,
  onNavigate,
  className,
}: {
  signedIn: boolean;
  isAdmin: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  if (signedIn) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {isAdmin ? (
          <Button variant="ghost" render={<Link href="/admin" />} onClick={onNavigate}>
            Admin
          </Button>
        ) : null}
        <Button variant="ghost" render={<Link href="/account" />} onClick={onNavigate}>
          Account
        </Button>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button variant="ghost" render={<Link href="/login" />} onClick={onNavigate}>
        Log in
      </Button>
      <Button render={<Link href="/signup" />} onClick={onNavigate}>
        Sign up
      </Button>
    </div>
  );
}

export function SiteNav({ signedIn, isAdmin }: SiteNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden items-center gap-3 lg:flex">
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {publicNavItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <AuthControls signedIn={signedIn} isAdmin={isAdmin} />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="lg:hidden"
          render={
            <Button variant="ghost" size="icon" aria-label="Open menu" />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Primary" className="px-2 pb-6">
            <ul className="flex flex-col gap-1">
              {publicNavItems.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-sm font-medium",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-border pt-4">
              <AuthControls
                signedIn={signedIn}
                isAdmin={isAdmin}
                className="flex-col items-stretch"
                onNavigate={() => setOpen(false)}
              />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
