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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col space-y-4 p-4 sm:p-5">
      {/* 1. Chamber Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-slate-950 font-mono uppercase tracking-wider">
                Autonomous Dispute Negotiation Chamber
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live AgentMail Listener</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              <span>Dedicated Inbox:</span>
              <button
                onClick={handleCopyInbox}
                className="text-purple-800 font-bold hover:text-purple-950 transition-colors inline-flex items-center gap-1 cursor-pointer bg-purple-50 px-2 py-0.5 rounded border border-purple-200"
                title="Click to copy case inbox"
              >
                <span>{currentCase.caseInbox}</span>
                {copiedInbox ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-purple-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-mono text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs font-medium"
          >
            <Terminal className="w-3.5 h-3.5 text-purple-600" />
            <span>Webhook Spec</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Negotiation Stepper (At-a-Glance Lifecycle) */}
      <NegotiationStepper currentStepIndex={stepIndex} />

      {/* 3. Fast-Forward Simulator Strip */}
      <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span className="font-bold">Fast-Forward Hospital Actions:</span>
          <span className="text-slate-600 hidden lg:inline">
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
            className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3 h-3 text-amber-600" />
            <span>Simulate Supply Concession (-$1,850)</span>
          </button>

          <button
            disabled={loadingAction !== null}
            onClick={() => handleSimulate("full_acceptance")}
            className="px-3 py-1.5 rounded-lg border border-transparent bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>Simulate Full Settlement ($3,735)</span>
          </button>
        </div>
      </div>

      {/* 4. BILATERAL SETTLEMENT ACCORD (When Case is Settled) */}
      {isSettled && (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-50/20 p-5 font-mono text-xs shadow-sm space-y-4">
          {/* Accord Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <div>
                <span className="font-bold text-emerald-950 tracking-wider uppercase text-sm block">
                  Bilateral Settlement Accord Executed
                </span>
                <span className="text-[11px] text-slate-600">
                  Enforced under federal No Surprises Act (45 C.F.R. § 149) &amp; CMS Transparency rules
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              <span className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold shadow-xs">
                Convex State Finality: #tx_8f9a2d
              </span>
            </div>
          </div>

          {/* Core Financial Adjudication (At-a-Glance Numbers) */}
          <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Final Adjudicated Balance
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-sm font-semibold text-slate-400 line-through decoration-rose-400">
                    ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">
                    ${(currentCase.finalSettlement ?? 3735).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg font-bold text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 shadow-xs">
                  -${currentCase.totalExcised.toLocaleString("en-US", { minimumFractionDigits: 2 })} (-74.8% Excised)
                </span>
              </div>
            </div>

            {/* WAS vs NOW Adjudicated Items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">CPT 99070 (Suture Tray):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-400 decoration-rose-400">$1,850.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-900 font-bold">$0.00</span>
                  <span className="text-emerald-700 font-bold">(-100%)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">CPT 70450 (Head CT Scan):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-400 decoration-rose-400">$5,400.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-900 font-bold">$650.00</span>
                  <span className="text-emerald-700 font-bold">(-$4,750)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500">CPT 99285 (ER Acuity):</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="line-through text-slate-400 decoration-rose-400">$7,600.00</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-900 font-bold">$3,085.00</span>
                  <span className="text-emerald-700 font-bold">(Self-Pay Cap)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Accord Instrument Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div
              className="sm:col-span-4 relative rounded-lg overflow-hidden border border-slate-200 group cursor-pointer"
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

            <div className="sm:col-span-8 space-y-1.5 text-[11px] text-slate-700">
              <div className="font-bold text-slate-950 flex items-center gap-2">
                <span>Executed Settlement Instrument · 45 CFR § 149</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                  RATIFIED
                </span>
              </div>
              <p className="text-slate-600 text-xs font-sans leading-relaxed">
                Hospital legal affairs and EXCISE digital tenders executed this binding bilateral compromise.
                The permanent collections stay is registered with the Centers for Medicare &amp; Medicaid Services (CMS).
              </p>
              <div className="text-[10px] font-mono text-emerald-800 font-bold flex items-center gap-2 pt-0.5">
                <span>Cryptographic Digest: 0x7f83b165...</span>
                <span>·</span>
                <span>Tender: $3,735.00</span>
              </div>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                Hospital Sign-off:
              </div>
              <div className="text-slate-950 font-bold">{currentCase.hospitalName}</div>
              <div className="text-emerald-800 text-[10px] font-medium">Revenue Integrity &amp; Patient Financial Services</div>
              <div className="text-slate-500 text-[10px]">Reference: MRMC-REV-20260920-88A</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                Patient Legal Representative:
              </div>
              <div className="text-slate-950 font-bold">EXCISE Autonomous Dispute Engine</div>
              <div className="text-purple-800 text-[10px] font-medium">Designated Agent for Marcus Vance (45 CFR § 149)</div>
              <div className="text-slate-500 text-[10px]">Cryptographic Seal: SHA-256 #7f83b165...</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-slate-600 text-[11px]">
              Statutory stay on collections made permanent under federal accord.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Downloading Ratified Bilateral Settlement Accord PDF...")}
                className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-sm active:scale-95"
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
        <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold px-1">
          Chronological Dispute Transmissions ({currentCase.correspondence.length})
        </div>

        {currentCase.correspondence.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-mono text-xs space-y-2">
            <Mail className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
            <div className="text-slate-800 font-bold">No transmissions dispatched yet</div>
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
                className={`rounded-xl border font-mono text-xs transition-all shadow-xs ${
                  isInbound
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-slate-50/70 border-slate-200"
                }`}
              >
                {/* Message Header Strip */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isInbound
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                          : "bg-purple-100 text-purple-800 border border-purple-200 font-bold"
                      }`}
                    >
                      {isInbound ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-950 text-xs">
                        {isInbound
                          ? `${currentCase.hospitalName} (Revenue Integrity)`
                          : "EXCISE Legal Dispute Counsel (Attorney-in-Fact)"}
                      </div>
                      <div className="text-[11px] text-slate-500">
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
                  <div className="font-bold text-slate-900 text-xs">
                    {msg.subject}
                  </div>

                  {/* Highlighted Delta Box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-600 text-[11px]">
                      {isInbound ? "Hospital Concession Adjudication:" : "Statutory Contest Demand:"}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      {isInbound && msg.proposedAdjustment && (
                        <>
                          <span className="text-slate-400 line-through">
                            ${currentCase.totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-emerald-700 font-extrabold">
                            ${msg.proposedAdjustment.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                            -${(currentCase.totalBilled - msg.proposedAdjustment).toLocaleString("en-US", { minimumFractionDigits: 2 })} Conceded
                          </span>
                        </>
                      )}
                      {!isInbound && (
                        <>
                          <span className="text-slate-500">Demand Settlement:</span>
                          <span className="text-purple-800 font-bold">
                            ${(currentCase.totalBilled - currentCase.totalExcised).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-100 border border-purple-200 text-purple-800 font-bold">
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
                      className="text-[11px] text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1 cursor-pointer font-medium"
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
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono shadow-inner">
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-950">AgentMail Inbound Webhook Specification</span>
              </div>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="text-slate-400 hover:text-slate-950 transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 font-sans text-xs">
              Convex registers an HTTP action endpoint at <code className="text-purple-700 font-bold bg-purple-50 px-1 py-0.5 rounded border border-purple-200">/api/agentmail/webhook</code> that processes incoming hospital emails in real time:
            </p>

            <pre className="p-3.5 rounded-xl bg-slate-900 text-purple-200 text-[11px] overflow-x-auto leading-relaxed">
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
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAccordImageModal(false)}
        >
          <div
            className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-slate-950">
                Ratified Bilateral Settlement Accord · Official Legal Instrument
              </span>
              <button
                onClick={() => setShowAccordImageModal(false)}
                className="text-slate-500 hover:text-slate-950 px-2 py-1 rounded cursor-pointer font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src="/images/settlement-accord-document.jpg"
                alt="Ratified Bilateral Settlement Accord Physical Instrument"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-md border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
