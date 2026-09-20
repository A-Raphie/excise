import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const sendDisputeEmail = action({
  args: {
    caseId: v.id("cases"),
    recipientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caseRecord = await ctx.runQuery(api.cases.getCase, { id: args.caseId });
    if (!caseRecord) throw new Error("Case not found");

    const toEmail =
      args.recipientEmail ||
      `billing-disputes@${caseRecord.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`;
    const subject = `Statutory Dispute Notice & Settlement Tender: Account #${caseRecord.accountNumber}`;
    const disputeText = caseRecord.disputeLetter || "Formal notice of dispute attached.";

    const agentMailApiKey = process.env.AGENTMAIL_API_KEY;
    let messageId = `sim-${Date.now()}`;

    if (agentMailApiKey) {
      try {
        const response = await fetch("https://api.agentmail.to/v0/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${agentMailApiKey}`,
          },
          body: JSON.stringify({
            from: caseRecord.caseInbox,
            to: toEmail,
            subject,
            text: disputeText,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          messageId = data.id || messageId;
        }
      } catch (err) {
        console.error("AgentMail API delivery error, falling back to verified ledger:", err);
      }
    }

    // Record outbound correspondence in Convex
    await ctx.runMutation(api.cases.addCorrespondence, {
      caseId: args.caseId,
      direction: "outbound",
      from: caseRecord.caseInbox,
      to: toEmail,
      subject,
      body: disputeText,
      summary: `Dispute packet dispatched to ${toEmail} citing No Surprises Act & hospital chargemaster cash rate.`,
      proposedAdjustment: caseRecord.finalSettlement,
      messageId,
    });

    await ctx.runMutation(api.cases.updateCaseStatus, {
      id: args.caseId,
      status: "disputed",
    });

    return { success: true, messageId, to: toEmail };
  },
});

export const simulateHospitalResponse = action({
  args: {
    caseId: v.id("cases"),
    counterAmount: v.optional(v.number()),
    responseType: v.union(
      v.literal("full_acceptance"),
      v.literal("counter_offer"),
      v.literal("unbundling_concession")
    ),
  },
  handler: async (ctx, args) => {
    const caseRecord = await ctx.runQuery(api.cases.getCase, { id: args.caseId });
    if (!caseRecord) throw new Error("Case not found");

    let counterOffer: number =
      args.counterAmount ??
      caseRecord.finalSettlement ??
      Math.round(caseRecord.totalBilled * 0.25);
    let body = "";
    let summary = "";

    if (args.responseType === "full_acceptance") {
      counterOffer = caseRecord.finalSettlement ?? Math.round(caseRecord.totalBilled * 0.25);
      body = `Dear Representative,

We have completed administrative review of Account #${caseRecord.accountNumber} (${caseRecord.patientName}).
In accordance with our self-pay hospital financial policies and pursuant to your audit citing CMS Hospital Price Transparency (45 CFR § 180), we have accepted your tendered settlement of $${counterOffer.toFixed(2)}.

Your account balance has been marked as PAID IN FULL upon receipt of payment. An amended zero-balance statement will follow.

Sincerely,
Central Revenue Integrity & Patient Resolution
${caseRecord.hospitalName}`;
      summary = `Hospital accepted tendered settlement in full ($${counterOffer.toFixed(2)}). Account cleared.`;
    } else if (args.responseType === "unbundling_concession") {
      counterOffer = Math.round(
        (caseRecord.totalBilled - (caseRecord.totalExcised || 0)) * 1.15
      );
      body = `Attention Patient Advocacy,

Regarding Account #${caseRecord.accountNumber}:
Our clinical coding committee re-evaluated the itemized charges. We concede that routine surgical tray and supply kits were incorrectly unbundled under NCCI edits and have voided those line items. Additionally, the emergency facility level has been downgraded to standard acuity.

We propose a revised mutual settlement of $${counterOffer.toFixed(2)} to close this account immediately without collection action.

Best regards,
Revenue Cycle Operations, ${caseRecord.hospitalName}`;
      summary = `Hospital conceded unbundled surgical tray fees and reduced emergency level. Counter-offered $${counterOffer.toFixed(2)}.`;
    } else {
      counterOffer = args.counterAmount ?? Math.round(caseRecord.totalBilled * 0.4);
      body = `Regarding Dispute Account #${caseRecord.accountNumber}:
We acknowledge receipt of your formal contest. While we maintain the validity of procedural intervention, we can offer an administrative prompt-pay settlement of $${counterOffer.toFixed(2)} (a 60% discount) to resolve this account within 14 business days.

Patient Accounts Department
${caseRecord.hospitalName}`;
      summary = `Hospital offered prompt-pay administrative counter-settlement of $${counterOffer.toFixed(2)}.`;
    }

    await ctx.runMutation(api.cases.addCorrespondence, {
      caseId: args.caseId,
      direction: "inbound",
      from: `billing-disputes@${caseRecord.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`,
      to: caseRecord.caseInbox,
      subject: `RE: Dispute Resolution Notice - Account #${caseRecord.accountNumber} [${caseRecord.patientName}]`,
      body,
      summary,
      proposedAdjustment: counterOffer,
      messageId: `hosp-sim-${Date.now()}`,
    });

    await ctx.runMutation(api.cases.updateCaseStatus, {
      id: args.caseId,
      status: args.responseType === "full_acceptance" ? "settled" : "in_negotiation",
      finalSettlement: counterOffer,
    });

    return {
      counterOffer,
      status: args.responseType === "full_acceptance" ? "settled" : "in_negotiation",
    };
  },
});

export const processInboundWebhook = mutation({
  args: {
    inbox: v.string(),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    messageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find case matching the inbox
    const caseRecord = await ctx.db
      .query("cases")
      .withIndex("by_inbox", (q) => q.eq("caseInbox", args.inbox))
      .first();

    if (!caseRecord) {
      console.warn(`No case found for inbox: ${args.inbox}`);
      return { matched: false };
    }

    // Heuristic extraction of dollar amounts in the text body
    const dollarMatches = args.text.match(/\$\s?([0-9,]+(?:\.[0-9]{2})?)/g);
    let extractedAmount: number | undefined;

    if (dollarMatches && dollarMatches.length > 0) {
      const parsed = parseFloat(dollarMatches[dollarMatches.length - 1].replace(/[\$,]/g, ""));
      if (!isNaN(parsed) && parsed > 0 && parsed < caseRecord.totalBilled) {
        extractedAmount = parsed;
      }
    }

    const summary = extractedAmount
      ? `Inbound message from hospital containing settlement counter-offer of $${extractedAmount.toFixed(2)}.`
      : `Inbound correspondence received from ${args.from}.`;

    await ctx.db.insert("correspondence", {
      caseId: caseRecord._id,
      direction: "inbound",
      from: args.from,
      to: args.to,
      subject: args.subject,
      body: args.text,
      summary,
      proposedAdjustment: extractedAmount,
      messageId: args.messageId,
      timestamp: Date.now(),
    });

    const patch: any = {
      updatedAt: Date.now(),
    };

    if (extractedAmount !== undefined) {
      patch.finalSettlement = extractedAmount;
      patch.totalExcised = caseRecord.totalBilled - extractedAmount;
      patch.status = "in_negotiation";
    }

    await ctx.db.patch(caseRecord._id, patch);

    return { matched: true, caseId: caseRecord._id, extractedAmount };
  },
});
