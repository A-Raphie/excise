"use client";

import React, { useState } from "react";
import { useCaseEngine } from "@/components/ConvexClientProvider";
import { Header } from "@/components/Header";
import { CaseOverview } from "@/components/CaseOverview";
import { LineItemsTable } from "@/components/LineItemsTable";
import { AgentMailChamber } from "@/components/AgentMailChamber";
import { DisputeLetterViewer } from "@/components/DisputeLetterViewer";
import { ChargemasterDirectory } from "@/components/ChargemasterDirectory";
import { NewBillModal } from "@/components/NewBillModal";
import {
  FileSpreadsheet,
  Mail,
  FileText,
  Search,
  Building2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { cases, selectedCaseId, setSelectedCaseId, activeCase } = useCaseEngine();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "letter" | "agentmail" | "transparency">(
    "audit"
  );

  if (!activeCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06090e] text-white font-mono text-sm">
        Loading Excise Engine...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header Navigation */}
      <Header onOpenNewBill={() => setIsModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 90-Second Judge Walkthrough Banner */}
        <div className="p-4 rounded-xl bg-[#0b1017] border border-slate-800 text-xs font-mono shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-white tracking-wide uppercase text-[11px]">
                90-Second Evaluator / Judge Demo Path
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Active Case:</span>
              <div className="flex items-center gap-1.5">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                      selectedCaseId === c.id
                        ? "bg-emerald-600 text-white font-semibold shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {c.hospitalName.split(" ")[0]} ({c.status})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-[#0e141e] border border-slate-800/80">
              <div className="font-semibold text-emerald-400 mb-0.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Toggle Line Items</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Uncheck/check any line item in the audit table below to watch Convex reactively recalculate the settlement totals live.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0e141e] border border-slate-800/80">
              <div className="font-semibold text-purple-400 mb-0.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-950 border border-purple-600 text-purple-300 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>AgentMail Negotiation</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Switch to &quot;AgentMail Dispute Room&quot; and click &quot;Simulate Concession&quot; or &quot;Simulate Full Settlement&quot; to see live hospital responses.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0e141e] border border-slate-800/80">
              <div className="font-semibold text-cyan-400 mb-0.5 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-300 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Audit New Bill</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Click &quot;+ Audit New Bill&quot; in the header, select an authentic test bill, and watch the 3-stage autonomous pipeline run.
              </p>
            </div>
          </div>
        </div>

        {/* Active Case Hero & Overview */}
        <CaseOverview currentCase={activeCase} />

        {/* Primary Functional Tabs */}
        <div className="flex border-b border-slate-800 gap-2 text-xs font-mono overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-t-lg font-medium border-t border-x flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-[#0b1017] border-slate-700 text-white border-b-2 border-b-transparent text-emerald-400 shadow-sm"
                : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Forensic Audit &amp; Line Items ({activeCase.lineItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("agentmail")}
            className={`px-4 py-2.5 rounded-t-lg font-medium border-t border-x flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "agentmail"
                ? "bg-[#0b1017] border-slate-700 text-white border-b-2 border-b-transparent text-purple-400 shadow-sm"
                : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>AgentMail Dispute Room ({activeCase.correspondence.length})</span>
            {activeCase.status === "in_negotiation" && (
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("letter")}
            className={`px-4 py-2.5 rounded-t-lg font-medium border-t border-x flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "letter"
                ? "bg-[#0b1017] border-slate-700 text-white border-b-2 border-b-transparent text-emerald-400 shadow-sm"
                : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Statutory Dispute Notice</span>
          </button>

          <button
            onClick={() => setActiveTab("transparency")}
            className={`px-4 py-2.5 rounded-t-lg font-medium border-t border-x flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "transparency"
                ? "bg-[#0b1017] border-slate-700 text-white border-b-2 border-b-transparent text-cyan-400 shadow-sm"
                : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Firecrawl Chargemaster Intel</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === "audit" && <LineItemsTable currentCase={activeCase} />}
          {activeTab === "agentmail" && <AgentMailChamber currentCase={activeCase} />}
          {activeTab === "letter" && <DisputeLetterViewer currentCase={activeCase} />}
          {activeTab === "transparency" && <ChargemasterDirectory />}
        </div>
      </main>

      {/* Bill Intake Modal */}
      <NewBillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080d14] py-6 mt-12 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">EXCISE</span>
            <span>•</span>
            <span>Convex All Gas Hackathon 2026</span>
            <span>•</span>
            <span className="text-emerald-400">Zero-Daemon Static Hosting on Convex</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Convex, Firecrawl, AgentMail, &amp; OpenAI</span>
            <a
              href="https://github.com/A-Raphie/excise"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
