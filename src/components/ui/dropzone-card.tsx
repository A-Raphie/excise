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
            ? "border-emerald-600 bg-emerald-50 scale-[1.01]"
            : "border-slate-300 bg-slate-50/70 hover:border-slate-400 hover:bg-white"
        )}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mx-auto group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <Sparkles className="w-6 h-6 animate-spin text-emerald-700" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-950 tracking-tight">
              {isProcessing ? "Scanning Chargemaster & CPT Codes..." : "Drop your itemized hospital bill"}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Supports PDF statement, photo, or UB-04 clinical ledger
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Log HIPAA Safe</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto CPT Parsing</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
          <span className="text-slate-600 font-semibold uppercase tracking-wider">
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
                className="group relative rounded-2xl border border-slate-200 bg-white hover:border-slate-300 p-4.5 transition-all cursor-pointer shadow-xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-950 text-xs group-hover:text-emerald-700 transition-colors">
                      {cs.title}
                    </span>
                    <Badge variant="emerald">-{savingsPercent}%</Badge>
                  </div>

                  <div className="space-y-1 text-[11px] font-mono text-slate-600 mb-3">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Building2 className="w-3 h-3 text-indigo-600" />
                      <span className="truncate font-semibold">{cs.facility}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <User className="w-3 h-3" />
                      <span>{cs.patient}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 mb-3">
                    <div className="text-[10px] text-amber-800 font-mono font-bold mb-1">
                      VIOLATION DISCOVERED:
                    </div>
                    <div className="text-[11px] text-slate-700 font-sans leading-snug">
                      {cs.highlightViolation}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Settlement Tender</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-950 tabular-nums">
                        ${cs.tenderedSettlement.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </span>
                      <span className="text-[11px] text-slate-400 line-through tabular-nums decoration-rose-400">
                        ${cs.originalCharge.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-slate-950 group-hover:text-white flex items-center justify-center text-slate-600 transition-all">
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
