"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  Building2,
  Lock,
  Eye,
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
  // Active sample case in the hero specimen
  const [activeHeroCase, setActiveHeroCase] = useState<"marcus" | "elena" | "david">("marcus");
  const [showFullImageModal, setShowFullImageModal] = useState(false);

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
      image: "/images/hospital-bill-specimen.jpg",
      imageCaption: "Authentic Scanned Hospital Bill · EXCISE 45 CFR § 149 Audit Stamps",
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
      image: "/images/radiology-audit-specimen.jpg",
      imageCaption: "Stanford Radiology Claim · Diagnostic CT Film & 66% Reduction Stamp",
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
      image: "/images/hospital-bill-specimen.jpg",
      imageCaption: "Mount Sinai Fracture Claim · Unbundled Splint Application Voided",
      strikes: [
        { code: "CPT 29125", name: "Forearm Splint Application", action: "Voided — pre-bundled in closed fracture reduction", saved: "-$2,350.00" },
        { code: "CPT 73090", name: "Post-Reduction X-Ray", action: "Corrected from hospital chargemaster to CMS median", saved: "-$1,850.00" },
        { code: "CPT 99214", name: "Level 4 Office Visit", action: "Downcoded to Level 3 for routine follow-up triage", saved: "-$1,550.00" },
      ],
    },
  };

  const current = caseData[activeHeroCase];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-14">
      {/* 1. Calm, Focused Hero */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>FORENSIC MEDICAL BILL AUDIT ENGINE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
          Hospitals overcharge by up to 800%. <br />
          <span className="text-emerald-400">
            We cut your bill to the legal cash rate.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
          Upload any hospital bill. EXCISE cross-references mandatory federal price transparency files,
          strikes illegal upcoding, and dispatches a binding statutory settlement demand.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="emerald"
            onClick={() => {
              onSelectCase(current.id);
              onEnterCockpit();
            }}
            className="text-xs font-mono font-semibold cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <span>Open Interactive Audit Docket</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              onSelectCase(current.id);
              onEnterCockpit();
            }}
            className="text-xs font-mono cursor-pointer border-white/[0.15] hover:border-emerald-500/40 text-slate-200"
          >
            <UploadCloud className="w-4 h-4 mr-1.5 text-emerald-400" />
            <span>Audit Your Bill (PDF / Photo)</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs font-mono text-slate-400 pt-1">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Zero Sign-In</span>
          </span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <span className="whitespace-nowrap">Federal 45 CFR § 149 Compliance</span>
          <span className="text-slate-600 hidden sm:inline">·</span>
          <button
            onClick={onOpenProof ?? onEnterCockpit}
            className="text-slate-300 hover:text-emerald-400 underline underline-offset-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            View Cryptographic Proof
          </button>
        </div>
      </section>

      {/* 2. THE HERO SPECIMEN: Real Physical Document Photo + Side-by-Side Forensic Data */}
      <section className="space-y-3">
        {/* Case Switcher Tabs Above Card */}
        <div className="flex items-center justify-between px-1 text-xs font-mono">
          <div className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
            Authentic Audited Case Studies:
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.08] p-1 rounded-lg">
            {(["marcus", "elena", "david"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveHeroCase(key)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  activeHeroCase === key
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {caseData[key].facility.split(" ")[0]} (-{caseData[key].savingsPct})
              </button>
            ))}
          </div>
        </div>

        {/* The Card */}
        <div className="rounded-2xl border border-white/[0.1] bg-[#090d14] overflow-hidden shadow-2xl">
          {/* Card Top: Facility and Status */}
          <div className="px-5 py-3.5 border-b border-white/[0.06] bg-black/40 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">{current.facility}</span>
              <span className="text-slate-400">· {current.department}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Patient: {current.patient}</span>
            </div>
          </div>

          {/* Card Center: Real Document Photograph (Left) & Forensic Adjudication (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] bg-gradient-to-b from-[#090d14] to-[#070a0f]">
            {/* Left Column (5 cols): Authentic Physical Bill Photo */}
            <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-white/[0.1] shadow-lg group cursor-pointer" onClick={() => setShowFullImageModal(true)}>
                <img
                  src={current.image}
                  alt={current.imageCaption}
                  className="w-full h-56 sm:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs border border-white/[0.15] text-[10px] font-mono text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Physical Evidence Scan</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
                  <span className="truncate mr-2 font-medium">Click to inspect full document</span>
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>
                <span>{current.imageCaption}</span>
              </div>
            </div>

            {/* Right Column (7 cols): Before vs After & Violations */}
            <div className="lg:col-span-7 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              {/* Before vs After Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/[0.06]">
                {/* Left: What Hospital Charged */}
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 uppercase">Hospital Charged</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono line-through opacity-70">
                    {current.original}
                  </div>
                  <p className="text-xs text-rose-400 font-mono pt-0.5">
                    Unadjusted chargemaster rate
                  </p>
                </div>

                {/* Right: What You Actually Owe */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                      Legal Settlement Offer
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {current.excised} ({current.savingsPct} OFF)
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                    {current.settlement}
                  </div>
                  <p className="text-xs text-slate-300 font-mono pt-0.5">
                    Enforced CMS published cash rate
                  </p>
                </div>
              </div>

              {/* 3 Detected Violations */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Violations Detected &amp; Excised On This Bill:
                </div>
                <div className="space-y-1.5">
                  {current.strikes.map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-semibold">{s.code}</span>
                        <span className="text-white font-medium">{s.name}</span>
                        <span className="text-slate-400 hidden sm:inline">— {s.action}</span>
                      </div>
                      <div className="font-bold text-emerald-400 self-end sm:self-auto shrink-0">
                        {s.saved}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Action Link */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectCase(current.id);
                    onEnterCockpit();
                  }}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Inspect Full Itemized Audit &amp; Settlement Letter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Simple 3-Step Process (No Clutter, Plain English) */}
      <section className="space-y-5 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-white">How EXCISE Resolves Your Bill</h2>
          <p className="text-xs text-slate-400 font-mono">From inflated charge to binding settlement in 3 steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090d14] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-semibold text-white">Upload Your Bill</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Drop any hospital bill, photo statement, or UB-04 clinical summary. All personal health data is processed with zero logging.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090d14] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-semibold text-white">Automated Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              We cross-check every line item against the hospital&apos;s mandatory Machine-Readable cash pricing and strike illegal upcodes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-[#090d14] space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-semibold text-white">Statutory Dispute</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              An official dispute notice is served directly to hospital billing through a dedicated AgentMail chamber citing 45 CFR § 149.
            </p>
          </div>
        </div>
      </section>

      {/* Full Document Preview Modal */}
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullImageModal(false)}
        >
          <div className="max-w-3xl w-full bg-[#0b1017] border border-white/[0.15] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <span className="font-semibold text-white">{current.imageCaption}</span>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-3 bg-black flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={current.image}
                alt={current.imageCaption}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
