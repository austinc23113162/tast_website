"use client";

import { ContentError } from "@/components/layout/content-error";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SiteContainer id="main-content">
      <PageHeader title="Unable to load this page" />
      <ContentError onRetry={reset} />
    </SiteContainer>
  );
}
