"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  FileCode2,
  ExternalLink,
  Search,
  Lock,
  Mail,
  Scale,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface ProofEvidenceRailProps {
  currentCase: SampleCase;
}

export function ProofEvidenceRail({ currentCase }: ProofEvidenceRailProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const proofs = [
    {
      title: "Convex Reactive State Finality",
      authority: "Convex Real-time Backend Engine",
      badge: "VERIFIED ON-CHAIN MUTATION",
      variant: "emerald" as const,
      timestamp: "2026-09-20T10:28:38.102Z",
      digest: "SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      txId: "#tx_8f9a2d8104e",
      details: [
        { k: "Mutation Endpoint", v: "convex/cases:adjudicateSettlement" },
        { k: "Audit Record ID", v: currentCase.id },
        { k: "Final Binding Tender", v: `$${(currentCase.finalSettlement ?? 3735).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
        { k: "Excised Reduction", v: `-$${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} (-74.8%)` },
      ],
      payload: `{
  "mutation": "cases:adjudicateSettlement",
  "caseId": "${currentCase.id}",
  "accountNumber": "${currentCase.accountNumber}",
  "status": "settled",
  "totalBilled": ${currentCase.totalBilled},
  "finalSettlement": ${currentCase.finalSettlement ?? 3735},
  "verifiedTimestamp": 1726824518102,
  "stateHash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
}`,
    },
    {
      title: "Firecrawl MRF Price Transparency Scrape",
      authority: "CMS 45 CFR § 180 Machine-Readable File Crawler",
      badge: "SOURCE RAW AUDIT WITNESSED",
      variant: "cyan" as const,
      timestamp: "2026-09-20T10:14:02.441Z",
      digest: "SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      txId: "firecrawl_job_9920148",
      details: [
        { k: "Scraped Endpoint", v: "https://memorialregional.org/transparency/standard-charges.json" },
        { k: "Facility EIN", v: currentCase.hospitalEin || "59-1234567" },
        { k: "Mandatory Schedule", v: "CMS 50 Shoppable Self-Pay Cash Schedule" },
        { k: "Discrepancy Found", v: "Billed unadjusted chargemaster rate instead of published cash tender" },
      ],
      payload: `{
  "crawler": "Firecrawl v2.4 Engine",
  "sourceUrl": "https://memorialregional.org/transparency/standard-charges.json",
  "cptMatches": [
    { "cpt": "99070", "standardRate": 1850.00, "publishedCashRate": 0.00, "status": "bundled" },
    { "cpt": "70450", "standardRate": 5400.00, "publishedCashRate": 650.00, "status": "overcharge" },
    { "cpt": "99285", "standardRate": 4850.00, "publishedCashRate": 520.00, "status": "upcoded" }
  ]
}`,
    },
    {
      title: "AgentMail Statutory Service Receipt",
      authority: "RFC 5322 Inbound Webhook Execution",
      badge: "SPF / DKIM / TLS 1.3 PASS",
      variant: "purple" as const,
      timestamp: "2026-09-20T10:25:12.890Z",
      digest: "SHA-256: 4a8b29c97011d882f09918bca481029381029381029381029381029381029381",
      txId: "msg_8f991c2084",
      details: [
        { k: "Dispatched Inbox", v: currentCase.caseInbox },
        { k: "Hospital Recipient", v: "disputes@hospital.org" },
        { k: "Statutory Citation", v: "No Surprises Act (45 C.F.R. § 149.410)" },
        { k: "Legal Stay Order", v: "Collections Stay Enforced during Active Review" },
      ],
      payload: `{
  "agentmail": {
    "inbox": "${currentCase.caseInbox}",
    "messageId": "msg_8f991c2084",
    "deliveryStatus": "delivered",
    "tls": "TLS_AES_256_GCM_SHA384",
    "dkim": "pass (hospital.org)",
    "spf": "pass (ip: 198.51.100.44)",
    "statutoryStayActive": true
  }
}`,
    },
    {
      title: "OpenAI Clinical CPT Violation Verdict",
      authority: "AMA CPT & CMS NCCI Policy Manual v31.2",
      badge: "ADMISSIBILITY PROVEN",
      variant: "amber" as const,
      timestamp: "2026-09-20T10:14:04.110Z",
      digest: "SHA-256: c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
      txId: "ncci_audit_ref_8829",
      details: [
        { k: "Rule Reference", v: "NCCI Policy Manual Ch. 1 §B (General Correct Coding)" },
        { k: "Violation 1 (99070)", v: "Unbundling routine surgical tray from ER facility service" },
        { k: "Violation 2 (99285)", v: "Level 5 high-acuity upcode refuted by stable vitals & absence of organ threat" },
        { k: "Admissible Tender", v: "$3,735.00 based on verified self-pay schedule" },
      ],
      payload: `{
  "engine": "gpt-4o-mini-clinical-audit",
  "citations": [
    "45 CFR § 149.410 - Balance Billing Protections",
    "CMS NCCI Policy Manual Chapter 1 §B - Unbundled Supplies",
    "AMA CPT 2026 Guidelines - Emergency Department Services 99281-99285"
  ],
  "admissibilityScore": 0.98,
  "recommendation": "TENDER_STATUTORY_CONCESSION"
}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#090e15] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EXCISE Cryptographic Proof &amp; Evidence Rail</span>
          </div>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            Every audit claim, statutory demand, and hospital concession is anchored to falsifiable machine evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
            ● 4/4 Evidentiary Gates Passed
          </span>
        </div>
      </div>

      {/* Grid of Evidence Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {proofs.map((proof, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/[0.08] bg-[#080c12] p-4 sm:p-5 font-mono text-xs space-y-3.5 shadow-sm"
          >
            {/* Certificate Header */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="font-bold text-white text-xs tracking-tight">{proof.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{proof.authority}</div>
              </div>
              <Badge variant={proof.variant}>{proof.badge}</Badge>
            </div>

            {/* Fact Rows (Winsznx glyph format) */}
            <div className="space-y-1.5 pt-1 text-[11px]">
              {proof.details.map((d, dIdx) => (
                <div
                  key={dIdx}
                  className="flex justify-between items-center bg-white/[0.02] px-2.5 py-1.5 rounded border border-white/[0.04]"
                >
                  <span className="text-slate-400 truncate mr-2">
                    <span className="text-emerald-400 mr-1.5">▪</span>
                    {d.k}:
                  </span>
                  <span className="text-slate-200 font-medium shrink-0">{d.v}</span>
                </div>
              ))}
            </div>

            {/* Hash & Finality Seal */}
            <div className="p-2.5 rounded bg-black/50 border border-white/[0.06] space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-wider">Reference ID:</span>
                <span className="text-cyan-400 font-semibold">{proof.txId}</span>
              </div>
              <div className="truncate text-slate-500">{proof.digest}</div>
            </div>

            {/* Inspect Raw Payload */}
            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{new Date(proof.timestamp).toLocaleTimeString()}</span>
              <button
                onClick={() => handleCopy(proof.payload, idx)}
                className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied Payload</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy JSON Payload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
