# R2 architecture proposal — pending representative proof

## Maintained source

Choose an authored/hybrid model: original Markdown/frontmatter and structured references remain authoritative; original assets remain byte-preserved; application components and service handlers remain maintained code. Rendered document HTML, indexes and downloadable projections are derived artifacts. Do not maintain independent whole-page snapshots or duplicate a serialized Markdown AST alongside editable article HTML.

This is one repository and source model, not paired human/agent projects. Reference snapshots are test evidence only.

## Ownership

| Responsibility | Owner | Build invalidation |
| --- | --- | --- |
| Document parsing, includes, reference normalization | Bounded publisher using pinned TanStack Markdown semantics | Source and transitive reference inputs |
| Article body, shell templates, metadata, exports | Nift composition and explicit projections | Actual content/template/metadata dependencies |
| Theme, copy, tabs, ordinary navigation | Small controllers or scoped components matching original contracts | Controller/component dependencies |
| Router navigation and scroll/preload behavior | TanStack Router where it preserves original UX | Browser graph only |
| Query data/cache and complex application UI | Scoped React + TanStack Query/Table/AI as required | Browser graph only |
| Fresh placement and request-sensitive HTML | Explicit request composition and original placement algorithm | Service graph; no frozen session seed |
| Auth/session/chat/API/DO/R2/workflows | Independently compiled service handlers, preserved protocol | Service graph only |
| Complete application release | Explicit publication + browser + backend union | Costs all required preparation, not static publication alone |

Article DOM is not inside a hydrated ancestor that re-renders an AST. React roots own declared regions and may not replace the surrounding authored document. Navigation swaps published article HTML through an explicit owner; surviving roots receive lifecycle updates rather than silently taking ownership of the page. The isolated native-owner proof passes, and the PublishedRegion host proof additionally shows that retained React shell ancestors can update without replacing native-owned article descendants. Its hydration markup object remains fixed for the mount; only an explicit committed publication change installs new HTML and runs child-island lifecycle hooks. Neither proof contains a document AST client payload. The actual retained shell/Router integration remains unproved, so this does not close the representative gate.

Published HTML may include dynamic placeholders only for declared request regions. The request layer must compose fresh partner/session state and matching island props while leaving the static article intact. Whole-page caching with frozen request/session data is rejected.

## Dependencies and commands

Plan independent `publish`, `frontend:build`, `service:build` and `release:prepare` commands. Publication includes all normal transforms, static copying, metadata, search/export generation and required browser asset preparation. Backend build/deploy is separately reported; full release includes it when needed. No deploy or production database mutation belongs in the local experiment.

Nift tracked dependency ordering alone does not invalidate output. Derived outputs must also appear as real file dependencies (supported `@dep`/dependency metadata), so an upstream source change propagates in the same invocation. A backend file is not a dependency of the corpus target; a document is not a dependency of the backend compiler. Verify these boundaries with actual touched-input output and invocation traces.

Do not start by copying the complete Start application graph. Reuse pure semantics and components deliberately, with narrow entry points and explicit HTTP adapters. Keep a compiler only if its retained responsibilities justify it; costs remain visible. No Nift changes, general Start emulation or whole-app framework shims.

## R3 acceptance before scaling

1. Home and documentation shell match reference widths/themes/metadata.
2. Real rich document: headings, tables, code, framework/package/file tabs and copy/download behavior.
3. Published body marker survives hydration, theme changes and client navigation; original AST cannot overwrite it.
4. Two fresh requests preserve the placement algorithm and independent seeds; island activation agrees with each response.
5. Query-driven state plus a complex chart/embed uses real scoped components with intact shared state.
6. Auth/session/chat service boundaries retain observable protocol and permissions in a controlled local environment.
7. 404, redirect and content negotiation behavior remains exact.
8. Document edit skips backend build; service edit skips corpus rebuild. All required browser/publication work is accounted for.

Failures are investigated before corpus expansion. No candidate parity or performance claim follows from this design document.
