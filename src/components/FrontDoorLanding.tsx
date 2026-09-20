"use client";

import React from "react";
import { ShieldAlert, ArrowRight, Sparkles, Scale, FileSpreadsheet, Mail, Globe, CheckCircle2, Bot } from "lucide-react";
import { DropzoneCard, DemoCaseStudy } from "./ui/dropzone-card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FrontDoorLandingProps {
  onSelectCase: (caseId: string) => void;
  onEnterCockpit: () => void;
}

export function FrontDoorLanding({ onSelectCase, onEnterCockpit }: FrontDoorLandingProps) {
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
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Hero Narrative Block */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Convex All Gas Hackathon · Autonomous Legal FinTech</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Autonomous Hospital Bill Auditing <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            &amp; Medical Bill Dispute Engine
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
          Hospitals bill billions in inflated chargemaster rates. Excise autonomously cross-references
          mandatory Machine-Readable Files (45 CFR § 180), voids upcoding and unbundled supplies, and negotiates
          binding cash settlements through dedicated AgentMail legal inboxes.
        </p>

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
            onClick={() => onSelectCase("case-marcus-er")}
            className="text-xs font-mono cursor-pointer"
          >
            <span>Load Marcus Vance ER Case ($14,850 → $3,735)</span>
          </Button>
        </div>
      </div>

      {/* Main Intake / Dropzone Section */}
      <DropzoneCard
        caseStudies={caseStudies}
        onSelectCase={onSelectCase}
      />

      {/* 3-Pillar Autonomous Engine Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
        <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
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

        <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
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

        <div className="p-4.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
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
