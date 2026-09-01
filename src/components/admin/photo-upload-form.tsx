"use client";

import { useActionState } from "react";

import { FormError } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  uploadEventPhotoAction,
  type AdminFormState,
} from "@/lib/admin/actions";

const initialState: AdminFormState = {};

type PhotoUploadFormProps = {
  eventId: string;
};

export function PhotoUploadForm({ eventId }: PhotoUploadFormProps) {
  const [state, formAction, pending] = useActionState(
    uploadEventPhotoAction,
    initialState
  );

  return (
    <form action={formAction} className="grid max-w-3xl gap-3">
      <input type="hidden" name="eventId" value={eventId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid min-w-0 flex-1 gap-1.5">
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Upload photo"}
        </Button>
      </div>
      <FormError message={state.error} />
    </form>
  );
}
