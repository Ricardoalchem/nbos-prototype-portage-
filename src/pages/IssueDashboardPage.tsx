import { useState, useMemo } from "react";
import {
  Box, Card, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, TextField, Stack,
  Button, Checkbox,
  MenuItem, Select, type SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { SYNTHETIC_DRAFTS, SYNTHETIC_ISSUES_RESPONSE } from "../data/syntheticIssues";
import { pbisReference, type DraftResponse, type IssueResponse } from "../domain/issues";

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

type EnrichedIssue = IssueResponse & { record_kind: string };

const isOpenIssue = (i: EnrichedIssue) => i.record_kind !== "draft" && ["Active", "Open"].includes(i.status || "");

/** Normalize the API's lifecycle values to the three labels the dashboard shows. */
function lifecycle(issue: EnrichedIssue): string {
  if (issue.record_kind === "draft") return "Draft";
  if (issue.status === "Open") return "Active";
  return issue.status || "Active";
}

function dashboardDraft(draft: DraftResponse): EnrichedIssue {
  const d = draft as Record<string, unknown>;
  return {
    ...draft,
    issue_id: draft.draft_issue_id || draft.draft_id,
    record_kind: "draft",
    status: "Draft",
    name: draft.name,
    organization: (d.organization as string) || undefined,
    appropriation_code: (d.appropriation_code as string) || undefined,
  } as EnrichedIssue;
}

/** Recommended alternative's deltas, aligned to the requested fiscal years. */
function fundingChanges(issue: EnrichedIssue, years: number[]): (number | null)[] {
  const alts = issue.alternatives || [];
  const sel = alts.find((a) => a.recommended) || alts[0];
  const vals = new Map((issue.fiscal_years || []).map((y, i) => [Number(y), sel?.deltas?.[i]]));
  return years.map((y) => {
    const v = vals.get(Number(y));
    return v === undefined || v === null ? null : Number(v);
  });
}

const signed = (v: number) => `${v > 0 ? "+" : v < 0 ? "-" : ""}${Math.abs(v).toFixed(1)}`;

const STATUS_CHIP: Record<string, { bg: string; fg: string }> = {
  Active: { bg: "#FDF3E1", fg: "#B26A00" },
  Decided: { bg: "#E6F4EA", fg: "#2E7D32" },
  Draft: { bg: "#E8F1FB", fg: "#1565C0" },
};

function StatusChip({ label }: { label: string }) {
  const tone = STATUS_CHIP[label] || { bg: "action.hover", fg: "text.secondary" };
  return (
    <Chip size="small" label={`• ${label}`}
      sx={{ bgcolor: tone.bg, color: tone.fg, fontWeight: 600, fontSize: 12, height: 22, borderRadius: 11 }} />
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ px: 2, py: 1.5, bgcolor: "action.hover", borderBottom: 1, borderColor: "divider" }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "primary.main" }}>
        {children}
      </Typography>
    </Box>
  );
}

const headCellSx = { fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const };
const monoSx = { fontFamily: MONO, fontSize: 13 };

export default function IssueDashboardPage() {
  // Synthetic data stands in for the prototype's /api/issues and /api/drafts until the OSDK source is wired.
  const data = SYNTHETIC_ISSUES_RESPONSE;
  const drafts = SYNTHETIC_DRAFTS;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("PowerPoint");

  const issues: EnrichedIssue[] = useMemo(() => {
    const apiIssues: EnrichedIssue[] = data.issues.map((i) => ({ ...i, record_kind: "pbis" }));
    const draftIssues = drafts.filter((d) => !d.linked_pbis_issue_id).map(dashboardDraft);
    return [...apiIssues, ...draftIssues];
  }, [data, drafts]);

  const organizations = useMemo(
    () => [...new Set(issues.map((i) => i.organization).filter(Boolean) as string[])].sort(),
    [issues],
  );
  const years = useMemo(
    () => [...new Set(issues.flatMap((i) => i.fiscal_years || []).map(Number))].sort((a, b) => a - b).slice(0, 5),
    [issues],
  );

  const filtered = useMemo(() => issues.filter((i) => {
    const displayId = i.record_kind === "draft" ? i.issue_id : pbisReference(i);
    return (statusFilter === "All" || lifecycle(i) === statusFilter)
      && (orgFilter === "All" || i.organization === orgFilter)
      && (!query || `${displayId} ${i.issue_id} ${i.name} ${i.program_name} ${i.program_identifier}`.toLowerCase().includes(query.toLowerCase()));
  }), [issues, query, statusFilter, orgFilter]);

  const reviewIssues = issues.filter((i) => i.record_kind !== "draft");
  const openCount = reviewIssues.filter(isOpenIssue).length;
  const decidedCount = reviewIssues.filter((i) => i.status === "Decided").length;

  const toggleSelect = (id: string) => setSelectedIds((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  // TODO: issue detail (/issues/:id), new issue (/drafts), and multi-Doolie export are tabled
  // until those pages and the export service exist in this repo.

  const fyLabel = (y: number) => `FY${String(y).slice(-2)}`;
  const filterLabel = (text: string) => <Typography variant="body2" sx={{ mb: 0.75 }}>{text}</Typography>;

  return (
    <Box>
      {/* Budget health */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <SectionHeader>Budget Health — Open Issues in Queue</SectionHeader>
        <Box sx={{ p: 2 }}>
          <Card variant="outlined" sx={{ px: 2.5, py: 2 }}>
            <Typography sx={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Open issues</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 500, lineHeight: 1.3 }}>{openCount} / {reviewIssues.length}</Typography>
            <Typography variant="body2" sx={{ color: "success.main" }}>{decidedCount} decided this cycle</Typography>
          </Card>
        </Box>
      </Card>

      {/* Filters + actions */}
      <Stack direction="row" spacing={1.5} alignItems="flex-end" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Box>
          {filterLabel("Search")}
          <TextField size="small" placeholder="Issue, program, or PE/BLI" value={query}
            onChange={(e) => setQuery(e.target.value)} sx={{ width: 220 }} />
        </Box>
        <Box>
          {filterLabel("Status")}
          <Select size="small" value={statusFilter} sx={{ width: 180 }}
            onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}>
            {["All", "Active", "Decided", "Draft"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </Box>
        <Box>
          {filterLabel("Organization")}
          <Select size="small" value={orgFilter} sx={{ width: 200 }}
            onChange={(e: SelectChangeEvent) => setOrgFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {organizations.map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ ml: "auto" }}>
          <Select size="small" value={exportFormat} sx={{ width: 150 }}
            onChange={(e: SelectChangeEvent) => setExportFormat(e.target.value)}>
            {["PowerPoint", "PDF", "Excel"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
          <Button variant="outlined" color="inherit" startIcon={<DescriptionOutlinedIcon fontSize="small" />}
            disabled sx={{ textTransform: "none", borderColor: "divider" }}>
            {`Create multi-Doolie ( ${selectedIds.size} )`}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} disabled
            sx={{ textTransform: "none", fontWeight: 600 }}>
            New issue
          </Button>
        </Stack>
      </Stack>

      {/* Issue table */}
      <Card variant="outlined">
        <SectionHeader>All Issues ({filtered.length})</SectionHeader>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell sx={headCellSx}>Issue ID</TableCell>
                <TableCell sx={headCellSx}>Issue Name</TableCell>
                <TableCell sx={headCellSx}>APPN</TableCell>
                <TableCell sx={headCellSx}>Status</TableCell>
                {years.map((y) => <TableCell key={y} sx={headCellSx}>{fyLabel(y)}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((issue) => {
                const fys = fundingChanges(issue, years);
                const displayId = issue.record_kind === "draft" ? issue.issue_id : pbisReference(issue);
                return (
                  <TableRow key={issue.issue_id} hover selected={selectedIds.has(issue.issue_id)}>
                    <TableCell padding="checkbox">
                      <Checkbox size="small" disabled={!isOpenIssue(issue)} checked={selectedIds.has(issue.issue_id)}
                        onChange={() => toggleSelect(issue.issue_id)} />
                    </TableCell>
                    <TableCell sx={{ ...monoSx, color: "primary.main", whiteSpace: "nowrap" }}>{displayId}</TableCell>
                    <TableCell>{issue.name}</TableCell>
                    <TableCell sx={monoSx}>{issue.appropriation_code || "—"}</TableCell>
                    <TableCell><StatusChip label={lifecycle(issue)} /></TableCell>
                    {fys.map((v, i) => (
                      <TableCell key={years[i]} sx={monoSx}>{v === null ? "—" : signed(v)}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5 + years.length} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {query ? "No matching issues." : "No issues loaded."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
