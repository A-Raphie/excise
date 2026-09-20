"use client";

import React, { useState } from "react";
import { SampleCase } from "@/lib/sampleData";
import { useCaseEngine } from "./ConvexClientProvider";
import {
  Mail,
  Send,
  Terminal,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
  ExternalLink,
} from "lucide-react";
import { NegotiationStepper } from "./ui/negotiation-stepper";
import { DisputeCard } from "./ui/approval-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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

  // Determine negotiation step index
  const hasInbound = currentCase.correspondence.some((m) => m.direction === "inbound");
  const isSettled = currentCase.status === "settled";
  const stepIndex = isSettled ? 3 : hasInbound ? 2 : currentCase.correspondence.length > 0 ? 1 : 0;

  return (
    <div className="bg-[#090d13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm flex flex-col space-y-4 p-4 sm:p-5">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/35 flex items-center justify-center text-purple-300">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Autonomous Dispute Negotiation Chamber
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live AgentMail Listener</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Case Inbox:</span>
              <span className="text-purple-300 font-medium">{currentCase.caseInbox}</span>
            </div>
          </div>
        </div>

        {/* Top Right Status & Webhook Spec */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>Webhook Spec</span>
          </button>
        </div>
      </div>

      {/* Progress Track: Negotiation Stepper */}
      <NegotiationStepper currentStepIndex={stepIndex} />

      {/* Floating Evaluator Demo Controller */}
      <div className="p-3 rounded-lg bg-purple-500/[0.04] border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="font-semibold">Evaluator Fast-Forward:</span>
          <span className="text-slate-400 hidden md:inline">Trigger live hospital concessions without waiting 14-day SLA</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentCase.correspondence.length === 0 && (
            <Button
              size="sm"
              variant="primary"
              disabled={loadingAction !== null}
              onClick={handleSend}
              className="text-xs"
            >
              <Send className="w-3 h-3" />
              <span>{loadingAction === "send" ? "Dispatching..." : "Send Statutory Dispute"}</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            disabled={loadingAction !== null}
            onClick={() => handleSimulate("unbundling_concession")}
            className="text-xs border-amber-500/30 text-amber-300 hover:border-amber-500/50"
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Simulate Concession (-$1,850)</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            disabled={loadingAction !== null}
            onClick={() => handleSimulate("full_acceptance")}
            className="text-xs border-emerald-500/30 text-emerald-300 hover:border-emerald-500/50"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Simulate Full Settlement</span>
          </Button>
        </div>
      </div>

      {/* Formatted Dispute Cards Timeline */}
      <div className="space-y-4">
        {currentCase.correspondence.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-black/20 border border-white/[0.04] text-slate-400 font-mono text-xs space-y-2">
            <Mail className="w-8 h-8 mx-auto opacity-30 text-slate-500" />
            <div className="text-slate-300 font-medium">No active correspondence yet</div>
            <p className="text-slate-500 max-w-sm mx-auto">
              Click &quot;Send Statutory Dispute&quot; above to dispatch the legal notice citing 45 CFR § 149 via AgentMail.
            </p>
          </div>
        ) : (
          currentCase.correspondence.map((msg) => {
            const isInbound = msg.direction === "inbound";

            if (isInbound) {
              const isSettlement = msg.proposedAdjustment && msg.proposedAdjustment <= 3735;

              return (
                <DisputeCard
                  key={msg.id}
                  type={isSettlement ? "final_settlement" : "inbound_concession"}
                  sender={`${currentCase.hospitalName} (Revenue Integrity Operations)`}
                  recipient="Excise Legal Dispute Engine"
                  timestamp={new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  subject={msg.subject}
                  statusBadge={isSettlement ? "SETTLEMENT ACCEPTED IN FULL" : "PARTIAL CONCESSION OFFERED"}
                  statusVariant={isSettlement ? "emerald" : "amber"}
                  financialDelta={{
                    finalAmount: msg.proposedAdjustment,
                    concededAmount: currentCase.totalBilled - (msg.proposedAdjustment || currentCase.totalBilled),
                    breakdown: [
                      { item: "CPT 99070 (Suture Tray)", delta: "Reduced to $0.00 (-$1,850.00)" },
                      { item: "CPT 70450 (CT Head)", delta: "Recalculated to $650.00 (-$4,750.00)" },
                      { item: "CPT 99285 (ED Visit)", delta: "Adjusted to Level 4 Facility Fee" },
                    ],
                  }}
                  summaryPoints={[
                    "Hospital Revenue Integrity conceded improper separate billing of surgical trays.",
                    "CT Head non-contrast charges adjusted to federal price transparency self-pay schedule.",
                    `Revised binding balance tendered: $${(msg.proposedAdjustment || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}.`,
                  ]}
                  fullBody={msg.body}
                />
              );
            }

            return (
              <DisputeCard
                key={msg.id}
                type="outbound_dispatch"
                sender="Excise Legal Dispute Agent"
                recipient={`${currentCase.hospitalName} <disputes@hospital.org>`}
                timestamp={new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                subject={msg.subject}
                statusBadge="STATUTORY DISPUTE SERVED (45 CFR § 149)"
                statusVariant="purple"
                financialDelta={{
                  originalBilled: currentCase.totalBilled,
                  excisedReduction: currentCase.totalExcised,
                  finalAmount: currentCase.totalBilled - currentCase.totalExcised,
                  breakdown: [
                    { item: "Challenged Gross Charge", delta: `$${currentCase.totalBilled.toLocaleString("en-US")}` },
                    { item: "Excised Non-Compliant Items", delta: `-$${currentCase.totalExcised.toLocaleString("en-US")}` },
                    { item: "Tendered Settlement Offer", delta: `$${(currentCase.totalBilled - currentCase.totalExcised).toLocaleString("en-US")}` },
                  ],
                }}
                summaryPoints={[
                  "Itemized billing compared against hospital published Machine-Readable File (MRF).",
                  "Statutory contest citing No Surprises Act (45 C.F.R. § 149) and CMS Hospital Transparency (45 CFR § 180).",
                  "Enforces federal stay on third-party collections during active statutory dispute.",
                ]}
                fullBody={msg.body}
              />
            );
          })
        )}
      </div>

      {/* Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0b1017] border border-white/[0.1] rounded-xl max-w-xl w-full p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-white">AgentMail Inbound Webhook Specification</span>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 font-sans text-xs">
              Convex registers an HTTP action endpoint at <code className="text-purple-300">/api/agentmail/webhook</code> that processes incoming hospital emails in real time:
            </p>

            <pre className="p-3.5 rounded bg-black/60 border border-white/[0.06] text-purple-200 text-[11px] overflow-x-auto leading-relaxed">
{`POST /api/agentmail/webhook HTTP/1.1
Host: your-convex-deployment.convex.site
Content-Type: application/json

{
  "event": "message.received",
  "inbox": "${currentCase.caseInbox}",
  "message": {
    "from": "disputes@memorialregional.org",
    "subject": "RE: Formal Dispute #MR-9920148-B",
    "text": "Concession accepted. CPT 99070 voided ($0.00)...",
    "timestamp": 1726819200000
  }
}`}
            </pre>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setShowWebhookModal(false)}>
                Close Spec
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
