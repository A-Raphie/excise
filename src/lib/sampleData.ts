export interface SampleLineItem {
  id: string;
  cptCode: string;
  description: string;
  billedAmount: number;
  hospitalCashRate: number;
  cmsBenchmarkRate: number;
  proposedAmount: number;
  violationType: "UPCODING" | "UNBUNDLING" | "PRICE_GOUGE_OVER_CHARGEMASTER" | "DUPLICATE_CHARGE" | "COMPLIANT";
  auditRationale: string;
  isDisputed: boolean;
}

export interface SampleCorrespondence {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  subject: string;
  body: string;
  summary: string;
  proposedAdjustment?: number;
  timestamp: number;
}

export interface SampleCase {
  id: string;
  patientName: string;
  hospitalName: string;
  hospitalEin: string;
  chargemasterUrl: string;
  accountNumber: string;
  billDate: string;
  totalBilled: number;
  totalExcised: number;
  finalSettlement?: number;
  status: "auditing" | "disputed" | "in_negotiation" | "settled" | "closed";
  caseInbox: string;
  legalBasis: string;
  disputeLetter: string;
  createdAt: number;
  updatedAt: number;
  lineItems: SampleLineItem[];
  correspondence: SampleCorrespondence[];
}

export const PRESET_BILLS = [
  {
    id: "preset-er",
    title: "Emergency Room Trauma & Wound Repair",
    hospitalName: "Memorial Regional Medical Center",
    hospitalEin: "59-1234567",
    chargemasterUrl: "https://www.memorialregional.org/transparency/standard-charges.json",
    patientName: "Marcus Vance",
    accountNumber: "MR-9920148-B",
    billDate: "2026-08-14",
    totalBilled: 14850,
    cptCodes: ["99285", "99070", "70450", "36415", "12002"],
    amounts: [4850, 1850, 5400, 450, 2300],
  },
  {
    id: "preset-endo",
    title: "Outpatient Diagnostic Endoscopy & Biopsy",
    hospitalName: "Stanford Health Care",
    hospitalEin: "94-1156320",
    chargemasterUrl: "https://stanfordhealthcare.org/price-transparency.json",
    patientName: "Elena Rostova",
    accountNumber: "SHC-5582910-A",
    billDate: "2026-08-28",
    totalBilled: 9420,
    cptCodes: ["45385", "88305"],
    amounts: [6200, 3220],
  },
  {
    id: "preset-ortho",
    title: "Orthopedic Urgent Care & Fracture Imaging",
    hospitalName: "Mount Sinai Hospital",
    hospitalEin: "13-1624070",
    chargemasterUrl: "https://www.mountsinai.org/about/transparency-in-coverage",
    patientName: "David Chen",
    accountNumber: "MSH-4819203-X",
    billDate: "2026-09-02",
    totalBilled: 8150,
    cptCodes: ["99284", "70450", "99214"],
    amounts: [3200, 4270, 680],
  },
];

export const INITIAL_SAMPLE_CASES: SampleCase[] = [
  {
    id: "case-marcus-er",
    patientName: "Marcus Vance",
    hospitalName: "Memorial Regional Medical Center",
    hospitalEin: "59-1234567",
    chargemasterUrl: "https://www.memorialregional.org/transparency/standard-charges.json",
    accountNumber: "MR-9920148-B",
    billDate: "2026-08-14",
    totalBilled: 14850,
    totalExcised: 11115,
    finalSettlement: 3735,
    status: "in_negotiation",
    caseInbox: "excise-marcus-vance-4912@agentmail.to",
    legalBasis: "No Surprises Act (45 C.F.R. § 149) & CMS Hospital Price Transparency (45 CFR § 180)",
    disputeLetter: `FORMAL NOTICE OF DISPUTE & DEMAND FOR RECODING / SETTLEMENT
Pursuant to the No Surprises Act (45 C.F.R. § 149) and CMS Hospital Price Transparency Requirements (45 CFR § 180)

To: Patient Financial Services & Revenue Cycle Operations
    Memorial Regional Medical Center
    Ref: Account #MR-9920148-B | Patient: Marcus Vance
    Date of Service: August 14, 2026

Dear Patient Financial Services,

This communication serves as a formal statutory dispute of billing statement #MR-9920148-B on behalf of Marcus Vance. An autonomous audit of the itemized master charges against Memorial Regional's publicly published Machine-Readable File (MRF) chargemaster and CMS National Correct Coding Initiative (NCCI) manuals reveals severe non-compliance, unbundling, and improper upcoding totaling $11,115.00 in non-compliant overcharges.

Specifically:
1. CPT 99285 (Level 5 Emergency Department Visit) billed at $4,850.00 is grossly upcoded. Clinical documentation reflects a superficial forehead laceration closed with simple 4-0 sutures and basic neurological check, requiring moderate acuity under CPT 99283. Your own published cash price for Level 3 is $520.00; Medicare allowable is $135.00.
2. CPT 99070 (Surgical Tray) billed at $1,850.00 represents improper unbundling. CMS NCCI Chapter 1 specifically establishes that routine surgical trays and sterile dressing kits are integral facility supplies subsumed under primary repair code CPT 12002.
3. CPT 70450 (CT Head without contrast) billed at $5,400.00 represents an 830% markup over Memorial Regional's verified cash price of $650.00 filed under federal price transparency rules.

We hereby tender an immediate, binding settlement offer of $3,735.00 as full and final satisfaction of this account, reflecting 100% of your published cash chargemaster rates. Failure to respond or referral to collections during an active dispute violates federal debt collection statutes.

Direct all replies to our dedicated case inbox:
excise-marcus-vance-4912@agentmail.to

Sincerely,
Excise Dispute Engine (Case #MR-9920148-B)`,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    lineItems: [
      {
        id: "item-1",
        cptCode: "99285",
        description: "Emergency Dept Visit - Level 5 (High/Immediate Threat)",
        billedAmount: 4850,
        hospitalCashRate: 1150,
        cmsBenchmarkRate: 265,
        proposedAmount: 520,
        violationType: "UPCODING",
        auditRationale:
          "Medical records document simple forehead laceration with stable vitals and zero critical organ threat. Coding Level 5 violates AMA CPT guidelines; recoded to Level 3 (CPT 99283).",
        isDisputed: true,
      },
      {
        id: "item-2",
        cptCode: "99070",
        description: "Supplies & Materials (Sterile Suture Kit & Tray)",
        billedAmount: 1850,
        hospitalCashRate: 0,
        cmsBenchmarkRate: 0,
        proposedAmount: 0,
        violationType: "UNBUNDLING",
        auditRationale:
          "Sterile suture kit unbundled from primary wound closure CPT 12002. Under CMS NCCI Chapter 1 § E, routine facility trays cannot be separately billed.",
        isDisputed: true,
      },
      {
        id: "item-3",
        cptCode: "70450",
        description: "CT Head / Brain without contrast",
        billedAmount: 5400,
        hospitalCashRate: 650,
        cmsBenchmarkRate: 185,
        proposedAmount: 650,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale:
          "Billed amount of $5,400.00 is an 830% markup over Memorial Regional's own published chargemaster cash rate of $650.00 verified via Firecrawl crawl.",
        isDisputed: true,
      },
      {
        id: "item-4",
        cptCode: "36415",
        description: "Routine Venipuncture Blood Draw",
        billedAmount: 450,
        hospitalCashRate: 35,
        cmsBenchmarkRate: 12,
        proposedAmount: 35,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale:
          "Routine blood collection marked up 1,285% over standard hospital cash schedule. Recalculated to chargemaster cash rate.",
        isDisputed: true,
      },
      {
        id: "item-5",
        cptCode: "12002",
        description: "Simple Wound Repair, Scalp/Neck/Axilla (2.6cm - 7.5cm)",
        billedAmount: 2300,
        hospitalCashRate: 750,
        cmsBenchmarkRate: 210,
        proposedAmount: 750,
        violationType: "COMPLIANT",
        auditRationale:
          "Procedural documentation substantiates 4.2cm laceration closure. Adjusted to published standard cash fee.",
        isDisputed: true,
      },
    ],
    correspondence: [
      {
        id: "cor-1",
        direction: "outbound",
        from: "excise-marcus-vance-4912@agentmail.to",
        to: "disputes@memorialregional.org",
        subject: "Statutory Dispute Notice & Settlement Offer: Account #MR-9920148-B",
        body: "Attached formal dispute letter citing 45 C.F.R. § 149 and 45 CFR § 180. We identify $11,115.00 in unbundled suture kits and upcoded Level 5 ED visit. Tender of $3,735.00 submitted.",
        summary: "Outbound statutory dispute delivered via AgentMail citing No Surprises Act and hospital chargemaster cash rate.",
        proposedAdjustment: 3735,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "cor-2",
        direction: "inbound",
        from: "disputes@memorialregional.org",
        to: "excise-marcus-vance-4912@agentmail.to",
        subject: "RE: Statutory Dispute Notice - Account #MR-9920148-B [Vance, Marcus]",
        body: `Dear Representative,\n\nWe have reviewed the documentation submitted regarding Marcus Vance (Acct #MR-9920148-B).\n\nUpon clinical re-audit by our Revenue Integrity team, we concede that CPT 99070 (suture tray) was improperly billed separately and will be zeroed out (-$1,850.00). Furthermore, CPT 70450 has been recalculated to our self-pay standard schedule ($650.00). Regarding CPT 99285, we are adjusting the facility fee to Level 4 ($2,100.00).\n\nOur revised balance is $3,735.00 if remitted within 30 days. Please confirm acceptance to conclude this matter.\n\nRegards,\nBrenda Kowalski, Senior Dispute Specialist\nPatient Revenue Management, Memorial Regional`,
        summary: "Hospital billing conceded unbundling of CPT 99070 ($0) and CT scan markup ($650), matching our proposed settlement of $3,735.00.",
        proposedAdjustment: 3735,
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
      },
    ],
  },
  {
    id: "case-elena-endo",
    patientName: "Elena Rostova",
    hospitalName: "Stanford Health Care",
    hospitalEin: "94-1156320",
    chargemasterUrl: "https://stanfordhealthcare.org/price-transparency.json",
    accountNumber: "SHC-5582910-A",
    billDate: "2026-08-28",
    totalBilled: 9420,
    totalExcised: 6180,
    finalSettlement: 3240,
    status: "settled",
    caseInbox: "excise-elena-rostova-7721@agentmail.to",
    legalBasis: "CMS Hospital Price Transparency (45 CFR § 180)",
    disputeLetter: `Formal Dispute Letter for Stanford Health Care regarding Account #SHC-5582910-A.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    lineItems: [
      {
        id: "item-e1",
        cptCode: "45385",
        description: "Colonoscopy, flexible with removal of tumor/polyp by snare",
        billedAmount: 6200,
        hospitalCashRate: 2100,
        cmsBenchmarkRate: 850,
        proposedAmount: 2100,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale: "Hospital charged $6,200 vs documented cash price of $2,100.",
        isDisputed: true,
      },
      {
        id: "item-e2",
        cptCode: "88305",
        description: "Surgical pathology, gross and microscopic examination",
        billedAmount: 3220,
        hospitalCashRate: 1140,
        cmsBenchmarkRate: 195,
        proposedAmount: 1140,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale: "Billed 2.8x higher than transparent published chargemaster.",
        isDisputed: true,
      },
    ],
    correspondence: [
      {
        id: "cor-e1",
        direction: "inbound",
        from: "billing@stanfordhealthcare.org",
        to: "excise-elena-rostova-7721@agentmail.to",
        subject: "Account Settled in Full - SHC-5582910-A",
        body: "We have accepted the tendered self-pay cash price of $3,240.00. Account is cleared with zero remaining balance.",
        summary: "Stanford Health accepted self-pay cash rate of $3,240.00. $6,180.00 excised.",
        proposedAdjustment: 3240,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
    ],
  },
  {
    id: "case-david-ortho",
    patientName: "David Chen",
    hospitalName: "Mount Sinai Hospital",
    hospitalEin: "13-1624070",
    chargemasterUrl: "https://www.mountsinai.org/about/transparency-in-coverage",
    accountNumber: "MSH-4819203-X",
    billDate: "2026-09-02",
    totalBilled: 8150,
    totalExcised: 5750,
    finalSettlement: 2400,
    status: "in_negotiation",
    caseInbox: "excise-david-chen-1049@agentmail.to",
    legalBasis: "CMS Hospital Price Transparency (45 CFR § 180) & CMS NCCI Unbundling Edits",
    disputeLetter: `FORMAL NOTICE OF DISPUTE & DEMAND FOR RECODING / SETTLEMENT
Pursuant to CMS Hospital Price Transparency Requirements (45 CFR § 180) and CMS National Correct Coding Initiative (NCCI)

To: Patient Financial Services & Revenue Cycle Operations
    Mount Sinai Hospital
    Ref: Account #MSH-4819203-X | Patient: David Chen
    Date of Service: September 02, 2026

Dear Patient Financial Services,

This communication serves as a formal statutory dispute of billing statement #MSH-4819203-X on behalf of David Chen. An autonomous audit of the itemized master charges against Mount Sinai Hospital's published Machine-Readable File (MRF) chargemaster and CMS NCCI manuals reveals severe overcharging totaling $5,750.00 in non-compliant charges.

Specifically:
1. CPT 99284 (Level 4 Emergency Visit) billed at $3,200.00 is inflated beyond your standard cash rate of $750.00.
2. CPT 70450 (CT Head Scan) billed at $4,270.00 exceeds your transparent cash rate of $1,100.00 by 288%.
3. CPT 99214 (Office Visit) billed at $680.00 was unbundled from initial evaluation.

We tender a prompt settlement offer of $2,400.00 in full satisfaction of all claims.

Direct all replies to our dedicated case inbox:
excise-david-chen-1049@agentmail.to

Sincerely,
Excise Dispute Engine (Case #MSH-4819203-X)`,
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    lineItems: [
      {
        id: "item-d1",
        cptCode: "99284",
        description: "Emergency Dept Visit - Level 4 (High Acuity)",
        billedAmount: 3200,
        hospitalCashRate: 750,
        cmsBenchmarkRate: 190,
        proposedAmount: 750,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale: "Hospital charged $3,200 vs transparent cash price of $750.",
        isDisputed: true,
      },
      {
        id: "item-d2",
        cptCode: "70450",
        description: "CT Head/Brain without contrast",
        billedAmount: 4270,
        hospitalCashRate: 1100,
        cmsBenchmarkRate: 215,
        proposedAmount: 1100,
        violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
        auditRationale: "Billed 2.88x above hospital standard cash chargemaster file.",
        isDisputed: true,
      },
      {
        id: "item-d3",
        cptCode: "99214",
        description: "Office/Outpatient Visit Established 30-39 min",
        billedAmount: 680,
        hospitalCashRate: 550,
        cmsBenchmarkRate: 130,
        proposedAmount: 550,
        violationType: "UNBUNDLING",
        auditRationale: "Unbundled routine orthopedic consult from primary emergency encounter.",
        isDisputed: true,
      },
    ],
    correspondence: [
      {
        id: "cor-d1",
        direction: "outbound",
        from: "excise-david-chen-1049@agentmail.to",
        to: "disputes@mountsinai.org",
        subject: "Statutory Dispute Notice & Settlement Tender: Account #MSH-4819203-X",
        body: "Attached statutory dispute notice citing 45 CFR § 180 and NCCI unbundling rules. Proposed settlement: $2,400.00.",
        summary: "Outbound statutory dispute delivered via AgentMail citing hospital cash chargemaster rates.",
        proposedAdjustment: 2400,
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
      },
      {
        id: "cor-d2",
        direction: "inbound",
        from: "disputes@mountsinai.org",
        to: "excise-david-chen-1049@agentmail.to",
        subject: "RE: Dispute Notice - Account #MSH-4819203-X [Chen, David]",
        body: `Dear Representative,\n\nWe have reviewed the dispute regarding Account #MSH-4819203-X.\nWe have recalculated the CT scan to our self-pay standard price ($1,100.00) and adjusted the Level 4 ED visit down to $750.00. The revised balance is $2,400.00.\n\nPlease remit payment within 30 calendar days.\n\nRevenue Cycle Operations, Mount Sinai Hospital`,
        summary: "Hospital conceded charges, reducing total bill to $2,400.00 (-$5,750.00 excised).",
        proposedAdjustment: 2400,
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
    ],
  },
];
