import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// AgentMail inbound webhook endpoint (mounted at /api/agentmail/webhook)
http.route({
  path: "/agentmail/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const payload = await request.json();

      // Parse payload structure
      const inbox =
        payload?.data?.to || payload?.inbox_id || payload?.to || payload?.recipient;
      const from = payload?.data?.from || payload?.from || "billing@hospital.org";
      const to = payload?.data?.to || payload?.to || "";
      const subject =
        payload?.data?.subject || payload?.subject || "RE: Medical Bill Dispute";
      const text = payload?.data?.text || payload?.text || payload?.body || "";
      const messageId = payload?.data?.id || payload?.id;

      if (!inbox && !text) {
        return new Response(JSON.stringify({ error: "Invalid webhook payload" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await ctx.runMutation(api.agentmail.processInboundWebhook, {
        inbox: inbox || "",
        from,
        to,
        subject,
        text,
        messageId,
      });

      return new Response(JSON.stringify({ received: true, ...result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("AgentMail webhook error:", err);
      return new Response(
        JSON.stringify({ error: err?.message || "Webhook handling error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
