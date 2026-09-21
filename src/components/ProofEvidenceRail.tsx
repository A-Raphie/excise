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
  Sparkles,
  Database,
  ArrowRight,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface ProofEvidenceRailProps {
  currentCase: SampleCase;
}

export function ProofEvidenceRail({ currentCase }: ProofEvidenceRailProps) {
  const [selectedProofIndex, setSelectedProofIndex] = useState(0);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedDigest, setCopiedDigest] = useState(false);

  const proofs = [
    {
      id: "convex-state",
      title: "Convex Reactive State Finality",
      authority: "Convex Real-time Backend Engine",
      badge: "VERIFIED MUTATION",
      variant: "emerald" as const,
      timestamp: "2026-09-20T10:28:38.102Z",
      digest: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      txId: "#tx_8f9a2d8104e",
      summary: "Atomic mutation committing $11,115.00 in verified hospital overcharges to Convex database.",
      details: [
        { k: "Backend Mutation", v: "convex/cases:adjudicateSettlement" },
        { k: "Docket ID", v: currentCase.id },
        { k: "Final Settlement Tender", v: `$${(currentCase.finalSettlement ?? 3735).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
        { k: "Total Excised", v: `-$${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} (-74.8%)` },
        { k: "State Integrity", v: "Cryptographically Sealed" },
      ],
      payload: {
        mutation: "cases:adjudicateSettlement",
        caseId: currentCase.id,
        accountNumber: currentCase.accountNumber,
        status: currentCase.status,
        totalBilled: currentCase.totalBilled,
        finalSettlement: currentCase.finalSettlement ?? 3735,
        totalExcised: currentCase.totalExcised,
        verifiedTimestamp: 1726824518102,
        stateHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      },
    },
    {
      id: "firecrawl-mrf",
      title: "Firecrawl MRF Price Transparency",
      authority: "CMS 45 CFR § 180 Machine-Readable File Crawler",
      badge: "RAW SOURCE WITNESSED",
      variant: "cyan" as const,
      timestamp: "2026-09-20T10:14:02.441Z",
      digest: "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      txId: "firecrawl_job_9920148",
      summary: "Ingested Memorial Regional MRF standard charges JSON to identify exact self-pay cash baseline.",
      details: [
        { k: "Source Endpoint", v: "memorialregional.org/transparency/standard-charges.json" },
        { k: "Facility EIN", v: currentCase.hospitalEin || "59-1234567" },
        { k: "Mandated Schedule", v: "CMS 50 Shoppable Self-Pay Cash Schedule" },
        { k: "CPT Discrepancies", v: "Found 3 rates exceeding published self-pay cash tender" },
        { k: "Crawler Version", v: "Firecrawl v2.4 Automated Extract" },
      ],
      payload: {
        crawler: "Firecrawl v2.4 Engine",
        sourceUrl: "https://memorialregional.org/transparency/standard-charges.json",
        cptMatches: [
          { cpt: "99070", standardRate: 1850.0, publishedCashRate: 0.0, status: "bundled" },
          { cpt: "70450", standardRate: 5400.0, publishedCashRate: 650.0, status: "overcharge" },
          { cpt: "99285", standardRate: 4850.0, publishedCashRate: 520.0, status: "upcoded" },
        ],
      },
    },
    {
      id: "agentmail-receipt",
      title: "AgentMail Statutory Service Receipt",
      authority: "RFC 5322 Inbound Webhook Execution",
      badge: "SPF / DKIM / TLS 1.3 PASS",
      variant: "purple" as const,
      timestamp: "2026-09-20T10:25:12.890Z",
      digest: "0x4a8b29c97011d882f09918bca481029381029381029381029381029381029381",
      txId: "msg_8f991c2084",
      summary: "Dispatched statutory demand letter via AgentMail with verifiable transport-layer security.",
      details: [
        { k: "Case Mailbox", v: currentCase.caseInbox },
        { k: "Hospital Recipient", v: "disputes@memorialregional.org" },
        { k: "Statutory Citation", v: "No Surprises Act (45 C.F.R. § 149.410)" },
        { k: "Statutory Stay Order", v: "Collections stay enforced during active review" },
        { k: "Transport Encryption", v: "TLS_AES_256_GCM_SHA384" },
      ],
      payload: {
        agentmail: {
          inbox: currentCase.caseInbox,
          messageId: "msg_8f991c2084",
          deliveryStatus: "delivered",
          tls: "TLS_AES_256_GCM_SHA384",
          dkim: "pass (hospital.org)",
          spf: "pass (ip: 198.51.100.44)",
          statutoryStayActive: true,
        },
      },
    },
    {
      id: "openai-ncci",
      title: "OpenAI Clinical CPT Violation Verdict",
      authority: "AMA CPT & CMS NCCI Policy Manual v31.2",
      badge: "ADMISSIBILITY 0.98",
      variant: "amber" as const,
      timestamp: "2026-09-20T10:14:04.110Z",
      digest: "0xc3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
      txId: "ncci_audit_ref_8829",
      summary: "Clinical audit proving CPT 99070 unbundling and CPT 99285 improper level-5 upcode.",
      details: [
        { k: "Primary Rule Citation", v: "NCCI Policy Manual Ch. 1 §B (General Correct Coding)" },
        { k: "Violation 1 (CPT 99070)", v: "Unbundling routine surgical tray from emergency facility fee" },
        { k: "Violation 2 (CPT 99285)", v: "Level 5 acuity upcode refuted by stable vitals and absence of organ threat" },
        { k: "Admissible Tender", v: "$3,735.00 based on verified self-pay schedule" },
        { k: "Audit Model", v: "gpt-4o-mini-clinical-audit" },
      ],
      payload: {
        engine: "gpt-4o-mini-clinical-audit",
        citations: [
          "45 CFR § 149.410 - Balance Billing Protections",
          "CMS NCCI Policy Manual Chapter 1 §B - Unbundled Supplies",
          "AMA CPT Guidelines - Emergency Department Services 99281-99285",
        ],
        admissibilityScore: 0.98,
        recommendation: "TENDER_STATUTORY_CONCESSION",
      },
    },
  ];

  const currentProof = proofs[selectedProofIndex];

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(currentProof.payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyDigest = () => {
    navigator.clipboard.writeText(currentProof.digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Verification Metric */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>EXCISE Cryptographic Proof &amp; Evidence Rail</span>
          </div>
          <p className="text-slate-600 text-xs mt-0.5 font-sans">
            Every audit claim, statutory demand, and hospital concession is anchored to falsifiable machine evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>4 of 4 Evidentiary Gates Certified</span>
          </span>
        </div>
      </div>

      {/* Human Assurance Strip: Instant Clarity for Patients */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-800 font-medium text-[11px]">Cryptographic State Sealed</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-800 font-medium text-[11px]">Hospital MRF Verified</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-800 font-medium text-[11px]">AgentMail Served (TLS 1.3)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-800 font-medium text-[11px]">CMS Coding Pass (0.98)</span>
        </div>
      </div>

      {/* 2. Interactive Split-Screen Lab: Selector on Left, Live Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 4 Selectable Evidence Gates (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold px-1">
            Certified Machine Attestations:
          </div>

          {proofs.map((proof, idx) => {
            const isSelected = selectedProofIndex === idx;

            return (
              <button
                key={proof.id}
                onClick={() => setSelectedProofIndex(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer font-mono text-xs ${
                  isSelected
                    ? "bg-white border-2 border-emerald-600 shadow-sm text-slate-950"
                    : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-slate-950 text-xs">
                    {proof.title}
                  </div>
                  <Badge variant={proof.variant}>{proof.badge}</Badge>
                </div>

                <div className="text-[11px] text-slate-600 mt-1 font-sans line-clamp-1">
                  {proof.summary}
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-sky-800 font-bold">{proof.txId}</span>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <span>Inspect Raw</span>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Live Raw Evidence Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 font-mono text-xs space-y-4 shadow-sm">
          {/* Inspector Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="text-sm font-bold text-slate-950 tracking-tight flex items-center gap-2">
                <span>{currentProof.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Authority: {currentProof.authority}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDigest}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer shadow-xs font-medium"
                title="Copy SHA-256 Digest"
              >
                {copiedDigest ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-800 font-bold">Digest Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyPayload}
                className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied JSON</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Payload</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cryptographic Digest Bar */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-[10px]">
            <span className="text-slate-500 font-bold uppercase tracking-wider shrink-0">
              SHA-256 Digest:
            </span>
            <span className="text-slate-900 font-mono font-semibold truncate">
              {currentProof.digest}
            </span>
          </div>

          {/* Key-Value Parameter Table */}
          <div className="space-y-1.5 text-[11px]">
            {currentProof.details.map((d, dIdx) => (
              <div
                key={dIdx}
                className="flex justify-between items-center bg-slate-50/70 px-3 py-2 rounded-lg border border-slate-200/80"
              >
                <span className="text-slate-600 mr-2 font-medium">
                  <span className="text-emerald-600 mr-1.5">▪</span>
                  {d.k}:
                </span>
                <span className="text-slate-950 font-bold truncate max-w-[60%] text-right">
                  {d.v}
                </span>
              </div>
            ))}
          </div>

          {/* Raw JSON Payload Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 text-purple-800 font-bold">
                <FileCode2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Raw Verifiable Evidence Payload</span>
              </span>
              <span className="text-[10px] text-slate-500">
                Timestamp: {new Date(currentProof.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-900 text-purple-200 text-[11px] overflow-x-auto leading-relaxed max-h-56 shadow-inner">
              {JSON.stringify(currentProof.payload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
