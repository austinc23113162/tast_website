import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DUPLICATE_EMAIL_SIGNUP_MESSAGE,
  SIGNUP_EMAIL_TIMEOUT_MESSAGE,
  SIGNUP_RATE_LIMIT_MESSAGE,
  isDuplicateEmailSignup,
  isDuplicateSignupError,
  isSignupEmailTimeoutError,
  isSignupRateLimitError,
  signupFailureMessage,
} from "./signup-result.ts";

test("treats an empty identities list as an existing email", () => {
  assert.equal(
    isDuplicateEmailSignup({
      user: { identities: [] },
      session: null,
    }),
    true
  );
});

test("treats a new user with an identity as a real signup", () => {
  assert.equal(
    isDuplicateEmailSignup({
      user: { identities: [{ id: "identity-1" }] },
      session: null,
    }),
    false
  );
});

test("does not flag a missing user as a duplicate", () => {
  assert.equal(isDuplicateEmailSignup({ user: null, session: null }), false);
});

test("recognizes duplicate signup API errors", () => {
  assert.equal(
    isDuplicateSignupError({ code: "user_already_exists" }),
    true
  );
  assert.equal(
    isDuplicateSignupError({ message: "User already registered" }),
    true
  );
  assert.equal(
    isDuplicateSignupError({ message: "Invalid login credentials" }),
    false
  );
});

test("maps email rate-limit errors to a wait message", () => {
  assert.equal(
    isSignupRateLimitError({ code: "over_email_send_rate_limit", status: 429 }),
    true
  );
  assert.equal(
    signupFailureMessage({ code: "over_email_send_rate_limit", status: 429 }),
    SIGNUP_RATE_LIMIT_MESSAGE
  );
  assert.equal(
    signupFailureMessage({ code: "user_already_exists" }),
    DUPLICATE_EMAIL_SIGNUP_MESSAGE
  );
  assert.equal(
    signupFailureMessage({ message: "smtp exploded" }),
    "Could not create an account. Try a different email or log in."
  );
});

test("maps confirmation email timeouts", () => {
  assert.equal(
    isSignupEmailTimeoutError({
      code: "request_timeout",
      status: 504,
      message: "context deadline exceeded",
    }),
    true
  );
  assert.equal(
    signupFailureMessage({ code: "request_timeout", status: 504 }),
    SIGNUP_EMAIL_TIMEOUT_MESSAGE
  );
});
