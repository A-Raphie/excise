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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
      {/* 1. Sleek Command HUD Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Case Identity */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight">
              {currentCase.hospitalName}
            </h1>
            <span className="text-xs font-mono text-emerald-800 font-bold">
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
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? "bg-white text-slate-950 border border-slate-300 font-bold shadow-xs"
                    : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {c.hospitalName.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDossier(!showDossier)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-700 hover:text-slate-950 transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <span>Dossier</span>
            {showDossier ? (
              <ChevronUp className="w-3 h-3 text-slate-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* 2. 3-Column Forensic Financial Surface */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
        {/* Cell 1: Hospital Charge */}
        <div className="p-4 sm:p-5 space-y-1">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Hospital Billed Charge
          </div>
          <div className="text-xl sm:text-3xl font-mono font-bold text-rose-600 line-through decoration-rose-400 tabular-nums">
            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate">
            Unadjusted gross chargemaster list rate
          </div>
        </div>

        {/* Cell 2: Overcharges Excised */}
        <div className="p-4 sm:p-5 space-y-1 bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-900 font-bold">
              Overcharges Excised
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800">
              -{percentReduction}% DEDUCTION
            </span>
          </div>
          <div
            className={`text-xl sm:text-3xl font-mono font-extrabold text-emerald-700 tabular-nums transition-all ${
              flashUpdate ? "animate-number-flash" : ""
            }`}
          >
            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-800/80 font-mono truncate">
            Upcoded acuity &amp; unbundled items stricken
          </div>
        </div>

        {/* Cell 3: Legal Cash Settlement */}
        <div className="p-4 sm:p-5 space-y-1 bg-slate-50/50">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-slate-700 font-semibold">
            {currentCase.status === "settled" ? "Final Binding Settlement" : "Legal Settlement Offer"}
          </div>
          <div
            className={`text-xl sm:text-3xl font-mono font-black text-slate-950 tabular-nums transition-all ${
              flashUpdate ? "animate-number-flash" : ""
            }`}
          >
            ${finalSettlement.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-indigo-700 font-mono font-medium truncate">
            Enforcing hospital published cash rate
          </div>
        </div>
      </div>

      {/* 3. Interactive Reduction Gauge Meter */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-emerald-800 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Legal Settlement: ${finalSettlement.toLocaleString("en-US", { minimumFractionDigits: 0 })} ({percentSettlement}%)
          </span>
          <span className="text-slate-600 font-medium">
            Excised: -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 0 })} ({percentReduction}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
          <div
            className="h-full bg-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, Math.min(95, parseFloat(percentSettlement)))}%` }}
            title={`Legal Cash Rate: ${percentSettlement}%`}
          />
          <div
            className="h-full bg-rose-400/80 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, Math.min(95, parseFloat(percentReduction)))}%` }}
            title={`Excised Overcharge: ${percentReduction}%`}
          />
        </div>
      </div>

      {/* 4. Expandable Legal Dossier Details */}
      {showDossier && (
        <div className="px-4 sm:px-5 py-3.5 bg-slate-100/70 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-600">
          <div className="space-y-1.5">
            <div className="text-slate-900 font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>Federal Statutory Safe Harbor</span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              Dispute served under the No Surprises Act (45 CFR § 149) and CMS Hospital Price Transparency (45 CFR § 180).
              Federal law strictly stays collections and adverse credit reporting during ongoing statutory audits.
            </p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Hospital Facility EIN:</span>
              <strong className="text-slate-900">{currentCase.hospitalEin || "59-1234567"}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">MRF Extraction Engine:</span>
              <span className="text-sky-700 font-semibold">Firecrawl v2.4 JSON Parser</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Statutory SLA Window:</span>
              <span className="text-purple-700 font-semibold">14 Business Days to Concede</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
