"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  Mail,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  Clock,
} from "lucide-react";

interface AgentMailChamberProps {
  currentCase: SampleCase;
}

export function AgentMailChamber({ currentCase }: AgentMailChamberProps) {
  const { sendDispute, simulateResponse } = useCaseEngine();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copiedInbox, setCopiedInbox] = useState(false);
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

  const copyInbox = () => {
    navigator.clipboard.writeText(currentCase.caseInbox);
    setCopiedInbox(true);
    setTimeout(() => setCopiedInbox(false), 2000);
  };

  return (
    <div className="bg-[#0b1017] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:px-6 border-b border-slate-800/90 bg-[#0d131d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                AgentMail Dispute Room
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Dedicated Case Inbox:{" "}
              <button
                onClick={copyInbox}
                className="text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-1"
                title="Click to copy"
              >
                {currentCase.caseInbox}
                {copiedInbox ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </p>
          </div>
        </div>

        {/* Webhook JSON inspector trigger */}
        <button
          onClick={() => setShowWebhookModal(true)}
          className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span>Webhook Spec</span>
        </button>
      </div>

      {/* Simulator Action Toolbar for Judges */}
      <div className="p-3 bg-[#080d14] border-b border-slate-800/80 px-4 sm:px-6">
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Judge Test Bench: Trigger Outbound / Inbound Events</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Dispatch Outbound */}
          <button
            onClick={handleSend}
            disabled={loadingAction !== null}
            className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>{loadingAction === "send" ? "Dispatching..." : "Send Outbound Dispute"}</span>
          </button>

          {/* Simulate Unbundling Concession */}
          <button
            onClick={() => handleSimulate("unbundling_concession")}
            disabled={loadingAction !== null}
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-amber-800/60 hover:border-amber-700 text-amber-300 disabled:opacity-50 text-xs font-mono flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Simulate Concession (-$1,850)</span>
          </button>

          {/* Simulate Full Acceptance */}
          <button
            onClick={() => handleSimulate("full_acceptance")}
            disabled={loadingAction !== null}
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-emerald-800/60 hover:border-emerald-700 text-emerald-300 disabled:opacity-50 text-xs font-mono flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Simulate Full Settlement</span>
          </button>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[500px]">
        {currentCase.correspondence.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-mono text-xs">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No correspondence dispatched yet. Click &quot;Send Outbound Dispute&quot; to initiate.
          </div>
        ) : (
          currentCase.correspondence.map((msg) => {
            const isInbound = msg.direction === "inbound";
            return (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border text-xs font-mono transition-all ${
                  isInbound
                    ? "bg-purple-950/20 border-purple-800/40 text-purple-100 mr-4 sm:mr-10"
                    : "bg-slate-900/80 border-slate-800 text-slate-200 ml-4 sm:ml-10"
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/60 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    {isInbound ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded">
                        <ArrowDownLeft className="w-3 h-3" />
                        INBOUND FROM HOSPITAL
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                        <ArrowUpRight className="w-3 h-3" />
                        OUTBOUND FROM EXCISE
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px]">
                      {isInbound ? msg.from : `To: ${msg.to}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
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
                <div className="font-semibold text-slate-100 mb-1 text-sm font-sans">
                  {msg.subject}
                </div>
                <p className="text-slate-400 text-xs font-sans mb-3 italic">
                  {msg.summary}
                </p>

                {/* Body Content */}
                <div className="bg-[#080d14] p-3 rounded-lg border border-slate-800/80 text-slate-300 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                  {msg.body}
                </div>

                {/* Proposed Financial Adjustment Pill */}
                {msg.proposedAdjustment !== undefined && (
                  <div className="mt-2.5 flex items-center justify-end">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300">
                      Settlement Amount: ${msg.proposedAdjustment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1017] border border-slate-700 rounded-xl max-w-xl w-full p-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">
                  AgentMail Inbound Webhook Specification
                </h3>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 font-sans mb-3">
              Convex registers an HTTP action at{" "}
              <code className="px-1 py-0.5 rounded bg-slate-800 text-purple-300">
                POST /api/agentmail/webhook
              </code>
              . When hospital financial services responds to the case address, AgentMail delivers this payload, triggering reactive database mutation:
            </p>

            <pre className="p-3 rounded-lg bg-[#06090e] border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
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
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
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
