"use client";

import { Button } from "@/components/ui/button";

type ContentErrorProps = {
  title?: string;
  description?: string;
  onRetry: () => void;
};

export function ContentError({
  title = "Something went wrong",
  description = "This page could not be loaded. Try again in a moment.",
  onRetry,
}: ContentErrorProps) {
  return (
    <div
      className="mt-10 rounded-xl border border-border bg-card px-6 py-12 text-center"
      role="alert"
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Button className="mt-6" type="button" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
