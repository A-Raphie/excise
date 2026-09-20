"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  Mail,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AgentMailChamberProps {
  currentCase: SampleCase;
}

export function AgentMailChamber({ currentCase }: AgentMailChamberProps) {
  const { sendDispute, simulateResponse } = useCaseEngine();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const handleSend = async () => {
    setLoadingAction("send");
    try {
      await sendDispute(currentCase.id);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSimulate = async (
    type: "full_acceptance" | "counter_offer" | "unbundling_concession"
  ) => {
    setLoadingAction(type);
    try {
      await simulateResponse(currentCase.id, type);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-[#090d13] border border-white/[0.08] rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-5 border-b border-white/[0.06] bg-[#0b1017] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                AgentMail Dispute Negotiation Room
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Dedicated Case Address: <span className="text-purple-300 font-medium">{currentCase.caseInbox}</span>
            </p>
          </div>
        </div>

        {/* Webhook JSON inspector trigger */}
        <button
          onClick={() => setShowWebhookModal(true)}
          className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Terminal className="w-3 h-3 text-purple-400" />
          <span>Webhook Spec</span>
        </button>
      </div>

      {/* Simulator Action Toolbar */}
      <div className="px-4 py-2.5 bg-black/40 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider">
          Demo Simulation Controls:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Dispatch Outbound */}
          <button
            onClick={handleSend}
            disabled={loadingAction !== null}
            className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Send className="w-3 h-3" />
            <span>{loadingAction === "send" ? "Dispatching..." : "Send Outbound Dispute"}</span>
          </button>

          {/* Simulate Unbundling Concession */}
          <button
            onClick={() => handleSimulate("unbundling_concession")}
            disabled={loadingAction !== null}
            className="px-3 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-amber-500/40 text-amber-300 disabled:opacity-50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Simulate Concession (-$1,850)</span>
          </button>

          {/* Simulate Full Acceptance */}
          <button
            onClick={() => handleSimulate("full_acceptance")}
            disabled={loadingAction !== null}
            className="px-3 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-emerald-500/40 text-emerald-300 disabled:opacity-50 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Simulate Full Settlement</span>
          </button>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto max-h-[500px]">
        {currentCase.correspondence.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-mono text-xs">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No correspondence dispatched yet. Click &quot;Send Outbound Dispute&quot; to initiate formal demand.
          </div>
        ) : (
          currentCase.correspondence.map((msg) => {
            const isInbound = msg.direction === "inbound";
            return (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border text-xs font-mono transition-all ${
                  isInbound
                    ? "bg-purple-500/[0.03] border-purple-500/30 text-purple-100 mr-2 sm:mr-8"
                    : "bg-white/[0.02] border-white/[0.08] text-slate-200 ml-2 sm:ml-8"
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06] mb-2">
                  <div className="flex items-center gap-1.5">
                    {isInbound ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                        <ArrowDownLeft className="w-3 h-3" />
                        INBOUND FROM HOSPITAL
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                        <ArrowUpRight className="w-3 h-3" />
                        OUTBOUND FROM EXCISE
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px]">
                      {isInbound ? msg.from : `To: ${msg.to}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Subject & Summary */}
                <div className="font-semibold text-white mb-1 text-xs font-sans">
                  {msg.subject}
                </div>
                <p className="text-slate-400 text-[11px] font-sans mb-2.5">
                  {msg.summary}
                </p>

                {/* Body Content */}
                <div className="bg-black/40 p-3 rounded border border-white/[0.04] text-slate-300 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                  {msg.body}
                </div>

                {/* Proposed Financial Adjustment Pill */}
                {msg.proposedAdjustment !== undefined && (
                  <div className="mt-2.5 flex items-center justify-end">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      Revised Settlement: ${msg.proposedAdjustment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Webhook Spec Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#090d13] border border-white/[0.1] rounded-lg max-w-xl w-full p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  AgentMail Inbound Webhook Specification
                </h3>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 font-sans mb-3 text-xs">
              Convex registers an HTTP action at{" "}
              <code className="px-1 py-0.5 rounded bg-white/[0.06] text-purple-300">
                POST /api/agentmail/webhook
              </code>
              . When hospital financial services responds to the case address, AgentMail delivers this signed payload, triggering reactive database mutation:
            </p>

            <pre className="p-3 rounded bg-black/60 border border-white/[0.06] text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "event": "message.received",
  "inbox_id": "${currentCase.caseInbox}",
  "data": {
    "from": "disputes@memorialregional.org",
    "to": "${currentCase.caseInbox}",
    "subject": "RE: Statutory Dispute - Account #${currentCase.accountNumber}",
    "text": "Conceding CPT 99070 unbundled tray fee (-$1,850.00). Revised balance $3,735.00."
  }
}`}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-3 py-1.5 rounded bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
