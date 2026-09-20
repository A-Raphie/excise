"use client";

import React, { useState, useEffect } from "react";
import { SampleCase } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Calendar,
  Hash,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface CaseOverviewProps {
  currentCase: SampleCase;
}

export function CaseOverview({ currentCase }: CaseOverviewProps) {
  const { cases, selectedCaseId, setSelectedCaseId } = useCaseEngine();
  const [showDossier, setShowDossier] = useState(false);
  const [flashUpdate, setFlashUpdate] = useState(false);

  // Trigger brief flash animation when numbers recalculate
  useEffect(() => {
    setFlashUpdate(true);
    const timer = setTimeout(() => setFlashUpdate(false), 600);
    return () => clearTimeout(timer);
  }, [currentCase.totalExcised, currentCase.totalBilled]);

  const percentReduction =
    currentCase.totalBilled > 0
      ? ((currentCase.totalExcised / currentCase.totalBilled) * 100).toFixed(1)
      : "0";

  const percentSettlement =
    currentCase.totalBilled > 0
      ? (100 - parseFloat(percentReduction)).toFixed(1)
      : "100";

  const getStatusBadge = () => {
    switch (currentCase.status) {
      case "settled":
        return (
          <Badge variant="emerald" className="gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3 h-3" /> SETTLED IN FULL
          </Badge>
        );
      case "in_negotiation":
        return (
          <Badge variant="purple" className="gap-1 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            IN NEGOTIATION
          </Badge>
        );
      case "disputed":
        return (
          <Badge variant="cyan" className="gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <AlertTriangle className="w-3 h-3" /> STATUTORY DISPUTE SERVED
          </Badge>
        );
      case "auditing":
      default:
        return (
          <Badge variant="amber" className="gap-1">
            <Clock className="w-3 h-3" /> AUDITING CHARGEMASTER
          </Badge>
        );
    }
  };

  const finalSettlement =
    currentCase.finalSettlement ??
    Math.max(0, currentCase.totalBilled - currentCase.totalExcised);

  return (
    <div className="bg-[#080c13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm transition-all">
      {/* 1. Sleek Command HUD Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-white/[0.06] bg-[#0b1018] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Case Identity */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
              {currentCase.hospitalName}
            </h1>
            <span className="text-xs font-mono text-emerald-400 font-medium">
              {currentCase.patientName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ({currentCase.accountNumber})
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              · DOS: {currentCase.billDate}
            </span>
          </div>
          <div className="ml-auto sm:ml-2">{getStatusBadge()}</div>
        </div>

        {/* Right: Tactile Case Selector + Dossier Peek */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/[0.08]">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {c.hospitalName.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDossier(!showDossier)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15]"
          >
            <span>Dossier</span>
            {showDossier ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* 2. 3-Column Forensic Financial Surface */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06] bg-[#070b11]">
        {/* Cell 1: Hospital Charge */}
        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Hospital Billed Charge
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-semibold text-rose-400/80 line-through decoration-rose-500/60 tabular-nums">
            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Unadjusted gross chargemaster list rate
          </div>
        </div>

        {/* Cell 2: Overcharges Excised */}
        <div className="p-4 sm:p-5 space-y-1 bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-medium">
              Overcharges Excised
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              -{percentReduction}% DEDUCTION
            </span>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums transition-all ${
              flashUpdate ? "animate-number-flash" : ""
            }`}
          >
            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 font-mono">
            Upcoded acuity &amp; unbundled items stricken
          </div>
        </div>

        {/* Cell 3: Legal Cash Settlement */}
        <div className="p-4 sm:p-5 space-y-1 bg-white/[0.01]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
            {currentCase.status === "settled" ? "Final Binding Settlement" : "Legal Settlement Offer"}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums transition-all ${
              flashUpdate ? "animate-number-flash" : ""
            }`}
          >
            ${finalSettlement.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-cyan-400 font-mono">
            Enforcing hospital published cash rate
          </div>
        </div>
      </div>

      {/* 3. Interactive Reduction Gauge Meter */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#06090e] border-t border-white/[0.04] flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Legal Settlement: ${finalSettlement.toLocaleString("en-US", { minimumFractionDigits: 0 })} ({percentSettlement}%)
          </span>
          <span className="text-slate-400">
            Excised: -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 0 })} ({percentReduction}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, Math.min(95, parseFloat(percentSettlement)))}%` }}
            title={`Legal Cash Rate: ${percentSettlement}%`}
          />
          <div
            className="h-full bg-rose-500/40 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, Math.min(95, parseFloat(percentReduction)))}%` }}
            title={`Excised Overcharge: ${percentReduction}%`}
          />
        </div>
      </div>

      {/* 4. Expandable Legal Dossier Details */}
      {showDossier && (
        <div className="px-4 sm:px-5 py-3.5 bg-[#05080c] border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-400">
          <div className="space-y-1.5">
            <div className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Federal Statutory Safe Harbor</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Dispute served under the No Surprises Act (45 CFR § 149) and CMS Hospital Price Transparency (45 CFR § 180).
              Federal law strictly stays collections and adverse credit reporting during ongoing statutory audits.
            </p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-white/[0.04] pb-1">
              <span className="text-slate-500">Hospital Facility EIN:</span>
              <strong className="text-slate-300">{currentCase.hospitalEin || "59-1234567"}</strong>
            </div>
            <div className="flex justify-between border-b border-white/[0.04] pb-1">
              <span className="text-slate-500">MRF Extraction Engine:</span>
              <span className="text-cyan-400 font-medium">Firecrawl v2.4 JSON Parser</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Statutory SLA Window:</span>
              <span className="text-purple-300 font-medium">14 Business Days to Concede</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
