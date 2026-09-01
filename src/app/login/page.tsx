import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { PageShell } from "@/components/layout/page-hero";
import { getSafeInternalPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Log in",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
    checkEmail?: string;
    confirmed?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeInternalPath(params.next);
  const callbackFailed = params.error === "callback" || params.error === "auth";
  const checkEmail = params.checkEmail === "1";
  const emailConfirmed = params.confirmed === "1";

  return (
    <PageShell
      title="Log in"
      description="Sign in to manage your TAST profile."
      eyebrow="Members"
    >
      <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        {emailConfirmed ? (
          <p
            role="status"
            className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
          >
            Your email is confirmed. Log in to continue.
          </p>
        ) : null}
        {checkEmail && !emailConfirmed ? (
          <p
            role="status"
            className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
          >
            Check your email to confirm your account, then log in.
          </p>
        ) : null}
        {callbackFailed ? (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            Could not complete sign-in. Try logging in again.
          </p>
        ) : null}
        <LoginForm nextPath={nextPath} />
        <p className="mt-4 text-sm text-muted-foreground">
          New to TAST?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
