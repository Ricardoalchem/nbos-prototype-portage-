import { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Tabs,
  Tab,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  portfolioAcquisitionSummary,
  fydpDecisionMatrix,
  pricingDecisionTimeline,
  type AcquisitionFlag,
  type FydpRow,
} from "../domain/acquisition";
import {
  SYNTHETIC_ACQUISITION_PROGRAMS,
  ACQUISITION_YEARS,
  ACQUISITION_FYDP_YEARS,
  SYNTHETIC_ACQUISITION_SCENARIO,
  SYNTHETIC_DECISION_DELTAS,
} from "../data/syntheticPrograms";

function FlagChip({ flag }: { flag: AcquisitionFlag }) {
  const colorMap = {
    error: "error",
    warning: "warning",
    info: "info",
  } as const;
  return (
    <Chip
      label={flag.title}
      size="small"
      color={colorMap[flag.severity]}
      variant="outlined"
    />
  );
}

type ViewTab = "programs" | "fydp" | "pricing";

export default function AcquisitionDashboardPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [viewTab, setViewTab] = useState<ViewTab>("programs");
  const [expanded, setExpanded] = useState<string | null>(null);

  const summary = useMemo(
    () =>
      portfolioAcquisitionSummary(SYNTHETIC_ACQUISITION_PROGRAMS, selectedYear),
    [selectedYear]
  );

  const fydpData = useMemo(() => {
    return SYNTHETIC_ACQUISITION_PROGRAMS.map((prog) => ({
      program: prog,
      rows: fydpDecisionMatrix(
        prog,
        ACQUISITION_FYDP_YEARS,
        ACQUISITION_YEARS,
        SYNTHETIC_DECISION_DELTAS[prog.program_id]
      ),
    }));
  }, []);

  const pricingData = useMemo(() => {
    return SYNTHETIC_ACQUISITION_PROGRAMS.map((prog) => ({
      program: prog,
      timeline: pricingDecisionTimeline(prog, selectedYear),
    })).filter((d) => d.timeline.length > 0);
  }, [selectedYear]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5">Acquisition Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            {SYNTHETIC_ACQUISITION_SCENARIO.name} —{" "}
            {SYNTHETIC_ACQUISITION_SCENARIO.currency}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Fiscal Year</InputLabel>
          <Select
            value={selectedYear}
            label="Fiscal Year"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {ACQUISITION_YEARS.map((year) => (
              <MenuItem key={year} value={year}>
                FY{year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Stat cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <StatCard
          label="Total Procurement"
          value={`$${summary.totalFunding.toLocaleString()}M`}
        />
        <StatCard
          label="Year-over-Year"
          value={`${
            summary.fundingDelta >= 0 ? "+" : ""
          }$${summary.fundingDelta.toLocaleString()}M`}
          sub={
            summary.fundingDeltaPercent !== null
              ? `${summary.fundingDeltaPercent.toFixed(1)}%`
              : undefined
          }
          color={summary.fundingDelta >= 0 ? "success.main" : "error.main"}
        />
        <StatCard
          label="Total Quantity"
          value={String(summary.totalQuantity)}
        />
        <StatCard
          label="End-Item Cost"
          value={`$${summary.totalEndItem.toLocaleString()}M`}
        />
        <StatCard
          label="Flagged Programs"
          value={`${summary.flaggedPrograms} / ${summary.rows.length}`}
          color={summary.flaggedPrograms > 0 ? "warning.main" : "success.main"}
        />
      </Stack>

      {/* View tabs */}
      <Tabs value={viewTab} onChange={(_, v) => setViewTab(v)} sx={{ mb: 2 }}>
        <Tab label="Program Review" value="programs" />
        <Tab label="FYDP Decision Matrix" value="fydp" />
        <Tab label="Pricing Timeline" value="pricing" />
      </Tabs>

      {/* Programs tab */}
      {viewTab === "programs" && (
        <Card variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 40 }} />
                  <TableCell>Program</TableCell>
                  <TableCell>Portfolio</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price ($M)</TableCell>
                  <TableCell align="right">Procurement ($M)</TableCell>
                  <TableCell align="right">YoY Change</TableCell>
                  <TableCell>Flags</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.rows.map((row) => {
                  const pid = (row as Record<string, unknown>)
                    .program_id as string;
                  return (
                    <>
                      <TableRow
                        key={`${row.year}-${pid}`}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          setExpanded(expanded === pid ? null : pid)
                        }
                      >
                        <TableCell>
                          <IconButton size="small">
                            {expanded === pid ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {
                              (row as Record<string, unknown>)
                                .program_name as string
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {
                              (row as Record<string, unknown>)
                                .program_element as string
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              (row as Record<string, unknown>)
                                .portfolio as string
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.record.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {row.record.unit_price.toFixed(1)}
                        </TableCell>
                        <TableCell align="right">
                          {row.record.procurement_funding.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {row.funding_delta !== null ? (
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={
                                row.funding_delta >= 0
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {row.funding_delta >= 0 ? "+" : ""}
                              {row.funding_delta.toFixed(1)}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            {row.flags.length > 0 ? (
                              row.flags.map((flag, i) => (
                                <FlagChip key={i} flag={flag} />
                              ))
                            ) : (
                              <Chip
                                label="OK"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                      <TableRow key={`${row.year}-${pid}-detail`}>
                        <TableCell
                          colSpan={8}
                          sx={{
                            py: 0,
                            border: expanded === pid ? undefined : "none",
                          }}
                        >
                          <Collapse in={expanded === pid}>
                            <Box sx={{ py: 2, px: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Acquisition Math
                              </Typography>
                              <Stack direction="row" spacing={4}>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    End-item cost
                                  </Typography>
                                  <Typography variant="body2">
                                    ${row.math.endItemCost.toFixed(1)}M
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Calculated funding
                                  </Typography>
                                  <Typography variant="body2">
                                    ${row.math.calculatedFunding.toFixed(1)}M
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Difference
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color={
                                      row.math.reconciled
                                        ? "success.main"
                                        : "error.main"
                                    }
                                  >
                                    ${row.math.difference.toFixed(3)}M{" "}
                                    {row.math.reconciled
                                      ? "(Reconciled)"
                                      : "(NOT reconciled)"}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Other costs
                                  </Typography>
                                  <Typography variant="body2">
                                    ${row.record.other_costs.toFixed(1)}M
                                  </Typography>
                                </Box>
                              </Stack>
                              {(row as Record<string, unknown>).description ? (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{ mt: 1 }}
                                >
                                  {String(
                                    (row as Record<string, unknown>).description
                                  )}
                                </Typography>
                              ) : null}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* FYDP Decision Matrix tab */}
      {viewTab === "fydp" && (
        <Stack spacing={3}>
          {fydpData.map(({ program, rows }) => (
            <Card variant="outlined" key={program.program_id}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    {program.program_name}
                  </Typography>
                  <Chip
                    label={program.portfolio}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={program.appropriation}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Profile</TableCell>
                        {rows.map((r: FydpRow) => (
                          <TableCell key={r.year} align="right">
                            FY{r.year}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Last budget ($M)</TableCell>
                        {rows.map((r: FydpRow) => (
                          <TableCell key={r.year} align="right">
                            {r.lastBudget.procurement_funding.toFixed(1)}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Decision delta ($M)</TableCell>
                        {rows.map((r: FydpRow) => (
                          <TableCell key={r.year} align="right">
                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  r.delta.procurement_funding > 0
                                    ? "success.main"
                                    : r.delta.procurement_funding < 0
                                    ? "error.main"
                                    : "text.primary",
                              }}
                            >
                              {r.delta.procurement_funding > 0 ? "+" : ""}
                              {r.delta.procurement_funding.toFixed(1)}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow sx={{ bgcolor: "action.selected" }}>
                        <TableCell>
                          <Typography fontWeight={700}>
                            Resultant ($M)
                          </Typography>
                        </TableCell>
                        {rows.map((r: FydpRow) => (
                          <TableCell key={r.year} align="right">
                            <Typography fontWeight={700}>
                              {r.resultant.procurement_funding.toFixed(1)}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>Quantity delta</TableCell>
                        {rows.map((r: FydpRow) => (
                          <TableCell key={r.year} align="right">
                            {r.delta.quantity !== 0 ? (
                              <Typography
                                variant="body2"
                                color={
                                  r.delta.quantity > 0
                                    ? "success.main"
                                    : "error.main"
                                }
                              >
                                {r.delta.quantity > 0 ? "+" : ""}
                                {r.delta.quantity}
                              </Typography>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Pricing Timeline tab */}
      {viewTab === "pricing" && (
        <Stack spacing={3}>
          {pricingData.length === 0 && (
            <Alert severity="info">
              No pricing estimates available for FY{selectedYear}.
            </Alert>
          )}
          {pricingData.map(({ program, timeline }) => (
            <Card variant="outlined" key={program.program_id}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  {program.program_name} — FY{selectedYear} pricing positions
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Stage</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell align="right">Unit Price ($M)</TableCell>
                        <TableCell align="right">
                          Difference from selected
                        </TableCell>
                        <TableCell>Selected</TableCell>
                        <TableCell>Rationale</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {timeline.map((pos, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            bgcolor: pos.selected
                              ? "action.selected"
                              : undefined,
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2">{pos.stage}</Typography>
                          </TableCell>
                          <TableCell>{pos.owner}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {pos.unit_price.toFixed(1)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={
                                pos.difference_from_selected > 0
                                  ? "error.main"
                                  : pos.difference_from_selected < 0
                                  ? "success.main"
                                  : "text.primary"
                              }
                            >
                              {pos.difference_from_selected > 0 ? "+" : ""}
                              {pos.difference_from_selected.toFixed(3)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {pos.selected && (
                              <Chip
                                label="Selected"
                                size="small"
                                color="success"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {pos.rationale}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {summary.flaggedPrograms > 0 && viewTab === "programs" && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {summary.flaggedPrograms} program(s) have flags requiring analyst
          review before advancing.
        </Alert>
      )}
    </Box>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 140 }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: color || "text.primary" }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography
            variant="caption"
            sx={{ color: color || "text.secondary" }}
          >
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
