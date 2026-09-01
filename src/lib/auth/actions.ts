"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSiteOrigin } from "@/lib/auth/origin";
import { getSafeInternalPath } from "@/lib/auth/redirect";
import {
  DUPLICATE_EMAIL_SIGNUP_MESSAGE,
  isDuplicateEmailSignup,
  signupFailureMessage,
} from "@/lib/auth/signup-result";
import { updateOwnProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  profileSchema,
  signupSchema,
} from "@/lib/validations/auth";

export type AuthFormState = {
  error?: string;
};

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Check the form and try again.";
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Confirm your email before signing in." };
    }
    return { error: "Invalid email or password." };
  }

  redirect(getSafeInternalPath(parsed.data.next));
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  const origin = await getSiteOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${origin}/auth/callback?next=/account`,
    },
  });

  if (error) {
    return { error: signupFailureMessage(error) };
  }

  if (isDuplicateEmailSignup(data)) {
    return { error: DUPLICATE_EMAIL_SIGNUP_MESSAGE };
  }

  if (!data.session) {
    redirect("/login?checkEmail=1");
  }

  redirect("/account");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("Could not log out. Try again.");
  }
  redirect("/");
}

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    classYear: formData.get("classYear"),
    major: formData.get("major") ?? "",
  });

  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }

  const classYear =
    parsed.data.classYear === "" || parsed.data.classYear == null
      ? null
      : parsed.data.classYear;
  const major =
    parsed.data.major == null || parsed.data.major === ""
      ? null
      : parsed.data.major;

  try {
    await updateOwnProfile({
      fullName: parsed.data.fullName,
      classYear,
      major,
    });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Could not save your profile.";
    return { error: message };
  }

  revalidatePath("/account");
  return { success: true };
}
