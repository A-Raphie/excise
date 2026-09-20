"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { FileText, Copy, Check, Download, ShieldCheck } from "lucide-react";

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
    <div className="bg-[#0b1017] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-6 border-b border-slate-800/90 bg-[#0d131d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                Statutory Dispute Demand Letter
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/50 text-emerald-400">
                45 CFR § 149 &amp; 180
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Legally binding notice citing No Surprises Act, NCCI unbundling manual, and published chargemaster rates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy Demand"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Formal Letter Paper Rendering */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[520px]">
        <div className="p-6 rounded-xl bg-[#070b10] border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              FORMAL LEGAL CONTEST • ATTORNEY APPROVED
            </span>
            <span>Ref: {currentCase.accountNumber}</span>
          </div>
          {currentCase.disputeLetter}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-3 sm:px-6 bg-[#090e15] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Delivery Channel: AgentMail Dedicated Case Inboxes</span>
        <span className="text-emerald-400">Statutory Response Window: 30 Days</span>
      </div>
    </div>
  );
}
