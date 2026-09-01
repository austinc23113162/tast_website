import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { PhotoUploadForm } from "@/components/admin/photo-upload-form";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { deleteEventPhotoAction } from "@/lib/admin/actions";
import { getEventById } from "@/lib/db/events";
import { listEventPhotos } from "@/lib/db/photos";

type EventPhotosPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EventPhotosPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? `Photos · ${event.title}` : "Event not found" };
}

export default async function EventPhotosPage({ params }: EventPhotosPageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  const photos = await listEventPhotos(event.id);

  return (
    <div className="grid gap-10">
      <div>
        <Button
          variant="ghost"
          render={<Link href={`/admin/events/${event.id}/edit`} />}
        >
          Back to event
        </Button>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Photos · {event.title}
        </h2>
      </div>
      <PhotoUploadForm eventId={event.id} />
      {photos.length === 0 ? (
        <EmptyState
          title="No photos yet"
          description="Upload a JPEG, PNG, WebP, or GIF up to 10 MB."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={photo.image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex justify-end p-3">
                <ConfirmDeleteButton
                  action={deleteEventPhotoAction.bind(null, photo)}
                  label="Remove"
                  message="Remove this photo?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
