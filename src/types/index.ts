export type { Database, Enums, Tables, TablesInsert, TablesUpdate } from "./database";
export type { AppRole } from "../lib/auth/roles";

export type PublicEboardMember = {
  id: string;
  position: string;
  bio: string | null;
  display_order: number;
  academic_year: string;
  full_name: string;
  major: string | null;
  class_year: number | null;
};
