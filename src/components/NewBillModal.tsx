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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative my-8 font-mono text-xs text-slate-900">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isAuditing}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
              Forensic Hospital Bill Intake Workstation
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Select an authentic hospital test specimen or input an itemized statement to execute real-time statutory audit.
            </p>
          </div>
        </div>

        {/* Preset Selector Cards */}
        <div className="mb-5 space-y-2">
          <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Select Authentic Hospital Case Study:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESET_BILLS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              const thumbnail =
                preset.id === "preset-imaging"
                  ? "/images/radiology-audit-specimen.jpg"
                  : "/images/hospital-bill-specimen.jpg";

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-50 border-2 border-emerald-600 text-slate-950 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-950 text-xs truncate max-w-[85%]">{preset.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>

                  <div className="w-full h-16 rounded-lg overflow-hidden border border-slate-200 mb-2 relative">
                    <img
                      src={thumbnail}
                      alt={preset.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute bottom-1 left-2 text-[9px] font-mono text-emerald-300 font-bold">
                      ${preset.totalBilled.toLocaleString()} Billed
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate font-medium">
                    {preset.hospitalName.split(" ")[0]} · Authentic Specimen
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropzone Quick Touch */}
        <div className="mb-5 p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-center gap-2.5 text-slate-600 cursor-pointer">
          <UploadCloud className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px] font-medium">
            Or drag &amp; drop an itemized PDF / UB-04 clinical statement to auto-extract CPT codes
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleRunAudit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Hospital Facility Name</span>
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Patient Full Name</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Hospital Account / Docket #</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date of Medical Service</span>
              </label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Gross Billed ($)</span>
              </label>
              <input
                type="number"
                value={totalBilled}
                onChange={(e) => setTotalBilled(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 flex items-center gap-1.5 text-[11px] font-medium">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>CPT Codes (comma-separated)</span>
              </label>
              <input
                type="text"
                value={cptCodes}
                onChange={(e) => setCptCodes(e.target.value)}
                placeholder="99285, 99070, 70450"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 text-[11px] font-medium">
              Line Item Billed Amounts ($, matching CPT codes)
            </label>
            <input
              type="text"
              value={amounts}
              onChange={(e) => setAmounts(e.target.value)}
              placeholder="4850, 1850, 5400, 450, 2300"
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white text-xs shadow-2xs"
            />
          </div>

          {/* Action Footer & Autonomous Scanning Animation */}
          <div className="pt-4 border-t border-slate-200">
            {isAuditing ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-300 space-y-3 font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                  <span>Executing Autonomous Audit Pipeline</span>
                  <span className="text-emerald-800 font-mono">Stage {currentStepIndex}/3</span>
                </div>

                {/* Step 1: Firecrawl */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 1 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      ✓
                    </span>
                  ) : currentStepIndex === 1 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-sky-600 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      1
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 1
                        ? "text-sky-800 font-bold"
                        : currentStepIndex > 1
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  >
                    Crawling Firecrawl for Hospital Machine-Readable File (MRF)...
                  </span>
                </div>

                {/* Step 2: OpenAI */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 2 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      ✓
                    </span>
                  ) : currentStepIndex === 2 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-600 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      2
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 2
                        ? "text-amber-800 font-bold"
                        : currentStepIndex > 2
                        ? "text-slate-800"
                        : "text-slate-400"
                    }
                  >
                    OpenAI CPT Audit: Checking AMA Guidelines &amp; NCCI Unbundling...
                  </span>
                </div>

                {/* Step 3: AgentMail */}
                <div className="flex items-center gap-2.5">
                  {currentStepIndex > 3 ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      ✓
                    </span>
                  ) : currentStepIndex === 3 ? (
                    <Loader2 className="w-5 h-5 animate-spin text-purple-600 shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] shrink-0 font-bold">
                      3
                    </span>
                  )}
                  <span
                    className={
                      currentStepIndex === 3
                        ? "text-purple-800 font-bold"
                        : currentStepIndex > 3
                        ? "text-slate-800"
                        : "text-slate-400"
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
