import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeContext";

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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var params = new URLSearchParams(window.location.search);
                  var t = params.get('theme') || localStorage.getItem('excise_theme') || 'obstat';
                  if (t === 'routedock' || t === 'mandate' || t === 'obstat') {
                    document.documentElement.setAttribute('data-theme', t);
                    document.documentElement.className = 'theme-' + t;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <ConvexClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
