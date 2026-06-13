import { describe, expect, it } from "vitest";
import packageJson from "../package.json?raw";

describe("package.json", () => {
  it("is valid and uses two-space JSON formatting", () => {
    const parsed = JSON.parse(packageJson) as {
      scripts?: Record<string, string>;
    };

    expect(parsed.scripts?.build).toBe("vite build");
    expect(packageJson).toContain('\n  "scripts": {');
  });
});
