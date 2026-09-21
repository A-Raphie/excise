"use client";

import React from "react";
import { useCaseEngine } from "./ConvexClientProvider";
import { useWinsznxTheme, WinsznxTheme } from "./ThemeContext";
import {
  ShieldAlert,
  RotateCcw,
  Plus,
  Compass,
  FileSpreadsheet,
  Search,
  ShieldCheck,
  Mail,
  Sun,
  Moon,
  Scroll,
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
  const { theme, setTheme } = useWinsznxTheme();

  const totalBilledAll = cases.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalExcisedAll = cases.reduce((acc, c) => acc + (c.totalExcised || 0), 0);

  const headerBgClass =
    theme === "obstat"
      ? "bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900"
      : theme === "mandate"
      ? "bg-[#fbfbfa]/95 backdrop-blur-md border-b border-stone-200 text-stone-900"
      : "bg-[#070b10]/95 backdrop-blur-md border-b border-white/[0.08] text-slate-100";

  return (
    <header className={cn("sticky top-0 z-40 transition-colors duration-200", headerBgClass)}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Cluster 1 (Left): Brand Wordmark tailored to theme */}
        <div
          onClick={() => onToggleView?.("landing")}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group flex-shrink-0"
        >
          {theme === "obstat" ? (
            <div className="flex items-center gap-2">
              <span className="font-sans text-base font-black tracking-tight text-slate-950">
                EXCISE
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold tracking-wide border border-emerald-300/60">
                LEGAL CHARGEMASTER ENFORCEMENT
              </span>
            </div>
          ) : theme === "mandate" ? (
            <div className="flex items-center gap-2">
              <span className="text-stone-950 text-sm font-bold">✱</span>
              <span className="font-sans text-base font-black tracking-tight text-stone-950">
                EXCISE
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-stone-500 border-l border-stone-300 pl-2">
                Statutory Dispute Agency
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-base font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                <span>Excise</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </span>
            </div>
          )}
        </div>

        {/* Cluster 2 (Center): Streamlined Surface Tabs */}
        <nav
          aria-label="Main"
          className={cn(
            "flex items-center gap-0.5 sm:gap-1 text-xs font-mono p-0.5 sm:p-1 rounded-full",
            theme === "obstat"
              ? "bg-slate-100 border border-slate-200"
              : theme === "mandate"
              ? "bg-stone-100 border border-stone-200"
              : "bg-black/40 border border-white/[0.08]"
          )}
        >
          <button
            onClick={() => onToggleView?.("landing")}
            className={cn(
              "px-2.5 sm:px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "landing"
                ? theme === "obstat"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : theme === "mandate"
                  ? "bg-white text-stone-900 font-bold shadow-xs"
                  : "bg-white/[0.12] text-white font-semibold shadow-xs"
                : theme === "obstat" || theme === "mandate"
                ? "text-slate-500 hover:text-slate-900"
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
              "px-2.5 sm:px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab !== "proof"
                ? theme === "obstat"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : theme === "mandate"
                  ? "bg-stone-900 text-white font-bold shadow-xs"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                : theme === "obstat" || theme === "mandate"
                ? "text-slate-500 hover:text-slate-900"
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
              "hidden sm:flex items-center gap-1 px-3.5 py-1 rounded-full transition-all cursor-pointer",
              viewMode === "cockpit" && activeTab === "proof"
                ? theme === "obstat"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : theme === "mandate"
                  ? "bg-stone-900 text-white font-bold shadow-xs"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-xs"
                : theme === "obstat" || theme === "mandate"
                ? "text-slate-500 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Receipts &amp; Proof</span>
          </button>
        </nav>

        {/* Cluster 3 (Right): Winsznx Style Switcher + Action Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Winsznx Reference Switcher */}
          <div
            className={cn(
              "flex items-center gap-0.5 p-0.5 rounded-lg text-[11px] font-mono",
              theme === "obstat"
                ? "bg-slate-100 border border-slate-200 text-slate-600"
                : theme === "mandate"
                ? "bg-stone-100 border border-stone-200 text-stone-600"
                : "bg-black/50 border border-white/[0.08] text-slate-400"
            )}
          >
            <button
              onClick={() => setTheme("obstat")}
              title="Obstat: Light Semantic Fintech"
              className={cn(
                "px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer",
                theme === "obstat"
                  ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200"
                  : "hover:text-slate-900"
              )}
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span className="hidden md:inline">Obstat</span>
            </button>

            <button
              onClick={() => setTheme("routedock")}
              title="RouteDock: Midnight Navy"
              className={cn(
                "px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer",
                theme === "routedock"
                  ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                  : "hover:text-white"
              )}
            >
              <Moon className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">RouteDock</span>
            </button>

            <button
              onClick={() => setTheme("mandate")}
              title="Mandate: Warm Paper Desk"
              className={cn(
                "px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer",
                theme === "mandate"
                  ? "bg-white text-stone-950 font-bold shadow-xs border border-stone-200"
                  : "hover:text-stone-950"
              )}
            >
              <Scroll className="w-3 h-3 text-orange-400" />
              <span className="hidden md:inline">Mandate</span>
            </button>
          </div>

          <button
            onClick={resetToSampleData}
            title="Reset sample data"
            className={cn(
              "p-1.5 rounded transition-colors cursor-pointer",
              theme === "obstat"
                ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                : theme === "mandate"
                ? "text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-white/[0.08]"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenNewBill}
            className={cn(
              "px-3 py-1.5 text-xs font-mono font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer",
              theme === "obstat"
                ? "bg-slate-950 hover:bg-slate-800 text-white"
                : theme === "mandate"
                ? "bg-stone-950 hover:bg-stone-800 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
}
