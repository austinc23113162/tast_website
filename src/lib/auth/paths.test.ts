import assert from "node:assert/strict";
import { test } from "node:test";

import { isAuthPage, isProtectedPath } from "./paths.ts";

test("member and admin routes are protected", () => {
  assert.equal(isProtectedPath("/account"), true);
  assert.equal(isProtectedPath("/account/attendance"), true);
  assert.equal(isProtectedPath("/admin"), true);
  assert.equal(isProtectedPath("/admin/events"), true);
});

test("public and auth routes are not protected", () => {
  assert.equal(isProtectedPath("/"), false);
  assert.equal(isProtectedPath("/events"), false);
  assert.equal(isProtectedPath("/about"), false);
  assert.equal(isProtectedPath("/login"), false);
  assert.equal(isProtectedPath("/signup"), false);
  assert.equal(isProtectedPath("/attendance"), false);
});

test("login and signup are auth pages", () => {
  assert.equal(isAuthPage("/login"), true);
  assert.equal(isAuthPage("/signup"), true);
  assert.equal(isAuthPage("/account"), false);
});
