import { ContentLoading } from "@/components/layout/content-loading";
import { SiteContainer } from "@/components/layout/site-container";

export default function EventDetailLoading() {
  return (
    <SiteContainer id="main-content">
      <ContentLoading label="Loading event" />
    </SiteContainer>
  );
}
