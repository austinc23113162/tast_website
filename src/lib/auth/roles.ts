export type AppRole = "member" | "admin";

export const APP_ROLES = ["member", "admin"] as const satisfies readonly AppRole[];

export function isAdmin(role: AppRole | null | undefined): boolean {
  return role === "admin";
}
