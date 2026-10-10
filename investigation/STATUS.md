# STATUS.md

Resumable rewrite state (EXPERIMENTAL, v4.8). Read REWRITE.md, AGENTS.md and HANDOVER.md.

Mark each phase: not started / in progress / blocked / done.

| Phase | Status | Acceptance criteria | Required evidence | Commands | Commit |
| --- | --- | --- | --- | --- | --- |
| 1 Understand old product | in progress | Public/source understanding established; full service traces pending | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 2 Freeze design/behaviour reference | in progress | Frozen 96 states plus separately frozen literal guide; full critical-state freeze pending | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 3 Inventory content/routes/features | done | 314 patterns, 7601 identities, 7527 nonempty docs, actual syntax inventory | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 4 Extract requirements | in progress | Observable contracts recorded; representative shell/service coverage incomplete | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 5 Choose Nift-native architecture | in progress | Authored/hybrid ownership proposal; complete runtime/build implementation pending | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 6 Prove representative vertical slice | in progress | Four article DOMs, isolated pixels, tab/HTML authority and auth primitives proved; full slice pending | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 7 Rebuild shared structure | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 8 Rebuild full corpus | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 9 Validate design/behaviour parity | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 10 Performance campaign | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 11 Full parity revalidation | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 12 Final benchmarks | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 13 Clean-checkout proof | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 14 Handover | not started | Await representative acceptance and preceding gates | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |

GATE: freeze product/design/behaviour evidence and prove a vertical slice before broad rebuilding.
GATE: complete validation precedes profiling/optimization; full revalidation precedes final benchmarks.

## Architecture and campaign evidence

- Significant retained/introduced islands; source model, accessibility/shared-state/maintenance/cost reasons:
- Complete production pipeline, including independently prepared browser-side bundles:
- Profiles/hotspots, general improvements, before/after measurements and justified deferrals:
- Final validation command/result and equivalent benchmark workloads (qualify changed workloads):

## Current

- Checkpoint: R3 representative proof in progress
- Commit SHA: latest checkpoint recorded by Git; no full R3 acceptance
- Blockers/approved decisions: no demonstrated stop condition; core unchanged; public repository/checkpoint pushes authorized
- Next checkpoint: finish shared shell/navigation/search and remaining real component/service cases

## R0 accepted — initialized, not rewritten

`nift init --rewrite` on frozen Nift 4.10.0 succeeds and builds the starter. Generated workbooks/method preserved verbatim in evidence/r0/generated-workflow with hashes. Original upstream pin unchanged. Starter output is placeholder and contributes no parity or benchmark evidence. R1 observable contract inventory and reference freeze are next. No core changes, no service deployment, no production credentials.

## R1 in progress

Inventory and independent output freeze complete; representative browser reference recapture in progress after correcting a sandbox-frame initializer defect. No candidate parity claimed. Authenticated/service, keyboard/search/navigation and fresh-session reference contracts remain to be recorded. R2 architecture and R3 representative implementation are pending; broad rebuilding remains gated.

## R2 design / R3 bounded proof in progress

Architecture proposal recorded in ARCHITECTURE.md. Authored/hybrid maintained sources are selected; scope and output remain unchanged. This proposal is not a representative parity acceptance.

Three real documents produce exactly the pinned parser AST with four pure upstream files and independent pinned dependencies. An isolated Nift raw-composition + scoped adapted upstream Tabs proof passes: literal syntax survives, rendered-file dependencies invalidate output, Home/End tab behavior works, article edits survive hydration and tab rerenders, and request seeds are fresh. This is technical boundary evidence only. Whole-page rendering, shell/navigation/search/Query/complex-island and service/session parity remain pending. Do not scale or benchmark yet.

Three real article bodies now match the frozen reference DOM: Query overview, Query comparison and Start build-from-scratch. Comparison retains exact tags, attributes, text, styles and highlighted code; only demonstrated CSSOM style serialization and bijective React-generated tab ID prefixes are normalized. Tables, anchors, real links/images and bundler tab markup are covered. Code clipboard/toast, full shell and further interactive/service contracts remain pending. No whole-page parity acceptance or corpus scaling yet.

The actual Nift-published Start article now passes shared bundler-tab selection across all three groups, persisted reload and Home/End behavior with zero browser/console errors. Its authored literal remains intact. This is isolated tab behavior, not whole-page design/shell parity. Remaining representative gate: shared shell/navigation/search, copy/feedback, Query-driven and complex islands, and service/auth/session/chat contracts.

Independent retained session/OAuth primitive proof passes using local fixture secrets: HMAC cross-check, valid/expired/tampered/wrong-secret cookies, exact production flags/clear behavior, fresh OAuth state, return-to roundtrip and popup channel bound to verified state. Complete provider/auth/database/chat integration remains pending; this does not certify private live integrations.

Owned auth service and original guards now pass authenticated-user mapping, anonymous rejection, capability enforcement, admin override, session-version revocation, missing-user rejection and development unconfigured-database behavior with local repositories. Database availability is an explicit constructor dependency rather than importing the complete database graph. Real adapter/provider/callback and HTTP/chat integration remain open.

Query overview isolated article pixels match exactly at 1440/390 in dark/light (four states, exact RGB dimensions/pixels, no tolerance). Actual upstream DOM is cloned into matching isolated geometry/styles to exclude overlapping sticky shell controls; candidate body is rendered independently from maintained Markdown. This proves component rasterization only, not full-shell/page parity or candidate CSS preparation.

Full raw-document feature inventory now covers all 7,527 nonempty inputs and identifies seven actual component kinds with real source examples. This is an inventory pass, not migration scaling or full rendering acceptance. Use it to finish representative component owners instead of building unused compatibility features.

The first real Form overview file-tab block now matches frozen upstream DOM (same bounded ID/style normalization as article proofs). The exact upstream FileTabs view is retained without changes. Native controls prove independent groups, unique IDs, two visible panels, Home/End and literal preservation. Run `proof:file-tabs` with the frozen browser toolchain. Full Form/framework/package-manager rendering and the whole R3 gate remain pending.

Six real article bodies now match frozen upstream DOM: the original four plus full Form overview and AI Anthropic adapter. Form framework URLs redirect upstream to a framework-free canonical path; candidate rendering uses that actual path, rather than normalizing away link differences. Exact owned package/framework views use explicit preferences and retain URL > user > local > react priority and first-panel fallback. Real-source preference checks pass; Nift-composed AI article passes shared/persisted package-manager selection, selected classes and Home/End. Full preference update/session integration, clipboard/toast/install-copy analytics and whole shell remain pending. No R3 acceptance or scaling/benchmarking yet.

Independent API-only feasibility now passes for three byte-preserved original auth server-function definitions using the official TanStack Start compiler/protocol/context/CSRF middleware, retained auth/session/guards and explicit local repositories. Generated-client browser calls cover anonymous/signed sessions, capability allow/deny and version revocation; HTTP guards return 403 cross-origin, 405 wrong-method and 404 ordinary page. Full nested/orphan import graph excludes original site source, publication views and document corpus. Start has an earned bounded service-protocol role here, not publication/root hydration. Read services/protocol-proof/README.md: independent release install/lock, provider/database/chat/full API integration and R3 acceptance remain pending. This is feasibility, not a benchmark or certified service release.

Two real AI agentic-cycle Mermaid diagrams now activate as declared scoped roots on Nift-composed article HTML, preserve outside article mutations and react to theme changes with zero hydration/browser errors. Dark SVG markup exactly matches frozen upstream after bijective generated-ID/reference normalization only. Two demonstrated island integration fixes are explicit in provenance: unique hydrateRoot identifierPrefix and initial theme from the actual document class. Exact Mermaid 11.14.0 retained. The isolated comparison uses pinned CSS/local fonts; upstream blocked Google stylesheet is excluded from candidate fragment and disclosed, not a whole-page font claim. Full shell/light/pixel and fallback clipboard/toast remain pending. R3 remains open.

PublishedRegion now proves native-owned Nift article descendants inside a React-owned host: the hydration markup object is fixed for the mount; new publication HTML installs explicitly after commit with optional child-island cleanup/activation. Real Query overview/comparison bodies preserve marker node identity and native edits through twelve shell updates each. A rendered-file dependency change followed by explicit navigation installs the fresh second Nift output, including its table. Hydration-compatible shell serialization is renderToString; no document AST client payload exists. Actual Navbar/Router/full-shell/SEO integration remains pending. This boundary extends feasibility, not R3 acceptance.
