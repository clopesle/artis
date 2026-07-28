import { describe, expect, it } from "vitest";

import { withBase } from "./paths";

describe("withBase", () => {
  it("prefixes project-site paths for GitHub Pages", () => {
    expect(withBase("/joias/", "/artis/")).toBe("/artis/joias/");
  });

  it("keeps root paths valid for a custom domain", () => {
    expect(withBase("/joias/", "/")).toBe("/joias/");
  });
});
