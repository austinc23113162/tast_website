import type { ReactNode } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <main id="main-content" className="flex-1">
      <PageHero
        eyebrow="E-Board"
        title="Admin"
        description="Create and update events, announcements, E-Board profiles, photos, and attendance."
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />
        {children}
      </div>
    </main>
  );
}
