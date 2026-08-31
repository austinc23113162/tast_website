"use client";

import { Pin } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatAnnouncementDate } from "@/lib/datetime";
import type { Tables } from "@/types/database";

type AnnouncementCardProps = {
  announcement: Tables<"announcements">;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const dateLabel = formatAnnouncementDate(announcement.created_at);

  return (
    <Dialog>
      <DialogTrigger
        className="content-card relative flex h-full min-h-0 w-full flex-col rounded-xl border border-border bg-card p-5 pr-10 text-left outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`Open announcement: ${announcement.title}`}
      >
        <Pin
          className="pointer-events-none absolute top-2 right-2.5 size-5 rotate-45 text-accent"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {dateLabel}
        </p>
        <p className="mt-1 line-clamp-1 text-lg font-semibold leading-snug break-words text-foreground">
          {announcement.title}
        </p>
        <p className="mt-1 line-clamp-4 min-h-[4lh] flex-1 text-sm leading-relaxed break-words text-muted-foreground">
          {announcement.content}
        </p>
      </DialogTrigger>
      <DialogContent className="max-h-[min(80vh,36rem)] overflow-y-auto">
        <DialogHeader>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {dateLabel}
          </p>
          <DialogTitle className="font-sans text-lg font-semibold leading-snug text-foreground">
            {announcement.title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="font-sans whitespace-pre-wrap text-sm leading-relaxed break-words text-muted-foreground">
          {announcement.content}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
