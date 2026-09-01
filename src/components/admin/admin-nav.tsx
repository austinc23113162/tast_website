"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavItems, isAdminNavItemActive } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="mb-8 overflow-x-auto">
      <ul className="flex gap-1 border-b border-border pb-px">
        {adminNavItems.map((item) => {
          const active = isAdminNavItemActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-block rounded-t-md px-3 py-2 text-sm font-medium",
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
  );
}
