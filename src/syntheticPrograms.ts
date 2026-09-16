import type { AcquisitionProgram } from "./acquisition";

export const ACQUISITION_YEARS = [2022, 2023, 2024, 2025, 2026] as const;
export const ACQUISITION_FYDP_YEARS = [2025, 2026, 2027, 2028, 2029] as const;

export const SYNTHETIC_ACQUISITION_SCENARIO = {
  id: "FY26-PLANNING-POSITION",
  name: "FY26 planning position",
  as_of: "2025-03-25",
  currency: "BY $M",
} as const;

export const SYNTHETIC_DECISION_DELTAS: Record<
  string,
  Record<string, number[]>
> = {
  "ACQ-F35C": {
    quantity: [0, 2, 0, -1, 0],
    unit_price: [0, 1.5, 1.8, 2.1, 2.4],
    procurement_funding: [0, 190, 25, -100, 35],
  },
  "ACQ-P8A": {
    quantity: [0, 0, -1, -1, -1],
    unit_price: [0, 2.5, 3, 3.5, 4],
    procurement_funding: [0, 40, -120, -125, -130],
  },
  "ACQ-MQ25": {
    quantity: [0, 1, 1, 0, 0],
    unit_price: [0, 4, 5, 6, 7],
    procurement_funding: [0, 160, 175, 35, 40],
  },
  "ACQ-E2D": {
    quantity: [0, 1, 0, 0, 1],
    unit_price: [0, 4, 4.2, 4.4, 4.8],
    procurement_funding: [0, 210, 18, 20, 150],
  },
  "ACQ-CH53K": {
    quantity: [0, 1, 1, 1, 0],
    unit_price: [0, -1.5, -1, -0.5, 0],
    procurement_funding: [0, 85, 90, 95, 15],
  },
  "ACQ-AIM9X": {
    quantity: [0, 20, 25, 15, 10],
    unit_price: [0, 0.02, 0.03, 0.04, 0.05],
    procurement_funding: [0, 22, 30, 28, 25],
  },
};

const src = (
  id: string,
  title: string,
  kind: string,
  year: number,
  locator: string
) => ({ id, title, kind, year, locator });

export const SYNTHETIC_ACQUISITION_PROGRAMS: AcquisitionProgram[] = [
  {
    program_id: "ACQ-F35C",
    program_name: "F-35C Lightning II",
    short_name: "F-35C",
    portfolio: "Tactical Aviation",
    sponsor: "N98",
    appropriation: "APN",
    program_element: "0204288N",
    description:
      "Carrier-variant strike fighter procurement, production support, spares, and fielding activities.",
    annual: {
      2022: {
        quantity: 13,
        unit_price: 101.2,
        other_costs: 410.0,
        procurement_funding: 1725.6,
        selected_source: "Program Office Estimate",
        as_of: "2021-09-30",
      },
      2023: {
        quantity: 15,
        unit_price: 98.7,
        other_costs: 445.0,
        procurement_funding: 1925.5,
        selected_source: "N80 Review Position",
        as_of: "2022-10-14",
      },
      2024: {
        quantity: 19,
        unit_price: 96.4,
        other_costs: 520.0,
        procurement_funding: 2351.6,
        selected_source: "PBIS Budget Position",
        as_of: "2023-11-03",
      },
      2025: {
        quantity: 13,
        unit_price: 100.8,
        other_costs: 480.0,
        procurement_funding: 1790.4,
        selected_source: "PBIS Budget Position",
        as_of: "2024-12-06",
      },
      2026: {
        quantity: 11,
        unit_price: 105.6,
        other_costs: 510.0,
        procurement_funding: 1671.6,
        selected_source: "Illustrative Planning Position",
        as_of: "2025-03-21",
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 103.4,
        rationale: "Current production and negotiated option assumptions.",
        evidence_id: "F35-CONTRACT",
      },
      {
        year: 2025,
        owner: "N98",
        estimate_type: "Sponsor position",
        unit_price: 99.2,
        rationale: "Anticipated lot efficiencies and quantity leverage.",
        evidence_id: "F35-PRR",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 100.8,
        rationale: "Selected planning position after affordability review.",
        evidence_id: "F35-PBIS",
      },
      {
        year: 2025,
        owner: "FMB",
        estimate_type: "Contract-informed check",
        unit_price: 104.1,
        rationale:
          "Closer alignment to currently documented contractual pricing.",
        evidence_id: "F35-CONTRACT",
      },
    ],
    evidence: [
      src(
        "F35-PBIS",
        "Synthetic PBIS F-35C budget position",
        "PBIS",
        2025,
        "PBIS-SYN-F35C-v3"
      ),
      src(
        "F35-JBOOK",
        "Aircraft Procurement, Navy J-book",
        "Public J-book",
        2025,
        "Illustrative F-35C exhibit reference"
      ),
    ],
  },
  {
    program_id: "ACQ-P8A",
    program_name: "P-8A Poseidon",
    short_name: "P-8A",
    portfolio: "Maritime Aviation",
    sponsor: "N98",
    appropriation: "APN",
    program_element: "0204228N",
    description:
      "Maritime patrol aircraft procurement, mission systems, support equipment, and fleet introduction.",
    annual: {
      2022: {
        quantity: 8,
        unit_price: 168.0,
        other_costs: 288.0,
        procurement_funding: 1632.0,
      },
      2023: {
        quantity: 7,
        unit_price: 171.5,
        other_costs: 270.0,
        procurement_funding: 1470.5,
      },
      2024: {
        quantity: 6,
        unit_price: 175.2,
        other_costs: 255.0,
        procurement_funding: 1306.2,
      },
      2025: {
        quantity: 5,
        unit_price: 181.0,
        other_costs: 248.0,
        procurement_funding: 1153.0,
      },
      2026: {
        quantity: 4,
        unit_price: 188.8,
        other_costs: 242.0,
        procurement_funding: 997.2,
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 184.3,
        rationale: "Lower annual quantity and supplier escalation.",
        evidence_id: "P8-CONTRACT",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 181.0,
        rationale: "Selected midpoint with affordability adjustment.",
        evidence_id: "P8-PBIS",
      },
    ],
    evidence: [
      src(
        "P8-PBIS",
        "Synthetic PBIS P-8A budget position",
        "PBIS",
        2025,
        "PBIS-SYN-P8A-v2"
      ),
      src(
        "P8-JBOOK",
        "Aircraft Procurement, Navy J-book",
        "Public J-book",
        2025,
        "Illustrative P-8A exhibit reference"
      ),
    ],
  },
  {
    program_id: "ACQ-MQ25",
    program_name: "MQ-25 Stingray",
    short_name: "MQ-25",
    portfolio: "Unmanned Aviation",
    sponsor: "N98",
    appropriation: "APN",
    program_element: "0605215N",
    description:
      "Carrier-based unmanned aerial refueling system procurement, integration, and fielding.",
    annual: {
      2022: {
        quantity: 2,
        unit_price: 142.0,
        other_costs: 390.0,
        procurement_funding: 674.0,
      },
      2023: {
        quantity: 3,
        unit_price: 139.0,
        other_costs: 420.0,
        procurement_funding: 837.0,
      },
      2024: {
        quantity: 4,
        unit_price: 145.5,
        other_costs: 455.0,
        procurement_funding: 1037.0,
      },
      2025: {
        quantity: 5,
        unit_price: 154.0,
        other_costs: 490.0,
        procurement_funding: 1260.0,
      },
      2026: {
        quantity: 6,
        unit_price: 161.5,
        other_costs: 525.0,
        procurement_funding: 1494.0,
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 159.5,
        rationale: "Early production learning curve remains uncertain.",
        evidence_id: "MQ25-ICE",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 154.0,
        rationale: "Selected position includes schedule and integration risk.",
        evidence_id: "MQ25-PBIS",
      },
    ],
    evidence: [
      src(
        "MQ25-PBIS",
        "Synthetic PBIS MQ-25 budget position",
        "PBIS",
        2025,
        "PBIS-SYN-MQ25-v4"
      ),
    ],
  },
  {
    program_id: "ACQ-E2D",
    program_name: "E-2D Advanced Hawkeye",
    short_name: "E-2D",
    portfolio: "Command and Control",
    sponsor: "N98",
    appropriation: "APN",
    program_element: "0204163N",
    description:
      "Airborne early warning aircraft procurement, mission systems, and support costs.",
    annual: {
      2022: {
        quantity: 5,
        unit_price: 182.0,
        other_costs: 240.0,
        procurement_funding: 1150.0,
      },
      2023: {
        quantity: 5,
        unit_price: 179.5,
        other_costs: 225.0,
        procurement_funding: 1122.5,
      },
      2024: {
        quantity: 4,
        unit_price: 184.0,
        other_costs: 210.0,
        procurement_funding: 946.0,
      },
      2025: {
        quantity: 4,
        unit_price: 189.5,
        other_costs: 205.0,
        procurement_funding: 963.0,
      },
      2026: {
        quantity: 3,
        unit_price: 197.0,
        other_costs: 198.0,
        procurement_funding: 789.0,
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 191.0,
        rationale: "Current supplier and mission-system position.",
        evidence_id: "E2D-CONTRACT",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 189.5,
        rationale: "Selected planning value after program review.",
        evidence_id: "E2D-PBIS",
      },
    ],
    evidence: [
      src(
        "E2D-PBIS",
        "Synthetic PBIS E-2D budget position",
        "PBIS",
        2025,
        "PBIS-SYN-E2D-v1"
      ),
    ],
  },
  {
    program_id: "ACQ-CH53K",
    program_name: "CH-53K King Stallion",
    short_name: "CH-53K",
    portfolio: "Marine Aviation",
    sponsor: "USMC",
    appropriation: "APN",
    program_element: "0206123M",
    description:
      "Heavy-lift helicopter procurement, support equipment, and initial spares.",
    annual: {
      2022: {
        quantity: 9,
        unit_price: 110.0,
        other_costs: 330.0,
        procurement_funding: 1320.0,
      },
      2023: {
        quantity: 10,
        unit_price: 107.0,
        other_costs: 345.0,
        procurement_funding: 1415.0,
      },
      2024: {
        quantity: 12,
        unit_price: 104.5,
        other_costs: 365.0,
        procurement_funding: 1619.0,
      },
      2025: {
        quantity: 13,
        unit_price: 102.0,
        other_costs: 380.0,
        procurement_funding: 1706.0,
      },
      2026: {
        quantity: 14,
        unit_price: 101.0,
        other_costs: 395.0,
        procurement_funding: 1809.0,
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 103.0,
        rationale: "Production learning and stable annual quantity.",
        evidence_id: "CH53-CONTRACT",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 102.0,
        rationale: "Selected affordability position.",
        evidence_id: "CH53-PBIS",
      },
    ],
    evidence: [
      src(
        "CH53-PBIS",
        "Synthetic PBIS CH-53K budget position",
        "PBIS",
        2025,
        "PBIS-SYN-CH53K-v2"
      ),
    ],
  },
  {
    program_id: "ACQ-AIM9X",
    program_name: "AIM-9X Sidewinder",
    short_name: "AIM-9X",
    portfolio: "Weapons",
    sponsor: "N98",
    appropriation: "WPN",
    program_element: "0204162N",
    description:
      "Air-to-air missile procurement, production support, and software activities.",
    annual: {
      2022: {
        quantity: 280,
        unit_price: 0.52,
        other_costs: 65.0,
        procurement_funding: 210.6,
      },
      2023: {
        quantity: 300,
        unit_price: 0.54,
        other_costs: 68.0,
        procurement_funding: 230.0,
      },
      2024: {
        quantity: 325,
        unit_price: 0.57,
        other_costs: 72.0,
        procurement_funding: 257.3,
      },
      2025: {
        quantity: 340,
        unit_price: 0.62,
        other_costs: 78.0,
        procurement_funding: 288.8,
      },
      2026: {
        quantity: 350,
        unit_price: 0.66,
        other_costs: 82.0,
        procurement_funding: 313.0,
      },
    },
    estimates: [
      {
        year: 2025,
        owner: "Program Office",
        estimate_type: "Program estimate",
        unit_price: 0.64,
        rationale: "Supplier escalation and component constraints.",
        evidence_id: "AIM9-CONTRACT",
      },
      {
        year: 2025,
        owner: "N80",
        estimate_type: "Programming position",
        unit_price: 0.62,
        rationale:
          "Selected position balances escalation and quantity leverage.",
        evidence_id: "AIM9-PBIS",
      },
    ],
    evidence: [
      src(
        "AIM9-PBIS",
        "Synthetic PBIS AIM-9X budget position",
        "PBIS",
        2025,
        "PBIS-SYN-AIM9X-v3"
      ),
    ],
  },
];
