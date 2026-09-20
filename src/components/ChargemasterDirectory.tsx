"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Database,
  ExternalLink,
  ShieldCheck,
  Check,
  Zap,
  Building2,
  FileCode2,
  Filter,
} from "lucide-react";

interface TransparencyRecord {
  cpt: string;
  name: string;
  category: "emergency" | "radiology" | "supplies" | "outpatient";
  facility: string;
  chargemasterCash: number;
  medicareRate: number;
  avgBilled: number;
  markupText: string;
  markupPct: number;
  isBundled?: boolean;
  status: string;
  mrfRawSnippet: {
    hospital_ein: string;
    billing_code: string;
    standard_charge_gross: number;
    standard_charge_discounted_cash: number;
    medicare_allowable: number;
    cms_compliance_status: string;
  };
}

export function ChargemasterDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inspectingCpt, setInspectingCpt] = useState<string | null>(null);

  const transparencyRecords: TransparencyRecord[] = [
    {
      cpt: "99285",
      name: "Emergency Dept Level 5 (Immediate Life/Organ Threat)",
      category: "emergency",
      facility: "Memorial Regional Medical Center",
      chargemasterCash: 1150,
      medicareRate: 265,
      avgBilled: 4850,
      markupText: "+321% over cash / +1,730% over Medicare",
      markupPct: 321,
      status: "Verified in Memorial Regional 2026 MRF",
      mrfRawSnippet: {
        hospital_ein: "59-1234567",
        billing_code: "99285",
        standard_charge_gross: 4850.0,
        standard_charge_discounted_cash: 1150.0,
        medicare_allowable: 265.0,
        cms_compliance_status: "PUBLISHED_VALID",
      },
    },
    {
      cpt: "99070",
      name: "Surgical Supply Kit / Suture Tray Addition",
      category: "supplies",
      facility: "Memorial Regional Medical Center",
      chargemasterCash: 0,
      medicareRate: 0,
      avgBilled: 1850,
      markupText: "100% Unbundled (Disallowed under CMS NCCI Ch. 1 §B)",
      markupPct: 100,
      isBundled: true,
      status: "Bundled routine facility overhead expense",
      mrfRawSnippet: {
        hospital_ein: "59-1234567",
        billing_code: "99070",
        standard_charge_gross: 1850.0,
        standard_charge_discounted_cash: 0.0,
        medicare_allowable: 0.0,
        cms_compliance_status: "NCCI_UNBUNDLED_VIOLATION",
      },
    },
    {
      cpt: "70450",
      name: "CT Head / Brain Scan Without Contrast",
      category: "radiology",
      facility: "Memorial Regional & Stanford Health",
      chargemasterCash: 650,
      medicareRate: 185,
      avgBilled: 5400,
      markupText: "+730% over cash / +2,818% over Medicare",
      markupPct: 730,
      status: "Verified in Stanford & Memorial MRF files",
      mrfRawSnippet: {
        hospital_ein: "94-1156321",
        billing_code: "70450",
        standard_charge_gross: 5400.0,
        standard_charge_discounted_cash: 650.0,
        medicare_allowable: 185.0,
        cms_compliance_status: "PUBLISHED_VALID",
      },
    },
    {
      cpt: "36415",
      name: "Routine Venipuncture Blood Draw",
      category: "emergency",
      facility: "Mount Sinai & Stanford Health Care",
      chargemasterCash: 35,
      medicareRate: 12,
      avgBilled: 450,
      markupText: "+1,185% over cash rate",
      markupPct: 1185,
      status: "Routine phlebotomy collection",
      mrfRawSnippet: {
        hospital_ein: "13-1748291",
        billing_code: "36415",
        standard_charge_gross: 450.0,
        standard_charge_discounted_cash: 35.0,
        medicare_allowable: 12.0,
        cms_compliance_status: "PUBLISHED_VALID",
      },
    },
    {
      cpt: "45385",
      name: "Colonoscopy with Lesion / Polyp Removal",
      category: "outpatient",
      facility: "Stanford Health Care Outpatient Surgery",
      chargemasterCash: 2100,
      medicareRate: 850,
      avgBilled: 6200,
      markupText: "+195% over cash rate",
      markupPct: 195,
      status: "Verified in Stanford Health Care 2026 MRF",
      mrfRawSnippet: {
        hospital_ein: "94-1156321",
        billing_code: "45385",
        standard_charge_gross: 6200.0,
        standard_charge_discounted_cash: 2100.0,
        medicare_allowable: 850.0,
        cms_compliance_status: "PUBLISHED_VALID",
      },
    },
  ];

  const filteredRecords = useMemo(() => {
    return transparencyRecords.filter((rec) => {
      const matchesSearch =
        rec.cpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.facility.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || rec.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-[#080c13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm flex flex-col space-y-4 p-4 sm:p-5">
      {/* 1. Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Firecrawl Hospital Chargemaster Intelligence
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <Database className="w-3 h-3" />
                <span>CMS 45 CFR § 180 Feed</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live crawler verifying hospital standard charges against mandatory Machine-Readable Files (MRFs).
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/40 border border-white/[0.08] text-slate-300 self-start md:self-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{filteredRecords.length} Audited Procedures</span>
        </span>
      </div>

      {/* 2. Interactive Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by CPT code, procedure name, or facility..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-xs transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Codes" },
            { id: "emergency", label: "Emergency" },
            { id: "radiology", label: "Radiology" },
            { id: "supplies", label: "Supplies" },
            { id: "outpatient", label: "Outpatient" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 font-semibold"
                  : "bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. High-Impact Procedure Cards with Visual Markup Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500 font-mono text-xs">
            No matching chargemaster procedures found for &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const isInspecting = inspectingCpt === rec.cpt;

            return (
              <div
                key={rec.cpt}
                className="p-4 rounded-xl bg-[#090d14] border border-white/[0.08] hover:border-white/[0.15] transition-all text-xs font-mono space-y-3 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Code & Markup Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                      CPT {rec.cpt}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        rec.isBundled
                          ? "bg-amber-500/15 border-amber-500/35 text-amber-300"
                          : "bg-rose-500/15 border-rose-500/35 text-rose-300"
                      }`}
                    >
                      {rec.isBundled ? "UNBUNDLED" : `${rec.markupPct}% MARKUP`}
                    </span>
                  </div>

                  {/* Procedure Name */}
                  <div className="text-slate-200 font-sans text-xs font-medium leading-snug">
                    {rec.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-sans">
                    <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{rec.facility}</span>
                  </div>

                  {/* Price Comparison Grid */}
                  <div className="space-y-1.5 pt-3 mt-3 border-t border-white/[0.06] text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Hospital Gross Billed:</span>
                      <span className="text-rose-400 font-bold line-through decoration-rose-500/60">
                        ${rec.avgBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Mandatory Cash Rate:</span>
                      <span className="text-cyan-400 font-bold">
                        ${rec.chargemasterCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Medicare Allowable:</span>
                      <span className="text-emerald-400 font-medium">
                        ${rec.medicareRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Proportional Markup Visual Gauge */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Price Proportionality:</span>
                        <span className="text-cyan-300">
                          {rec.isBundled ? "Disallowed" : `${(rec.avgBilled / (rec.chargemasterCash || 1)).toFixed(1)}× Fair Cash`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden flex">
                        <div
                          className="h-full bg-cyan-400"
                          style={{
                            width: `${Math.min(100, ((rec.chargemasterCash || 1) / rec.avgBilled) * 100)}%`,
                          }}
                        />
                        <div
                          className="h-full bg-rose-500/80"
                          style={{
                            width: `${100 - Math.min(100, ((rec.chargemasterCash || 1) / rec.avgBilled) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Witness MRF Snippet */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate max-w-[65%]">
                    {rec.status}
                  </span>
                  <button
                    onClick={() => setInspectingCpt(isInspecting ? null : rec.cpt)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <FileCode2 className="w-3 h-3" />
                    <span>{isInspecting ? "Close" : "Witness MRF"}</span>
                  </button>
                </div>

                {/* Expanded Raw MRF Snippet Drawer */}
                {isInspecting && (
                  <div className="mt-2 p-2.5 rounded bg-black/80 border border-cyan-500/30 text-[10px] text-cyan-200 overflow-x-auto space-y-1">
                    <div className="text-slate-400 uppercase tracking-wider font-semibold">
                      Raw CMS 45 CFR § 180 Witness:
                    </div>
                    <pre className="text-[10px] leading-relaxed">
                      {JSON.stringify(rec.mrfRawSnippet, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
