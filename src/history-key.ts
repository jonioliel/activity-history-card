export interface HistoryCacheKeyInput {
  mock: boolean;
  start: string;
  end: string;
  entityIds: string[];
  withAttributes: string[];
  withoutAttributes: string[];
  includeLabels?: string[];
  excludeLabels?: string[];
  significant?: boolean;
  minimal?: boolean;
}

export function buildHistoryCacheKey(input: HistoryCacheKeyInput): string {
  return JSON.stringify({
    mock: input.mock,
    start: input.start,
    end: input.end,
    entities: [...input.entityIds].sort(),
    withAttributes: [...input.withAttributes].sort(),
    withoutAttributes: [...input.withoutAttributes].sort(),
    includeLabels: input.includeLabels ?? [],
    excludeLabels: input.excludeLabels ?? [],
    significant: input.significant,
    minimal: input.minimal,
  });
}
