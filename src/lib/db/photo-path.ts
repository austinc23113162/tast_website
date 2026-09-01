const PUBLIC_PREFIX = "/storage/v1/object/public/event-photos/";

export function storagePathFromPublicUrl(imageUrl: string): string | null {
  const index = imageUrl.indexOf(PUBLIC_PREFIX);
  if (index === -1) {
    return null;
  }
  return decodeURIComponent(imageUrl.slice(index + PUBLIC_PREFIX.length));
}
