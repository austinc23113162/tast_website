import assert from "node:assert/strict";
import { test } from "node:test";

import { getSafeInternalPath } from "./redirect.ts";

test("accepts relative app paths", () => {
  assert.equal(getSafeInternalPath("/account"), "/account");
  assert.equal(getSafeInternalPath("/account/attendance"), "/account/attendance");
});

test("rejects open redirects and falls back", () => {
  assert.equal(getSafeInternalPath("https://evil.example"), "/account");
  assert.equal(getSafeInternalPath("//evil.example"), "/account");
  assert.equal(getSafeInternalPath("/\\evil"), "/account");
  assert.equal(getSafeInternalPath(null, "/events"), "/events");
  assert.equal(getSafeInternalPath("", "/events"), "/events");
});
