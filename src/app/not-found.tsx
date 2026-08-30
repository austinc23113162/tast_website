import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";

export default function NotFound() {
  return (
    <SiteContainer id="main-content">
      <PageHeader title="Page not found" />
      <EmptyState
        title="That page does not exist"
        description="Check the URL, or use the navigation to find events, about, and contact pages."
      />
    </SiteContainer>
  );
}
