"use client";

import { useActionState } from "react";

import { FormError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addAttendanceAction,
  type AdminFormState,
} from "@/lib/admin/actions";

const initialState: AdminFormState = {};

type AttendanceFormProps = {
  eventId: string;
};

export function AttendanceForm({ eventId }: AttendanceFormProps) {
  const [state, formAction, pending] = useActionState(
    addAttendanceAction,
    initialState
  );

  return (
    <form action={formAction} className="grid max-w-xl gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="grid gap-1.5">
        <Label htmlFor="email">Member email</Label>
        <Input id="email" name="email" type="email" required autoComplete="off" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Check in"}
      </Button>
      <div className="sm:col-span-2">
        <FormError message={state.error} />
      </div>
    </form>
  );
}
