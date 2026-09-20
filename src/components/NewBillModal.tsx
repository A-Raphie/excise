"use client";

import React, { useState } from "react";
import { PRESET_BILLS } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  FilePlus,
  Zap,
  Building2,
  User,
  Hash,
  Calendar,
  DollarSign,
  Search,
  Sparkles,
  Loader2,
  X,
  UploadCloud,
  CheckCircle2,
  Check,
} from "lucide-react";

interface NewBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewBillModal({ isOpen, onClose }: NewBillModalProps) {
  const { auditNewBill } = useCaseEngine();

  const [selectedPreset, setSelectedPreset] = useState<string>("preset-er");
  const [hospitalName, setHospitalName] = useState("Memorial Regional Medical Center");
  const [patientName, setPatientName] = useState("Marcus Vance");
  const [accountNumber, setAccountNumber] = useState("MR-9920148-B");
  const [billDate, setBillDate] = useState("2026-08-14");
  const [totalBilled, setTotalBilled] = useState(14850);
  const [cptCodes, setCptCodes] = useState("99285, 99070, 70450, 36415, 12002");
  const [amounts, setAmounts] = useState("4850, 1850, 5400, 450, 2300");

  const [isAuditing, setIsAuditing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = PRESET_BILLS.find((p) => p.id === presetId);
    if (preset) {
      setHospitalName(preset.hospitalName);
      setPatientName(preset.patientName);
      setAccountNumber(preset.accountNumber);
      setBillDate(preset.billDate);
      setTotalBilled(preset.totalBilled);
      setCptCodes(preset.cptCodes.join(", "));
      setAmounts(preset.amounts.join(", "));
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);

    try {
      setCurrentStepIndex(1); // Crawling Firecrawl
      await new Promise((r) => setTimeout(r, 650));

      setCurrentStepIndex(2); // OpenAI CPT Audit
      await new Promise((r) => setTimeout(r, 750));

      setCurrentStepIndex(3); // Provisioning AgentMail Inbox
      await new Promise((r) => setTimeout(r, 650));

      const parsedCpts = cptCodes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedAmounts = amounts
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      await auditNewBill({
        hospitalName,
        patientName,
        accountNumber,
        billDate,
        totalBilled: Number(totalBilled),
        cptCodes: parsedCpts,
        amounts: parsedAmounts,
      });

      onClose();
    } finally {
      setIsAuditing(false);
      setCurrentStepIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1017] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-8 font-mono text-xs">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isAuditing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08] mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Forensic Hospital Bill Intake Workstation
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Select an authentic hospital test specimen or input an itemized statement to execute real-time statutory audit.
            </p>
          </div>
        </div>

        {/* Preset Selector Cards */}
        <div className="mb-5 space-y-2">
          <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Select Authentic Hospital Case Study:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_BILLS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-md shadow-emerald-950/40"
                      : "bg-[#080c13] border-white/[0.06] hover:border-white/[0.15] text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">{preset.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {preset.hospitalName.split(" ")[0]}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                    ${preset.totalBilled.toLocaleString()} Billed
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropzone Quick Touch */}
        <div className="mb-4 p-3 rounded-xl border border-dashed border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex items-center justify-center gap-2.5 text-slate-400 cursor-pointer">
          <UploadCloud className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px]">
            Or drag &amp; drop an itemized PDF / UB-04 clinical statement to auto-extract CPT codes
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleRunAudit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Hospital Facility Name</span>
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Patient Full Name</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>Hospital Account / Docket #</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date of Medical Service</span>
              </label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Total Gross Billed ($)</span>
              </label>
              <input
                type="number"
                value={totalBilled}
                onChange={(e) => setTotalBilled(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5 text-[11px]">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>CPT Codes (comma-separated)</span>
              </label>
              <input
                type="text"
                value={cptCodes}
                onChange={(e) => setCptCodes(e.target.value)}
                placeholder="99285, 99070, 70450"
                required
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-[11px]">
              Line Item Billed Amounts ($, matching CPT codes)
            </label>
            <input
              type="text"
              value={amounts}
              onChange={(e) => setAmounts(e.target.value)}
              placeholder="4850, 1850, 5400, 450, 2300"
              required
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-white focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Action Footer & Autonomous Scanning Animation */}
          <div className="pt-4 border-t border-white/[0.08]">
            {isAuditing ? (
              <div className="p-4 rounded-xl bg-black/80 border border-emerald-500/40 space-y-3 font-mono text-xs shadow-lg shadow-emerald-950/20">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <span>Executing Autonomous Audit Pipeline</span>
                  <span className="text-emerald-400 font-mono">Stage {currentStepIndex}/3</span>
                </div>

                {/* Step 1: Firecrawl */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 1 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                      ✓
                    </span>
                  ) : currentStepIndex === 1 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] shrink-0">
                      1
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 1
                        ? "text-cyan-300 font-bold"
                        : currentStepIndex > 1
                        ? "text-slate-300"
                        : "text-slate-500"
                    }
                  >
                    Crawling Firecrawl for Hospital Machine-Readable File (MRF)...
                  </span>
                </div>

                {/* Step 2: OpenAI */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 2 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                      ✓
                    </span>
                  ) : currentStepIndex === 2 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] shrink-0">
                      2
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 2
                        ? "text-amber-300 font-bold"
                        : currentStepIndex > 2
                        ? "text-slate-300"
                        : "text-slate-500"
                    }
                  >
                    OpenAI CPT Audit: Checking AMA Guidelines &amp; NCCI Unbundling...
                  </span>
                </div>

                {/* Step 3: AgentMail */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 3 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">
                      ✓
                    </span>
                  ) : currentStepIndex === 3 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] shrink-0">
                      3
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 3
                        ? "text-purple-300 font-bold"
                        : currentStepIndex > 3
                        ? "text-slate-300"
                        : "text-slate-500"
                    }
                  >
                    Provisioning AgentMail Dispute Inbox &amp; Serving Statutory Demand...
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-mono">
                  Scrapes hospital MRF cash prices and strikes non-compliant charges.
                </div>

                <button
                  type="submit"
                  disabled={isAuditing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Run Autonomous Forensic Audit</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
