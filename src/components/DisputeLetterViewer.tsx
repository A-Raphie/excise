"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { FileText, Copy, Check, Download, ShieldCheck, Scale, ExternalLink } from "lucide-react";

interface DisputeLetterViewerProps {
  currentCase: SampleCase;
}

export function DisputeLetterViewer({ currentCase }: DisputeLetterViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCase.disputeLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentCase.disputeLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `excise-dispute-${currentCase.accountNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-[#080c13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-5 border-b border-white/[0.06] bg-[#0b1018] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Statutory Dispute Demand Notice
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                45 CFR § 149 &amp; § 180
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Legally binding contest invoking the No Surprises Act, CMS NCCI unbundling rules, and published cash schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied Notice</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Demand</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .TXT</span>
          </button>
        </div>
      </div>

      {/* Statutory Rule Citation Badges */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#090e15] border-b border-white/[0.04] flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
          Admitted Grounds:
        </span>
        <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300">
          45 CFR § 149.410 (Balance Billing Stay)
        </span>
        <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300">
          45 CFR § 180 (Mandatory MRF Cash Schedule)
        </span>
        <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300">
          CMS NCCI Ch. 1 §B (Surgical Tray Unbundling)
        </span>
      </div>

      {/* Formal Letter Paper Rendering */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[520px]">
        <div className="p-5 sm:p-6 rounded-xl bg-black/50 border border-white/[0.08] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
          <div className="border-b border-white/[0.08] pb-3 mb-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              FORMAL LEGAL CONTEST • ATTORNEY-IN-FACT DESIGNATED
            </span>
            <span className="text-slate-400">Ref: {currentCase.accountNumber}</span>
          </div>
          {currentCase.disputeLetter}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-3 sm:px-5 bg-[#0b1018] border-t border-white/[0.06] text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Delivery Channel: AgentMail Dedicated Dispute Chamber</span>
        </div>
        <span className="text-emerald-400 font-semibold">Statutory Response Window: 30 Days</span>
      </div>
    </div>
  );
}
