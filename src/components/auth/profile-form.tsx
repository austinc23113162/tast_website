"use client";

import { useActionState } from "react";

import { FormError, FormSuccess } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updateProfileAction,
  type ProfileFormState,
} from "@/lib/auth/actions";
import type { OwnProfile } from "@/lib/db/profiles";

const initialState: ProfileFormState = {};

type ProfileFormProps = {
  profile: OwnProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState
  );

  return (
    <form action={formAction} className="grid max-w-md gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={profile.full_name}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="classYear">Class year</Label>
        <Input
          id="classYear"
          name="classYear"
          type="number"
          inputMode="numeric"
          min={2000}
          max={2100}
          placeholder="2028"
          defaultValue={profile.class_year ?? ""}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="major">Major</Label>
        <Input
          id="major"
          name="major"
          type="text"
          maxLength={120}
          placeholder="Optional"
          defaultValue={profile.major ?? ""}
        />
      </div>
      {profile.email ? (
        <p className="text-sm text-muted-foreground">
          Email: {profile.email}
        </p>
      ) : null}
      <FormError message={state.error} />
      {state.success ? (
        <FormSuccess message="Profile saved." />
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
