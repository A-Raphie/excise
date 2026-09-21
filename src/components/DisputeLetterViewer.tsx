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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider">
                Statutory Dispute Demand Notice
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                45 CFR § 149 &amp; § 180
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Legally binding contest invoking the No Surprises Act, CMS NCCI unbundling rules, and published cash schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer text-xs shadow-xs font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800 font-bold">Copied Notice</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Demand</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .TXT</span>
          </button>
        </div>
      </div>

      {/* Statutory Rule Citation Badges */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-600">
        <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
          Admitted Grounds:
        </span>
        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 shadow-2xs font-medium">
          45 CFR § 149.410 (Balance Billing Stay)
        </span>
        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 shadow-2xs font-medium">
          45 CFR § 180 (Mandatory MRF Cash Schedule)
        </span>
        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 shadow-2xs font-medium">
          CMS NCCI Ch. 1 §B (Surgical Tray Unbundling)
        </span>
      </div>

      {/* Formal Letter Paper Rendering */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[520px] bg-slate-50/50">
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-900 whitespace-pre-wrap leading-relaxed shadow-xs">
          <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              FORMAL LEGAL CONTEST • ATTORNEY-IN-FACT DESIGNATED
            </span>
            <span className="text-slate-500 font-semibold">Ref: {currentCase.accountNumber}</span>
          </div>
          {currentCase.disputeLetter}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 text-[11px] font-mono text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Delivery Channel: AgentMail Dedicated Dispute Chamber</span>
        </div>
        <span className="text-emerald-800 font-bold">Statutory Response Window: 30 Days</span>
      </div>
    </div>
  );
}
