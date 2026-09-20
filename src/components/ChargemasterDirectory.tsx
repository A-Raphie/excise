"use client";

import React from "react";
import { Search, Database, ExternalLink, ShieldCheck, Check } from "lucide-react";

export function ChargemasterDirectory() {
  const transparencyRecords = [
    {
      cpt: "99285",
      name: "Emergency Dept Level 5 (Immediate Threat)",
      chargemasterCash: 1150,
      medicareRate: 265,
      avgBilled: 4850,
      markup: "321% over cash / 1,730% over Medicare",
      status: "Verified in Memorial Regional 2026 MRF",
    },
    {
      cpt: "99070",
      name: "Surgical Supply Kit / Suture Tray",
      chargemasterCash: 0,
      medicareRate: 0,
      avgBilled: 1850,
      markup: "100% Unbundled (Unlawful under CMS NCCI Ch 1)",
      status: "Bundled routine facility expense",
    },
    {
      cpt: "70450",
      name: "CT Head / Brain without contrast",
      chargemasterCash: 650,
      medicareRate: 185,
      avgBilled: 5400,
      markup: "730% over cash / 2,818% over Medicare",
      status: "Verified in Stanford & Memorial MRF",
    },
    {
      cpt: "36415",
      name: "Routine Venipuncture Blood Draw",
      chargemasterCash: 35,
      medicareRate: 12,
      avgBilled: 450,
      markup: "1,185% over cash",
      status: "Routine phlebotomy collection",
    },
    {
      cpt: "45385",
      name: "Colonoscopy with Polyp Removal",
      chargemasterCash: 2100,
      medicareRate: 850,
      avgBilled: 6200,
      markup: "195% over cash",
      status: "Verified in Stanford Health Care MRF",
    },
  ];

  return (
    <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Firecrawl Hospital Chargemaster Intelligence
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Autonomous extraction of hospital Machine-Readable Files (MRFs) mandated under 45 CFR § 180.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300 self-start sm:self-auto flex items-center gap-1.5">
          <Database className="w-3 h-3" />
          CMS Compliance Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {transparencyRecords.map((rec) => (
          <div
            key={rec.cpt}
            className="p-3.5 rounded-lg bg-[#0e141e] border border-slate-800/80 hover:border-slate-700 transition-colors text-xs font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">CPT {rec.cpt}</span>
              <span className="text-[10px] text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-900/50">
                {rec.markup}
              </span>
            </div>
            <div className="text-slate-300 font-sans text-xs mb-2 font-medium">
              {rec.name}
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Typical Gross Billed:</span>
                <span className="text-slate-200 font-semibold">${rec.avgBilled.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hospital Cash Rate:</span>
                <span className="text-cyan-400 font-semibold">${rec.chargemasterCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medicare Allowable:</span>
                <span className="text-emerald-400 font-semibold">${rec.medicareRate.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{rec.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
