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
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Zap,
  Eye,
} from "lucide-react";
import { NegotiationStepper } from "./ui/negotiation-stepper";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AgentMailChamberProps {
  currentCase: SampleCase;
}

export function AgentMailChamber({ currentCase }: AgentMailChamberProps) {
  const { sendDispute, simulateResponse } = useCaseEngine();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showAccordImageModal, setShowAccordImageModal] = useState(false);
  const [copiedInbox, setCopiedInbox] = useState(false);
  const [expandedTransmissionId, setExpandedTransmissionId] = useState<string | null>(null);

  const handleCopyInbox = () => {
    navigator.clipboard.writeText(currentCase.caseInbox);
    setCopiedInbox(true);
    setTimeout(() => setCopiedInbox(false), 2000);
  };

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
    <div className="bg-[#080c13] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm flex flex-col space-y-4 p-4 sm:p-5">
      {/* 1. Chamber Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/35 flex items-center justify-center text-purple-300 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Autonomous Dispute Negotiation Chamber
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live AgentMail Listener</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Dedicated Inbox:</span>
              <button
                onClick={handleCopyInbox}
                className="text-purple-300 font-medium hover:text-purple-200 transition-colors inline-flex items-center gap-1 cursor-pointer bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20"
                title="Click to copy case inbox"
              >
                <span>{currentCase.caseInbox}</span>
                {copiedInbox ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Webhook Spec</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Negotiation Stepper (At-a-Glance Lifecycle) */}
      <NegotiationStepper currentStepIndex={stepIndex} />

      {/* 3. Fast-Forward Simulator Strip */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/30 via-[#0c101a] to-purple-950/20 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="font-semibold">Fast-Forward Hospital Actions:</span>
          <span className="text-slate-400 hidden lg:inline">
            Skip 14-day SLA to test real-time concession parsing
          </span>
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
              <span>{loadingAction === "send" ? "Serving..." : "Serve Dispute Notice"}</span>
            </Button>
          )}

          <button
            disabled={loadingAction !== null}
            onClick={() => handleSimulate("unbundling_concession")}
            className="px-2.5 py-1 rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Simulate Supply Concession (-$1,850)</span>
          </button>

          <button
            disabled={loadingAction !== null}
            onClick={() => handleSimulate("full_acceptance")}
            className="px-2.5 py-1 rounded border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Simulate Full Settlement ($3,735)</span>
          </button>
        </div>
      </div>

      {/* 4. BILATERAL SETTLEMENT ACCORD (When Case is Settled) */}
      {isSettled && (
        <div className="rounded-xl border-2 border-emerald-500/50 bg-gradient-to-b from-[#091712] via-[#071018] to-[#070c12] p-5 font-mono text-xs shadow-xl shadow-emerald-950/30 space-y-4">
          {/* Accord Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-500/25">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-emerald-300 tracking-wider uppercase text-sm block">
                  Bilateral Settlement Accord Executed
                </span>
                <span className="text-[11px] text-slate-400">
                  Enforced under federal No Surprises Act (45 C.F.R. § 149) &amp; CMS Transparency rules
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
                Convex State Finality: #tx_8f9a2d
              </span>
            </div>
          </div>

          {/* Core Financial Adjudication (At-a-Glance Numbers) */}
          <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Final Adjudicated Balance
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-sm font-semibold text-slate-500 line-through decoration-rose-500/80">
                    ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    ${(currentCase.finalSettlement ?? 3735).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg font-bold text-xs text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 shadow-sm">
                  -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} (-74.8% Excised)
                </span>
              </div>
            </div>

            {/* WAS vs NOW Adjudicated Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-[11px]">
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-400">CPT 99070 (Suture Tray):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-500 decoration-rose-500/70">$1,850.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-white font-bold">$0.00</span>
                  <span className="text-emerald-400 font-semibold">(-100%)</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-400">CPT 70450 (Head CT Scan):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-500 decoration-rose-500/70">$5,400.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-white font-bold">$650.00</span>
                  <span className="text-emerald-400 font-semibold">(-$4,750)</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-400">CPT 99285 (ER Acuity):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-500 decoration-rose-500/70">$7,600.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-white font-bold">$3,085.00</span>
                  <span className="text-emerald-400 font-semibold">(Self-Pay Cap)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Accord Instrument Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-black/40 border border-emerald-500/25">
            <div
              className="sm:col-span-4 relative rounded-lg overflow-hidden border border-white/[0.1] group cursor-pointer"
              onClick={() => setShowAccordImageModal(true)}
            >
              <img
                src="/images/settlement-accord-document.jpg"
                alt="Ratified Bilateral Settlement Accord Physical Instrument"
                className="w-full h-32 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Physical Instrument with Wax Seal</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white">
                <span>Click to inspect full document</span>
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
            </div>

            <div className="sm:col-span-8 space-y-1.5 text-[11px] text-slate-300">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Executed Settlement Instrument · 45 CFR § 149</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  RATIFIED
                </span>
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Hospital legal affairs and EXCISE digital tenders executed this binding bilateral compromise.
                The permanent collections stay is registered with the Centers for Medicare &amp; Medicaid Services (CMS).
              </p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-2 pt-0.5">
                <span>Cryptographic Digest: 0x7f83b165...</span>
                <span>·</span>
                <span>Tender: $3,735.00</span>
              </div>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                Hospital Sign-off:
              </div>
              <div className="text-white font-medium">{currentCase.hospitalName}</div>
              <div className="text-emerald-400 text-[10px]">Revenue Integrity &amp; Patient Financial Services</div>
              <div className="text-slate-500 text-[10px]">Reference: MRMC-REV-20260920-88A</div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1">
              <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                Patient Legal Representative:
              </div>
              <div className="text-white font-medium">EXCISE Autonomous Dispute Engine</div>
              <div className="text-purple-300 text-[10px]">Designated Agent for Marcus Vance (45 CFR § 149)</div>
              <div className="text-slate-500 text-[10px]">Cryptographic Seal: SHA-256 #7f83b165...</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-slate-400 text-[11px]">
              Statutory stay on collections made permanent under federal accord.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Downloading Ratified Bilateral Settlement Accord PDF...")}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Download Ratified Accord (.PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Clean Chronological Legal Correspondence Wire */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold px-1">
          Chronological Dispute Transmissions ({currentCase.correspondence.length})
        </div>

        {currentCase.correspondence.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-black/20 border border-white/[0.04] text-slate-400 font-mono text-xs space-y-2">
            <Mail className="w-8 h-8 mx-auto opacity-30 text-slate-500" />
            <div className="text-slate-300 font-medium">No transmissions dispatched yet</div>
            <p className="text-slate-500 max-w-sm mx-auto">
              Click &quot;Serve Dispute Notice&quot; above to dispatch the statutory contest citing 45 CFR § 149 via AgentMail.
            </p>
          </div>
        ) : (
          currentCase.correspondence.map((msg) => {
            const isInbound = msg.direction === "inbound";
            const isExpanded = expandedTransmissionId === msg.id;

            return (
              <div
                key={msg.id}
                className={`rounded-xl border font-mono text-xs transition-all shadow-sm ${
                  isInbound
                    ? "bg-[#090e15] border-emerald-500/30"
                    : "bg-[#0a0f16] border-purple-500/25"
                }`}
              >
                {/* Message Header Strip */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isInbound
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      }`}
                    >
                      {isInbound ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-xs">
                        {isInbound
                          ? `${currentCase.hospitalName} (Revenue Integrity)`
                          : "EXCISE Legal Dispute Counsel (Attorney-in-Fact)"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isInbound
                          ? `To: ${currentCase.caseInbox}`
                          : `To: ${currentCase.hospitalName} Billing`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Badge variant={isInbound ? "emerald" : "purple"}>
                      {isInbound ? "HOSPITAL CONCESSION" : "STATUTORY NOTICE SERVED"}
                    </Badge>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Subject & Key Impact */}
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="font-semibold text-slate-200 text-xs">
                    {msg.subject}
                  </div>

                  {/* Highlighted Delta Box */}
                  <div className="p-3 rounded-lg bg-black/50 border border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">
                      {isInbound ? "Hospital Concession Adjudication:" : "Statutory Contest Demand:"}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      {isInbound && msg.proposedAdjustment && (
                        <>
                          <span className="text-slate-500 line-through">
                            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-emerald-400 font-bold">
                            ${msg.proposedAdjustment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                            -${(currentCase.totalBilled - msg.proposedAdjustment).toLocaleString("en-US", { minimumFractionDigits: 2 })} Conceded
                          </span>
                        </>
                      )}
                      {!isInbound && (
                        <>
                          <span className="text-slate-400">Demand Settlement:</span>
                          <span className="text-purple-300 font-bold">
                            ${(currentCase.totalBilled - currentCase.totalExcised).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                            -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} Disputed
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expandable Transmission Drawer */}
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        setExpandedTransmissionId(isExpanded ? null : msg.id)
                      }
                      className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isExpanded
                          ? "Hide full legal transmission"
                          : "Inspect full transmission text (RFC 5322)"}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-lg bg-black/80 border border-white/[0.08] text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                        {msg.body}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Webhook Specification Modal */}
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
    "subject": "RE: Formal Dispute #${currentCase.accountNumber}",
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

      {/* Full Accord Document Preview Modal */}
      {showAccordImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAccordImageModal(false)}
        >
          <div
            className="max-w-3xl w-full bg-[#0b1017] border border-white/[0.15] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <span className="font-semibold text-white">
                Ratified Bilateral Settlement Accord · Official Legal Instrument
              </span>
              <button
                onClick={() => setShowAccordImageModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-3 bg-black flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src="/images/settlement-accord-document.jpg"
                alt="Ratified Bilateral Settlement Accord Physical Instrument"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
