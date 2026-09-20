// Harvested from: https://reui.io/components & https://beui.dev/components/motion/tilt-card.md
// Re-expressed on semantic tokens

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export interface DemoCaseStudy {
  id: string;
  title: string;
  facility: string;
  patient: string;
  originalCharge: number;
  excisedSavings: number;
  tenderedSettlement: number;
  highlightViolation: string;
}

interface DropzoneCardProps {
  onSelectCase: (caseId: string) => void;
  onUploadMock?: (fileName: string) => void;
  caseStudies: DemoCaseStudy[];
  className?: string;
}

export function DropzoneCard({
  onSelectCase,
  onUploadMock,
  caseStudies,
  className,
}: DropzoneCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSelectCase("case-marcus-er");
    }, 800);
  };

  const handleSimulatedUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSelectCase("case-marcus-er");
    }, 700);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* File Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSimulatedUpload}
        className={cn(
          "relative group border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer",
          isDragging
            ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
            : "border-white/[0.12] bg-[#090d14] hover:border-emerald-500/40 hover:bg-white/[0.02]"
        )}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <Sparkles className="w-6 h-6 animate-spin text-emerald-300" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              {isProcessing ? "Scanning Chargemaster & CPT Codes..." : "Drop your itemized hospital bill"}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Supports PDF statement, photo, or UB-04 clinical ledger
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Log HIPAA Safe</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Auto CPT Parsing</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>45 CFR § 149 Compliance</span>
            </span>
          </div>

          <div className="pt-1">
            <Button size="sm" variant="outline" className="text-xs">
              Select Document from Computer
            </Button>
          </div>
        </div>
      </div>

      {/* Or select an authentic case study */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">
            Or select an authentic hospital case study:
          </span>
          <span className="text-slate-500 text-[11px]">One-click instant demonstration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {caseStudies.map((cs) => {
            const savingsPercent = Math.round((cs.excisedSavings / cs.originalCharge) * 100);

            return (
              <div
                key={cs.id}
                onClick={() => onSelectCase(cs.id)}
                className="group relative rounded-xl border border-white/[0.08] bg-[#0a0f16] hover:border-emerald-500/50 hover:bg-[#0c131d] p-4.5 transition-all cursor-pointer shadow-sm hover:shadow-emerald-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-white text-xs group-hover:text-emerald-300 transition-colors">
                      {cs.title}
                    </span>
                    <Badge variant="emerald">-{savingsPercent}%</Badge>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-400 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Building2 className="w-3 h-3 text-cyan-400" />
                      <span className="truncate">{cs.facility}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3 h-3" />
                      <span>{cs.patient}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] mb-3">
                    <div className="text-[10px] text-amber-400 font-mono font-medium mb-1">
                      VIOLATION DISCOVERED:
                    </div>
                    <div className="text-[11px] text-slate-300 font-sans leading-snug">
                      {cs.highlightViolation}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Settlement Tender</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-white tabular-nums">
                        ${cs.tenderedSettlement.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </span>
                      <span className="text-[11px] text-slate-500 line-through tabular-nums">
                        ${cs.originalCharge.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white/[0.04] group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center text-slate-400 transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
