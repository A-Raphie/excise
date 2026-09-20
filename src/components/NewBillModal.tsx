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
  const [auditStep, setAuditStep] = useState("");

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
      setAuditStep("Connecting to Firecrawl to crawl hospital chargemaster...");
      await new Promise((r) => setTimeout(r, 600));

      setAuditStep("Analyzing CPT codes for upcoding & unbundling with OpenAI...");
      await new Promise((r) => setTimeout(r, 700));

      setAuditStep("Provisioning dedicated AgentMail case inbox & drafting demand...");
      await new Promise((r) => setTimeout(r, 600));

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
      setAuditStep("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1017] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isAuditing}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Forensic Hospital Bill Intake
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Enter bill details or pick a real hospital test case to trigger live chargemaster audit.
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mb-5">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Pre-loaded Authentic Hospital Bills
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_BILLS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  selectedPreset === preset.id
                    ? "bg-emerald-950/40 border-emerald-500/60 text-white shadow-sm shadow-emerald-950"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="font-semibold text-white">{preset.title}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {preset.hospitalName.split(" ")[0]} • ${preset.totalBilled.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleRunAudit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Hospital Facility Name</span>
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Patient Full Name</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>Hospital Account Number</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date of Medical Service</span>
              </label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Total Billed Amount ($)</span>
              </label>
              <input
                type="number"
                value={totalBilled}
                onChange={(e) => setTotalBilled(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>CPT Codes (comma-separated)</span>
              </label>
              <input
                type="text"
                value={cptCodes}
                onChange={(e) => setCptCodes(e.target.value)}
                placeholder="99285, 99070, 70450"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Line Item Billed Amounts ($, matching CPT codes)
            </label>
            <input
              type="text"
              value={amounts}
              onChange={(e) => setAmounts(e.target.value)}
              placeholder="4850, 1850, 5400, 450, 2300"
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {isAuditing ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{auditStep}</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 font-mono">
                Scrapes hospital chargemaster MRF and analyzes NCCI unbundling.
              </div>
            )}

            <button
              type="submit"
              disabled={isAuditing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-medium text-xs shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Run Autonomous Forensic Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
