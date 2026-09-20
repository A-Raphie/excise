import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Excise | Autonomous Hospital Chargemaster Audit & Medical Bill Dispute Engine",
  description:
    "Autonomous forensic medical bill dispute engine. Uses Firecrawl to scrape hospital machine-readable chargemasters, OpenAI to detect CPT upcoding & unbundling, AgentMail for dedicated legal dispute inboxes, and Convex for reactive real-time settlement negotiation.",
  keywords: [
    "hospital bill dispute",
    "chargemaster audit",
    "No Surprises Act",
    "medical billing advocate",
    "Convex",
    "Firecrawl",
    "AgentMail",
    "OpenAI",
  ],
  authors: [{ name: "Raphie" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06090e] text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
