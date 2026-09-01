"use client";

import { Button } from "@/components/ui/button";

type ConfirmDeleteButtonProps = {
  action: () => void | Promise<void>;
  label: string;
  message: string;
};

export function ConfirmDeleteButton({
  action,
  label,
  message,
}: ConfirmDeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive">
        {label}
      </Button>
    </form>
  );
}
