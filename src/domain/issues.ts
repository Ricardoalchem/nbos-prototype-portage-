// Issue record shapes ported from the nbos-alchem-prototype API contract
// (client/src/data/api.ts). Field names mirror the prototype's /api/issues and
// /api/drafts payloads so synthetic data and a future OSDK source stay swappable.

export interface AlternativeProfile {
  alternative_id: string;
  name?: string;
  deltas: number[];
  total?: number;
  recommended?: boolean;
}

export interface ValidationDetail {
  code: string;
  name: string;
  status: string;
  passed: boolean;
  detail: string;
  resolution?: string;
  findings?: {
    alternative_id?: string;
    fiscal_year?: number;
    field?: string;
    baseline?: number;
    delta?: number;
    resulting_balance?: number;
  }[];
}

export interface EvidenceRecord {
  evidence_id: string;
  title?: string;
  source_name?: string;
  source_type?: string;
  source_uri?: string;
  source_locator?: string;
  source_budget_year?: number;
  amount_millions?: number;
  fiscal_year?: number;
  kind?: string;
  year?: number;
}

export interface AuditEvent {
  event_id?: string;
  event_type: string;
  actor: string;
  occurred_at_utc: string;
  occurred_at_dtg?: string;
  detail?: string;
  source_system?: string;
  previous_status?: string | null;
  new_status?: string;
}

export interface DataOverlay {
  name: string;
  status: string;
  source?: string;
  as_of?: string | null;
  locator?: string | null;
}

export interface DoolieReadiness {
  status: string;
  percent: number;
  missing_fields?: string[];
  blocking_checks?: string[];
  rules_status?: string;
}

export interface IssueResponse {
  issue_id: string;
  pbis_issue_id?: string;
  source_issue_id?: string;
  name: string;
  organization?: string;
  appropriation_code?: string;
  appropriation_title?: string;
  program_identifier?: string;
  program_name?: string;
  status?: string;
  analyst_queue?: string;
  description?: string;
  rationale?: string;
  source_process?: string;
  budget_cycle?: string;
  issue_type?: string;
  owner?: string;
  assigned_to?: string;
  version?: number;
  fiscal_years?: number[];
  baseline?: (number | null)[];
  quantities?: (number | null)[];
  unit_prices_millions?: (number | null)[];
  pricing_applicable?: boolean;
  alternatives?: AlternativeProfile[];
  evidence?: EvidenceRecord[];
  validation?: ValidationDetail[];
  validation_summary?: { status: string; errors: number; warnings: number; passed: number; total: number };
  doolie_readiness?: DoolieReadiness;
  audit_events?: AuditEvent[];
  activity?: { actor: string; action: string; detail: string; when?: string }[];
  data_overlays?: DataOverlay[];
  source_changes?: { field: string; label: string; previous: unknown; current: unknown }[];
  source_change_count?: number;
  execution_scenario?: Record<string, unknown>;
  completeness?: { percent: number; issue_type?: string };
  decision_stage?: string;
  decision_disposition?: string;
  decision_reason?: string;
  // presentation fields
  submitter_impact?: string;
  requirement_source?: string;
  warfighting_impact?: string;
  linked_programs?: string;
  barriers?: string;
  risk?: string;
  risk_mitigation?: string;
  compliance?: string;
  // timestamps
  source_updated_at?: string;
  nbos_received_at?: string;
  nbos_processed_at?: string;
  imported_at?: string;
  updated_at?: string;
  created_at?: string;
  // flex
  search_terms?: string | string[];
  record_kind?: string;
  issue_value_millions?: number;
  [key: string]: unknown;
}

export interface PortfolioSummary {
  issue_count: number;
  open_issue_count: number;
  fiscal_years: number[];
  net_recommended_delta_millions: number[];
  gross_potential_additions_millions: number[];
  definitions?: { net_recommended_delta: string; gross_potential_additions: string };
  synthetic?: boolean;
  generated_at?: string;
  [key: string]: unknown;
}

export interface IntegrationSummary {
  total: number;
  imported: number;
  in_nbos: number;
  pending: number;
  awaiting_import: number;
  updates_available: number;
  pbis_drafts: number;
  returned: number;
}

export interface IssuesListResponse {
  issues: IssueResponse[];
  portfolio: PortfolioSummary;
  integration: IntegrationSummary;
  queue_summary: Record<string, number>;
}

export interface DraftResponse {
  draft_issue_id?: string;
  draft_id: string;
  issue_id?: string;
  name: string;
  status: string;
  linked_pbis_issue_id?: string;
  [key: string]: unknown;
}

/** PBIS-facing identifier shown to analysts in place of the internal NBOS id. */
export function pbisReference(
  issue: Pick<IssueResponse, "issue_id" | "pbis_issue_id" | "source_issue_id">,
): string {
  return (
    issue.pbis_issue_id ||
    issue.source_issue_id ||
    String(issue.issue_id || "").replace("NBOS-SYN", "PBIS-PROT")
  );
}
