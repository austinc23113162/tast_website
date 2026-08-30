type ContentLoadingProps = {
  label?: string;
};

export function ContentLoading({
  label = "Loading page content",
}: ContentLoadingProps) {
  return (
    <div className="mt-10 space-y-4" role="status" aria-label={label}>
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
