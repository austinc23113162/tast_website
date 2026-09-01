"use client";

import { useActionState } from "react";

import { FormError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  type AdminFormState,
} from "@/lib/admin/actions";
import type { Tables } from "@/types/database";

const initialState: AdminFormState = {};

type AnnouncementFormProps = {
  announcement?: Tables<"announcements">;
};

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const action = announcement
    ? updateAnnouncementAction.bind(null, announcement.id)
    : createAnnouncementAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="grid gap-6 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12"
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={200}
            defaultValue={announcement?.title ?? ""}
          />
        </div>
        <FormError message={state.error} />
        <div className="hidden lg:block">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : announcement
                ? "Save announcement"
                : "Publish announcement"}
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="content">Body</Label>
          <Textarea
            id="content"
            name="content"
            required
            className="min-h-48 lg:min-h-[19.5rem]"
            defaultValue={announcement?.content ?? ""}
          />
        </div>
        <div className="lg:hidden">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : announcement
                ? "Save announcement"
                : "Publish announcement"}
          </Button>
        </div>
      </div>
    </form>
  );
}
