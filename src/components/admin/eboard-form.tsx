"use client";

import { useActionState } from "react";

import { FormError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createEboardMemberAction,
  updateEboardMemberAction,
  type AdminFormState,
} from "@/lib/admin/actions";

const initialState: AdminFormState = {};

type EboardFormProps = {
  member?: {
    id: string;
    position: string;
    bio: string | null;
    display_order: number;
    academic_year: string;
    email: string | null;
  };
};

export function EboardForm({ member }: EboardFormProps) {
  const action = member
    ? updateEboardMemberAction.bind(null, member.id)
    : createEboardMemberAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12"
    >
      <div className="grid gap-4">
        {member ? (
          <p className="text-sm text-muted-foreground">
            Member email: {member.email ?? "Unknown"}
          </p>
        ) : (
          <div className="grid gap-1.5">
            <Label htmlFor="email">Member email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              The person must already have a TAST account.
            </p>
          </div>
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            required
            maxLength={120}
            defaultValue={member?.position ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="displayOrder">Display order</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              min={0}
              max={999}
              required
              defaultValue={member?.display_order ?? 0}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="academicYear">Academic year</Label>
            <Input
              id="academicYear"
              name="academicYear"
              required
              maxLength={40}
              placeholder="2026–2027"
              defaultValue={member?.academic_year ?? ""}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            className="min-h-40 lg:min-h-[16.5rem]"
            defaultValue={member?.bio ?? ""}
          />
        </div>
        <FormError message={state.error} />
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : member ? "Save member" : "Add member"}
          </Button>
        </div>
      </div>
    </form>
  );
}
