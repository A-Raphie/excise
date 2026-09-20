import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listCases = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("cases")
      .order("desc")
      .collect();
  },
});

export const getCase = query({
  args: { id: v.id("cases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCaseWithDetails = query({
  args: { id: v.id("cases") },
  handler: async (ctx, args) => {
    const caseRecord = await ctx.db.get(args.id);
    if (!caseRecord) return null;

    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_caseId", (q) => q.eq("caseId", args.id))
      .collect();

    const correspondence = await ctx.db
      .query("correspondence")
      .withIndex("by_caseId", (q) => q.eq("caseId", args.id))
      .order("asc")
      .collect();

    return {
      caseRecord,
      lineItems,
      correspondence,
    };
  },
});

export const createCase = mutation({
  args: {
    patientName: v.string(),
    hospitalName: v.string(),
    hospitalEin: v.optional(v.string()),
    chargemasterUrl: v.optional(v.string()),
    accountNumber: v.string(),
    billDate: v.string(),
    totalBilled: v.number(),
    lineItems: v.optional(
      v.array(
        v.object({
          cptCode: v.string(),
          description: v.string(),
          billedAmount: v.number(),
          hospitalCashRate: v.number(),
          cmsBenchmarkRate: v.number(),
          proposedAmount: v.number(),
          violationType: v.union(
            v.literal("UPCODING"),
            v.literal("UNBUNDLING"),
            v.literal("PRICE_GOUGE_OVER_CHARGEMASTER"),
            v.literal("DUPLICATE_CHARGE"),
            v.literal("COMPLIANT")
          ),
          auditRationale: v.string(),
          isDisputed: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const cleanName = args.patientName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomHex = Math.random().toString(36).substring(2, 6);
    const caseInbox = `excise-${cleanName}-${randomHex}@agentmail.to`;

    let totalExcised = 0;
    if (args.lineItems) {
      for (const item of args.lineItems) {
        if (item.isDisputed) {
          totalExcised += item.billedAmount - item.proposedAmount;
        }
      }
    }

    const now = Date.now();
    const caseId = await ctx.db.insert("cases", {
      patientName: args.patientName,
      hospitalName: args.hospitalName,
      hospitalEin: args.hospitalEin,
      chargemasterUrl: args.chargemasterUrl,
      accountNumber: args.accountNumber,
      billDate: args.billDate,
      totalBilled: args.totalBilled,
      totalExcised,
      status: "auditing",
      caseInbox,
      legalBasis:
        "No Surprises Act (45 C.F.R. § 149) & CMS Hospital Price Transparency (45 CFR § 180)",
      createdAt: now,
      updatedAt: now,
    });

    if (args.lineItems) {
      for (const item of args.lineItems) {
        await ctx.db.insert("lineItems", {
          caseId,
          ...item,
        });
      }
    }

    return caseId;
  },
});

export const updateCaseStatus = mutation({
  args: {
    id: v.id("cases"),
    status: v.union(
      v.literal("auditing"),
      v.literal("disputed"),
      v.literal("in_negotiation"),
      v.literal("settled"),
      v.literal("closed")
    ),
    finalSettlement: v.optional(v.number()),
    disputeLetter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caseRecord = await ctx.db.get(args.id);
    if (!caseRecord) throw new Error("Case not found");

    const patch: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.finalSettlement !== undefined) {
      patch.finalSettlement = args.finalSettlement;
      patch.totalExcised = caseRecord.totalBilled - args.finalSettlement;
    }

    if (args.disputeLetter !== undefined) {
      patch.disputeLetter = args.disputeLetter;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const toggleLineItemDispute = mutation({
  args: {
    lineItemId: v.id("lineItems"),
    isDisputed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.lineItemId);
    if (!item) throw new Error("Line item not found");

    await ctx.db.patch(args.lineItemId, { isDisputed: args.isDisputed });

    // Recalculate case total excised
    const allItems = await ctx.db
      .query("lineItems")
      .withIndex("by_caseId", (q) => q.eq("caseId", item.caseId))
      .collect();

    let newExcised = 0;
    for (const line of allItems) {
      const disputed = line._id === args.lineItemId ? args.isDisputed : line.isDisputed;
      if (disputed) {
        newExcised += line.billedAmount - line.proposedAmount;
      }
    }

    await ctx.db.patch(item.caseId, {
      totalExcised: newExcised,
      updatedAt: Date.now(),
    });
  },
});

export const addCorrespondence = mutation({
  args: {
    caseId: v.id("cases"),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    summary: v.string(),
    proposedAdjustment: v.optional(v.number()),
    messageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("correspondence", {
      caseId: args.caseId,
      direction: args.direction,
      from: args.from,
      to: args.to,
      subject: args.subject,
      body: args.body,
      summary: args.summary,
      proposedAdjustment: args.proposedAdjustment,
      messageId: args.messageId,
      timestamp: Date.now(),
    });

    const caseRecord = await ctx.db.get(args.caseId);
    if (caseRecord) {
      const patch: any = { updatedAt: Date.now() };
      if (args.direction === "inbound" && args.proposedAdjustment !== undefined) {
        patch.finalSettlement = args.proposedAdjustment;
        patch.totalExcised = caseRecord.totalBilled - args.proposedAdjustment;
        patch.status = "in_negotiation";
      }
      await ctx.db.patch(args.caseId, patch);
    }

    return id;
  },
});

export const seedSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if cases already exist
    const existing = await ctx.db.query("cases").first();
    if (existing) {
      return { message: "Sample data already seeded", caseId: existing._id };
    }

    const now = Date.now();
    const twoDaysAgo = now - 1000 * 60 * 60 * 48;
    const yesterday = now - 1000 * 60 * 60 * 24;
    const threeHoursAgo = now - 1000 * 60 * 60 * 3;

    // Case 1: Memorial Regional Medical Center ER Visit (Lead Showcase)
    const case1Id = await ctx.db.insert("cases", {
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
      legalBasis:
        "No Surprises Act (45 C.F.R. § 149), CMS Hospital Price Transparency (45 CFR § 180), NCCI Unbundling Policy",
      disputeLetter: `FORMAL NOTICE OF DISPUTE & DEMAND FOR RECODING / SETTLEMENT
Pursuant to the No Surprises Act (45 C.F.R. § 149) and CMS Hospital Price Transparency Requirements (45 CFR § 180)

To: Patient Financial Services & Revenue Cycle Operations
    Memorial Regional Medical Center
    Ref: Account #MR-9920148-B | Patient: Marcus Vance
    Date of Service: August 14, 2026

Dear Patient Financial Services,

This communication serves as a formal statutory dispute of billing statement #MR-9920148-B on behalf of Marcus Vance. An autonomous audit of the itemized master charges against Memorial Regional's publicly published Machine-Readable File (MRF) chargemaster and CMS National Correct Coding Initiative (NCCI) manuals reveals severe non-compliance, unbundling, and improper upcoding totaling $11,115.00 in unlawful charges.

Specifically:
1. CPT 99285 (Level 5 Emergency Department Visit) billed at $4,850.00 is grossly upcoded. Clinical documentation reflects a superficial forehead laceration closed with simple 4-0 sutures and basic neurological check, requiring moderate acuity under CPT 99283. Your own published cash price for Level 3 is $520.00; Medicare allowable is $135.00.
2. CPT 99070 (Surgical Tray) billed at $1,850.00 represents improper unbundling. CMS NCCI Chapter 1 specifically establishes that routine surgical trays and sterile dressing kits are integral facility supplies subsumed under primary repair code CPT 12002.
3. CPT 70450 (CT Head without contrast) billed at $5,400.00 represents an 830% markup over Memorial Regional's verified cash price of $650.00 filed under federal price transparency rules.

We hereby tender an immediate, binding settlement offer of $3,735.00 as full and final satisfaction of this account, reflecting 100% of your published cash chargemaster rates. Failure to respond or referral to collections during an active dispute violates federal debt collection statutes.

Direct all replies to our dedicated case inbox:
excise-marcus-vance-4912@agentmail.to

Sincerely,
Excise Dispute Engine (Case #MR-9920148-B)`,
      createdAt: twoDaysAgo,
      updatedAt: threeHoursAgo,
    });

    // Line items for Case 1
    await ctx.db.insert("lineItems", {
      caseId: case1Id,
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
    });

    await ctx.db.insert("lineItems", {
      caseId: case1Id,
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
    });

    await ctx.db.insert("lineItems", {
      caseId: case1Id,
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
    });

    await ctx.db.insert("lineItems", {
      caseId: case1Id,
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
    });

    await ctx.db.insert("lineItems", {
      caseId: case1Id,
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
    });

    // Correspondence for Case 1
    await ctx.db.insert("correspondence", {
      caseId: case1Id,
      direction: "outbound",
      from: "excise-marcus-vance-4912@agentmail.to",
      to: "disputes@memorialregional.org",
      subject: "Statutory Dispute Notice & Settlement Offer: Account #MR-9920148-B",
      body: "Attached formal dispute letter citing 45 C.F.R. § 149 and 45 CFR § 180. We identify $11,115.00 in unbundled suture kits and upcoded Level 5 ED visit. Tender of $3,735.00 submitted.",
      summary: "Outbound statutory dispute delivered via AgentMail citing No Surprises Act and hospital chargemaster cash rate.",
      proposedAdjustment: 3735,
      timestamp: yesterday,
    });

    await ctx.db.insert("correspondence", {
      caseId: case1Id,
      direction: "inbound",
      from: "disputes@memorialregional.org",
      to: "excise-marcus-vance-4912@agentmail.to",
      subject: "RE: Statutory Dispute Notice - Account #MR-9920148-B [Vance, Marcus]",
      body: `Dear Representative,

We have reviewed the documentation submitted regarding Marcus Vance (Acct #MR-9920148-B).

Upon clinical re-audit by our Revenue Integrity team, we concede that CPT 99070 (suture tray) was improperly billed separately and will be zeroed out (-$1,850.00). Furthermore, CPT 70450 has been recalculated to our self-pay standard schedule ($650.00). Regarding CPT 99285, we are adjusting the facility fee to Level 4 ($2,100.00).

Our revised balance is $3,735.00 if remitted within 30 days. Please confirm acceptance to conclude this matter.

Regards,
Brenda Kowalski, Senior Dispute Specialist
Patient Revenue Management, Memorial Regional`,
      summary: "Hospital billing conceded unbundling of CPT 99070 ($0) and CT scan markup ($650), matching our proposed settlement of $3,735.00.",
      proposedAdjustment: 3735,
      timestamp: threeHoursAgo,
    });

    // Case 2: Stanford Outpatient Colonoscopy & Biopsy
    const case2Id = await ctx.db.insert("cases", {
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
      createdAt: now - 1000 * 60 * 60 * 72,
      updatedAt: yesterday,
    });

    await ctx.db.insert("lineItems", {
      caseId: case2Id,
      cptCode: "45385",
      description: "Colonoscopy, flexible with removal of tumor/polyp by snare",
      billedAmount: 6200,
      hospitalCashRate: 2100,
      cmsBenchmarkRate: 850,
      proposedAmount: 2100,
      violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
      auditRationale: "Hospital charged $6,200 vs documented cash price of $2,100.",
      isDisputed: true,
    });

    await ctx.db.insert("lineItems", {
      caseId: case2Id,
      cptCode: "88305",
      description: "Surgical pathology, gross and microscopic examination",
      billedAmount: 3220,
      hospitalCashRate: 1140,
      cmsBenchmarkRate: 195,
      proposedAmount: 1140,
      violationType: "PRICE_GOUGE_OVER_CHARGEMASTER",
      auditRationale: "Billed 2.8x higher than transparent published chargemaster.",
      isDisputed: true,
    });

    await ctx.db.insert("correspondence", {
      caseId: case2Id,
      direction: "inbound",
      from: "billing@stanfordhealthcare.org",
      to: "excise-elena-rostova-7721@agentmail.to",
      subject: "Account Settled in Full - SHC-5582910-A",
      body: "We have accepted the tendered self-pay cash price of $3,240.00. Account is cleared with zero remaining balance.",
      summary: "Stanford Health accepted self-pay cash rate of $3,240.00. $6,180.00 excised.",
      proposedAdjustment: 3240,
      timestamp: yesterday,
    });

    return { message: "Sample data seeded successfully", caseId: case1Id };
  },
});
