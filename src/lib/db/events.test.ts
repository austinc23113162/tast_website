import assert from "node:assert/strict";
import { test } from "node:test";

import { findById } from "./event-queries.ts";

test("findById returns the matching item or null", () => {
  const items = [
    { id: "evt-night-market-2026", title: "TAST Night Market" },
    { id: "evt-welcome-mixer-2026", title: "Fall welcome mixer" },
  ];

  assert.equal(findById(items, "evt-night-market-2026")?.title, "TAST Night Market");
  assert.equal(findById(items, "does-not-exist"), null);
});
