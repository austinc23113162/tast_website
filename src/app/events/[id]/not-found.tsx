import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { SiteContainer } from "@/components/layout/site-container";

export default function EventNotFound() {
  return (
    <SiteContainer id="main-content">
      <PageHeader title="Event not found" />
      <EmptyState
        title="We could not find that event"
        description="It may have been removed, or the link might be incorrect. Browse upcoming events from the calendar."
      />
    </SiteContainer>
  );
}
