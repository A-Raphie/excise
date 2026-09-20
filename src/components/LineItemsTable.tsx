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
} from "lucide-react";

interface LineItemsTableProps {
  currentCase: SampleCase;
}

export function LineItemsTable({ currentCase }: LineItemsTableProps) {
  const { toggleDispute } = useCaseEngine();
  const [expandedId, setExpandedId] = useState<string | null>("item-1"); // Expand first item by default to show evidence immediately!

  const getViolationBadge = (type: SampleLineItem["violationType"]) => {
    switch (type) {
      case "UPCODING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-500/15 border border-red-500/35 text-red-400">
            UPCODED · LVL 5
          </span>
        );
      case "UNBUNDLING":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 border border-amber-500/35 text-amber-300">
            UNBUNDLED
          </span>
        );
      case "PRICE_GOUGE_OVER_CHARGEMASTER":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 border border-rose-500/35 text-rose-300">
            8.3× MARKUP
          </span>
        );
      case "COMPLIANT":
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-slate-400">
            STANDARD
          </span>
        );
    }
  };

  const getRowBgClass = (item: SampleLineItem, isExcluded: boolean, isExpanded: boolean) => {
    if (isExcluded) return "opacity-40 bg-black/25";
    if (isExpanded) return "bg-white/[0.04]";
    switch (item.violationType) {
      case "UPCODING":
        return "bg-red-500/[0.035] hover:bg-red-500/[0.07]";
      case "UNBUNDLING":
        return "bg-amber-500/[0.035] hover:bg-amber-500/[0.07]";
      case "PRICE_GOUGE_OVER_CHARGEMASTER":
        return "bg-rose-500/[0.035] hover:bg-rose-500/[0.07]";
      case "COMPLIANT":
      default:
        return "hover:bg-white/[0.02]";
    }
  };

  return (
    <div className="bg-[#090d13] border border-white/[0.08] rounded-lg overflow-hidden shadow-sm">
      {/* Table Subheader */}
      <div className="px-4 py-3 border-b border-white/[0.06] bg-[#0b1017] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400/80" />
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
            Forensic Chargemaster Audit Breakdown
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            ({currentCase.lineItems.length} clinical charges)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Firecrawl Scraped MRF Cash Benchmarks</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-black/30 text-[10px] uppercase tracking-wider font-mono text-slate-400">
              <th className="py-2.5 px-4 w-10 text-center">Dispute</th>
              <th className="py-2.5 px-4 w-28">CPT Code</th>
              <th className="py-2.5 px-4 min-w-[240px]">Clinical Description</th>
              <th className="py-2.5 px-4 text-right">Billed Rate</th>
              <th className="py-2.5 px-4 text-right">MRF Cash Rate</th>
              <th className="py-2.5 px-4 text-right">CMS Benchmark</th>
              <th className="py-2.5 px-4 text-right text-emerald-400">Fair Settlement</th>
              <th className="py-2.5 px-4 w-10 text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs font-mono">
            {currentCase.lineItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const isExcluded = !item.isDisputed;

              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`transition-colors ${getRowBgClass(item, isExcluded, isExpanded)}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isDisputed}
                        onChange={() => toggleDispute(currentCase.id, item.id)}
                        className="w-4 h-4 rounded border-white/[0.2] bg-black text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                        title="Toggle dispute of this line item"
                      />
                    </td>

                    {/* CPT & Badge */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-100 text-xs tracking-wide">{item.cptCode}</div>
                      <div className="mt-1">{getViolationBadge(item.violationType)}</div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-100 text-xs">{item.description}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>Rev: {item.cptCode === "99285" ? "0450 (Emerg)" : item.cptCode === "74177" || item.cptCode === "70450" ? "0350 (CT)" : "0270 (Supplies)"}</span>
                        {item.violationType !== "COMPLIANT" && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            · {isExpanded ? "Hide evidence" : "View evidence"}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Billed */}
                    <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums text-xs">
                      ${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Hospital Cash Rate (scraped via Firecrawl) */}
                    <td className="py-3 px-4 text-right text-slate-200 tabular-nums text-xs font-medium">
                      {item.hospitalCashRate === 0 ? (
                        <span className="text-amber-300 font-semibold">$0.00 (Bundled)</span>
                      ) : (
                        `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      )}
                    </td>

                    {/* CMS Allowable */}
                    <td className="py-3 px-4 text-right text-slate-400 tabular-nums text-xs">
                      ${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Fair Settlement Proposed */}
                    <td className="py-3 px-4 text-right tabular-nums">
                      <div className="text-emerald-400 font-bold text-xs">
                        ${item.proposedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      {item.isDisputed && item.billedAmount > item.proposedAmount && (
                        <div className="text-[10px] text-emerald-500/80 font-mono font-medium">
                          -${(item.billedAmount - item.proposedAmount).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </div>
                      )}
                    </td>

                    {/* Expand Details button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          isExpanded
                            ? "bg-white/[0.1] text-emerald-400"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
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
                    <tr className="bg-[#070b10] border-b border-white/[0.06]">
                      <td colSpan={8} className="p-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
                            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 mb-1.5">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Clinical Violation Rationale (OpenAI Forensic Audit)
                            </div>
                            <p className="text-slate-300 font-sans leading-relaxed text-xs">
                              {item.auditRationale}
                            </p>
                          </div>

                          <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
                            <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5 mb-1.5">
                              <Globe className="w-3.5 h-3.5" />
                              Hospital Transparency Evidence (Firecrawl Crawl)
                            </div>
                            <div className="space-y-1 text-[11px] text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Hospital Standard Billed:</span>
                                <span className="text-slate-200">${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Verified Cash Schedule:</span>
                                <span className="text-cyan-300">
                                  {item.hospitalCashRate === 0 ? "$0.00 (Bundled into primary procedure)" : `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">CMS Medicare Median Allowable:</span>
                                <span className="text-emerald-400">${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                                <span className="text-slate-500">Overcharge Excised:</span>
                                <span className="text-red-400 font-semibold">
                                  -${(item.billedAmount - item.proposedAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>
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
      <div className="px-4 py-2.5 bg-[#0b1017] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <div>
          Interactive: Unchecking any charge recalculates settlement tender reactively via Convex.
        </div>
        <div className="text-emerald-400 font-medium">
          Total Disputed Savings: -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
