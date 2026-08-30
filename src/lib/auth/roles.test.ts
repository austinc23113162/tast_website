import assert from "node:assert/strict";
import { test } from "node:test";

import { isAdmin } from "./roles.ts";

test("isAdmin is true for admin only", () => {
  assert.equal(isAdmin("admin"), true);
  assert.equal(isAdmin("member"), false);
  assert.equal(isAdmin(null), false);
});
