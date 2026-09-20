"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  ShieldAlert,
  Activity,
  Mail,
  Cpu,
  Database,
  Search,
  RotateCcw,
  PlusCircle,
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
    <header className="border-b border-slate-800/80 bg-[#080d14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold tracking-tight text-white">
                  EXCISE
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
                  v1.0 • No Surprises Act
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Autonomous Hospital Chargemaster Audit & Medical Bill Dispute Engine
              </p>
            </div>
          </div>

          {/* Sponsor Primitives Radar Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Convex Reactive</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <Search className="w-3 h-3 text-cyan-400" />
              <span>Firecrawl MRF</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <Mail className="w-3 h-3 text-purple-400" />
              <span>AgentMail Inboxes</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300">
              <Cpu className="w-3 h-3 text-amber-400" />
              <span>OpenAI CPT Audit</span>
            </div>
          </div>

          {/* Aggregate Savings Metric & Quick Actions */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="hidden lg:block text-right pr-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                Total Overcharges Excised
              </div>
              <div className="text-sm font-mono font-semibold text-emerald-400 tabular-nums">
                ${totalExcisedAll.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal text-slate-400 ml-1">
                  ({percentExcised}% cut)
                </span>
              </div>
            </div>

            <button
              onClick={resetToSampleData}
              title="Reset to default authentic hospital bills"
              className="px-2.5 py-1.5 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={onOpenNewBill}
              className="px-3.5 py-1.5 text-xs font-mono font-medium rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-950 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Audit New Bill</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
