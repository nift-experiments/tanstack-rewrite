# HANDOVER.md
v0.0.8

This is a living handover for working effectively in a Nift project.

Canonical version:

https://nift.dev/HANDOVER.md

Check the version at the top of this file against the canonical copy when the
project is old, unfamiliar, or behaving differently from the current Nift
documentation.

To replace this file with the latest canonical version:

```sh
curl -fsSL https://nift.dev/HANDOVER.md -o HANDOVER.md
```

If this project has project-specific additions, preserve or reapply them when
updating the canonical handover.

This project uses Nift as part of its website build process.

Nift is the project's build-time templating and dependency layer. It does not determine what the website is about or what other technologies the project should use.

Keep the existing project architecture and use the project's normal HTML, CSS, JavaScript, frameworks, backend, and other tooling where appropriate.

Do not introduce Nift-specific machinery where ordinary web tooling is the clearer solution.

## Start here

Before making substantial changes:

1. Inspect `.nift/config.json` and `.nift/tracked.json`.
2. Inspect the existing `content/`, `templates/`, and output structure.
3. Read this project's `README.md` and other project-specific documentation.
4. Run:

```sh
nift status
```

During normal development, build frequently:

```sh
nift build
```

Use this throughout a task, not only at the end. Rebuild after meaningful
changes so Nift can surface template, path, dependency, configuration, and
tracking errors while the cause is still obvious.

In particular, run `nift build` immediately after editing
`.nift/config.json` or `.nift/tracked.json`.

Use:

```sh
nift status
```

when you want to inspect what Nift considers stale and why.

Successful `nift build` output may include indented `↳ ...` lines explaining
why a page was considered stale and rebuilt, such as a missing generated output
or a changed dependency. These are rebuild reasons, not errors. Actual build
failures are reported as errors and cause the build to fail.

Do not delete or recreate `.nift/`.

## Nift's core template model

Most Nift websites need very little Nift-specific syntax.

The three primitives you will use most often are:

```text
@content
@input(...)
@path(...)
```

`@content` inserts the tracked page's content into its template.

```html
<main>
    @content
</main>
```

`@content` should execute exactly once across the rendered template/input graph
for a tracked page. It is normally placed in the page's template; the tracked
content file supplies the content inserted there.

Content files may still use other Nift syntax when needed. If page text needs
to display Nift syntax literally, prefix the active sigil with `\` rather than
leaving it as template syntax:

```html
<code>\@content</code>
<code>\@path('about')</code>
<code>\$[title]</code>
```

This applies whenever `@...`, `$[...]`, or other Nift syntax is intended as
literal output rather than something Nift should execute or resolve.

`@input(...)` inserts a reusable file and automatically makes it a dependency of the output using it.

```html
@input('templates/header.html')

<main>
    @content
</main>

@input('templates/footer.html')
```

### Structured JSON and markup sources

Use name-first `@json` when a template needs immutable structured data:

```text
@json(name, path)
@json(name, schema-path, path)
@json(name, schema-name, path)
@json(name){...}
@json(name, schema-path){...}
@json(name, schema-name){...}
```

Inline bodies are evaluated as Nift templates before JSON parsing. A schema
name refers to an earlier JSON binding. Data and schema files are automatic
dependencies and paths must stay inside the project.

Use `@markup(format){...}` or `@markup(format, path)` for Markdown (`md`),
AsciiDoc (`adoc`) or reStructuredText (`rst`). Nift evaluates template syntax in
the source first, Markup++ converts it once, and the resulting HTML is appended
without being parsed as Nift syntax again. File sources and host-resolved
AsciiDoc/RST includes are automatic dependencies.

`@path(...)` creates project-aware links to tracked pages and local assets.

Nift has additional features including metadata, JSON data, loops, conditionals, pagination, contracts, and explicit dependencies. Use them when the project actually needs them; do not use advanced features merely because they exist.

When writing expressions inside constructs such as `@if(...)`, refer to values directly rather than wrapping them in `$[...]`. For example:

```html
@if(name == 'about'){...}
```

Use `$[...]` when resolving or rendering a value into output, for example `$[title]`. Consult the expressions and control-flow documentation when using more advanced expression syntax.

## Internal links: use `@path`

Use `@path(...)` for internal links.

This applies to:

- links between pages;
- stylesheets;
- JavaScript;
- images and other local assets where Nift should know the relationship.

For pages, link to the **tracked page name**, not its generated file.

```html
<nav>
    <a href="@path('/')">Home</a>
    <a href="@path('about')">About</a>
    <a href="@path('docs')">Docs</a>
    <a href="@path('contact')">Contact</a>
</nav>
```

Do this:

```html
<a href="@path('about')">About</a>
```

Do not do this:

```html
<a href="@path('about.html')">About</a>
```

and do not hard-code the generated output path:

```html
<a href="about.html">About</a>
```

The tracked page name is the stable project identity. Its output filename or location may change independently.

CSS and JavaScript includes should also use `@path(...)`:

```html
<link rel="stylesheet" href="@path('public/assets/style.css')">
<script src="@path('public/assets/app.js')"></script>
```

Do not calculate relative paths such as:

```html
<link rel="stylesheet" href="../../assets/style.css">
```

Using `@path` lets Nift resolve the correct output-relative path and check the project relationship during the build.

## Project configuration

`.nift/config.json` contains project-level Nift configuration.

`.nift/tracked.json` describes tracked pages and their metadata, including things such as their content, template, and output relationships.

By default, ordinary CSS, JavaScript, images, fonts and other static assets live
directly in the configured output tree (normally `public/`) and do not have
entries in `.nift/tracked.json`. Edit those files in place. This keeps Nift's
tracked graph focused on content that Nift actually renders and avoids duplicate
source/output copies for files that need no build-time transformation.

Track an asset only when Nift genuinely needs to generate it from content,
templates or build-time data. Template-less tracked entries remain available for
that advanced case; they are not the default asset workflow.

These files are part of the project and should evolve with its structure.

If you add, remove, or reorganise pages, templates, outputs, deployment settings, or other Nift-managed structure, inspect the relevant `.nift` configuration and update it where necessary.

Do not treat `.nift/` as disposable generated state.

Do not invent `.nift/tracked.json` fields or assume arbitrary fields become
`$[...]` metadata. When you need tracking behaviour or metadata that is not
already demonstrated by the project, consult the tracked-files and metadata
documentation rather than guessing.

## Output directory

Do not assume the generated website always lives in `public/`.

A normal Nift project may use `public/`, but deployment targets can use a different output structure appropriate to the platform.

Inspect `.nift/config.json` before making assumptions about output paths.

Edit Nift-managed page sources rather than their generated output. Edit untracked
static assets directly in the configured output tree, unless the project
documents another tool or source directory as their owner.

## Pagination

Pagination has several related pieces across `.nift/tracked.json`, page
content, pagination templates, and generated page links. Do not infer its full
behaviour from this handover.

If working with pagination, read the dedicated documentation first:

https://nift.dev/docs/pagination.html

Preserve the project's existing pagination structure unless the task actually
requires changing it, and run `nift build` frequently while doing so.

## Other stacks and tools

Nift does not need to own the whole application.

A project may use Nift alongside tools such as Vite, React, Vue, Svelte, TypeScript, Go, Node, Python, PHP, serverless functions, or other systems.

Keep responsibilities separated:

- use Nift for build-time composition, tracked relationships, and dependencies;
- use the neighbouring tool for the job it is designed to do.

Do not replace an existing stack with Nift-specific code simply to make more of the project use Nift.

## Before finishing

Run:

```sh
nift build
nift status
```

The build should succeed and `nift status` should report the project up to date.
Spot-check generated output when changes affect paths, templates, tracked
relationships, or deployment structure.

## Documentation

Nift documentation:

https://nift.dev/docs.html

When unfamiliar with the project, prioritise:

1. Getting started — https://nift.dev/docs/getting-started.html
2. the three-primitives/template-language material;
3. paths and tracked files, especially `@path`;
4. project structure;
5. `.nift/config.json` and `.nift/tracked.json`;
6. incremental builds and CLI commands.

Then read feature documentation only when the task requires it, for example:

- JSON and control flow;
- pagination;
- contracts;
- minification;
- deployment targets;
- integration with other application stacks.

Prefer documented Nift behaviour and the existing project structure over guessing based on another website generator or framework.

## TanStack rewrite / R0

This project intentionally replaces architecture while preserving exact observable TanStack.com design/behavior. Follow REWRITE.md and the user rewrite contract over the generic advice to keep an incumbent architecture. Upstream pin 862ccc3d191818320c3e6d217542883f80cb907a; independent rewrite repository; accepted migrations remain untouched. Nift 4.10.0 binary frozen outside the checkout with SHA in evidence/r0/initialization.json. R1 inventories routes, dynamic/session/service boundaries and freezes reference before any representative rewrite. Starter is not a parity result.

## Rewrite campaign progress

R0 is committed and pushed on `master` (`8bb2a68`). R1 now freezes the 314-pattern route inventory, 7,601 source identities and independent 1,867-file production output. The corrected representative reference capture has 96 states, zero browser errors and eight rich-tab assertions. Further interaction/service/session contracts remain pending, so this is not full reference or candidate certification.

R2 proposal is `investigation/ARCHITECTURE.md`: authored/hybrid sources, Nift-owned article HTML outside scoped React roots, explicit request composition and independent backend build. R3 has only a three-real-document parser equivalence proof so far. Four pure pinned upstream files are retained; the independent parser build works with pinned dependencies. No full candidate parity or performance campaign yet. Continue through the representative proof before scaling; no real stop condition has been demonstrated.

Reference server runs locally on 4121 with controlled external fixtures and an independent output copy under `../tanstack-rewrite-baseline`. All browser image/raw logs stay there. Do not write through the baseline's links to accepted migration fixtures. Nift core and accepted migration/Labs trees remain untouched.

The isolated R3 ownership proof now passes. Run `npm run proof:authority:build` then `TANSTACK_TOOLCHAIN=<frozen baseline toolchain> npm run proof:authority:browser`. It intentionally lives under ignored `.work/authority`; it is not a candidate TanStack publication. Evidence in `evidence/r3` explicitly limits its claims. Rendering still uses generic package HTML in the article proof, so exact upstream custom component/page parity remains unresolved work, not a waived difference. The original Tabs adaptation passes framework route state explicitly and preserves its rendering/state/keyboard implementation. Avoid calling this full R3 acceptance.

R3 article rendering has advanced: `scripts/proof-document.mjs` compares three real article bodies against frozen HTML, passing after restoring the original feedback wrapper and production image define. `proof-codeblock.mjs` independently compares a real block exactly. Retained Router context supplies original MarkdownLink semantics without Start. `publisher/views/CommentTabs.tsx` currently covers ordinary/bundler tabs; unsupported package/file/component categories throw rather than disappear. `frontend/article-controls.js` is a pending native controller for declared published tab groups; it is not yet accepted browser evidence. Continue with controller interaction/copy/feedback and full shared shell, not broad scaling.

`proof-article-controls.mjs` now passes on the actual narrow-rendered rich article composed by Nift, proving three groups synchronize and persist with zero errors. It uses minimal visibility CSS for the isolated logic test and therefore contributes no whole-page visual certification. Browser source `article-controls.js` owns only declared tab state; article content stays authoritative. Full representative R3 gate remains open.

`proof-session.mjs` retains exact framework-agnostic upstream session/schema sources and independently checks HMAC/cookie/OAuth contracts with a local fixture secret. It does not invoke production providers or databases. The owned service source boundary is established only for these primitives; complete service dispatch, authenticated capability and chat/streaming proofs remain open.

`proof-auth.mjs` verifies retained auth service/guards with signed local sessions and injected repositories. The auth service adaptation makes the existing database-configured check a required constructor callback; session validation/mapping/revocation and guard bodies remain original. This prevents the client/publication graph from importing database setup. It proves controlled authenticated states, not live provider/database integration.

`proof-article-pixels.mjs` + `verify-article-pixels.py` pass four exact-RGB isolated Query overview states. Reference fragment comes from the actual upstream Worker DOM, not candidate output. It is cloned into matching geometry/styles because a direct element screenshot includes upstream sticky navigation overlays. The initial full-context attempt is retained outside Git; no whole-page result is claimed or waived. Images remain under the external rewrite baseline; compact hashes/results are committed.

`inventory-document-features.mjs` completes a raw syntax inventory over the full maintained corpus without migrating it. Seven used component kinds are recorded in evidence/r1/document-feature-inventory.json; metadata variants and code languages supply concrete representative sources. Resolved includes, site-specific HTML mappings and outputs still require separate proof.

The real Rendering Markdown guide now joins the article proof (four real DOMs and exact parser ASTs). Its literal `@content-collections` code survives Nift composition byte-for-byte except terminal whitespace. Additional reference files are frozen separately under reference-extra; the accepted 96-state snapshot is not overwritten. The native tab controller now updates selected border/text styling as well as ARIA/panel state, and that styling assertion passes. Full R3 acceptance remains pending.

The first real Form overview file-tab block now matches frozen upstream DOM (same bounded ID/style normalization as article proofs). The exact upstream FileTabs view is retained without changes. Native controls prove independent groups, unique IDs, two visible panels, Home/End and literal preservation. Run `proof:file-tabs` with the frozen browser toolchain. Full Form/framework/package-manager rendering and the whole R3 gate remain pending.

Six real article bodies now match frozen upstream DOM: the original four plus full Form overview and AI Anthropic adapter. Form framework URLs redirect upstream to a framework-free canonical path; candidate rendering uses that actual path, rather than normalizing away link differences. Exact owned package/framework views use explicit preferences and retain URL > user > local > react priority and first-panel fallback. Real-source preference checks pass; Nift-composed AI article passes shared/persisted package-manager selection, selected classes and Home/End. Full preference update/session integration, clipboard/toast/install-copy analytics and whole shell remain pending. No R3 acceptance or scaling/benchmarking yet.

Independent API-only feasibility now passes for three byte-preserved original auth server-function definitions using the official TanStack Start compiler/protocol/context/CSRF middleware, retained auth/session/guards and explicit local repositories. Generated-client browser calls cover anonymous/signed sessions, capability allow/deny and version revocation; HTTP guards return 403 cross-origin, 405 wrong-method and 404 ordinary page. Full nested/orphan import graph excludes original site source, publication views and document corpus. Start has an earned bounded service-protocol role here, not publication/root hydration. Read services/protocol-proof/README.md: independent release install/lock, provider/database/chat/full API integration and R3 acceptance remain pending. This is feasibility, not a benchmark or certified service release.

Two real AI agentic-cycle Mermaid diagrams now activate as declared scoped roots on Nift-composed article HTML, preserve outside article mutations and react to theme changes with zero hydration/browser errors. Dark SVG markup exactly matches frozen upstream after bijective generated-ID/reference normalization only. Two demonstrated island integration fixes are explicit in provenance: unique hydrateRoot identifierPrefix and initial theme from the actual document class. Exact Mermaid 11.14.0 retained. The isolated comparison uses pinned CSS/local fonts; upstream blocked Google stylesheet is excluded from candidate fragment and disclosed, not a whole-page font claim. Full shell/light/pixel and fallback clipboard/toast remain pending. R3 remains open.

PublishedRegion now proves native-owned Nift article descendants inside a React-owned host: the hydration markup object is fixed for the mount; new publication HTML installs explicitly after commit with optional child-island cleanup/activation. Real Query overview/comparison bodies preserve marker node identity and native edits through twelve shell updates each. A rendered-file dependency change followed by explicit navigation installs the fresh second Nift output, including its table. Hydration-compatible shell serialization is renderToString; no document AST client payload exists. Actual Navbar/Router/full-shell/SEO integration remains pending. This boundary extends feasibility, not R3 acceptance.
