"use client";

import React, { useState } from "react";
import { useCaseEngine } from "@/components/ConvexClientProvider";
import { useWinsznxTheme } from "@/components/ThemeContext";
import { Header } from "@/components/Header";
import { CaseOverview } from "@/components/CaseOverview";
import { LineItemsTable } from "@/components/LineItemsTable";
import { AgentMailChamber } from "@/components/AgentMailChamber";
import { DisputeLetterViewer } from "@/components/DisputeLetterViewer";
import { ChargemasterDirectory } from "@/components/ChargemasterDirectory";
import { NewBillModal } from "@/components/NewBillModal";
import { FrontDoorLanding } from "@/components/FrontDoorLanding";
import { ProofEvidenceRail } from "@/components/ProofEvidenceRail";
import {
  FileSpreadsheet,
  Mail,
  FileText,
  Search,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const { activeCase, setSelectedCaseId } = useCaseEngine();
  const { theme } = useWinsznxTheme();
  const [viewMode, setViewMode] = useState<"landing" | "cockpit">("landing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "letter" | "agentmail" | "transparency" | "proof">(
    "audit"
  );

  if (!activeCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06090e] text-white font-mono text-xs">
        Initializing Excise Terminal...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === "obstat"
          ? "bg-[#f8fafc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900"
          : theme === "mandate"
          ? "bg-[#fbfbfa] text-stone-900 selection:bg-amber-100 selection:text-stone-900"
          : "bg-[#080b14] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300"
      }`}
    >
      {/* Top Header Navigation (One Chrome Row) */}
      <Header
        onOpenNewBill={() => setIsModalOpen(true)}
        viewMode={viewMode}
        onToggleView={setViewMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {viewMode === "landing" ? (
          <FrontDoorLanding
            onSelectCase={(caseId) => {
              setSelectedCaseId(caseId);
              setViewMode("cockpit");
            }}
            onEnterCockpit={() => setViewMode("cockpit")}
            onOpenProof={() => {
              setViewMode("cockpit");
              setActiveTab("proof");
            }}
          />
        ) : (
          <>
            {/* Navigation back breadcrumb */}
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setViewMode("landing")}
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-md hover:bg-white/[0.04] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Return to Bill Intake &amp; Case Studies</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Autonomous Chargemaster Dispute Engine</span>
              </div>
            </div>

            {/* Active Case Hero & Unified Docket */}
            <CaseOverview currentCase={activeCase} />

        {/* Primary Functional Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-t-md font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "border-emerald-400 text-white bg-white/[0.08] font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === "audit" ? "text-emerald-400" : "text-slate-400"}`} />
              <span>Forensic Audit ({activeCase.lineItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("agentmail")}
              className={`px-4 py-2 rounded-t-md font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "agentmail"
                  ? "border-purple-400 text-white bg-white/[0.08] font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Mail className={`w-3.5 h-3.5 ${activeTab === "agentmail" ? "text-purple-400" : "text-slate-400"}`} />
              <span>AgentMail Room ({activeCase.correspondence.length})</span>
              {activeCase.status === "in_negotiation" && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("letter")}
              className={`px-4 py-2 rounded-t-md font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "letter"
                  ? "border-slate-200 text-white bg-white/[0.08] font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === "letter" ? "text-white" : "text-slate-400"}`} />
              <span>Statutory Demand Notice</span>
            </button>

            <button
              onClick={() => setActiveTab("transparency")}
              className={`px-4 py-2 rounded-t-md font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "transparency"
                  ? "border-cyan-400 text-white bg-white/[0.08] font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${activeTab === "transparency" ? "text-cyan-400" : "text-slate-400"}`} />
              <span>Chargemaster Intel</span>
            </button>

            <button
              onClick={() => setActiveTab("proof")}
              className={`px-4 py-2 rounded-t-md font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "proof"
                  ? "border-emerald-300 text-white bg-white/[0.08] font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "proof" ? "text-emerald-400" : "text-slate-400"}`} />
              <span>Proof &amp; Receipts (4)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <strong className="text-emerald-400 font-semibold tracking-wide">LIVE DEMO:</strong>
            <span className="text-slate-300">Toggle any charge → recalculates instantly</span>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === "audit" && <LineItemsTable currentCase={activeCase} />}
          {activeTab === "agentmail" && <AgentMailChamber currentCase={activeCase} />}
          {activeTab === "letter" && <DisputeLetterViewer currentCase={activeCase} />}
          {activeTab === "transparency" && <ChargemasterDirectory />}
          {activeTab === "proof" && <ProofEvidenceRail currentCase={activeCase} />}
        </div>
        </>
        )}
      </main>

      {/* Bill Intake Modal */}
      <NewBillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#070b10] py-5 mt-auto text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-slate-300">EXCISE</span>
            <span>·</span>
            <span>Convex All Gas Hackathon</span>
            <span>·</span>
            <span className="text-emerald-500/80">Static Hosting on Convex</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Powered by Convex, Firecrawl, AgentMail, &amp; OpenAI</span>
            <a
              href="https://github.com/A-Raphie/excise"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
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
