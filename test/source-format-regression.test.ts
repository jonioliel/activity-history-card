import { describe, expect, it } from "vitest";
import cardSource from "../src/activity-history-card.ts?raw";
import modelSource from "../src/mockup05/mockup05-model.ts?raw";
import dashboardRendererSource from "../src/renderers/activity-dashboard-renderer.ts?raw";
import mockupLayoutSource from "../src/renderers/mockup05-layout.ts?raw";
import stylesSource from "../src/styles.ts?raw";

const readableSourceFiles = [
  { path: "src/activity-history-card.ts", source: cardSource, minLines: 1000 },
  {
    path: "src/renderers/activity-dashboard-renderer.ts",
    source: dashboardRendererSource,
    minLines: 250,
  },
  {
    path: "src/renderers/mockup05-layout.ts",
    source: mockupLayoutSource,
    minLines: 350,
  },
  {
    path: "src/mockup05/mockup05-model.ts",
    source: modelSource,
    minLines: 350,
  },
  { path: "src/styles.ts", source: stylesSource, minLines: 2500 },
] as const;

describe("source formatting regression guard", () => {
  it("keeps large source files readable and multiline", () => {
    for (const file of readableSourceFiles) {
      const lineCount = file.source.split(/\r?\n/).length;

      expect(lineCount, `${file.path} should stay readable`).toBeGreaterThan(
        file.minLines,
      );
      expect(file.source).toContain("\n");
    }
  });
});
