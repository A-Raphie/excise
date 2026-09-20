"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  ShieldAlert,
  RotateCcw,
  Plus,
  Compass,
  FileSpreadsheet,
  Search,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenNewBill: () => void;
  viewMode?: "landing" | "cockpit";
  onToggleView?: (mode: "landing" | "cockpit") => void;
  activeTab?: "audit" | "letter" | "agentmail" | "transparency" | "proof";
  onSelectTab?: (tab: "audit" | "letter" | "agentmail" | "transparency" | "proof") => void;
}

export function Header({
  onOpenNewBill,
  viewMode = "cockpit",
  onToggleView,
  activeTab = "audit",
  onSelectTab,
}: HeaderProps) {
  const { cases, resetToSampleData } = useCaseEngine();

  const totalBilledAll = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalExcisedAll = cases.reduce((acc, c) => acc + (c.totalExcised || 0), 0);
  const percentExcised =
    totalBilledAll > 0 ? ((totalExcisedAll / totalBilledAll) * 100).toFixed(1) : "0";

  return (
    <header className="border-b border-white/[0.08] bg-[#070b10] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Cluster 1 (Left): Brand Wordmark */}
        <div
          onClick={() => onToggleView?.("landing")}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              EXCISE
            </span>
            <span className="hidden md:inline-block text-xs font-mono text-slate-500 border-l border-white/[0.1] pl-2">
              Legal &amp; Chargemaster Engine
            </span>
          </div>
        </div>

        {/* Cluster 2 (Center): Streamlined Surface Tabs */}
        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1 text-xs font-mono bg-black/40 border border-white/[0.08] p-0.5 sm:p-1 rounded-lg">
          <button
            onClick={() => onToggleView?.("landing")}
            className={cn(
              "px-2 sm:px-3 py-1 rounded-md transition-all cursor-pointer",
              viewMode === "landing"
                ? "bg-white/[0.12] text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Overview
          </button>

          <button
            onClick={() => {
              onToggleView?.("cockpit");
              onSelectTab?.("audit");
            }}
            className={cn(
              "px-2 sm:px-3 py-1 rounded-md transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab !== "proof"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <span className="sm:hidden">Docket</span>
            <span className="hidden sm:inline">Audit Docket</span>
          </button>

          <button
            onClick={() => {
              onToggleView?.("cockpit");
              onSelectTab?.("proof");
            }}
            className={cn(
              "hidden sm:flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab === "proof"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Receipts &amp; Proof</span>
          </button>
        </nav>

        {/* Cluster 3 (Right): Single Provenance Pill + Single Action Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Live Convex:</span>
            <span className="text-emerald-400 font-semibold">
              ${totalExcisedAll.toLocaleString("en-US", { minimumFractionDigits: 0 })} Excised
            </span>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset to default authentic hospital bills"
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded border border-white/[0.08] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewBill}
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-mono font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Audit Bill</span>
            <span className="xs:hidden">Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
}
