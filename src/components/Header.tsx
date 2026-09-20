"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  ShieldAlert,
  RotateCcw,
  Plus,
  Compass,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenNewBill: () => void;
  viewMode?: "landing" | "cockpit";
  onToggleView?: (mode: "landing" | "cockpit") => void;
}

export function Header({ onOpenNewBill, viewMode = "cockpit", onToggleView }: HeaderProps) {
  const { cases, resetToSampleData } = useCaseEngine();

  const totalBilledAll = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalExcisedAll = cases.reduce((acc, c) => acc + (c.totalExcised || 0), 0);
  const percentExcised =
    totalBilledAll > 0 ? ((totalExcisedAll / totalBilledAll) * 100).toFixed(1) : "0";

  return (
    <header className="border-b border-white/[0.08] bg-[#070b10] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div 
          onClick={() => onToggleView?.("landing")}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-mono text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              EXCISE
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 border-l border-white/[0.1] pl-2">
              Legal &amp; Chargemaster Engine
            </span>
          </div>
        </div>

        {/* Center: View Mode Switcher Pill */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => onToggleView?.("landing")}
            className={cn(
              "px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
              viewMode === "landing"
                ? "bg-white/[0.12] text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Bill Intake</span>
          </button>
          <button
            onClick={() => onToggleView?.("cockpit")}
            className={cn(
              "px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
              viewMode === "cockpit"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Docket</span>
          </button>
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
