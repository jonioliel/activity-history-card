import { describe, expect, it } from "vitest";
import { normalizeRefreshIntervalSeconds, shouldRefreshFromHassSetter } from "../src/refresh-policy";

describe("refresh policy", () => {
  it("refreshes on the first hass setter only", () => {
    expect(
      shouldRefreshFromHassSetter({
        hasFetchedOnce: false,
        live: true,
        lastHistoryFetchAt: 0,
        now: 10_000,
        refreshIntervalSeconds: 300,
      }),
    ).toBe(true);

    expect(
      shouldRefreshFromHassSetter({
        hasFetchedOnce: true,
        live: true,
        lastHistoryFetchAt: 9_500,
        now: 10_000,
        refreshIntervalSeconds: 300,
      }),
    ).toBe(false);
  });

  it("disables automatic hass-setter refresh when live is false", () => {
    expect(
      shouldRefreshFromHassSetter({
        hasFetchedOnce: true,
        live: false,
        lastHistoryFetchAt: 0,
        now: 1_000_000,
        refreshIntervalSeconds: 30,
      }),
    ).toBe(false);
  });

  it("respects refresh_interval_seconds", () => {
    expect(
      shouldRefreshFromHassSetter({
        hasFetchedOnce: true,
        live: true,
        lastHistoryFetchAt: 0,
        now: 119_000,
        refreshIntervalSeconds: 120,
      }),
    ).toBe(false);
    expect(
      shouldRefreshFromHassSetter({
        hasFetchedOnce: true,
        live: true,
        lastHistoryFetchAt: 0,
        now: 120_000,
        refreshIntervalSeconds: 120,
      }),
    ).toBe(true);
  });

  it("normalizes invalid refresh intervals to a quiet default", () => {
    expect(normalizeRefreshIntervalSeconds(undefined)).toBe(300);
    expect(normalizeRefreshIntervalSeconds(5)).toBe(30);
  });
});
