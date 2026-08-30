export type PublicNavItem = {
  href: string;
  label: string;
};

export const publicNavItems: readonly PublicNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/events/past", label: "Past Events" },
  { href: "/eboard", label: "E-Board" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/attendance", label: "Attendance" },
] as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/events") {
    return (
      pathname === "/events" ||
      (pathname.startsWith("/events/") &&
        pathname !== "/events/past" &&
        !pathname.startsWith("/events/past/"))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
