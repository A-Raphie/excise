// Harvested from: https://beui.dev/components/agents/approval-card & https://beautifului.dev#approval-card
// Re-expressed on semantic tokens

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface DisputeCardProps {
  type: "outbound_dispatch" | "inbound_concession" | "inbound_rejection" | "final_settlement";
  sender: string;
  recipient: string;
  timestamp: string;
  subject: string;
  statusBadge: string;
  statusVariant?: "emerald" | "amber" | "purple" | "cyan" | "destructive" | "secondary";
  financialDelta?: {
    originalBilled?: number;
    excisedReduction?: number;
    concededAmount?: number;
    finalAmount?: number;
    breakdown?: { item: string; delta: string }[];
  };
  summaryPoints?: string[];
  fullBody: string;
  onViewDemandNotice?: () => void;
  className?: string;
}

export function DisputeCard({
  type,
  sender,
  recipient,
  timestamp,
  subject,
  statusBadge,
  statusVariant = "secondary",
  financialDelta,
  summaryPoints,
  fullBody,
  onViewDemandNotice,
  className,
}: DisputeCardProps) {
  const [showFullBody, setShowFullBody] = useState(false);

  const isOutbound = type === "outbound_dispatch";

  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-5 font-mono text-xs transition-all shadow-sm",
        isOutbound
          ? "bg-[#0a0f16] border-purple-500/25 shadow-purple-950/10"
          : "bg-[#090e15] border-emerald-500/30 shadow-emerald-950/10",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
              isOutbound
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            )}
          >
            {isOutbound ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-slate-200 text-xs tracking-tight truncate block">
              {sender}
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              To: {recipient}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant={statusVariant}>{statusBadge}</Badge>
          <span className="text-[10px] text-slate-500 font-mono">{timestamp}</span>
        </div>
      </div>

      {/* Subject */}
      <div className="pt-3 font-medium text-slate-200 text-xs">
        {subject}
      </div>

      {/* Financial Delta Highlight Banner */}
      {financialDelta && (
        <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/[0.08] space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {isOutbound ? "Dispute Audit Basis" : "Hospital Concession Settlement"}
            </span>
            {financialDelta.concededAmount && (
              <span className="text-xs font-bold text-emerald-400 font-mono">
                -${financialDelta.concededAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} Conceded
              </span>
            )}
            {financialDelta.finalAmount && (
              <span className="text-xs font-bold text-cyan-300 font-mono">
                Settlement Tender: ${financialDelta.finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {financialDelta.breakdown && financialDelta.breakdown.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5 border-t border-white/[0.06] text-[11px]">
              {financialDelta.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 truncate mr-2">{item.item}:</span>
                  <span className="text-emerald-400 font-medium shrink-0">{item.delta}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Points */}
      {summaryPoints && summaryPoints.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-slate-300 font-sans list-disc list-inside">
          {summaryPoints.map((point, idx) => (
            <li key={idx} className="leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      )}

      {/* Actions & Body Toggle */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <button
          onClick={() => setShowFullBody(!showFullBody)}
          className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
        >
          {showFullBody ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showFullBody ? "Hide full transmission" : "Show full transmission text"}</span>
        </button>

        {onViewDemandNotice && (
          <button
            onClick={onViewDemandNotice}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <FileText className="w-3 h-3" />
            <span>View Statutory Filing</span>
          </button>
        )}
      </div>

      {/* Collapsible Full Body Text */}
      {showFullBody && (
        <div className="mt-3 p-3.5 rounded-lg bg-black/60 border border-white/[0.06] text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
          {fullBody}
        </div>
      )}
    </div>
  );
}
