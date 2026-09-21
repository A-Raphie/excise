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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-900 font-mono text-xs">
        Initializing Excise Terminal...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
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
            onOpenNewBill={() => setIsModalOpen(true)}
          />
        ) : (
          <>
            {/* Active Case Hero & Unified Docket */}
            <CaseOverview currentCase={activeCase} />

            {/* Primary Functional Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 gap-3 text-xs font-mono pb-1">
              <div className="flex items-center gap-1 overflow-x-auto pb-px">
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "audit"
                      ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === "audit" ? "text-emerald-700" : "text-slate-400"}`} />
                  <span>Forensic Audit ({activeCase.lineItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("agentmail")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "agentmail"
                      ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Mail className={`w-3.5 h-3.5 ${activeTab === "agentmail" ? "text-purple-700" : "text-slate-400"}`} />
                  <span>AgentMail Room ({activeCase.correspondence.length})</span>
                  {activeCase.status === "in_negotiation" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("letter")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "letter"
                      ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === "letter" ? "text-slate-900" : "text-slate-400"}`} />
                  <span>Statutory Demand Notice</span>
                </button>

                <button
                  onClick={() => setActiveTab("transparency")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "transparency"
                      ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Search className={`w-3.5 h-3.5 ${activeTab === "transparency" ? "text-sky-700" : "text-slate-400"}`} />
                  <span>Chargemaster Intel</span>
                </button>

                <button
                  onClick={() => setActiveTab("proof")}
                  className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "proof"
                      ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "proof" ? "text-emerald-700" : "text-slate-400"}`} />
                  <span>Proof &amp; Receipts (4)</span>
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" />
                <strong className="text-emerald-900 font-bold tracking-wide">LIVE DEMO:</strong>
                <span className="text-emerald-700">Toggle any charge → recalculates instantly</span>
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
      <NewBillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuditComplete={(newCaseId) => {
          setSelectedCaseId(newCaseId);
          setViewMode("cockpit");
          setActiveTab("audit");
          setIsModalOpen(false);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-bold text-slate-900">EXCISE</span>
            <span>·</span>
            <span>Convex All Gas Hackathon</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Static Hosting on Convex</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Powered by Convex, Firecrawl, AgentMail, &amp; OpenAI</span>
            <a
              href="https://github.com/A-Raphie/excise"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 flex items-center gap-1 transition-colors font-medium"
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
