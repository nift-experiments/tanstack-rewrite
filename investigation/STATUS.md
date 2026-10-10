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
| 7 Rebuild shared structure | in progress | Actual homepage/shared documentation shell; remaining marketing/application shells pending | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
| 8 Rebuild full corpus | in progress | 14,107 documentation routes plus actual homepage; complete publication and family gaps tracked | evidence/r1 and evidence/r3 where applicable | See package.json proof commands | See checkpoint notes |
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

The API feasibility module now preserves the complete original auth-function definitions/helpers and tests disabled OAuth provider flags through the generated client. Empty provider settings and local database availability are explicit fixtures. The official generateFunctionId hook uses canonical original auth module identity, allowing separately compiled clients and API builds to agree. Previous auth/capability/revocation/CSRF/method/import checks still pass. Full backend and independently provisioned release tooling remain pending.

Owned retained Navbar/providers now build independently of the original source worktree (95 runtime files plus one compile-time redirect helper, exact provenance and side-effect policy). Browser module audit finds no original source, original route/server modules or publisher imports. The CSR-only proof exercises theme, real public search snapshots, mobile menu and Router navigation over Nift-composed overview/comparison HTML, including fresh incremental return publication. Auth uses the owned protocol proof; one GET-only controlled upstream oracle remains. Public search/badge fixtures are explicit replay snapshots, not pinned live-service evidence. Full SSR/layout/service parity and R3 remain open.

Request-local retained Navbar SSR/hydration now passes no-JavaScript article/navigation visibility, HTML-only edits injected before hydration (same native node), theme/search/mobile and Router republication checks. Signed and anonymous requests use fresh retained-session validation/local repositories, and signed account-menu behavior is tested. Publication uses the pinned official macro compiler/RPC-client transforms without the Start site-server plugin; full nested/orphan module audit excludes original routes, parser/corpus and backend implementations. Initial serializer resolves lazy views then synchronously serializes the same loaded request tree; both passes must remain in publication cost. Read frontend/ssr-proof/README.md for the rejected streaming behavior and limitations. Full layout/routes/SEO/provider/database/chat parity remains pending; R3 remains open. Interim diagnostic snapshot at 3030898 is committed separately and does not measure this added SSR work.

Documentation layout representative proof now passes exact full-page RGB at 1440/390 dark/light under matched fresh placement seeds and disclosed fallback-font transport. Retained sidebar, title, TOC, width/mobile controls, partner rail, recent posts and Footer surround independent Nift article HTML. Feedback ownership uses the original relative container, preserving actual upstream block selectors and block text across all four states; no extra native-owner ancestor. Request-local sessions, pre-hydration HTML-only edits, native node identity and fresh Router publication continue passing. 174 runtime source files are retained with provenance. Production fonts, code copy/tab/island integration, full route/corpus/SEO/backend parity and R3 acceptance remain pending. This is not final performance evidence.

Native ordinary-code copy now reads live published code text, retains the copied indicator/2s reset and original toast/clipboard integration, and cleans listeners/timers. Real Form source isolated proof covers HTML-only code edits, native node identity and teardown, with injected clipboard/toast ports. Owned layout client/publication builds and all four strict RGB/feedback-selector/hydration regressions pass. Package-manager install-copy analytics and browser clipboard permissions/fallback integration remain separate pending checks. R3 remains open.

Source-derived compact control declarations now activate tabs with explicit cleanup and install-copy metadata, without serializing body/AST. Real Router transitions Query -> AI Anthropic -> AI agentic-cycle -> fresh Query publication pass package selection/persistence, actual isolated browser clipboard and retained toast, locally intercepted install analytics, HTML-only code edits, diagram theme change/unmount and zero errors. Upstream prefetch to React Native is satisfied by its byte-preserved authored page. Four Query full-page RGB and feedback selector comparisons still pass after restoring the intentional incremental fixture. The publication-only retained chat Mermaid adapter uses the official client-only macro; full nested/orphan graph contains zero Mermaid implementation modules. Complex charts/live/client examples, full backend/SEO/routes/home/production fonts and R3 remain open.

## Corpus pivot checkpoint

The user explicitly superseded the prior no-scaling R3 gate: stop page-by-page work and demonstrate corpus-wide generation next. The earlier sequencing was inadequate. The corpus publisher now imports maintained Markdown/frontmatter from the pinned inventory and maps library IDs, version aliases, repository refs and docs roots automatically from retained library definitions. It generates 14,107 concrete documentation URLs from 7,527 unique authored documents across 21 library identities. All article outputs, metadata and Markdown downloads are verified; the shared retained shell is rendered per request by the local server. Browser navigation loads route-specific metadata/configuration, rather than requiring a hand-added page registry. One automated browser smoke route per library loads/hydrates without page errors. This is throughput/coverage evidence, not full parity.

`npm run build` and `npm run serve` are the normal corpus commands. Unsupported chart/client/live execution families have visible notices and affected-route entries in CORPUS-GAPS.json; non-documentation application/service patterns and shared gaps remain explicit. No Nift core or accepted migration/Labs changes. Full product parity, service integration, independent packaging, profiling and final controlled benchmarking remain open. Further work must close gaps by family, not resume isolated-page sequencing.

## Publication ownership correction (active campaign)

The user superseded the earlier representative-only gate and instructed continuation through final parity, performance and evaluation without routine approval. Nift owns complete page publication, checked path-bearing HTML and stylesheet projection. The actual homepage is `/`; `npm run serve` serves the publication and evaluates declared dynamic shell/session slots. Untransformed assets are maintained directly in public with provenance. Server startup does not copy/build publication. Normal build orchestration is moving through verified Nift custom actions and completion/file dependencies; bootstrap establishes the route graph on a clean workspace.

Availability: 14,107 documentation URLs, 14,108 complete pages, 7,527 authoritative documents, 21 library identities, 244 maintained static assets. Availability is separate from semantic/browser parity. The actual homepage's seven explicit island regions and native CTA were checked; native homepage DOM survives the retained libraries overlay update. Query complete body bytes match prepared HTML after only checked URL normalization. A long inline @content insertion was found to inflate publication whitespace; column-zero insertion corrects it. Earlier inflated-output timings remain diagnostic evidence, never final benchmarks.

Backend: the owned registry matched all 164 pinned upstream server-function identities before the broader HTTP family was integrated. 120 public HTTP route modules and their owned dependency closure compile. Isolated PostgreSQL checks pass genuine signed-session/capability loading, expiry, database session-version revocation, CSRF, method enforcement, public library data and CLI ticket creation. Cloudflare-backed chat stream runtime and remaining provider/auth/application/service scenarios still require closure.

Open work remains: clean-checkout packaging; general runtime URL interfaces beyond the home media region; marketing/application family coverage; chart/live/client examples; SEO/content negotiation/redirect/search parity; full visual and interaction matrix; complete profiling, optimization, controlled benchmarks and three-way maintenance judgement. No core, accepted migration or Labs changes. This checkpoint is not final acceptance. Continue the campaign automatically.

## Shared landing families and path interface (in progress)

The latest publication includes the homepage, 14,107 generated docs outputs and 44 landing outputs across 20 library identities. MCP requests preserve the upstream CLI-guide redirect. The chart landing consumes the pinned catalog index rather than an empty placeholder. All original 46 landing outputs previously passed browser hydration smoke; the corrected catalog and redirect pass is running. Docs smoke covers 21 families. These are availability checks, not semantic or visual parity acceptance. General local URL attributes use the Nift-resolved asset interface, including islands; the special homepage-media adapter is removed. Route discovery finishes through the native preparation DAG before publication reloads tracking. Current comprehensive parity, application routes, service behavior, independent packaging, profiling and benchmarks remain open.

## Checked publication-family checkpoint

Current stable publication: 14,152 complete pages (homepage + 14,107 docs outputs + 44 library landings), with 244 maintained assets verified. Full 14,107-fragment composition integrity and pinned 7,601-source-file byte checks pass. Shared native docs → landing → home → library-menu navigation preserves the document lifetime; native heading identity/edits survive overlay updates. The common Nift-resolved path interface covers assets and navigation, including React `to` values and root-library aliases. Native status decides preparation freshness before publication loads the discovered output graph.

The owned HTTP closure now includes 140 handler modules / 548 source files. Real local transport checks pass for streamed first chunks, multiple cookies, request host/body, and actual public library/auth/root-LLM endpoints through 127.0.0.1. Real PostgreSQL signed-session/revocation/CSRF/CLI checks pass. These establish selected contracts, not full service acceptance.

Next work continues automatically: integrate the staged 199-reference resolver with transitive Nift dependencies; connect the staged 14-route marketing projection; close complex examples and application/service families; then full parity, profiling/optimization, benchmark and evaluation. The reference resolver currently passes source preprocessing only and is not yet part of normal publication. No final parity, performance or rewrite acceptance is claimed.
