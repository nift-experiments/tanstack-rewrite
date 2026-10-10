# TanStack rewrite experiment

The rewrite is in progress. Maintained Markdown produces **14,107 documentation URLs from 7,527 unique authored documents**, alongside the homepage, 44 library landings, 14 marketing pages and 81 blog pages/index: **14,247 complete publications**. There are also **114 request-time family boundaries** (100 application views and 14 route controls) backed by 126 authored view/options bindings. Family availability is not final semantic, visual or service parity; see [the gap ledger](investigation/CORPUS-GAPS.json).

## Build and serve locally

From this directory, install Node.js 25, pnpm 11.1.0 and Nift 4.10.0, then:

```bash
pnpm install --frozen-lockfile
npm run build # normal pipeline: declare inputs, native Nift DAG, preparation and publication
npm run serve # http://localhost:4173 — homepage at /
```

`PORT=3000 npm run serve` selects another port. Stop with Ctrl+C. A clean workspace bootstraps its compiler artifacts automatically. `npm run local:prepare` invokes the same native frontend/posts/backend/Worker producers explicitly; it is not a second publication owner. Runtime and compiler dependencies are pinned in this project’s pnpm lockfile, including the retained SDK patches. Normal builds and preview resolve these owned packages; neighbouring experiment checkouts are only reference/evidence tools. `NIFT_BIN` can select a different installed Nift binary.

Edit Markdown/frontmatter under `sources/docs/` and rebuild. Maintained views, shared components and services have separate source owners. The normal command expands declared input roots into explicit Nift dependencies; it does not decide source freshness itself. Nift schedules frontend, preparation, posts, backend and Worker packaging actions. Ordinary documents do not depend on backend compilation. Restart the local runtime after changing compiled browser/SSR/API code; publication metadata refreshes as builds complete.

Nift owns `public/<route>.html`, `public/index.html`, checked article fragments under `public/publication/`, application-family boundaries, the shared application envelope and the build-to-runtime path interface. Metadata and Markdown downloads derive from maintained source. The preview consumes these artifacts and evaluates declared session/runtime slots; it performs no startup publication. React owns explicit interactive regions. A generic static server does not implement the application services or request-time shell.

Signed-session behavior uses the actual retained auth/database logic when configured. Public-feed, provider and database fixtures are explicitly scoped evidence. Selected live/chart/client examples reach their real runtime; full execution, authenticated application families, Worker/chat/provider integration, SEO/error/redirect parity, clean-checkout acceptance and complete browser/visual acceptance remain open.

Current timings are integration diagnostics, not final site benchmarks. Read REWRITE.md, investigation/STATUS.md, HANDOVER.md and AGENTS.md for the contract and checkpoints.

## Local runtime configuration

Normal preview starts the actual owned workerd classes, durable SQLite stores, R2 stores and workflow binding from the built Worker artifact. This is local hosting, separate from publication; restart preview after compiled runtime changes. Persistent runtime state stays outside public under ignored `.work/runtime-state/preview`. Backend environment settings remain explicit: `DATABASE_URL` and `SESSION_SECRET` for configured authentication; `ENCRYPTION_KEY`, `INCLUDED_MODEL`, `KODY_ORIGIN` and `MCP_EGRESS_MODE` for configured Chat integrations. Startup supplies a private local session secret if none is configured. It does not fabricate provider credentials or application responses. Full provider/workflow parity is still open.

`TANSTACK_FIXTURE_DATABASE_URL=postgres://...@127.0.0.1:5549/nift_rewrite_fixture node scripts/verify-preview-authenticated-runtime.mjs` uses the explicitly configured isolated local database and running preview, inserts a disposable identity, verifies real authenticated bootstrap and removes the identity in finally. Do not point this fixture check at production. `node scripts/verify-document-heads.mjs` compares ten initial heads against the pinned local reference; `node scripts/verify-native-family-navigation.mjs` checks client head updates and native DOM authority.

For an isolated local database, set `TANSTACK_FIXTURE_DATABASE_URL` to a loopback database named `nift_rewrite_fixture` (optionally with a fixture suffix), then run `node scripts/prepare-fixture-database.mjs`. This explicit maintenance command provisions an empty fixture using the maintained schema and installs the pinned final SQL functions/triggers. Normal publication never performs database DDL. The byte-preserved migration SQL and provenance are under `services/database/`.

With that database configured in the running preview, `node scripts/verify-preview-workspace-sync.mjs` verifies a disposable signed identity, actual section mutation, SQL-trigger invalidation, durable snapshot and replay/delta contracts, and anonymous denial. It removes its identity afterward. These selected checks do not certify complete Chat, provider or workflow parity.
