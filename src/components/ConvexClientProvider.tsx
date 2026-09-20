"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { INITIAL_SAMPLE_CASES, SampleCase, SampleLineItem, SampleCorrespondence } from "@/lib/sampleData";

interface AppContextType {
  cases: SampleCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  activeCase: SampleCase | null;
  toggleDispute: (caseId: string, lineItemId: string) => void;
  sendDispute: (caseId: string) => Promise<void>;
  simulateResponse: (
    caseId: string,
    type: "full_acceptance" | "counter_offer" | "unbundling_concession"
  ) => Promise<void>;
  auditNewBill: (billData: {
    hospitalName: string;
    patientName: string;
    accountNumber: string;
    billDate: string;
    totalBilled: number;
    cptCodes: string[];
    amounts: number[];
  }) => Promise<string>;
  resetToSampleData: () => void;
  isLiveConvex: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function useCaseEngine() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCaseEngine must be used within ConvexClientProvider");
  }
  return context;
}

// Ensure a safe valid fallback URL for build time / static exports
const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://quiet-fox-123.convex.cloud";
let convexClient: ConvexReactClient | null = null;
try {
  convexClient = new ConvexReactClient(convexUrl);
} catch (e) {
  console.warn("ConvexReactClient initialization deferred:", e);
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const isLiveConvex = Boolean(
    process.env.NEXT_PUBLIC_CONVEX_URL &&
      !process.env.NEXT_PUBLIC_CONVEX_URL.includes("dummy") &&
      !process.env.NEXT_PUBLIC_CONVEX_URL.includes("quiet-fox-123")
  );

  const [cases, setCases] = useState<SampleCase[]>(INITIAL_SAMPLE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-marcus-er");

  // Load from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("excise_cases_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCases(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  const updateCases = (newCases: SampleCase[]) => {
    setCases(newCases);
    try {
      localStorage.setItem("excise_cases_state", JSON.stringify(newCases));
    } catch {
      // ignore
    }
  };

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0] || null;

  const toggleDispute = (caseId: string, lineItemId: string) => {
    const updated = cases.map((c) => {
      if (c.id !== caseId) return c;
      const updatedLines = c.lineItems.map((li) => {
        if (li.id === lineItemId) {
          return { ...li, isDisputed: !li.isDisputed };
        }
        return li;
      });

      let totalExcised = 0;
      for (const li of updatedLines) {
        if (li.isDisputed) {
          totalExcised += li.billedAmount - li.proposedAmount;
        }
      }

      const finalSettlement = c.totalBilled - totalExcised;

      return {
        ...c,
        lineItems: updatedLines,
        totalExcised,
        finalSettlement,
        updatedAt: Date.now(),
      };
    });
    updateCases(updated);
  };

  const sendDispute = async (caseId: string) => {
    const current = cases.find((c) => c.id === caseId);
    if (!current) return;

    const newOutbound: SampleCorrespondence = {
      id: `cor-${Date.now()}`,
      direction: "outbound",
      from: current.caseInbox,
      to: `disputes@${current.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`,
      subject: `Statutory Dispute Notice & Settlement Tender: Account #${current.accountNumber}`,
      body: current.disputeLetter,
      summary: `Dispute packet dispatched to hospital patient financial services via AgentMail case inbox.`,
      proposedAdjustment: current.finalSettlement,
      timestamp: Date.now(),
    };

    const updated = cases.map((c) => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: "disputed" as const,
        correspondence: [...c.correspondence, newOutbound],
        updatedAt: Date.now(),
      };
    });
    updateCases(updated);
  };

  const simulateResponse = async (
    caseId: string,
    type: "full_acceptance" | "counter_offer" | "unbundling_concession"
  ) => {
    const current = cases.find((c) => c.id === caseId);
    if (!current) return;

    let counterOffer = current.finalSettlement ?? Math.round(current.totalBilled * 0.3);
    let body = "";
    let summary = "";
    let newStatus: "settled" | "in_negotiation" = "in_negotiation";
    let updatedLineItems = current.lineItems;

    if (type === "full_acceptance") {
      newStatus = "settled";
      counterOffer = current.finalSettlement ?? 3735;
      body = `Dear Representative,\n\nWe have completed administrative review of Account #${current.accountNumber} (${current.patientName}).\nIn accordance with our self-pay hospital financial policies and pursuant to your audit citing CMS Hospital Price Transparency (45 CFR § 180), we have accepted your tendered settlement of $${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })} in full satisfaction of all claims.\n\nYour account balance has been marked as PAID IN FULL upon receipt of payment. An amended zero-balance statement will follow.\n\nSincerely,\nCentral Revenue Integrity & Patient Resolution\n${current.hospitalName}`;
      summary = `Hospital accepted tendered settlement in full ($${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })}). Account marked PAID IN FULL.`;
    } else if (type === "unbundling_concession") {
      newStatus = "in_negotiation";
      counterOffer = 3735;
      body = `Attention Patient Advocacy,\n\nRegarding Account #${current.accountNumber}:\nOur clinical coding committee re-evaluated the itemized charges. We concede that routine surgical tray and supply kits (CPT 99070) were incorrectly unbundled under CMS NCCI edits and have voided those line items (-$1,850.00). Additionally, the emergency facility level has been downgraded to standard acuity.\n\nWe propose an amended mutual settlement of $${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })} to close this account immediately without collection action.\n\nBest regards,\nRevenue Cycle Operations, ${current.hospitalName}`;
      summary = `Hospital conceded unbundled surgical tray fees (-$1,850.00) and downgraded emergency level. Revised settlement: $${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`;

      updatedLineItems = current.lineItems.map((li) => {
        if (li.cptCode === "99070") {
          return {
            ...li,
            proposedAmount: 0,
            auditRationale:
              "CONCEDED BY HOSPITAL: Suture tray fee ($1,850.00) voided by Revenue Cycle committee.",
          };
        }
        return li;
      });
    } else {
      newStatus = "in_negotiation";
      counterOffer = Math.round(current.totalBilled * 0.45);
      body = `Regarding Dispute Account #${current.accountNumber}:\nWe acknowledge receipt of your formal contest. While we maintain the validity of procedural intervention, we can offer an administrative prompt-pay settlement of $${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })} (a 55% discount) to resolve this account within 14 business days.\n\nPatient Accounts Department\n${current.hospitalName}`;
      summary = `Hospital offered prompt-pay administrative counter-settlement of $${counterOffer.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`;
    }

    const newInbound: SampleCorrespondence = {
      id: `cor-in-${Date.now()}`,
      direction: "inbound",
      from: `billing-disputes@${current.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`,
      to: current.caseInbox,
      subject: `RE: Dispute Resolution Notice - Account #${current.accountNumber} [${current.patientName}]`,
      body,
      summary,
      proposedAdjustment: counterOffer,
      timestamp: Date.now(),
    };

    const updated = cases.map((c) => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        status: newStatus,
        finalSettlement: counterOffer,
        totalExcised: c.totalBilled - counterOffer,
        lineItems: updatedLineItems,
        correspondence: [...c.correspondence, newInbound],
        updatedAt: Date.now(),
      };
    });
    updateCases(updated);
  };

  const auditNewBill = async (billData: {
    hospitalName: string;
    patientName: string;
    accountNumber: string;
    billDate: string;
    totalBilled: number;
    cptCodes: string[];
    amounts: number[];
  }): Promise<string> => {
    const cleanName = billData.patientName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const randomHex = Math.random().toString(36).substring(2, 6);
    const caseInbox = `excise-${cleanName}-${randomHex}@agentmail.to`;
    const newCaseId = `case-${Date.now()}`;

    const lineItems: SampleLineItem[] = billData.cptCodes.map((cpt, idx) => {
      const billed = billData.amounts[idx] || 1200;
      let cashRate = Math.round(billed * 0.25);
      let cmsRate = Math.round(billed * 0.12);
      let violation: SampleLineItem["violationType"] = "PRICE_GOUGE_OVER_CHARGEMASTER";
      let rationale = `Billed charge is an excessive markup over hospital chargemaster cash rate of $${cashRate}.`;
      let proposed = cashRate;

      if (cpt === "99285") {
        violation = "UPCODING";
        rationale = "Clinical documentation does not meet Level 5 immediate life threat criteria; recoded to Level 3 (CPT 99283).";
        cashRate = 520;
        cmsRate = 135;
        proposed = 520;
      } else if (cpt === "99070") {
        violation = "UNBUNDLING";
        rationale = "Sterile supplies & surgical kits are bundled facility operating expenses under CMS NCCI Chapter 1 § E.";
        cashRate = 0;
        cmsRate = 0;
        proposed = 0;
      } else if (cpt === "70450") {
        violation = "PRICE_GOUGE_OVER_CHARGEMASTER";
        rationale = "Hospital billed >800% above verified machine-readable chargemaster rate.";
        cashRate = 650;
        cmsRate = 185;
        proposed = 650;
      }

      return {
        id: `line-${newCaseId}-${idx}`,
        cptCode: cpt,
        description: `Hospital Clinical Procedure CPT ${cpt}`,
        billedAmount: billed,
        hospitalCashRate: cashRate,
        cmsBenchmarkRate: cmsRate,
        proposedAmount: proposed,
        violationType: violation,
        auditRationale: rationale,
        isDisputed: true,
      };
    });

    const totalExcised = lineItems.reduce(
      (sum, li) => sum + (li.billedAmount - li.proposedAmount),
      0
    );
    const proposedSettlement = billData.totalBilled - totalExcised;

    const disputeLetter = `FORMAL NOTICE OF STATUTORY DISPUTE & DEMAND FOR RECODING
Pursuant to the No Surprises Act (45 C.F.R. § 149) and CMS Hospital Price Transparency (45 CFR § 180)

To: Patient Financial Services
    ${billData.hospitalName}
    Ref: Account #${billData.accountNumber} | Patient: ${billData.patientName}
    Date of Service: ${billData.billDate}

Dear Patient Financial Services,

This communication serves as a formal statutory dispute of billing statement #${billData.accountNumber} on behalf of ${billData.patientName}. 

An autonomous forensic audit conducted by Excise compares your itemized billing against your published Machine-Readable File (MRF) chargemaster schedule and CMS National Correct Coding Initiative (NCCI) policy. The audit identified $${totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} in unlawful charges, including improper unbundling of surgical supplies and egregious upcoding beyond clinical presentation.

STATUTORY TENDER OF SETTLEMENT:
We hereby tender an immediate, binding settlement payment of $${proposedSettlement.toLocaleString("en-US", { minimumFractionDigits: 2 })} in full satisfaction of all claims arising from this encounter.

Direct all replies to our dedicated case inbox:
${caseInbox}

Sincerely,
Excise Dispute Engine (Case #${billData.accountNumber})`;

    const newCase: SampleCase = {
      id: newCaseId,
      patientName: billData.patientName,
      hospitalName: billData.hospitalName,
      hospitalEin: "XX-XXXXXXX",
      chargemasterUrl: "https://hospital.org/standard-charges.json",
      accountNumber: billData.accountNumber,
      billDate: billData.billDate,
      totalBilled: billData.totalBilled,
      totalExcised,
      finalSettlement: proposedSettlement,
      status: "disputed",
      caseInbox,
      legalBasis: "No Surprises Act (45 C.F.R. § 149) & CMS Price Transparency (45 CFR § 180)",
      disputeLetter,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lineItems,
      correspondence: [
        {
          id: `cor-${Date.now()}`,
          direction: "outbound",
          from: caseInbox,
          to: `disputes@${billData.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`,
          subject: `Formal Dispute Notice: Account #${billData.accountNumber}`,
          body: disputeLetter,
          summary: `Initial statutory dispute letter generated and dispatched via AgentMail case inbox.`,
          proposedAdjustment: proposedSettlement,
          timestamp: Date.now(),
        },
      ],
    };

    updateCases([newCase, ...cases]);
    setSelectedCaseId(newCaseId);
    return newCaseId;
  };

  const resetToSampleData = () => {
    updateCases(INITIAL_SAMPLE_CASES);
    setSelectedCaseId("case-marcus-er");
  };

  const contextValue: AppContextType = {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    activeCase,
    toggleDispute,
    sendDispute,
    simulateResponse,
    auditNewBill,
    resetToSampleData,
    isLiveConvex,
  };

  const content = (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );

  if (convexClient) {
    return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
  }

  return content;
}
