import { describe, expect, it } from "vitest";
import {
  hasWritePermission,
  isAllowedRepositoryPath,
  isAllowedRepositoryWritePath,
  parseBearerToken,
} from "./security.mjs";

describe("admin bridge security", () => {
  it("allows only managed content and catalog images", () => {
    expect(isAllowedRepositoryPath("src/data/products.json")).toBe(true);
    expect(isAllowedRepositoryPath("admin/providers.json")).toBe(true);
    expect(isAllowedRepositoryPath("src/assets/catalog/nova-joia.webp")).toBe(true);
    expect(isAllowedRepositoryPath(".github/workflows/deploy-pages.yml")).toBe(false);
    expect(isAllowedRepositoryPath("src/assets/catalog/../site.json")).toBe(false);
  });

  it("allows listing the catalog directory but never writing to the directory itself", () => {
    expect(isAllowedRepositoryPath("src/assets/catalog")).toBe(true);
    expect(isAllowedRepositoryWritePath("src/assets/catalog")).toBe(false);
    expect(isAllowedRepositoryWritePath("src/assets/catalog/nova-joia.webp")).toBe(
      true,
    );
  });

  it("accepts opaque bearer sessions and write-capable users", () => {
    const request = new Request("https://admin.example/api/session", {
      headers: { Authorization: `Bearer ${"a".repeat(43)}` },
    });
    expect(parseBearerToken(request)).toHaveLength(43);
    expect(hasWritePermission({ permissions: { push: true } })).toBe(true);
    expect(hasWritePermission({ permissions: { pull: true } })).toBe(false);
  });
});
