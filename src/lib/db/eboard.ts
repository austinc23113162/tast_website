import { placeholderEboard } from "@/lib/db/placeholders";
import type { PublicEboardMember } from "@/types";

export async function listEboardMembers(): Promise<PublicEboardMember[]> {
  return [...placeholderEboard].sort(
    (a, b) => a.display_order - b.display_order
  );
}
