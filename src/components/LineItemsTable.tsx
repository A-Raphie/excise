"use client";

import React, { useState } from "react";
import { SampleCase, SampleLineItem } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from "lucide-react";

interface LineItemsTableProps {
  currentCase: SampleCase;
}

export function LineItemsTable({ currentCase }: LineItemsTableProps) {
  const { toggleDispute, setAllDisputes } = useCaseEngine();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "violations">("all");

  const violationsCount = currentCase.lineItems.filter(
    (item) => item.violationType !== "COMPLIANT"
  ).length;

  const displayedItems =
    filter === "violations"
      ? currentCase.lineItems.filter((i) => i.violationType !== "COMPLIANT")
      : currentCase.lineItems;

  const allViolationsDisputed = currentCase.lineItems
    .filter((i) => i.violationType !== "COMPLIANT")
    .every((i) => i.isDisputed);

  const getViolationBadge = (type: SampleLineItem["violationType"]) => {
    switch (type) {
      case "UPCODING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 border border-red-200 text-red-700">
            UPCODED · LVL 5
          </span>
        );
      case "UNBUNDLING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800">
            UNBUNDLED
          </span>
        );
      case "PRICE_GOUGE_OVER_CHARGEMASTER":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 border border-rose-200 text-rose-700">
            8.3× MARKUP
          </span>
        );
      case "COMPLIANT":
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 border border-slate-200 text-slate-600">
            STANDARD
          </span>
        );
    }
  };

  const getRowBgClass = (item: SampleLineItem, isExcluded: boolean, isExpanded: boolean) => {
    if (isExcluded) return "opacity-50 bg-slate-50/50";
    if (isExpanded) return "bg-slate-50";
    switch (item.violationType) {
      case "UPCODING":
        return "hover:bg-red-50/40";
      case "UNBUNDLING":
        return "hover:bg-amber-50/40";
      case "PRICE_GOUGE_OVER_CHARGEMASTER":
        return "hover:bg-rose-50/40";
      case "COMPLIANT":
      default:
        return "hover:bg-slate-50/80";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Table Toolbar Strip */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Filter Tabs */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-200/60 border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white text-slate-950 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              All Charges ({currentCase.lineItems.length})
            </button>
            <button
              onClick={() => setFilter("violations")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                filter === "violations"
                  ? "bg-white text-emerald-800 border border-emerald-300 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Flagged Overcharges ({violationsCount})</span>
            </button>
          </div>
        </div>

        {/* Right: Tactile Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAllDisputes(currentCase.id, true)}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
              allViolationsDisputed
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Dispute All Flagged (-${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 0 })})</span>
          </button>

          <button
            onClick={() => setAllDisputes(currentCase.id, false)}
            title="Reset to hospital rate without dispute"
            className="px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider font-mono text-slate-500">
              <th className="py-2.5 px-4 w-12 text-center">Dispute</th>
              <th className="py-2.5 px-4 w-28">CPT Code</th>
              <th className="py-2.5 px-4 min-w-[220px]">Clinical Description</th>
              <th className="py-2.5 px-4 text-right">Billed Rate</th>
              <th className="py-2.5 px-4 text-right">MRF Cash Rate</th>
              <th className="py-2.5 px-4 text-right">CMS Benchmark</th>
              <th className="py-2.5 px-4 text-right text-emerald-800 font-bold">Legal Settlement</th>
              <th className="py-2.5 px-4 w-10 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-mono">
            {displayedItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const isExcluded = !item.isDisputed;
              const overchargeAmount = item.billedAmount - item.proposedAmount;

              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`transition-colors cursor-pointer ${getRowBgClass(item, isExcluded, isExpanded)}`}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={item.isDisputed}
                        onChange={() => toggleDispute(currentCase.id, item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-0 cursor-pointer accent-emerald-600 transition-transform active:scale-90"
                        title="Toggle dispute of this line item"
                      />
                    </td>

                    {/* CPT & Badge */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-950 text-xs tracking-wide">
                        {item.cptCode}
                      </div>
                      <div className="mt-1">{getViolationBadge(item.violationType)}</div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 text-xs">
                        {item.description}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                        <span>Rev: {item.cptCode === "99285" ? "0450 (ER)" : item.cptCode === "74177" || item.cptCode === "70450" ? "0350 (CT)" : "0270 (Supplies)"}</span>
                        {item.violationType !== "COMPLIANT" && (
                          <span className="text-indigo-700 hover:underline font-medium">
                            · {isExpanded ? "Close evidence" : "Inspect statutory proof"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Billed */}
                    <td className="py-3 px-4 text-right font-medium text-rose-600 line-through decoration-rose-400 tabular-nums text-xs">
                      ${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Hospital Cash Rate */}
                    <td className="py-3 px-4 text-right text-slate-900 tabular-nums text-xs font-semibold">
                      {item.hospitalCashRate === 0 ? (
                        <span className="text-amber-800 font-bold">$0.00 (Bundled)</span>
                      ) : (
                        `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      )}
                    </td>

                    {/* CMS Allowable */}
                    <td className="py-3 px-4 text-right text-slate-500 tabular-nums text-xs">
                      ${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Fair Settlement Proposed */}
                    <td className="py-3 px-4 text-right tabular-nums">
                      <div className="text-emerald-700 font-extrabold text-xs">
                        ${item.proposedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      {item.isDisputed && overchargeAmount > 0 && (
                        <div className="text-[10px] text-emerald-800 font-mono font-bold">
                          -${overchargeAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })} excised
                        </div>
                      )}
                    </td>

                    {/* Expand Details button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : item.id);
                        }}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          isExpanded
                            ? "bg-slate-200 text-slate-900 font-bold"
                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                        title="View clinical audit evidence"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <td colSpan={8} className="p-4 sm:px-6 space-y-3">
                        {/* Visual Comparative Gauge */}
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-600 font-medium">Rate Discrepancy Breakdown for CPT {item.cptCode}</span>
                            <span className="text-rose-600 font-bold">
                              ${item.billedAmount} Billed vs ${item.proposedAmount} Cash Baseline
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                            <div
                              className="h-full bg-emerald-600"
                              style={{ width: `${Math.max(5, (item.proposedAmount / item.billedAmount) * 100)}%` }}
                              title="Cash Settlement Baseline"
                            />
                            <div
                              className="h-full bg-rose-400/80"
                              style={{ width: `${Math.min(95, (overchargeAmount / item.billedAmount) * 100)}%` }}
                              title="Unlawful Overcharge Margin"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                            <span className="text-emerald-800 font-bold">■ Cash Baseline (${item.proposedAmount})</span>
                            <span className="text-rose-600 font-bold">■ Strike Margin: -${overchargeAmount}</span>
                          </div>
                        </div>

                        {/* Detail Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                            <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                              Clinical Violation Rationale (OpenAI Forensic Audit)
                            </div>
                            <p className="text-slate-700 font-sans leading-relaxed text-xs">
                              {item.auditRationale}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                            <div className="text-[10px] uppercase tracking-wider text-sky-800 font-bold flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-sky-700" />
                              Hospital Transparency Evidence (Firecrawl Scraped MRF)
                            </div>
                            <div className="space-y-1 text-[11px] text-slate-700">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Hospital Standard Billed:</span>
                                <span className="text-slate-900 font-bold">${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Verified Cash Schedule:</span>
                                <span className="text-sky-800 font-bold">
                                  {item.hospitalCashRate === 0 ? "$0.00 (Bundled into facility charge)" : `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">CMS Medicare Benchmark:</span>
                                <span className="text-emerald-800 font-bold">${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive In-Drawer Strike Toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate-500">
                            Statutory Ground: 45 CFR § 149.410 &amp; NCCI Manual v31.2
                          </span>
                          <button
                            onClick={() => toggleDispute(currentCase.id, item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                              item.isDisputed
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-950 hover:bg-slate-800 text-white"
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {item.isDisputed
                                ? `✓ Disputed (Saving -$${overchargeAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })})`
                                : `Strike Overcharge (-$${overchargeAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })})`}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer explanation */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Interactive: Toggling line items recalculates settlement offer reactively via Convex.</span>
        </div>
        <div className="text-emerald-800 font-bold">
          Total Savings Excised: -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
