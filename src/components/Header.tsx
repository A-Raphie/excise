"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  RotateCcw,
  Plus,
  ShieldCheck,
  Building2,
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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Cluster 1 (Left): Obstat Brand Wordmark */}
        <div
          onClick={() => onToggleView?.("landing")}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <span className="font-sans text-base font-black tracking-tight text-slate-950 group-hover:text-emerald-700 transition-colors">
            EXCISE
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold tracking-wide border border-emerald-200">
            LEGAL CHARGEMASTER ENFORCEMENT
          </span>
        </div>

        {/* Cluster 2 (Center): Obstat Capsule Tabs */}
        <nav
          aria-label="Main"
          className="flex items-center gap-0.5 sm:gap-1 text-xs font-mono p-0.5 sm:p-1 rounded-full bg-slate-100 border border-slate-200"
        >
          <button
            onClick={() => onToggleView?.("landing")}
            className={cn(
              "px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "landing"
                ? "bg-white text-slate-900 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
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
              "px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab !== "proof"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
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
              "hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab === "proof"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Receipts &amp; Proof</span>
          </button>
        </nav>

        {/* Cluster 3 (Right): Savings Ticker Pill + Reset + Black Action Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-slate-500">Live Convex:</span>
            <span className="text-emerald-700 font-bold">
              ${totalExcisedAll.toLocaleString("en-US", { minimumFractionDigits: 0 })} Excised
            </span>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset sample hospital bills"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewBill}
            className="px-4 py-1.5 text-xs font-mono font-bold rounded-full bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Audit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
