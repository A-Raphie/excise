"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface CaseOverviewProps {
  currentCase: SampleCase;
}

export function CaseOverview({ currentCase }: CaseOverviewProps) {
  const { cases, selectedCaseId, setSelectedCaseId } = useCaseEngine();
  const [copied, setCopied] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  const handleCopyInbox = () => {
    navigator.clipboard.writeText(currentCase.caseInbox);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentReduction =
    currentCase.totalBilled > 0
      ? ((currentCase.totalExcised / currentCase.totalBilled) * 100).toFixed(1)
      : "0";

  const getStatusBadge = () => {
    switch (currentCase.status) {
      case "settled":
        return <Badge variant="emerald"><CheckCircle2 className="w-3 h-3" /> SETTLED IN FULL</Badge>;
      case "in_negotiation":
        return <Badge variant="purple"><Clock className="w-3 h-3 animate-spin" /> IN NEGOTIATION</Badge>;
      case "disputed":
        return <Badge variant="cyan"><AlertTriangle className="w-3 h-3" /> STATUTORY DISPUTE SERVED</Badge>;
      case "auditing":
      default:
        return <Badge variant="amber"><Clock className="w-3 h-3" /> AUDITING CHARGEMASTER</Badge>;
    }
  };

  return (
    <div className="bg-[#090d13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      {/* Top Breadcrumb & Active Docket Tier */}
      <div className="px-4 py-2 bg-black/40 border-b border-white/[0.05] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-slate-500">Active Docket</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">{currentCase.hospitalName}</span>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-semibold">{currentCase.patientName}</span>
          <span className="text-slate-500">({currentCase.accountNumber})</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">DOS: {currentCase.billDate}</span>
        </div>

        {/* Integrated Case Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 mr-1 hidden sm:inline">
            Switch Case:
          </span>
          <div className="flex items-center p-0.5 rounded bg-black/50 border border-white/[0.08]">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? "bg-white/[0.12] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {c.hospitalName.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDossier(!showDossier)}
            className="flex items-center gap-1 ml-2 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]"
          >
            <span>Dossier</span>
            {showDossier ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Hospital Identity & Status Header */}
      <div className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0b1017]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-white tracking-tight">
            {currentCase.hospitalName}
          </h1>
          {getStatusBadge()}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">Jurisdiction:</span>
          <span className="text-slate-300">45 CFR § 149 (CMS Independent Dispute Resolution)</span>
        </div>
      </div>

      {/* 3-Column Dominant Financial KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        {/* Cell 1: Original Billed */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Original Hospital Charge
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-semibold text-slate-300 tabular-nums">
            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1.5">
            Gross unadjusted chargemaster rates
          </div>
        </div>

        {/* Cell 2: Overcharges Excised (The Primary Metric) */}
        <div className="p-4 sm:p-5 bg-emerald-500/[0.03]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
              Overcharges Excised
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              -{percentReduction}% SAVINGS
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums">
            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 font-mono mt-1.5">
            Upcoded acuity &amp; unbundled supplies voided
          </div>
        </div>

        {/* Cell 3: Tendered / Settled Cash */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1">
            {currentCase.status === "settled" ? "Agreed Settlement Paid" : "Legally Tendered Settlement Offer"}
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-semibold text-white tabular-nums">
            ${(currentCase.finalSettlement ?? (currentCase.totalBilled - currentCase.totalExcised)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-cyan-400/80 font-mono mt-1.5">
            Hospital published self-pay cash schedule
          </div>
        </div>
      </div>

      {/* Expandable Legal Dossier Details */}
      {showDossier && (
        <div className="px-4 sm:px-5 py-3 bg-[#070b10] border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-400">
          <div className="space-y-1">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Legal Protection Enforced</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Dispute served under the No Surprises Act (45 C.F.R. § 149) and CMS Hospital Price Transparency (45 CFR § 180).
              Federal law strictly stays third-party collections and credit reporting during active statutory disputes.
            </p>
          </div>

          <div className="space-y-1 text-[11px]">
            <div><span className="text-slate-500">Hospital Facility EIN:</span> <strong className="text-slate-300">{currentCase.hospitalEin || "59-1234567"}</strong></div>
            <div><span className="text-slate-500">Verification Engine:</span> <span className="text-cyan-400">Firecrawl MRF JSON Parser v2.4</span></div>
            <div><span className="text-slate-500">Dispute Defense SLA:</span> <span className="text-purple-300">14 Business Days Statutory Response Window</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
