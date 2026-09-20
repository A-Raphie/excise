"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  ShieldAlert,
  RotateCcw,
  Plus,
} from "lucide-react";

interface HeaderProps {
  onOpenNewBill: () => void;
}

export function Header({ onOpenNewBill }: HeaderProps) {
  const { cases, resetToSampleData } = useCaseEngine();

  const totalBilledAll = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalExcisedAll = cases.reduce((acc, c) => acc + (c.totalExcised || 0), 0);
  const percentExcised =
    totalBilledAll > 0 ? ((totalExcisedAll / totalBilledAll) * 100).toFixed(1) : "0";

  return (
    <header className="border-b border-white/[0.08] bg-[#070b10] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand & Legal Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2.5 min-w-0">
            <span className="font-mono text-base font-bold tracking-tight text-white">
              EXCISE
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400 border-l border-white/[0.1] pl-2.5">
              Hospital Bill Audit &amp; Dispute
            </span>
          </div>
        </div>

        {/* Center: Quiet Unified Sponsor Telemetry Strip */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-slate-400 whitespace-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Convex</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Firecrawl MRF</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-slate-300">AgentMail</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">OpenAI CPT Audit</span>
          </div>
        </div>

        {/* Right: Metrics & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-baseline gap-1.5 font-mono text-xs pr-2 border-r border-white/[0.08]">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider">Excised:</span>
            <span className="font-semibold text-emerald-400 tabular-nums">
              ${totalExcisedAll.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-slate-500">(-{percentExcised}%)</span>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset to default authentic hospital bills"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded border border-white/[0.08] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewBill}
            className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit New Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
}
