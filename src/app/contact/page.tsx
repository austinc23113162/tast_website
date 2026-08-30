import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact"
      description="Reach the TAST E-Board with questions or collaboration ideas."
      emptyTitle="Contact details coming soon"
      emptyDescription="Email and social links will be added here. For now, find us through Tufts student organization listings."
    />
  );
}
