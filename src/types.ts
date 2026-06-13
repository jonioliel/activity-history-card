export type DirectionOption = "auto" | "rtl" | "ltr" | boolean;
export type DisplayMode = "card" | "panel" | "fullscreen";
export type ViewMode = "swimlane" | "heatmap" | "detail" | "correlation";
export type GroupBy = "area" | "domain" | "floor" | "entity" | "none";
export type StateMode = "all" | "active_only" | "currently_active";
export type TimePreset = "24h" | "7d" | "custom";
export type SummaryScope = "visible" | "all";
export type ActivityMode = "meaningful" | "all";

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassConnection {
  subscribeMessage<T = unknown>(
    callback: (message: T) => void,
    params: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<() => void>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: {
    language?: string;
    number_format?: string;
    time_format?: string;
  };
  callWS<T = unknown>(params: Record<string, unknown>): Promise<T>;
  connection: HassConnection;
  formatEntityName?: (stateObj: HassEntity) => string;
  formatEntityState?: (stateObj: HassEntity) => string;
}

export interface EntityConfig {
  entity: string;
  name?: string;
  area?: string;
  domain?: string;
  icon?: string;
  active_states?: string[];
  active_attributes?: Record<string, string[]>;
  attributes?: string[];
  color?: string;
  hidden?: boolean;
}

export interface FilterConfig {
  show?: boolean;
  show_search?: boolean;
  show_area_chips?: boolean;
  show_domain_chips?: boolean;
  show_state_mode?: boolean;
  default_domains?: string[];
  default_areas?: string[];
  active_only?: boolean;
}

export interface ActivityHistoryCardConfig {
  type: string;
  title?: string;
  auto_discover?: boolean;
  debug?: boolean;
  hours_to_show?: number;
  start_time?: string;
  end_time?: string;
  live?: boolean;
  rtl?: DirectionOption;
  direction?: DirectionOption;
  display_mode?: DisplayMode;
  default_view?: ViewMode;
  view_mode?: ViewMode;
  group_by?: GroupBy;
  show_summary?: boolean;
  show_insights?: boolean;
  show_now_line?: boolean;
  show_legend?: boolean;
  show_fullscreen_button?: boolean;
  significant_changes_only?: boolean;
  minimal_response?: boolean;
  mock_data?: boolean;
  mock_profile?: string;
  refresh_interval_seconds?: number;
  min_duration_seconds?: number;
  merge_gap_seconds?: number;
  max_visible_rows?: number;
  smart_filter?: boolean;
  activity_mode?: ActivityMode;
  hide_empty_rows?: boolean;
  hide_empty_groups?: boolean;
  min_row_active_seconds?: number;
  max_rows_per_group?: number;
  max_total_rows?: number;
  show_technical_entities?: boolean;
  show_config_entities?: boolean;
  show_diagnostic_entities?: boolean;
  show_inactive_baselines?: boolean;
  show_entity_id_when_name_missing?: boolean;
  summary_scope?: SummaryScope;
  collapse_groups?: boolean;
  default_collapsed_groups?: string[];
  timeline_height?: string;
  mobile_breakpoint?: number;
  filters?: FilterConfig;
  entities?: Array<string | EntityConfig>;
  exclude_entities?: string[];
  include_entity_globs?: string[];
  exclude_entity_globs?: string[];
  include_labels?: string[];
  exclude_labels?: string[];
  domains?: string[];
  exclude_domains?: string[];
  areas?: string[];
  colors?: Partial<Record<StateCategory, string>>;
}

export type StateCategory =
  | "on"
  | "off"
  | "cooling"
  | "heating"
  | "drying"
  | "fan"
  | "playing"
  | "opening"
  | "closing"
  | "idle"
  | "unknown"
  | "unavailable";

export interface HistoryStateRecord {
  entity_id: string;
  state: string;
  attributes?: Record<string, unknown>;
  last_changed: string;
  last_updated?: string;
}

export interface TimelineSegment {
  entity_id: string;
  state: string;
  category: StateCategory;
  active: boolean;
  start: Date;
  end: Date;
  durationMs: number;
  attributes?: Record<string, unknown>;
}

export interface EntityMeta {
  entity_id: string;
  name: string;
  area?: string;
  area_id?: string;
  domain: string;
  icon?: string;
  labels?: string[];
  entity_category?: string;
  device_id?: string;
  device_name?: string;
  device_manufacturer?: string;
  device_model?: string;
  hidden_by?: string;
  disabled_by?: string;
  config?: EntityConfig;
}

export interface TimelineRow {
  entity: EntityMeta;
  segments: TimelineSegment[];
  totalActiveMs: number;
  eventCount: number;
  currentState?: string;
  currentCategory?: StateCategory;
}

export interface TimelineGroup {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  rows: TimelineRow[];
  totalActiveMs: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface FilterState {
  search: string;
  areas: string[];
  domains: string[];
  stateMode: StateMode;
  groupBy: GroupBy;
  timePreset: TimePreset;
}

export interface ActivitySummary {
  totalActiveMs: number;
  activeEntityCount: number;
  eventCount: number;
  activeNowCount: number;
  lastEvent?: TimelineSegment;
  lastEventRow?: TimelineRow;
  mostActiveEntity?: TimelineRow;
  mostActiveArea?: TimelineGroup;
  peakBucketLabel?: string;
}

export interface DiscoveryDiagnostics {
  registryAvailable: boolean;
  areaRegistryAvailable: boolean;
  entityRegistryAvailable: boolean;
  deviceRegistryAvailable: boolean;
  labelRegistryAvailable: boolean;
  registryEntityCount: number;
  areaCount: number;
  labelCount: number;
  fallbackUsed: boolean;
  unavailableReasons: string[];
}

export type RowCurationHiddenReason =
  | "empty"
  | "no_meaningful_activity"
  | "too_short"
  | "technical"
  | "noisy_name"
  | "config"
  | "diagnostic"
  | "hidden"
  | "disabled"
  | "max_rows";

export interface RowCurationDiagnostics {
  totalRows: number;
  visibleRows: number;
  hiddenRows: number;
  hiddenEmptyRows: number;
  hiddenNoMeaningfulRows: number;
  hiddenTooShortRows: number;
  hiddenTechnicalRows: number;
  hiddenNoisyNameRows: number;
  hiddenConfigRows: number;
  hiddenDiagnosticRows: number;
  hiddenHiddenRows: number;
  hiddenDisabledRows: number;
  hiddenMinDurationRows: number;
  hiddenMaxRows: number;
  hiddenByReason: Partial<Record<RowCurationHiddenReason, number>>;
  smartFilter: boolean;
  activityMode: ActivityMode;
  showInactiveBaselines: boolean;
  showAll: boolean;
  manualRowsProtected: number;
  maxRowsPerGroup: number;
  maxTotalRows: number;
}

export interface ActivityDiagnostics {
  resolvedEntityCount: number;
  historyRecordCount: number;
  timelineSegmentCount: number;
  activeTimelineSegmentCount: number;
  filteredRowCount: number;
  renderedGroupCount: number;
  activeFilters: FilterState;
  historyRange?: TimeRange;
  attributesRequested: {
    withAttributes: number;
    withoutAttributes: number;
  };
  cacheHit: boolean;
  mockData: boolean;
  discovery?: DiscoveryDiagnostics;
  curation?: RowCurationDiagnostics;
  lastFetchTime?: Date;
  fetchDurationMs?: number;
  fetchReason?: string;
  currentHistoryKey?: string;
  refreshIntervalSeconds?: number;
  initialLoad?: boolean;
  backgroundLoading?: boolean;
}
