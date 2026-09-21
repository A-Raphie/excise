"use client";

import React, { useState } from "react";
import { useWinsznxTheme } from "./ThemeContext";
import {
  ArrowRight,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Building2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Play,
  Terminal,
} from "lucide-react";
import { Button } from "./ui/button";

interface FrontDoorLandingProps {
  onSelectCase: (caseId: string) => void;
  onEnterCockpit: () => void;
  onOpenProof?: () => void;
}

export function FrontDoorLanding({
  onSelectCase,
  onEnterCockpit,
  onOpenProof,
}: FrontDoorLandingProps) {
  const { theme } = useWinsznxTheme();

  // Active sample case
  const [activeHeroCase, setActiveHeroCase] = useState<"marcus" | "elena" | "david">("marcus");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Obstat toggle state
  const [obstatRateMode, setObstatRateMode] = useState<"chargemaster" | "enforced">("enforced");

  // RouteDock copy state
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard.writeText("npx excise audit patient-bill.pdf");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const caseData = {
    marcus: {
      id: "case-marcus-er",
      facility: "Memorial Regional Medical Center",
      department: "Emergency Room Visit",
      patient: "Marcus Vance",
      original: "$14,850.00",
      excised: "-$11,115.00",
      settlement: "$3,735.00",
      savingsPct: "75%",
      strikes: [
        { code: "CPT 99285", name: "Emergency Visit Level 5", action: "Downcoded to Level 3 (minor laceration)", saved: "-$4,330.00" },
        { code: "CPT 99070", name: "Suture & Supply Kit", action: "Voided — bundled under CMS NCCI rules", saved: "-$1,850.00" },
        { code: "CPT 70450", name: "Head CT Scan", action: "Reduced to published hospital self-pay cash schedule", saved: "-$4,750.00" },
      ],
    },
    elena: {
      id: "case-elena-endo",
      facility: "Stanford Health Care",
      department: "Outpatient Endoscopy",
      patient: "Elena Rostova",
      original: "$9,420.00",
      excised: "-$6,180.00",
      settlement: "$3,240.00",
      savingsPct: "66%",
      strikes: [
        { code: "REV 0490", name: "Ambulatory Facility Fee", action: "Marked down from 4.2× chargemaster gouge to cash rate", saved: "-$4,200.00" },
        { code: "CPT 43239", name: "Biopsy Pathology Add-on", action: "Voided duplicate unbundled laboratory processing fee", saved: "-$1,120.00" },
        { code: "CPT 99152", name: "Moderate Sedation Unit", action: "Adjusted to CMS standard physician fee schedule", saved: "-$860.00" },
      ],
    },
    david: {
      id: "case-david-ortho",
      facility: "Mount Sinai Hospital",
      department: "Urgent Orthopedic Care",
      patient: "David Chen",
      original: "$8,150.00",
      excised: "-$5,750.00",
      settlement: "$2,400.00",
      savingsPct: "71%",
      strikes: [
        { code: "CPT 29125", name: "Forearm Splint Application", action: "Voided — pre-bundled in closed fracture reduction", saved: "-$2,350.00" },
        { code: "CPT 73090", name: "Post-Reduction X-Ray", action: "Corrected from hospital chargemaster to CMS median", saved: "-$1,850.00" },
        { code: "CPT 99214", name: "Level 4 Office Visit", action: "Downcoded to Level 3 for routine follow-up triage", saved: "-$1,550.00" },
      ],
    },
  };

  const current = caseData[activeHeroCase];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-14 space-y-16 sm:space-y-20 relative">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Dynamic Architecture for Obstat, RouteDock, Mandate)    */}
      {/* ========================================================================= */}

      {/* --- THEME 1: OBSTAT LIGHT FINTECH --- */}
      {theme === "obstat" && (
        <section className="text-center space-y-7 pt-4">
          {/* Centered Lavender Capsule Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-mono text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span>NO SURPRISES ACT · CMS MRF ENFORCEMENT</span>
          </div>

          {/* Majestic Centered Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Hospital bills that keep up with the legal cash rate.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Audit hospital bills against legally enforceable CMS Machine-Readable File (MRF) rates and automatically generate cash settlement documentation. When rates adjust, enforcement rules update dynamically.
            </p>
          </div>

          {/* Centered Dual Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                onSelectCase(current.id);
                onEnterCockpit();
              }}
              className="px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Audit Your Bill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onSelectCase(current.id);
                onEnterCockpit();
              }}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-mono font-medium text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Explore Sample Docket</span>
            </button>
          </div>

          {/* Centered Signature Move: Obstat Locked/Enforced Toggle Card */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm text-left space-y-5">
              {/* Segmented Control Switcher */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Controlled Architecture Demonstration
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-sans">
                    CDGI Continuous Chargemaster Invalidation Engine
                  </div>
                </div>

                <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
                  <button
                    onClick={() => setObstatRateMode("chargemaster")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      obstatRateMode === "chargemaster"
                        ? "bg-white text-slate-900 font-bold shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Gross Chargemaster
                  </button>
                  <button
                    onClick={() => setObstatRateMode("enforced")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      obstatRateMode === "enforced"
                        ? "bg-white text-emerald-700 font-bold shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Enforced Cash Rate
                  </button>
                </div>
              </div>

              {/* Dynamic Readout */}
              {obstatRateMode === "enforced" ? (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-900">
                      {current.facility.toUpperCase()} · ER DOCKET
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-800 text-[10px] font-mono font-bold">
                      ACTIVE · ENFORCED
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs font-mono text-emerald-700">Important CMS Rate Reduction:</div>
                      <div className="text-3xl font-extrabold font-mono text-emerald-800">
                        {current.excised} ({current.savingsPct} OFF)
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs text-slate-500 line-through">{current.original}</div>
                      <div className="text-xl font-bold text-emerald-950">{current.settlement}</div>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-800/90 font-sans leading-relaxed pt-1">
                    Bill downcoded per CMS Machine-Readable benchmark rates under 45 CFR § 180. Zero predatory upcoding retained.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-900">
                      UNREGULATED HOSPITAL CHARGEMASTER
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-200/60 text-rose-800 text-[10px] font-mono font-bold">
                      EXPLOITATIVE · UNBUNDLED
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs font-mono text-rose-700">Hospital Demanded Total:</div>
                      <div className="text-3xl font-extrabold font-mono text-rose-800">
                        {current.original}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs text-rose-600 font-bold">+420% Markup</div>
                      <div className="text-xs text-slate-500">Unjustified Rate</div>
                    </div>
                  </div>

                  <p className="text-xs text-rose-800/90 font-sans leading-relaxed pt-1">
                    Systemic acuity inflation detected on CPT 99285 and duplicate tray charges unbundled without statutory authority.
                  </p>
                </div>
              )}

              {/* Line items preview */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                  Audited Line-Item Strikes ({current.strikes.length}):
                </div>
                {current.strikes.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900">{s.code}</span>
                      <span className="text-slate-600 truncate">{s.name}</span>
                    </div>
                    <span className="font-bold text-emerald-700 shrink-0">{s.saved}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  onSelectCase(current.id);
                  onEnterCockpit();
                }}
                className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Open Full Audited Case &amp; Accord Demand</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- THEME 2: ROUTEDOCK MIDNIGHT NAVY --- */}
      {theme === "routedock" && (
        <section className="text-center space-y-7 pt-4">
          {/* Centered Capsule Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-mono text-cyan-300">
            <span className="text-cyan-400 font-bold">⚡</span>
            <span>Built for the Healthcare Patient Defense Economy</span>
          </div>

          {/* RouteDock 3-Beat Centered Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
              One hospital bill.
              <br />
              Three statutory strikes.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Zero predatory debt.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
              x402 dispute engine, CMS MRF chargemaster indexing, and automated statutory settlement accords — unified behind a single audit run.
            </p>
          </div>

          {/* Centered macOS Terminal Signature Move */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="rounded-xl border border-white/[0.12] bg-[#0c101d] p-5 shadow-2xl text-left space-y-3 font-mono text-xs">
              {/* Traffic Light Bar */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-slate-400 text-[11px] ml-2">excise-engine — zsh</span>
                </div>

                <button
                  onClick={handleCopyCli}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCli ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCli ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Code Snippet */}
              <div className="space-y-1.5 text-slate-300 py-1 leading-relaxed">
                <div>
                  <span className="text-rose-400">const</span>{" "}
                  <span className="text-cyan-300">audit</span> ={" "}
                  <span className="text-rose-400">await</span>{" "}
                  <span className="text-emerald-400">excise</span>.
                  <span className="text-amber-300">audit</span>(
                  <span className="text-emerald-300">&quot;memorial-er-marcus.pdf&quot;</span>);
                </div>
                <div className="text-slate-400">// Struck CPT 99285 (ER Level 5 Upcoding): -$4,330.00</div>
                <div className="text-slate-400">// Voided CPT 99070 (Phantom Suture Tray): -$1,850.00</div>
                <div className="text-slate-400">// Enforced CPT 70450 (Head CT Cash Rate): -$4,750.00</div>
                <div className="text-emerald-400 pt-1 font-bold">
                  // Result: $14,850.00 charged → settled at $3,735.00 cash rate (-75%)
                </div>
              </div>
            </div>

            {/* RouteDock Dual Centered Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-5">
              <button
                onClick={handleCopyCli}
                className="px-5 py-2.5 rounded-lg bg-black/60 border border-white/[0.15] text-slate-200 hover:text-white hover:border-white/[0.3] font-mono text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>npx excise audit patient-bill.pdf</span>
              </button>

              <button
                onClick={() => {
                  onSelectCase(current.id);
                  onEnterCockpit();
                }}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <span>Explore Live Docket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* --- THEME 3: MANDATE WARM PAPER DESK --- */}
      {theme === "mandate" && (
        <section className="space-y-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (7 cols): Asymmetric Bold Grotesque Headline */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                <span>CMS Hospital Price Transparency (45 CFR § 180)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-stone-950 tracking-tight leading-[1.08]">
                Strike hospital charges without hiring a law firm.
              </h1>

              <p className="text-base text-stone-600 font-sans leading-relaxed max-w-xl">
                Automate hospital chargemaster adjudication to strike invalid line items. EXCISE uses federal price transparency data to find overcharges before you grant them billing authority.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectCase(current.id);
                    onEnterCockpit();
                  }}
                  className="px-6 py-3 rounded-lg bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Audit a Bill
                </button>

                <button
                  onClick={() => {
                    onSelectCase(current.id);
                    onEnterCockpit();
                  }}
                  className="px-6 py-3 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-mono font-medium text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Explore Live Cases
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenProof ?? onEnterCockpit}
                  className="text-xs font-mono text-stone-600 hover:text-stone-950 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  See the live adjudication example →
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Mandate Peach Glow Container & Floating Accord Card */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-100/70 via-orange-50/50 to-stone-100/50 border border-amber-200 shadow-sm">
                <div className="rounded-2xl bg-white p-5 sm:p-6 border border-stone-200 shadow-md space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500">Protect Marcus Vance (ER Visit)</span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold border border-stone-200 text-[10px] flex items-center gap-1">
                      <span>◉</span>
                      <span>STATUTE VERIFIED</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-bold text-stone-950 font-sans">
                      ER Level 5 Upcoding Strike
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      Hospital upcoding trigger → CPT 99285 reduction
                    </div>
                  </div>

                  {/* Recessed Gray Parchment Box */}
                  <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 space-y-1 font-mono text-xs">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                      GRANTED SETTLEMENT AUTHORITY:
                    </div>
                    <div className="text-stone-900 font-bold">
                      strike CPT 99285 ≤ $980 cash rate / federal median
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => {
                      onSelectCase(current.id);
                      onEnterCockpit();
                    }}
                    className="w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-mono font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>View Enforced Accord →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. CASE STUDY SWITCHER PILLS (Shared across themes)                       */}
      {/* ========================================================================= */}
      <section className="pt-2">
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
            theme === "obstat"
              ? "bg-white border-slate-200 shadow-xs"
              : theme === "mandate"
              ? "bg-white border-stone-200 shadow-xs"
              : "bg-[#090d14] border-white/[0.08]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div
                className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                  theme === "obstat" || theme === "mandate" ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Live Audited Patient Case Studies:
              </div>
              <div
                className={`text-xs font-mono ${
                  theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Select a real hospital bill to inspect the itemized adjudication and savings:
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["marcus", "elena", "david"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveHeroCase(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroCase === key
                      ? theme === "obstat"
                        ? "bg-emerald-600 text-white font-bold shadow-xs"
                        : theme === "mandate"
                        ? "bg-stone-900 text-white font-bold shadow-xs"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                      : theme === "obstat"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : theme === "mandate"
                      ? "bg-stone-100 hover:bg-stone-200 text-stone-700"
                      : "bg-white/[0.04] text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{caseData[key].facility.split(" ")[0]}</span>
                  <span className={activeHeroCase === key && theme === "routedock" ? "text-emerald-400 font-bold" : "font-bold"}>
                    (-{caseData[key].savingsPct})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 3-STEP PROCESS (The Obstat / Winsznx Numbered Feature Grid)             */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1">
          <h2
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              theme === "obstat" || theme === "mandate" ? "text-slate-950" : "text-white"
            }`}
          >
            How EXCISE Resolves Your Bill
          </h2>
          <p
            className={`text-xs font-mono ${
              theme === "obstat" || theme === "mandate" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            From inflated chargemaster charge to binding legal settlement in 3 steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Step 1 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#090d14] border-white/[0.08]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 font-mono font-bold text-xs">
              01
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Automatic Rate Auditing
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Upload your hospital statement. EXCISE cross-references 45,000+ machine-readable hospital price files ingested under 45 CFR § 180 to detect hidden cash discounts.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#090d14] border-white/[0.08]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-mono font-bold text-xs">
              02
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Legally Enforceable Strikes
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              We strike unbundled tray fees, downcode acute emergency inflation, and bind the facility to published self-pay schedules using CMS NCCI statutory rules.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#090d14] border-white/[0.08]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 font-mono font-bold text-xs">
              03
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Dynamic Cash Settlement
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              A formal settlement accord demand letter is compiled and dispatched directly to hospital billing through an AgentMail legal chamber, preventing collections.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE THREE CHARGEMASTER EXPLOITS DIAGNOSTIC GRID                        */}
      {/* ========================================================================= */}
      <section className="space-y-5 pt-2">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-semibold">
            Forensic Diagnostic
          </div>
          <h2
            className={`text-lg sm:text-xl font-bold tracking-tight ${
              theme === "obstat" || theme === "mandate" ? "text-slate-950" : "text-white"
            }`}
          >
            The Three Chargemaster Exploits
          </h2>
          <p
            className={`text-xs font-mono max-w-xl mx-auto ${
              theme === "obstat" || theme === "mandate" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Hospitals rely on opaque billing codes and intimidation to extract 4x to 10x markups. EXCISE automatically identifies and disallows all three.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Exploit 1 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#080c13] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-500">CPT 99285</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold">
                UPCODING SCAM
              </span>
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Emergency Acuity Inflation
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Routine minor cuts or sprains are billed at Level 5 (Immediate Threat to Life). EXCISE downcodes to Level 3 per clinical notes, saving $3,700–$4,500 instantly.
            </p>
            <div
              className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                theme === "obstat" || theme === "mandate" ? "border-slate-100 text-slate-500" : "border-white/[0.04] text-slate-500"
              }`}
            >
              <span>Avg. Overcharge:</span>
              <span className="text-rose-500 font-semibold">+$4,330.00</span>
            </div>
          </div>

          {/* Exploit 2 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#080c13] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-500">CPT 99070</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
                NCCI UNBUNDLING
              </span>
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Phantom Suture &amp; Supply Trays
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              Billing separately for sterile trays or bandages that are federally mandated to be bundled under facility fees. EXCISE strikes the full line item under CMS NCCI edits.
            </p>
            <div
              className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                theme === "obstat" || theme === "mandate" ? "border-slate-100 text-slate-500" : "border-white/[0.04] text-slate-500"
              }`}
            >
              <span>Federal Allowance:</span>
              <span className="text-emerald-600 font-semibold">$0.00 (Bundled)</span>
            </div>
          </div>

          {/* Exploit 3 */}
          <div
            className={`p-5 rounded-2xl border space-y-3 transition-all ${
              theme === "obstat"
                ? "bg-white border-slate-200 shadow-xs"
                : theme === "mandate"
                ? "bg-white border-stone-200 shadow-xs"
                : "bg-[#080c13] border-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">CPT 70450</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 font-semibold">
                8.3x MULTIPLIER
              </span>
            </div>
            <h3
              className={`text-sm font-bold ${
                theme === "obstat" || theme === "mandate" ? "text-slate-900" : "text-white"
              }`}
            >
              Fictitious Diagnostic Markups
            </h3>
            <p
              className={`text-xs leading-relaxed font-sans ${
                theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-400"
              }`}
            >
              A Head CT scan is billed at $5,400 on the hospital chargemaster, while their own published federal cash price is $650. EXCISE binds the hospital to their own published cash rate.
            </p>
            <div
              className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                theme === "obstat" || theme === "mandate" ? "border-slate-100 text-slate-500" : "border-white/[0.04] text-slate-500"
              }`}
            >
              <span>Enforced Cash Rate:</span>
              <span className="text-cyan-600 font-semibold">$650.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FREQUENTLY ASKED QUESTIONS                                             */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-2">
        <div className="text-center space-y-1">
          <h2
            className={`text-lg sm:text-xl font-bold tracking-tight ${
              theme === "obstat" || theme === "mandate" ? "text-slate-950" : "text-white"
            }`}
          >
            Frequently Asked Questions
          </h2>
          <p
            className={`text-xs font-mono ${
              theme === "obstat" || theme === "mandate" ? "text-slate-500" : "text-slate-400"
            }`}
          >
            How statutory enforcement protects patients from illegal charges
          </p>
        </div>

        <div className="space-y-2 max-w-3xl mx-auto">
          {[
            {
              q: "How can EXCISE legally enforce a cash discount against a hospital?",
              a: "Under federal 45 CFR § 180, all US hospitals are legally required to publish standard charges, including discounted cash prices. Under 45 CFR § 149 (No Surprises Act), patients cannot be charged rates exceeding the hospital's median in-network or published cash price. EXCISE generates a formal statutory dispute notice that cites these federal mandates as a binding legal tender offer.",
            },
            {
              q: "Does submitting an EXCISE dispute protect me from debt collectors?",
              a: "Yes. Once an official billing dispute is served under 45 CFR § 149, federal law prohibits the hospital or their debt collection agencies from reporting the contested balance to credit bureaus or taking adverse collection action while the dispute is pending.",
            },
            {
              q: "Where does EXCISE get the hospital's actual pricing data?",
              a: "We cross-reference the hospital's mandatory Machine-Readable File (MRF) JSON and CSV tables ingested via Firecrawl, cross-checked against CMS National Correct Coding Initiative (NCCI) policy manuals.",
            },
            {
              q: "What happens if hospital billing refuses the settlement accord?",
              a: "The complete, immutable audit docket—including cryptographic timestamps, AgentMail delivery receipts, and verified hospital cash schedules—is automatically formatted for submission to the Federal Independent Dispute Resolution (IDR) portal or state insurance commissioner.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                theme === "obstat"
                  ? "bg-white border-slate-200"
                  : theme === "mandate"
                  ? "bg-white border-stone-200"
                  : "bg-[#080c13] border-white/[0.06]"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className={`w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  theme === "obstat" || theme === "mandate"
                    ? "text-slate-900 hover:text-emerald-700"
                    : "text-white hover:text-emerald-300"
                }`}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div
                  className={`px-4 pb-4 text-xs font-sans leading-relaxed border-t pt-3 ${
                    theme === "obstat" || theme === "mandate"
                      ? "border-slate-100 text-slate-600"
                      : "border-white/[0.04] text-slate-400"
                  }`}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DECISIVE CLOSER CTA                                                    */}
      {/* ========================================================================= */}
      <section
        className={`text-center p-8 sm:p-12 rounded-3xl border space-y-4 shadow-sm ${
          theme === "obstat"
            ? "bg-slate-50 border-slate-200 text-slate-900"
            : theme === "mandate"
            ? "bg-stone-50 border-stone-200 text-stone-900"
            : "bg-gradient-to-b from-emerald-950/20 via-[#070b11] to-black/80 border-emerald-500/25 text-white"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Don&apos;t pay an inflated hospital bill.
        </h2>
        <p
          className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${
            theme === "obstat" || theme === "mandate" ? "text-slate-600" : "text-slate-300"
          }`}
        >
          Instantly cross-examine your charges against federal CMS pricing files and dispatch a binding settlement.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onSelectCase(current.id);
              onEnterCockpit();
            }}
            className={`px-7 py-3.5 rounded-full font-mono font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95 ${
              theme === "obstat"
                ? "bg-slate-950 hover:bg-slate-800 text-white"
                : theme === "mandate"
                ? "bg-stone-950 hover:bg-stone-800 text-white"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            }`}
          >
            <span>Open Interactive Audit Docket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
