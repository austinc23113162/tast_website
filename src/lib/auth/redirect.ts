export function getSafeInternalPath(
  value: string | null | undefined,
  fallback = "/account"
): string {
  if (value == null || value === "") {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  return value;
}
