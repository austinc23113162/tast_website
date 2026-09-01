"use client";

import { useActionState } from "react";

import { FormError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createEventAction,
  updateEventAction,
  type AdminFormState,
} from "@/lib/admin/actions";
import { toDatetimeLocalValue } from "@/lib/datetime";
import type { Tables } from "@/types/database";

const initialState: AdminFormState = {};

type EventFormProps = {
  event?: Tables<"events">;
};

export function EventForm({ event }: EventFormProps) {
  const action = event
    ? updateEventAction.bind(null, event.id)
    : createEventAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12"
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={200}
            defaultValue={event?.title ?? ""}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location ?? ""}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="startTime">Starts</Label>
            <Input
              id="startTime"
              name="startTime"
              type="datetime-local"
              required
              defaultValue={
                event ? toDatetimeLocalValue(event.start_time) : ""
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="endTime">Ends</Label>
            <Input
              id="endTime"
              name="endTime"
              type="datetime-local"
              defaultValue={
                event?.end_time ? toDatetimeLocalValue(event.end_time) : ""
              }
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="registrationUrl">RSVP URL</Label>
          <Input
            id="registrationUrl"
            name="registrationUrl"
            type="url"
            placeholder="https://"
            defaultValue={event?.registration_url ?? ""}
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            className="min-h-48 lg:min-h-[19.5rem]"
            defaultValue={event?.description ?? ""}
          />
        </div>
        <FormError message={state.error} />
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : event ? "Save event" : "Create event"}
          </Button>
        </div>
      </div>
    </form>
  );
}
