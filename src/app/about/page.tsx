import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About TAST"
      description="Who we are and what we do at Tufts."
      emptyTitle="Full story coming soon"
      emptyDescription="This page will cover TAST’s mission, history, and how to get involved."
    />
  );
}
