import assert from "node:assert/strict";
import { test } from "node:test";

import { isAdminNavItemActive } from "./admin-nav.ts";

test("overview is active only on /admin", () => {
  assert.equal(isAdminNavItemActive("/admin", "/admin"), true);
  assert.equal(isAdminNavItemActive("/admin/events", "/admin"), false);
});

test("nested admin routes match their section", () => {
  assert.equal(isAdminNavItemActive("/admin/events", "/admin/events"), true);
  assert.equal(
    isAdminNavItemActive("/admin/events/abc/edit", "/admin/events"),
    true
  );
  assert.equal(
    isAdminNavItemActive("/admin/announcements", "/admin/events"),
    false
  );
});
