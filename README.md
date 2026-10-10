# TanStack rewrite experiment

The migration is in progress. The corpus publisher generates **14,107 documentation URLs from 7,527 unique authored documents**, covering 21 library identities and their pinned versions. `latest` and explicit-version URLs share source documents. Application, service and interaction parity remain incomplete; see [the gap ledger](investigation/CORPUS-GAPS.json).

## Build and serve locally

From this directory, with the pinned sibling experiment/toolchain directories present:

```bash
npm run local:prepare # prepare browser, SSR, document renderer and API prototypes
npm run build         # ingest maintained corpus, render changed documents, Nift composition
npm run serve         # http://localhost:4173
```

Preparation artifacts already exist in this workspace. `PORT=3000 npm run serve` selects another port; stop with Ctrl+C. Edit Markdown/frontmatter under `sources/docs/`, rebuild, then restart the server after metadata or configuration changes. The initial import copies the pinned authored corpus into this repository; routine builds use these maintained copies. `sources/representative/` remains isolated proof input, not the corpus source of truth.

`public/publication/<route>.html` contains Nift-composed article HTML. `public/publication-meta/` and `public/downloads/` contain derived metadata and authored Markdown downloads. The local server supplies the generalized retained navigation/sidebar/title/TOC/footer shell per request and serves these outputs. Browser navigation fetches the new route's article and metadata. A generic static server does not supply the application shell or service endpoints.

This preview currently uses anonymous sessions. Tabs, ordinary code copy and Mermaid activation attach by document family. Chart/client/live execution owners have visible pending notices; affected URLs and unimplemented application/service route patterns are recorded in the ledger. Browser smoke tests are coverage evidence, not full visual or behavioral parity.

Bare `nift build` composes already-prepared article HTML; `npm run build` includes conversion and metadata preparation. Browser/SSR compilation is independent. Preparation still depends on pinned sibling runtimes and frozen CSS/assets; independent clean-checkout packaging and production publication remain open requirements. Current timings are development diagnostics, not final benchmarks.

Read REWRITE.md, investigation/STATUS.md, HANDOVER.md and AGENTS.md for the contract and checkpoints.
