"use client";

import React, { useState } from "react";
import { SampleCase, SampleLineItem } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  AlertOctagon,
  Layers,
  TrendingDown,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Globe,
} from "lucide-react";

interface LineItemsTableProps {
  currentCase: SampleCase;
}

export function LineItemsTable({ currentCase }: LineItemsTableProps) {
  const { toggleDispute } = useCaseEngine();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getViolationBadge = (type: SampleLineItem["violationType"]) => {
    switch (type) {
      case "UPCODING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950/80 border border-red-700/60 text-red-400">
            <AlertOctagon className="w-3 h-3" />
            UPCODING
          </span>
        );
      case "UNBUNDLING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-950/80 border border-amber-700/60 text-amber-400">
            <Layers className="w-3 h-3" />
            UNBUNDLED
          </span>
        );
      case "PRICE_GOUGE_OVER_CHARGEMASTER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-950/80 border border-rose-700/60 text-rose-400">
            <TrendingDown className="w-3 h-3" />
            &gt;800% MARKUP
          </span>
        );
      case "COMPLIANT":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300">
            <CheckCircle className="w-3 h-3 text-slate-400" />
            COMPLIANT
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0b1017] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Table Section Header */}
      <div className="p-4 sm:px-6 border-b border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d131d]">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">
              Forensic Itemized Chargemaster Audit
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentCase.lineItems.length} Line Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Line-by-line verification against hospital transparency MRF scraped via Firecrawl and CMS NCCI unbundling policy.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800">
            <Globe className="w-3 h-3 text-cyan-400" />
            Firecrawl MRF Verified
          </span>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#090e15] text-[11px] uppercase tracking-wider font-mono text-slate-400">
              <th className="py-3 px-4 w-10 text-center">Dispute</th>
              <th className="py-3 px-4 w-28">CPT Code</th>
              <th className="py-3 px-4 min-w-[220px]">Clinical Description</th>
              <th className="py-3 px-4 text-right">Hospital Billed</th>
              <th className="py-3 px-4 text-right">Chargemaster Cash</th>
              <th className="py-3 px-4 text-right">CMS Benchmark</th>
              <th className="py-3 px-4 text-right text-emerald-400 font-semibold">
                Fair Settlement
              </th>
              <th className="py-3 px-4 w-12 text-center">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {currentCase.lineItems.map((item) => {
              const isExpanded = expandedId === item.id;
              const isExcluded = !item.isDisputed;

              return (
                <React.Fragment key={item.id}>
                  <tr
                    className={`transition-colors ${
                      isExcluded
                        ? "opacity-50 bg-slate-950/40"
                        : item.violationType === "UNBUNDLING"
                        ? "bg-amber-950/10 hover:bg-amber-950/20"
                        : item.violationType === "UPCODING"
                        ? "bg-red-950/10 hover:bg-red-950/20"
                        : "hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isDisputed}
                        onChange={() => toggleDispute(currentCase.id, item.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                        title="Toggle dispute of this line item"
                      />
                    </td>

                    {/* CPT & Badge */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-200">{item.cptCode}</div>
                      <div className="mt-1">{getViolationBadge(item.violationType)}</div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 font-sans text-slate-200">
                      <div className="font-medium text-slate-200">{item.description}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                        {item.auditRationale}
                      </div>
                    </td>

                    {/* Billed */}
                    <td className="py-3 px-4 text-right font-medium text-slate-200 tabular-nums">
                      ${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Hospital Cash Rate (scraped via Firecrawl) */}
                    <td className="py-3 px-4 text-right text-cyan-300 tabular-nums font-medium">
                      {item.hospitalCashRate === 0 ? (
                        <span className="text-amber-400 font-semibold">$0.00 (Bundled)</span>
                      ) : (
                        `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      )}
                    </td>

                    {/* CMS Allowable */}
                    <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                      ${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Fair Settlement Proposed */}
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold tabular-nums">
                      ${item.proposedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      {item.isDisputed && (
                        <div className="text-[10px] text-emerald-600 font-normal">
                          -${(item.billedAmount - item.proposedAmount).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </div>
                      )}
                    </td>

                    {/* Expand Details button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                    <tr className="bg-[#0e1622] border-b border-slate-800/80">
                      <td colSpan={8} className="p-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 mb-2">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Clinical Coding Rationale &amp; Violation Basis
                            </div>
                            <p className="text-slate-200 font-sans leading-relaxed mb-2">
                              {item.auditRationale}
                            </p>
                            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                              <span className="text-purple-400 font-semibold">Auditor:</span>
                              <span>OpenAI Forensic CPT Engine (AMA Guidelines &amp; CMS NCCI Ch 1)</span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                            <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5 mb-2">
                              <Globe className="w-3.5 h-3.5" />
                              Firecrawl Hospital Chargemaster Intelligence
                            </div>
                            <div className="space-y-1.5 text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Hospital Standard Billed:</span>
                                <span className="text-white font-semibold">${item.billedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Hospital MRF Cash Price:</span>
                                <span className="text-cyan-400 font-semibold">
                                  {item.hospitalCashRate === 0 ? "$0.00 (Bundled)" : `$${item.hospitalCashRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">CMS Medicare Benchmark:</span>
                                <span className="text-emerald-400 font-semibold">${item.cmsBenchmarkRate.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-slate-800/80">
                                <span className="text-slate-400">Price Delta Excised:</span>
                                <span className="text-red-400 font-bold">
                                  -${(item.billedAmount - item.proposedAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                  {" "}
                                  ({Math.round(((item.billedAmount - item.proposedAmount) / item.billedAmount) * 100)}% overcharge)
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 pt-1">
                                Source: Verified in {currentCase.hospitalName} 2026 Machine-Readable Transparency File via Firecrawl crawl.
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
      <div className="p-3 sm:px-6 bg-[#090e15] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div>
          Tip: Uncheck any row to accept the hospital charge. Excise reactively updates total settlement tender in real time.
        </div>
        <div className="text-emerald-400 font-medium">
          Total Disputed Savings: -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
