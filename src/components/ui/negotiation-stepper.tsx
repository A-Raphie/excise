// Harvested from: https://beui.dev/components/motion/adaptive-stepper.md & https://coss.com/ui
// Re-expressed on semantic tokens

import React from "react";
import { Check, Clock, AlertTriangle, FileSpreadsheet, Mail, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  label: string;
  sublabel?: string;
  status: "completed" | "current" | "upcoming";
}

interface NegotiationStepperProps {
  currentStepIndex: number;
  className?: string;
}

export function NegotiationStepper({ currentStepIndex, className }: NegotiationStepperProps) {
  const steps: StepItem[] = [
    {
      id: "audit",
      label: "1. Bill Audited",
      sublabel: "CPT violations detected",
      status: currentStepIndex > 0 ? "completed" : currentStepIndex === 0 ? "current" : "upcoming",
    },
    {
      id: "demand",
      label: "2. Statutory Demand Sent",
      sublabel: "45 CFR § 149 legal notice",
      status: currentStepIndex > 1 ? "completed" : currentStepIndex === 1 ? "current" : "upcoming",
    },
    {
      id: "concession",
      label: "3. Hospital Concession",
      sublabel: "AgentMail dispute inbox",
      status: currentStepIndex > 2 ? "completed" : currentStepIndex === 2 ? "current" : "upcoming",
    },
    {
      id: "settled",
      label: "4. Final Settlement",
      sublabel: "Cash schedule confirmed",
      status: currentStepIndex >= 3 ? "completed" : "upcoming",
    },
  ];

  return (
    <div className={cn("p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2.5 p-2 rounded-lg transition-all",
                isCurrent
                  ? "bg-white border border-emerald-500/40 shadow-xs"
                  : isCompleted
                  ? "bg-emerald-50/60 border border-emerald-200/70"
                  : "opacity-50 border border-transparent"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : isCurrent
                    ? "bg-emerald-600 text-white font-bold animate-pulse shadow-xs"
                    : "bg-slate-200 text-slate-500 border border-slate-300"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <div className="min-w-0">
                <div
                  className={cn(
                    "font-medium truncate text-xs",
                    isCurrent ? "text-emerald-900 font-bold" : isCompleted ? "text-slate-800" : "text-slate-500"
                  )}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{step.sublabel}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
