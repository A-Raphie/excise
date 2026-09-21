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
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertOctagon,
  Layers,
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-16 relative">
      {/* Ambient Blueprint Grid & Subtle Spotlight */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/[0.04] blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* 1. Unified Split-Screen Hero: Copy on Left, Authentic Document Specimen on Right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column (7 cols): Direct Thesis, CTAs, and Authority */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>45 CFR § 149 &amp; § 180 FORENSIC ENFORCEMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.1]">
            Hospitals overcharge by up to 800%.{" "}
            <span className="text-emerald-400 block mt-1.5">
              We cut your bill to the legal cash rate.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl">
            Upload any hospital bill. EXCISE cross-references mandatory federal price transparency files,
            strikes illegal emergency upcoding, and dispatches a binding statutory settlement demand.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              size="lg"
              variant="emerald"
              onClick={() => {
                onSelectCase(current.id);
                onEnterCockpit();
              }}
              className="text-xs font-mono font-bold cursor-pointer shadow-lg shadow-emerald-950/40"
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

          {/* Quiet Proof Line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-400 pt-1">
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

          {/* Case Study Switcher Pills Directly Below Lede */}
          <div className="pt-3 space-y-2 border-t border-white/[0.06]">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Live Audited Patient Case Studies:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(["marcus", "elena", "david"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveHeroCase(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeHeroCase === key
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm"
                      : "bg-[#090d14] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeHeroCase === key ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <span>{caseData[key].facility.split(" ")[0]}</span>
                  <span className="text-emerald-400 font-bold">(-{caseData[key].savingsPct})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): The Physical Specimen Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/[0.1] bg-[#090d14] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.06] bg-black/40 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white truncate">{current.facility}</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                {current.patient}
              </span>
            </div>

            {/* Live Interactive Forensic Adjudication Engine Card (No JPEG image in hero) */}
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* Docket Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">DOCKET #{current.id.toUpperCase()}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CMS MRF WITNESSED
                </span>
              </div>

              {/* Financial Comparison Readout */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Hospital Charged</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400/80 line-through">
                    {current.original}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Gross Chargemaster Rate</div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Legal Cash Settlement</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {current.settlement}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 font-mono font-medium">
                    {current.excised} ({current.savingsPct} Reduction)
                  </div>
                </div>
              </div>

              {/* 3 Detected Violations List */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Detected Violations &amp; Excised Amounts:
                </div>
                <div className="space-y-1.5">
                  {current.strikes.map((s, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs font-mono gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-rose-400 font-semibold shrink-0">{s.code}</span>
                        <span className="text-slate-200 truncate">{s.name}</span>
                      </div>
                      <span className="text-emerald-400 font-bold shrink-0">{s.saved}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Convex State Finality Hash */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Convex State Hash:</span>
                <span className="text-cyan-400 font-semibold">#tx_8f9a2d81 · Verified</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectCase(current.id);
                  onEnterCockpit();
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40"
              >
                <span>Inspect Full Itemized Audit &amp; Settlement Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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

      {/* 4. The 3-Card Economic Friction Grid */}
      <section className="space-y-5 pt-2">
        <div className="text-center space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-semibold">
            Forensic Diagnostic
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            The Three Chargemaster Exploits
          </h2>
          <p className="text-xs text-slate-400 font-mono max-w-xl mx-auto">
            Hospitals rely on opaque billing codes and patient intimidation to extract 4x to 10x markups. EXCISE automatically identifies and disallows all three.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Exploit 1 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#080c13] space-y-3 relative group hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400">CPT 99285</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                UPCODING SCAM
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Emergency Acuity Inflation</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Routine minor cuts or basic sprains are systematically billed at Level 5 (Immediate Threat to Life). EXCISE downcodes to Level 3 per clinical notes, saving $3,700–$4,500 instantly.
            </p>
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Avg. Overcharge:</span>
              <span className="text-rose-400 font-semibold">+$4,330.00</span>
            </div>
          </div>

          {/* Exploit 2 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#080c13] space-y-3 relative group hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">CPT 99070</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                NCCI UNBUNDLING
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Phantom Suture &amp; Supply Trays</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Billing separately for sterile trays, gloves, or bandages that are federally mandated to be bundled under facility fees. EXCISE strikes the full line item to $0.00 under CMS NCCI edits.
            </p>
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Federal Allowance:</span>
              <span className="text-emerald-400 font-semibold">$0.00 (Bundled)</span>
            </div>
          </div>

          {/* Exploit 3 */}
          <div className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#080c13] space-y-3 relative group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">CPT 70450</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                8.3x MULTIPLIER
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Fictitious Diagnostic Markups</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              A standard Head CT scan is billed at $5,400 on the hospital chargemaster, while their own published federal cash price is $650. EXCISE binds the hospital to their own published cash rate.
            </p>
            <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Enforced Cash Rate:</span>
              <span className="text-cyan-400 font-semibold">$650.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statutory Evidentiary Footing & Authority Grid */}
      <section className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#070b11] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Statutory Authority
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">Ground-Truth Regulatory Enforcement</h3>
          </div>
          <button
            onClick={onOpenProof ?? onEnterCockpit}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Inspect Live Convex Proofs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] space-y-1">
            <div className="text-emerald-400 font-bold">45 CFR § 149</div>
            <div className="text-slate-300 text-[11px]">No Surprises Act</div>
            <div className="text-[10px] text-slate-500">Balance billing immunity</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] space-y-1">
            <div className="text-cyan-400 font-bold">45 CFR § 180</div>
            <div className="text-slate-300 text-[11px]">Price Transparency</div>
            <div className="text-[10px] text-slate-500">Mandatory cash pricing</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] space-y-1">
            <div className="text-purple-400 font-bold">CMS NCCI Edits</div>
            <div className="text-slate-300 text-[11px]">Correct Coding</div>
            <div className="text-[10px] text-slate-500">Illegal unbundling voided</div>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] space-y-1">
            <div className="text-amber-400 font-bold">Convex Immutability</div>
            <div className="text-slate-300 text-[11px]">Audit Finality</div>
            <div className="text-[10px] text-slate-500">Cryptographic state hash</div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="space-y-4 pt-2">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            How statutory enforcement protects patients from illegal charges
          </p>
        </div>

        <div className="space-y-2 max-w-3xl mx-auto">
          {[
            {
              q: "How can EXCISE legally enforce a cash discount against a hospital?",
              a: "Under federal 45 CFR § 180, all US hospitals are legally required to publish their standard charges, including discounted cash prices. Under 45 CFR § 149 (No Surprises Act), uninsured, self-pay, or out-of-network emergency patients cannot be charged rates exceeding the hospital's median in-network or published cash price. EXCISE generates a formal statutory dispute notice that cites these federal mandates and establishes a binding legal tender offer.",
            },
            {
              q: "Does submitting an EXCISE dispute protect me from debt collectors?",
              a: "Yes. Once an official billing dispute is served under 45 CFR § 149, federal law prohibits the hospital or their debt collection agencies from reporting the contested balance to credit bureaus or taking adverse collection action while the dispute is pending or settled.",
            },
            {
              q: "Where does EXCISE get the hospital's actual pricing data?",
              a: "We cross-reference the hospital's mandatory Machine-Readable File (MRF) JSON and CSV tables ingested via Firecrawl, cross-checked against CMS National Correct Coding Initiative (NCCI) policy manuals and regional median fee schedules.",
            },
            {
              q: "What happens if hospital billing refuses the settlement accord?",
              a: "The complete, immutable audit docket—including cryptographic timestamps, AgentMail delivery receipts, and verified hospital cash schedules—is automatically formatted for submission to the Federal Independent Dispute Resolution (IDR) portal or state insurance commissioner.",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.06] bg-[#080c13] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-3.5 sm:px-4 pb-4 text-xs text-slate-400 font-sans leading-relaxed border-t border-white/[0.04] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Decisive Closer CTA */}
      <section className="text-center p-8 sm:p-10 rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-emerald-950/20 via-[#070b11] to-black/80 space-y-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Don&apos;t pay an inflated hospital bill.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
          Instantly cross-examine your charges against federal CMS pricing files and dispatch a binding settlement.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onSelectCase(current.id);
              onEnterCockpit();
            }}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center gap-2"
          >
            <span>Open Interactive Audit Docket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
