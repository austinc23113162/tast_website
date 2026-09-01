import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminHomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Events</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add upcoming events, edit details, upload photos, and manage check-ins.
        </p>
        <Button className="mt-4" render={<Link href="/admin/events" />}>
          Manage events
        </Button>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Announcements</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Publish notes that appear on the homepage.
        </p>
        <Button className="mt-4" render={<Link href="/admin/announcements" />}>
          Manage announcements
        </Button>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">E-Board</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Link member accounts to public officer profiles.
        </p>
        <Button className="mt-4" render={<Link href="/admin/eboard" />}>
          Manage E-Board
        </Button>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Attendance</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manually add or remove check-ins for an event.
        </p>
        <Button className="mt-4" render={<Link href="/admin/attendance" />}>
          Manage attendance
        </Button>
      </section>
    </div>
  );
}
