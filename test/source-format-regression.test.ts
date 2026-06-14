import { describe, expect, it } from "vitest";
import packageJsonSource from "../package.json?raw";
import sampleConfigSource from "../sample-config.yaml?raw";
import dashboardModelSource from "../src/activity-dashboard-model.ts?raw";
import defaultsSource from "../src/defaults.ts?raw";
import mockupLayoutSource from "../src/renderers/mockup05-layout.ts?raw";
import stylesSource from "../src/styles.ts?raw";
import typesSource from "../src/types.ts?raw";
import dashboardCssContractSource from "./dashboard-css-contract.test.ts?raw";

const readableSourceFiles = [
  {
    path: "package.json",
    source: packageJsonSource,
    minLines: 5,
  },
  {
    path: "sample-config.yaml",
    source: sampleConfigSource,
    minLines: 20,
  },
  {
    path: "src/styles.ts",
    source: stylesSource,
    minLines: 200,
  },
  {
    path: "src/activity-dashboard-model.ts",
    source: dashboardModelSource,
    minLines: 40,
  },
  {
    path: "src/defaults.ts",
    source: defaultsSource,
    minLines: 40,
  },
  {
    path: "src/types.ts",
    source: typesSource,
    minLines: 80,
  },
  {
    path: "src/renderers/mockup05-layout.ts",
    source: mockupLayoutSource,
    minLines: 120,
  },
  {
    path: "test/dashboard-css-contract.test.ts",
    source: dashboardCssContractSource,
    minLines: 40,
  },
] as const;

describe("source formatting regression guard", () => {
  it("keeps source, config, and test files readable and multiline", () => {
    for (const file of readableSourceFiles) {
      const lineCount = file.source.split(/\r?\n/).length;

      expect(
        lineCount,
        `${file.path} should stay readable`,
      ).toBeGreaterThanOrEqual(file.minLines);
      expect(file.source).toContain("\n");
    }
  });
});
