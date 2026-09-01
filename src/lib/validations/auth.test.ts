import assert from "node:assert/strict";
import { test } from "node:test";

import { loginSchema, profileSchema, signupSchema } from "./auth.ts";

test("loginSchema accepts a valid email and password", () => {
  const result = loginSchema.safeParse({
    email: "member@tufts.edu",
    password: "password1",
  });
  assert.equal(result.success, true);
});

test("loginSchema rejects a short password", () => {
  const result = loginSchema.safeParse({
    email: "member@tufts.edu",
    password: "short",
  });
  assert.equal(result.success, false);
});

test("signupSchema requires a name", () => {
  const missing = signupSchema.safeParse({
    fullName: "  ",
    email: "member@tufts.edu",
    password: "password1",
  });
  assert.equal(missing.success, false);

  const ok = signupSchema.safeParse({
    fullName: "Alex Chen",
    email: "member@tufts.edu",
    password: "password1",
  });
  assert.equal(ok.success, true);
});

test("profileSchema allows empty class year and validates range", () => {
  const emptyYear = profileSchema.safeParse({
    fullName: "Alex Chen",
    classYear: "",
    major: "Biology",
  });
  assert.equal(emptyYear.success, true);

  const badYear = profileSchema.safeParse({
    fullName: "Alex Chen",
    classYear: "1999",
  });
  assert.equal(badYear.success, false);
});
