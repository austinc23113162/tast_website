export function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="status"
      className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
    >
      {message}
    </p>
  );
}
