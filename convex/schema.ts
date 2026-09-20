import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cases: defineTable({
    patientName: v.string(),
    hospitalName: v.string(),
    hospitalEin: v.optional(v.string()),
    chargemasterUrl: v.optional(v.string()),
    accountNumber: v.string(),
    billDate: v.string(),
    totalBilled: v.number(),
    totalExcised: v.number(),
    finalSettlement: v.optional(v.number()),
    status: v.union(
      v.literal("auditing"),
      v.literal("disputed"),
      v.literal("in_negotiation"),
      v.literal("settled"),
      v.literal("closed")
    ),
    caseInbox: v.string(),
    agentMailInboxId: v.optional(v.string()),
    disputeLetter: v.optional(v.string()),
    legalBasis: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_inbox", ["caseInbox"]),

  lineItems: defineTable({
    caseId: v.id("cases"),
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
  }).index("by_caseId", ["caseId"]),

  correspondence: defineTable({
    caseId: v.id("cases"),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    summary: v.string(),
    proposedAdjustment: v.optional(v.number()),
    messageId: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_caseId", ["caseId"]),

  chargemasters: defineTable({
    hospitalName: v.string(),
    cptCode: v.string(),
    description: v.string(),
    cashPrice: v.number(),
    minNegotiated: v.number(),
    maxNegotiated: v.number(),
    mrfUrl: v.string(),
    lastScraped: v.number(),
  })
    .index("by_hospital_cpt", ["hospitalName", "cptCode"])
    .index("by_cpt", ["cptCode"]),
});
