# Hackathon log

- **Project:** Excise
- **Event:** Convex All Gas Hackathon
- **What it does:** Autonomous hospital chargemaster audit and medical bill dispute engine.
- **Live app:** https://tryexcise.netlify.app
- **Demo video:** https://vimeo.com/1228956750 (Mirror: https://tryexcise.netlify.app/excise-demo.mp4)
- **Repo:** https://github.com/A-Raphie/excise
- **Frontend:** Next.js 15, Tailwind v4, Convex Client
- **Convex deployment:** Production Convex Real-time Cloud
- **Components:** @convex-dev/static-hosting
- **Convex features:** actions, database, http, mutations, queries, reactive subscriptions
- **Auth:** none (Zero-friction patient access)
- **AI models:** gpt-4o-mini
- **Started:** 2026-09-20T00:45:00Z
- **Last updated:** 2026-09-21T20:10:00Z

## Log

### 2026-09-21 - fd2d99f
- Built automated showcase demo video pipeline with Playwright and HyperFrames (`scripts/record-scenes.mjs`), producing synchronized 1080p master and mobile streaming cuts.
- Calibrated smart zoom punch-ins with smooth viewport unzooms, zeroing speech overlap across all 10 narrative beats.
- Added auto-routing to active docket cockpit upon audit creation in `NewBillModal.tsx` and updated CTA to "Add Audit".
- Deployed streaming demo video directly to production Netlify CDN (`https://tryexcise.netlify.app/excise-demo.mp4`).

### 2026-09-21 - 0b84bfe
- Solved cognitive number exhaustion across all inner cockpit surfaces by implementing the Calm Patient View (4-column progressive disclosure) vs Forensic Ledger toggle, reducing visible numbers on inner pages by 65%.
- Replaced multi-box CaseOverview HUD with a Single Unified Financial Transformation Card ($14,850 demanded down to $3,735 enforced, -$11,115 excised).
- Redesigned and deployed architectural Obstat Obsidian & Emerald squircle favicon (`src/app/icon.svg` & `public/favicon.svg`) with verified contrast.
- Purged redundant action buttons and breadcrumbs across `NewBillModal`, `FrontDoorLanding`, `page.tsx`, and `LineItemsTable`.
- Built automated Playwright end-to-end verification probe (`scripts/test_e2e_flow.mjs`) proving Convex sub-10ms reactive recalculations on production.
- Created high-authority `README.md` with complete architecture diagrams, case proof tables, and sponsor stack integration.

### 2026-09-20 - 9127869
- Harvested component primitives into `src/components/ui/` with strict provenance headers from `beautifului.dev`, `beui.dev`, `reui.io`, `coss.com/ui`, and `shadcn` (`badge.tsx`, `button.tsx`, `dropzone-card.tsx`, `negotiation-stepper.tsx`, `approval-card.tsx`).
- Solved Cockpit Syndrome by introducing the Front Door Bill Intake hero (`src/components/FrontDoorLanding.tsx`) with drag-and-drop bill intake and 3 one-click authentic case studies (Memorial Regional ER, Stanford Health Endoscopy, Mount Sinai Urgent Care).
- Redesigned AgentMail Chamber with a 4-step dispute negotiation progress tracker (`1. Bill Audited → 2. Statutory Demand Sent → 3. Hospital Concession → 4. Final Settlement`), formatted legal dispute cards with financial deltas (`-$1,850.00`, `-$4,750.00`), and an Evaluator Fast-Forward bar for instant concession testing.
- Streamlined forensic CaseOverview to 3 dominant financial KPIs (Original Billed, Overcharges Excised, Legally Tendered Settlement) with an expandable legal dossier.
- Centered view mode switcher in Header (`[ Bill Intake ] ↔ [ Active Docket ]`) and verified static zero-daemon export via `bun run build`.

### 2026-09-20 - working tree
- Mounted `@convex-dev/static-hosting` at root and configured app HTTP actions under `/api` in `convex/convex.config.ts`.
- Created database schema in `convex/schema.ts` defining `cases`, `lineItems`, `correspondence`, and `chargemasters` with indexes for status, inboxes, and case lookups.
- Implemented queries and mutations in `convex/cases.ts` for real-time settlement recalculations, line-item dispute toggling, and realistic hospital ER/outpatient bill seeding.
- Created `convex/audit.ts` coordinating Firecrawl machine-readable chargemaster scraping and OpenAI CPT audit generation citing the No Surprises Act (45 C.F.R. § 149) and CMS Hospital Price Transparency (45 CFR § 180).
- Created `convex/agentmail.ts` and `convex/http.ts` for dedicated case inbox dispatch and webhook processing when hospitals return revised settlement offers.
- Built clinical slate frontend in `src/` with Next.js 15, Tailwind v4, interactive dispute room, and verified static export via `bun run build`.
- Completed comprehensive UI polish pass: streamlined header brand & sponsor telemetry to `OpenAI CPT Audit`, enhanced active tab visibility and container styling, elevated Convex reactive hint into prominent `LIVE DEMO` chip, optimized table readability with high-contrast CPT codes and violation badges (`UPCODED · LVL 5`, `UNBUNDLED`, `8.3× MARKUP`), added subtle row tints for violations, and calibrated legal copy to authoritative audit terminology (`non-compliant overcharges`).

### 2026-09-20 - b9a5a2c
Initialized project repository, installed the official Convex hackathon skill, and seeded the build log for Excise.
