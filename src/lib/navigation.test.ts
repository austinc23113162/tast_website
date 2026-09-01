import assert from "node:assert/strict";
import { test } from "node:test";

import { isNavItemActive } from "./navigation.ts";

test("home is active only on the root path", () => {
  assert.equal(isNavItemActive("/", "/"), true);
  assert.equal(isNavItemActive("/events", "/"), false);
});

test("events is active for upcoming and detail paths, not past events", () => {
  assert.equal(isNavItemActive("/events", "/events"), true);
  assert.equal(isNavItemActive("/events/abc", "/events"), true);
  assert.equal(isNavItemActive("/events/past", "/events"), false);
  assert.equal(isNavItemActive("/events/past/photo", "/events"), false);
});

test("nested public routes match their own href", () => {
  assert.equal(isNavItemActive("/events/past", "/events/past"), true);
  assert.equal(isNavItemActive("/about", "/about"), true);
  assert.equal(isNavItemActive("/about/team", "/about"), true);
  assert.equal(isNavItemActive("/account", "/about"), false);
});
