"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import {
  Building2,
  User,
  Hash,
  Calendar,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  ArrowDownRight,
} from "lucide-react";

interface CaseOverviewProps {
  currentCase: SampleCase;
}

export function CaseOverview({ currentCase }: CaseOverviewProps) {
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/70 border border-emerald-500/50 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SETTLED IN FULL
          </span>
        );
      case "in_negotiation":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-950/70 border border-purple-500/50 text-purple-300">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            IN NEGOTIATION
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/70 border border-cyan-500/50 text-cyan-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            STATUTORY DISPUTE SERVED
          </span>
        );
      case "auditing":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-950/70 border border-amber-500/50 text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            AUDITING CHARGEMASTER
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-5 shadow-lg">
      {/* Top Meta Line */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold text-white tracking-tight">
              {currentCase.hospitalName}
            </h1>
            {getStatusBadge()}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Patient: <strong className="text-slate-300">{currentCase.patientName}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>Account: <strong className="text-slate-300">{currentCase.accountNumber}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Service Date: <strong className="text-slate-300">{currentCase.billDate}</strong></span>
            </div>
            {currentCase.hospitalEin && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>EIN: <strong className="text-slate-300">{currentCase.hospitalEin}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Dedicated AgentMail Inbox Box */}
        <div className="flex flex-col items-start lg:items-end">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3 text-purple-400" />
            <span>Dedicated Dispute Case Inbox</span>
          </div>
          <button
            onClick={handleCopyInbox}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-800/40 hover:border-purple-600/70 text-xs font-mono text-purple-200 transition-all shadow-inner"
            title="Click to copy case email address"
          >
            <span className="font-semibold text-purple-300">{currentCase.caseInbox}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-200" />
            )}
          </button>
          <span className="text-[10px] text-slate-500 mt-1 font-mono">
            Direct hospital replies to this address route automatically
          </span>
        </div>
      </div>

      {/* Financial Ledger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Card 1: Original Billed */}
        <div className="bg-[#0e141e] border border-slate-800/90 rounded-lg p-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
            Original Hospital Charge
          </div>
          <div className="text-2xl font-mono font-bold text-slate-200 tabular-nums">
            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Gross master chargemaster rates before audit
          </div>
        </div>

        {/* Card 2: Excised Unlawful Charges */}
        <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-lg p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              Overcharges Excised
            </div>
            <span className="inline-flex items-center text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-600/60 text-emerald-300">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              {percentReduction}% Saved
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-600/90 font-mono mt-1">
            Upcoded ED visits & unbundled supplies removed
          </div>
        </div>

        {/* Card 3: Proposed / Settled Cash Tender */}
        <div className="bg-[#0e141e] border border-cyan-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              {currentCase.status === "settled" ? "Agreed Settlement Paid" : "Tendered Cash Settlement"}
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              Cash Schedule
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums">
            ${(currentCase.finalSettlement ?? (currentCase.totalBilled - currentCase.totalExcised)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Based on hospital&apos;s verified public cash MRF
          </div>
        </div>
      </div>

      {/* Statutory Protection Banner */}
      <div className="mt-4 px-3.5 py-2 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Statutory Authority: <strong className="text-slate-300">{currentCase.legalBasis}</strong></span>
        </div>
        <div className="hidden sm:block text-[11px] text-slate-500">
          Collections stay enforced under 45 CFR § 149 during active dispute
        </div>
      </div>
    </div>
  );
}
