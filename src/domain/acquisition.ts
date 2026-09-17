export interface AnnualRecord {
  quantity: number;
  unit_price: number;
  other_costs: number;
  procurement_funding: number;
  selected_source?: string;
  as_of?: string;
}

export interface PricingEstimate {
  year: number;
  owner: string;
  estimate_type: string;
  unit_price: number;
  rationale: string;
  evidence_id: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  kind: string;
  year: number;
  locator: string;
}

export interface AcquisitionProgram {
  program_id: string;
  program_name: string;
  short_name: string;
  portfolio: string;
  sponsor: string;
  appropriation: string;
  program_element: string;
  description: string;
  annual: Record<number, AnnualRecord>;
  estimates: PricingEstimate[];
  evidence: EvidenceSource[];
}

export interface AcquisitionMathResult {
  endItemCost: number;
  calculatedFunding: number;
  difference: number;
  reconciled: boolean;
}

export interface ProgramYearViewResult {
  year: number;
  record: AnnualRecord;
  prior: AnnualRecord | null;
  math: AcquisitionMathResult;
  quantity_delta: number | null;
  unit_price_delta_percent: number | null;
  funding_delta: number | null;
  funding_delta_percent: number | null;
  evidence?: EvidenceSource[];
  [key: string]: unknown;
}

export interface AcquisitionFlag {
  severity: "error" | "warning" | "info";
  title: string;
  detail: string;
}

export function percentChange(
  current: number,
  previous: number
): number | null {
  const currentValue = Number(current);
  const previousValue = Number(previous);
  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue) ||
    previousValue === 0
  )
    return null;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

export function acquisitionMath(record: AnnualRecord): AcquisitionMathResult {
  const endItemCost = Number(
    (Number(record.quantity || 0) * Number(record.unit_price || 0)).toFixed(3)
  );
  const calculatedFunding = Number(
    (endItemCost + Number(record.other_costs || 0)).toFixed(3)
  );
  const difference = Number(
    (Number(record.procurement_funding || 0) - calculatedFunding).toFixed(3)
  );
  return {
    endItemCost,
    calculatedFunding,
    difference,
    reconciled: Math.abs(difference) < 0.0005,
  };
}

export function programYearView(
  program: AcquisitionProgram,
  year: number
): ProgramYearViewResult | null {
  const record = program.annual[year];
  if (!record) return null;
  const prior = program.annual[Number(year) - 1] || null;
  const math = acquisitionMath(record);
  return {
    ...program,
    year: Number(year),
    record,
    prior,
    math,
    quantity_delta: prior ? record.quantity - prior.quantity : null,
    unit_price_delta_percent: prior
      ? percentChange(record.unit_price, prior.unit_price)
      : null,
    funding_delta: prior
      ? Number(
          (record.procurement_funding - prior.procurement_funding).toFixed(3)
        )
      : null,
    funding_delta_percent: prior
      ? percentChange(record.procurement_funding, prior.procurement_funding)
      : null,
    evidence: program.evidence,
  };
}

export interface FydpRow {
  year: number;
  lastBudget: AnnualRecord;
  delta: { quantity: number; unit_price: number; procurement_funding: number };
  resultant: AnnualRecord;
}

export function fydpDecisionMatrix(
  program: AcquisitionProgram,
  years: readonly number[],
  sourceYears: readonly number[],
  decision: Record<string, number[]> = {}
): FydpRow[] {
  return years
    .map((year, index) => {
      const lastBudget = program.annual[sourceYears[index]];
      if (!lastBudget) return null;
      const delta = {
        quantity: Number(decision.quantity?.[index] || 0),
        unit_price: Number(decision.unit_price?.[index] || 0),
        procurement_funding: Number(decision.procurement_funding?.[index] || 0),
      };
      return {
        year: Number(year),
        lastBudget,
        delta,
        resultant: {
          ...lastBudget,
          quantity: lastBudget.quantity + delta.quantity,
          unit_price: Number(
            (lastBudget.unit_price + delta.unit_price).toFixed(3)
          ),
          procurement_funding: Number(
            (
              lastBudget.procurement_funding + delta.procurement_funding
            ).toFixed(3)
          ),
        },
      };
    })
    .filter((row): row is FydpRow => row !== null);
}

const DECISION_STAGES: Record<
  string,
  { order: number; stage: string; recorded_at: string }
> = {
  "Program Office": {
    order: 1,
    stage: "Original program position",
    recorded_at: "2024-07-15",
  },
  N98: {
    order: 2,
    stage: "Resource sponsor review",
    recorded_at: "2024-09-30",
  },
  N80: {
    order: 3,
    stage: "N80 programming position",
    recorded_at: "2024-11-15",
  },
  FMB: {
    order: 4,
    stage: "FMB contract-informed check",
    recorded_at: "2024-12-06",
  },
};

export function pricingDecisionTimeline(
  program: AcquisitionProgram,
  year: number
) {
  const selectedPrice = program.annual[year]?.unit_price;
  return program.estimates
    .filter((estimate) => estimate.year === Number(year))
    .map((estimate, index) => {
      const metadata = DECISION_STAGES[estimate.owner] || {
        order: 10 + index,
        stage: estimate.estimate_type,
        recorded_at: `${year}-01-01`,
      };
      return {
        ...estimate,
        ...metadata,
        selected:
          Math.abs(Number(estimate.unit_price) - Number(selectedPrice)) <
          0.0005,
        difference_from_selected: Number(
          (Number(estimate.unit_price) - Number(selectedPrice)).toFixed(3)
        ),
      };
    })
    .sort((left, right) => left.order - right.order);
}

function flagsForView(view: ProgramYearViewResult): AcquisitionFlag[] {
  const flags: AcquisitionFlag[] = [];
  const {
    record,
    prior,
    math,
    unit_price_delta_percent,
    funding_delta_percent,
  } = view;
  if (!math.reconciled)
    flags.push({
      severity: "error",
      title: "Funding does not reconcile",
      detail: `Quantity × unit price + other costs differs from procurement funding by $${Math.abs(
        math.difference
      ).toFixed(3)}M.`,
    });
  if (
    unit_price_delta_percent !== null &&
    Math.abs(unit_price_delta_percent) >= 5
  )
    flags.push({
      severity: "warning",
      title: "Large unit-price change",
      detail: `Unit price changed ${unit_price_delta_percent.toFixed(
        1
      )}% from FY${view.year - 1}.`,
    });
  if (funding_delta_percent !== null && Math.abs(funding_delta_percent) >= 20)
    flags.push({
      severity: "warning",
      title: "Large procurement change",
      detail: `Total procurement funding changed ${funding_delta_percent.toFixed(
        1
      )}% from FY${view.year - 1}.`,
    });
  if (
    prior &&
    Math.abs(percentChange(record.quantity, prior.quantity) || 0) >= 25
  )
    flags.push({
      severity: "info",
      title: "Quantity changed materially",
      detail: `Planned quantity moved from ${prior.quantity} to ${record.quantity}.`,
    });
  if (
    record.procurement_funding &&
    record.other_costs / record.procurement_funding >= 0.35
  )
    flags.push({
      severity: "info",
      title: "Other costs are significant",
      detail:
        "Support, integration, spares, or other costs represent at least 35% of total procurement funding.",
    });
  return flags;
}

export function pricingFlags(
  program: AcquisitionProgram,
  year: number
): AcquisitionFlag[] {
  const view = programYearView(program, year);
  return view ? flagsForView(view) : [];
}

export interface PortfolioSummary {
  rows: (ProgramYearViewResult & { flags: AcquisitionFlag[] })[];
  totalFunding: number;
  totalPriorFunding: number;
  fundingDelta: number;
  fundingDeltaPercent: number | null;
  totalQuantity: number;
  totalEndItem: number;
  flaggedPrograms: number;
}

export function portfolioAcquisitionSummary(
  programs: AcquisitionProgram[],
  year: number
): PortfolioSummary {
  const rows = programs
    .map((program) => programYearView(program, year))
    .filter((view): view is ProgramYearViewResult => view !== null)
    .map((view) => ({ ...view, flags: flagsForView(view) }));
  const totalFunding = rows.reduce(
    (sum, row) => sum + row.record.procurement_funding,
    0
  );
  const totalPriorFunding = rows.reduce(
    (sum, row) => sum + Number(row.prior?.procurement_funding || 0),
    0
  );
  const totalQuantity = rows.reduce((sum, row) => sum + row.record.quantity, 0);
  const totalEndItem = rows.reduce((sum, row) => sum + row.math.endItemCost, 0);
  return {
    rows,
    totalFunding: Number(totalFunding.toFixed(3)),
    totalPriorFunding: Number(totalPriorFunding.toFixed(3)),
    fundingDelta: Number((totalFunding - totalPriorFunding).toFixed(3)),
    fundingDeltaPercent: totalPriorFunding
      ? percentChange(totalFunding, totalPriorFunding)
      : null,
    totalQuantity,
    totalEndItem: Number(totalEndItem.toFixed(3)),
    flaggedPrograms: rows.filter((row) => row.flags.length > 0).length,
  };
}
