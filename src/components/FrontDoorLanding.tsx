"use client";

import React from "react";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Scale,
  FileSpreadsheet,
  Mail,
  Globe,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { DropzoneCard, DemoCaseStudy } from "./ui/dropzone-card";
import { Button } from "./ui/button";

interface FrontDoorLandingProps {
  onSelectCase: (caseId: string) => void;
  onEnterCockpit: () => void;
  onOpenProof?: () => void;
}

export function FrontDoorLanding({ onSelectCase, onEnterCockpit, onOpenProof }: FrontDoorLandingProps) {
  const caseStudies: DemoCaseStudy[] = [
    {
      id: "case-marcus-er",
      title: "Emergency Room Trauma & Repair",
      facility: "Memorial Regional Medical Center",
      patient: "Marcus Vance",
      originalCharge: 14850,
      excisedSavings: 11115,
      tenderedSettlement: 3735,
      highlightViolation: "CPT 99285 upcoded Level 5 for superficial laceration + unbundled routine suture trays (CPT 99070).",
    },
    {
      id: "case-elena-endo",
      title: "Outpatient Diagnostic Endoscopy",
      facility: "Stanford Health Care",
      patient: "Elena Rostova",
      originalCharge: 9420,
      excisedSavings: 6180,
      tenderedSettlement: 3240,
      highlightViolation: "Facility fee marked up 4.2× over published hospital cash schedule under federal price transparency rules.",
    },
    {
      id: "case-david-ortho",
      title: "Orthopedic Urgent Care & Fracture",
      facility: "Mount Sinai Hospital",
      patient: "David Chen",
      originalCharge: 8150,
      excisedSavings: 5750,
      tenderedSettlement: 2400,
      highlightViolation: "Splint supply kit and post-reduction X-ray improperly unbundled from primary orthopedic manipulation.",
    },
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* 5-Beat Hero Narrative Block */}
      <div className="text-center space-y-4">
        {/* Beat 1: Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>45 CFR § 149 &amp; § 180 Federal Transparency Enforcement</span>
        </div>

        {/* Beat 2: High-Contrast 2-Clause Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Hospitals bill unadjusted charges. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            We enforce the cash schedule.
          </span>
        </h1>

        {/* Beat 3: 50-65ch Lede */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          EXCISE autonomously cross-references mandatory hospital Machine-Readable Files,
          voids emergency upcoding and illicit unbundled surgical trays, and executes binding statutory
          settlements through dedicated AgentMail legal chambers.
        </p>

        {/* Beat 4: CTA Pair */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="emerald"
            onClick={onEnterCockpit}
            className="text-xs font-mono cursor-pointer"
          >
            <span>Explore Active Docket Cockpit</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onOpenProof ?? onEnterCockpit}
            className="text-xs font-mono cursor-pointer border-white/[0.12] hover:border-emerald-500/40 text-slate-200"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>View Cryptographic Proof &amp; Receipts</span>
          </Button>
        </div>

        <p className="text-[11px] font-mono text-slate-500 pt-1">
          Zero sign-in required · Convex verified state · 100% statutory adherence
        </p>
      </div>

      {/* Beat 5: Live Hero Visual & Intake Dropzone */}
      <DropzoneCard
        caseStudies={caseStudies}
        onSelectCase={onSelectCase}
      />

      {/* Problem Section: 3-Card Economic Friction Grid */}
      <div className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>The Problem: Why Hospital Bills Are 300% to 800% Inflated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">1. Upcoded Acuity</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                CPT 99285
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Emergency visits for minor lacerations are systematically upcoded to Level 5 (High/Immediate Threat), billing <strong className="text-slate-200">$4,850.00</strong> for a service whose verified cash schedule is <strong className="text-emerald-400">$520.00</strong>.
            </p>
          </div>

          <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">2. Unbundled Supply Kits</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                CPT 99070
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Routine surgical trays, sutures, and venipuncture supplies are separately billed at <strong className="text-slate-200">$1,850.00</strong> despite CMS NCCI rules strictly mandating they be bundled at <strong className="text-emerald-400">$0.00</strong>.
            </p>
          </div>

          <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">3. Concealed Cash Schedules</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                45 CFR § 180
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Hospitals bury self-pay discounts in multi-gigabyte MRF files, demanding inflated chargemaster totals unless confronted with their own published rates.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Pillar Autonomous Engine Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
        <div className="p-4.5 rounded-xl bg-[#080c12] border border-white/[0.06] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-xs font-mono">
            1. Firecrawl Chargemaster Intel
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Autonomously crawls published Machine-Readable Files (MRFs) mandated under federal transparency rules to discover actual cash prices.
          </p>
        </div>

        <div className="p-4.5 rounded-xl bg-[#080c12] border border-white/[0.06] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-xs font-mono">
            2. OpenAI Clinical CPT Audit
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cross-references AMA guidelines &amp; CMS NCCI unbundling manuals to downcode exaggerated emergency acuity and void illicit supply fees.
          </p>
        </div>

        <div className="p-4.5 rounded-xl bg-[#080c12] border border-white/[0.06] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-xs font-mono">
            3. AgentMail Negotiation Room
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provisions isolated case email inboxes, dispatches statutory demand filings citing 45 CFR § 149, and processes hospital concessions in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
