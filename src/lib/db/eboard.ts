import { createClient } from "@/lib/supabase/server";
import type { PublicEboardMember } from "@/types";
import type { Tables } from "@/types/database";

type EboardQueryRow = Tables<"eboard_members"> & {
  profiles:
    | {
        full_name: string;
        major: string | null;
        class_year: number | null;
      }
    | {
        full_name: string;
        major: string | null;
        class_year: number | null;
      }[]
    | null;
};

function mapEboardRow(row: EboardQueryRow): PublicEboardMember {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: row.id,
    position: row.position,
    bio: row.bio,
    display_order: row.display_order,
    academic_year: row.academic_year,
    full_name: profile?.full_name ?? "TAST member",
    major: profile?.major ?? null,
    class_year: profile?.class_year ?? null,
  };
}

export async function listEboardMembers(): Promise<PublicEboardMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eboard_members")
    .select(
      "id, user_id, position, bio, display_order, academic_year, profiles ( full_name, major, class_year )"
    )
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error("Could not load E-Board members.");
  }

  return ((data ?? []) as EboardQueryRow[]).map(mapEboardRow);
}

export async function getEboardMemberById(
  id: string
): Promise<(Tables<"eboard_members"> & { email: string | null }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eboard_members")
    .select(
      "id, user_id, position, bio, display_order, academic_year, profiles ( email )"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load this E-Board member.");
  }

  if (!data) {
    return null;
  }

  const profile = Array.isArray(data.profiles)
    ? data.profiles[0]
    : data.profiles;

  return {
    id: data.id,
    user_id: data.user_id,
    position: data.position,
    bio: data.bio,
    display_order: data.display_order,
    academic_year: data.academic_year,
    email: profile?.email ?? null,
  };
}

export async function createEboardMember(values: {
  userId: string;
  position: string;
  bio: string | null;
  displayOrder: number;
  academicYear: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("eboard_members").insert({
    user_id: values.userId,
    position: values.position,
    bio: values.bio,
    display_order: values.displayOrder,
    academic_year: values.academicYear,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("That member is already on the E-Board.");
    }
    throw new Error("Could not add the E-Board member.");
  }
}

export async function updateEboardMember(
  id: string,
  values: {
    position: string;
    bio: string | null;
    displayOrder: number;
    academicYear: string;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("eboard_members")
    .update({
      position: values.position,
      bio: values.bio,
      display_order: values.displayOrder,
      academic_year: values.academicYear,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Could not update the E-Board member.");
  }
}

export async function deleteEboardMember(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("eboard_members").delete().eq("id", id);

  if (error) {
    throw new Error("Could not remove the E-Board member.");
  }
}
