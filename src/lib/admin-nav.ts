export type AdminNavItem = {
  href: string;
  label: string;
};

export const adminNavItems: readonly AdminNavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/eboard", label: "E-Board" },
  { href: "/admin/attendance", label: "Attendance" },
] as const;

export function isAdminNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
