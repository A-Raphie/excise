"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Scale,
  FileSpreadsheet,
  FileText,
  Lock,
  ExternalLink,
  Plus,
} from "lucide-react";

interface FrontDoorLandingProps {
  onSelectCase: (caseId: string) => void;
  onEnterCockpit: () => void;
  onOpenProof?: () => void;
  onOpenNewBill?: () => void;
}

export function FrontDoorLanding({
  onSelectCase,
  onEnterCockpit,
  onOpenProof,
  onOpenNewBill,
}: FrontDoorLandingProps) {
  // Active sample case
  const [activeHeroCase, setActiveHeroCase] = useState<"marcus" | "elena" | "david">("marcus");

  // Obstat toggle state
  const [obstatRateMode, setObstatRateMode] = useState<"chargemaster" | "enforced">("enforced");

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
        { code: "CPT 99285", name: "Level 5 Emergency Severity Visit", action: "Downcoded to Level 3 per clinical acuity guidelines", saved: "-$4,330.00", basis: "AMA CPT Guidelines" },
        { code: "CPT 99070", name: "Suture Tray & Materials Kit", action: "Voided — pre-bundled in emergency facility fee", saved: "-$1,850.00", basis: "CMS NCCI Policy Ch. 1 §B" },
        { code: "CPT 70450", name: "CT Head Scan without Contrast", action: "Adjusted to published self-pay cash schedule", saved: "-$4,750.00", basis: "45 CFR § 180 MRF Rate" },
      ],
    },
    elena: {
      id: "case-elena-cardio",
      facility: "Stanford Health Care",
      department: "Cardiology Outpatient Lab",
      patient: "Elena Rostova",
      original: "$9,340.00",
      excised: "-$6,180.00",
      settlement: "$3,160.00",
      savingsPct: "66%",
      strikes: [
        { code: "REV 0490", name: "Ambulatory Facility Fee", action: "Marked down from 4.2× chargemaster gouge to cash rate", saved: "-$4,200.00", basis: "Hospital Cash Schedule" },
        { code: "CPT 43239", name: "Biopsy Pathology Add-on", action: "Voided duplicate unbundled laboratory processing fee", saved: "-$1,120.00", basis: "CMS NCCI Bundle Edit" },
        { code: "CPT 99152", name: "Moderate Sedation Unit", action: "Adjusted to CMS standard physician fee schedule", saved: "-$860.00", basis: "45 CFR § 149 IDR Median" },
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
        { code: "CPT 29125", name: "Forearm Splint Application", action: "Voided — pre-bundled in closed fracture reduction", saved: "-$2,350.00", basis: "CMS Surgical Global Period" },
        { code: "CPT 73090", name: "Post-Reduction X-Ray", action: "Corrected from hospital chargemaster to CMS median", saved: "-$1,850.00", basis: "45 CFR § 180 Federal Rate" },
        { code: "CPT 99214", name: "Level 4 Office Visit", action: "Downcoded to Level 3 for routine follow-up triage", saved: "-$1,550.00", basis: "Clinical Acuity Evaluation" },
      ],
    },
  };

  const current = caseData[activeHeroCase];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-14 space-y-16 sm:space-y-20 relative">
      {/* ========================================================================= */}
      {/* 1. OBSTAT HERO SECTION                                                    */}
      {/* ========================================================================= */}
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

        {/* Centered Distinct Actions: No Duplicate Callbacks */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => {
              if (onOpenNewBill) {
                onOpenNewBill();
              } else {
                onEnterCockpit();
              }
            }}
            className="px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Hospital Audit</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
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

      {/* ========================================================================= */}
      {/* 2. 3-BEAT NUMBERED FEATURE GRID (Authentic Obstat Step Cards)             */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
            How EXCISE Resolves Your Bill
          </h2>
          <p className="text-xs font-mono text-slate-500">
            From inflated chargemaster charge to binding legal settlement in 3 steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-mono font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Automatic Rate Auditing
            </h3>
            <p className="text-xs leading-relaxed font-sans text-slate-600">
              Upload your hospital statement. EXCISE cross-references 45,000+ machine-readable hospital price files ingested under 45 CFR § 180 to detect hidden cash discounts.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-mono font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Legally Enforceable Strikes
            </h3>
            <p className="text-xs leading-relaxed font-sans text-slate-600">
              We strike unbundled tray fees, downcode acute emergency inflation, and bind the facility to published self-pay schedules using CMS NCCI statutory rules.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-mono font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Dynamic Cash Settlement
            </h3>
            <p className="text-xs leading-relaxed font-sans text-slate-600">
              A formal settlement accord demand letter is compiled and dispatched directly to hospital billing through an AgentMail legal chamber, preventing collections.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CONTINUOUS CLEARANCE EVIDENCE MATRIX (Surface 1 & 2 Bridge)            */}
      {/* ========================================================================= */}
      <section className="space-y-4 pt-2">
        <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                Continuous Clearance Evidence Matrix
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-950">
                Live Itemized Forensic Case Registry
              </h3>
            </div>

            {/* Case Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono">
              {(["marcus", "elena", "david"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveHeroCase(key)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroCase === key
                      ? "bg-slate-950 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <span>{caseData[key].facility.split(" ")[0]}</span>
                  <span className="text-emerald-500 font-bold">(-{caseData[key].savingsPct})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                  <th className="pb-2.5 font-semibold">Violation Code</th>
                  <th className="pb-2.5 font-semibold">Service Description</th>
                  <th className="pb-2.5 font-semibold">Statutory Basis</th>
                  <th className="pb-2.5 font-semibold text-right">Excised Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.strikes.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-rose-600">{s.code}</td>
                    <td className="py-3 text-slate-900 font-sans font-medium">
                      <div>{s.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{s.action}</div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                        {s.basis}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-700">{s.saved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Convex State Hash:</span>
              <span className="text-slate-900 font-bold">#tx_8f9a2d81 · Attested</span>
            </div>

            <button
              onClick={() => {
                onSelectCase(current.id);
                onEnterCockpit();
              }}
              className="text-slate-900 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Inspect Full Docket in Working Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STATUTORY EVIDENTIARY AUTHORITY FOOTING                                */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider font-semibold">
              Statutory Authority
            </span>
            <h3 className="text-base font-bold text-slate-950">Ground-Truth Regulatory Enforcement</h3>
          </div>
          <button
            onClick={onOpenProof ?? onEnterCockpit}
            className="text-xs font-mono text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect Live Convex Proofs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-slate-950 font-bold">45 CFR § 149</div>
            <div className="text-slate-700 text-[11px]">No Surprises Act</div>
            <div className="text-[10px] text-slate-500">Balance billing immunity</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-slate-950 font-bold">45 CFR § 180</div>
            <div className="text-slate-700 text-[11px]">Price Transparency</div>
            <div className="text-[10px] text-slate-500">Mandatory cash pricing</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-slate-950 font-bold">CMS NCCI Edits</div>
            <div className="text-slate-700 text-[11px]">Correct Coding</div>
            <div className="text-[10px] text-slate-500">Illegal unbundling voided</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-slate-950 font-bold">Convex Immutability</div>
            <div className="text-slate-700 text-[11px]">Audit Finality</div>
            <div className="text-[10px] text-slate-500">Cryptographic state hash</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DECISIVE CLOSER CTA CARD                                               */}
      {/* ========================================================================= */}
      <section className="text-center p-8 sm:p-12 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Don&apos;t pay an inflated hospital bill.
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Instantly cross-examine your charges against federal CMS pricing files and dispatch a binding settlement.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onSelectCase(current.id);
              onEnterCockpit();
            }}
            className="px-7 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>Open Interactive Audit Docket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
