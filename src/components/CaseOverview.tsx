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
} from "lucide-react";

interface CaseOverviewProps {
  currentCase: SampleCase;
}

export function CaseOverview({ currentCase }: CaseOverviewProps) {
  const { cases, selectedCaseId, setSelectedCaseId } = useCaseEngine();
  const [copied, setCopied] = useState(false);

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
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            SETTLED IN FULL
          </span>
        );
      case "in_negotiation":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <Clock className="w-3 h-3 animate-spin" />
            IN NEGOTIATION
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <AlertTriangle className="w-3 h-3" />
            STATUTORY DISPUTE SERVED
          </span>
        );
      case "auditing":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Clock className="w-3 h-3" />
            AUDITING CHARGEMASTER
          </span>
        );
    }
  };

  return (
    <div className="bg-[#090d13] border border-white/[0.08] rounded-lg overflow-hidden shadow-sm">
      {/* Top Bar: Hospital Title, Status, and Case Selector */}
      <div className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0b1017]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-white tracking-tight">
            {currentCase.hospitalName}
          </h1>
          {getStatusBadge()}
        </div>

        {/* Integrated Case Switcher */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline">
            Active Docket:
          </span>
          <div className="flex items-center p-0.5 rounded bg-black/40 border border-white/[0.06]">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedCaseId === c.id
                    ? "bg-white/[0.1] text-white font-medium shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {c.hospitalName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata Ribbon */}
      <div className="px-4 sm:px-5 py-2.5 bg-black/20 border-b border-white/[0.04] flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono text-slate-400">
        <div>
          <span className="text-slate-500">Patient:</span>{" "}
          <strong className="text-slate-200 font-medium">{currentCase.patientName}</strong>
        </div>
        <div>
          <span className="text-slate-500">Account:</span>{" "}
          <strong className="text-slate-200 font-medium">{currentCase.accountNumber}</strong>
        </div>
        <div>
          <span className="text-slate-500">Date of Service:</span>{" "}
          <strong className="text-slate-200 font-medium">{currentCase.billDate}</strong>
        </div>
        {currentCase.hospitalEin && (
          <div>
            <span className="text-slate-500">EIN:</span>{" "}
            <strong className="text-slate-200 font-medium">{currentCase.hospitalEin}</strong>
          </div>
        )}
        <div className="hidden xl:flex items-center gap-1.5 text-slate-500 ml-auto text-[11px]">
          <Scale className="w-3 h-3 text-emerald-500/70" />
          <span>Statutory Protection: 45 CFR § 149 (Collections Stay Enforced)</span>
        </div>
      </div>

      {/* 4-Column Unified Ledger Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
        {/* Cell 1: Original Billed */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            Original Hospital Charge
          </div>
          <div className="text-2xl font-mono font-semibold text-slate-300 tabular-nums">
            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1.5">
            Gross master chargemaster rates
          </div>
        </div>

        {/* Cell 2: Overcharges Excised (The Hero) */}
        <div className="p-4 sm:p-5 bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400/90 font-medium">
              Overcharges Excised
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              -{percentReduction}%
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-500/80 font-mono mt-1.5">
            Upcoding &amp; unbundled supplies voided
          </div>
        </div>

        {/* Cell 3: Tendered / Settled Cash */}
        <div className="p-4 sm:p-5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            {currentCase.status === "settled" ? "Agreed Settlement Paid" : "Tendered Settlement Offer"}
          </div>
          <div className="text-2xl font-mono font-semibold text-white tabular-nums">
            ${(currentCase.finalSettlement ?? (currentCase.totalBilled - currentCase.totalExcised)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-cyan-400/80 font-mono mt-1.5">
            Hospital verified cash price schedule
          </div>
        </div>

        {/* Cell 4: Dedicated Case Inbox */}
        <div className="p-4 sm:p-5 bg-purple-500/[0.02] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-purple-300">
              <span className="uppercase tracking-wider">AgentMail Dispute Inbox</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Webhook listener active" />
            </div>
            <button
              onClick={handleCopyInbox}
              className="group flex items-center justify-between w-full px-2.5 py-1.5 rounded bg-black/40 border border-white/[0.08] hover:border-purple-500/40 text-xs font-mono text-slate-200 transition-colors cursor-pointer"
              title="Click to copy case inbox"
            >
              <span className="truncate text-[11px] text-purple-200 font-medium">
                {currentCase.caseInbox}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-1.5" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 flex-shrink-0 ml-1.5" />
              )}
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-2">
            Inbound hospital replies trigger real-time updates
          </div>
        </div>
      </div>
    </div>
  );
}
