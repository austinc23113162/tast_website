import assert from "node:assert/strict";
import { test } from "node:test";

import { storagePathFromPublicUrl } from "./photo-path.ts";

test("storagePathFromPublicUrl extracts the object path", () => {
  assert.equal(
    storagePathFromPublicUrl(
      "https://example.supabase.co/storage/v1/object/public/event-photos/evt/abc.jpg"
    ),
    "evt/abc.jpg"
  );
  assert.equal(storagePathFromPublicUrl("https://cdn.example/photo.jpg"), null);
});
