import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { PageShell } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <PageShell
      title="Sign up"
      description="Create a member account to keep your name, class year, and major on file."
      eyebrow="Members"
    >
      <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <SignupForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
