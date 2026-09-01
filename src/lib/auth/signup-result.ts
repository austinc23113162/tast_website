type SignupIdentity = {
  id?: string;
};

export type SignupAuthResult = {
  user: { identities?: SignupIdentity[] | null } | null;
  session: unknown;
};

export const DUPLICATE_EMAIL_SIGNUP_MESSAGE =
  "An account with this email already exists. Log in instead.";

export const SIGNUP_RATE_LIMIT_MESSAGE =
  "This site has hit its email rate limit. Try signing up again later.";

export const SIGNUP_EMAIL_TIMEOUT_MESSAGE =
  "Confirmation email timed out. Check your inbox, or wait a moment and try again.";

export function isSignupRateLimitError(
  error: { code?: string; message?: string; status?: number } | null | undefined
): boolean {
  if (!error) {
    return false;
  }

  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    code === "over_email_send_rate_limit" ||
    error.status === 429 ||
    message.includes("rate limit") ||
    message.includes("for security purposes")
  );
}

export function isSignupEmailTimeoutError(
  error: { code?: string; message?: string; status?: number } | null | undefined
): boolean {
  if (!error) {
    return false;
  }

  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    code === "request_timeout" ||
    error.status === 504 ||
    message.includes("context deadline exceeded") ||
    message.includes("timeout")
  );
}

export function signupFailureMessage(
  error: { code?: string; message?: string; status?: number }
): string {
  if (isDuplicateSignupError(error)) {
    return DUPLICATE_EMAIL_SIGNUP_MESSAGE;
  }

  if (isSignupRateLimitError(error)) {
    return SIGNUP_RATE_LIMIT_MESSAGE;
  }

  if (isSignupEmailTimeoutError(error)) {
    return SIGNUP_EMAIL_TIMEOUT_MESSAGE;
  }

  return "Could not create an account. Try a different email or log in.";
}

export function isDuplicateEmailSignup(data: SignupAuthResult): boolean {
  const identities = data.user?.identities;
  return Array.isArray(identities) && identities.length === 0;
}

export function isDuplicateSignupError(
  error: { code?: string; message?: string } | null | undefined
): boolean {
  if (!error) {
    return false;
  }

  const code = error.code?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already exists")
  );
}
