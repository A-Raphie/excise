# Hackathon log

- **Project:** Excise
- **Event:** Convex All Gas Hackathon
- **What it does:** Autonomous hospital chargemaster audit and medical bill dispute engine.
- **Live app:** not deployed
- **Repo:** https://github.com/A-Raphie/excise
- **Frontend:** Convex static hosting
- **Convex deployment:** not deployed
- **Components:** @convex-dev/static-hosting
- **Convex features:** actions, database, http, mutations, queries
- **Auth:** none
- **AI models:** gpt-4o-mini
- **Started:** 2026-09-20T00:45:00Z
- **Last updated:** 2026-09-20T01:51:00Z

## Log

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
