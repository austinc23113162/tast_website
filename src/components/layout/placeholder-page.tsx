import { EmptyState } from "@/components/layout/empty-state";
import { PageShell } from "@/components/layout/page-hero";

type PlaceholderPageProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  eyebrow?: string;
};

export function PlaceholderPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  eyebrow,
}: PlaceholderPageProps) {
  return (
    <PageShell title={title} description={description} eyebrow={eyebrow}>
      <EmptyState title={emptyTitle} description={emptyDescription} />
    </PageShell>
  );
}
