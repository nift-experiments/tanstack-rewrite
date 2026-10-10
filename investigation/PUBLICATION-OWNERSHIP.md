# Corrected publication ownership

This supersedes the prototype server-startup publication and the old representative-only scaling gate. `public/` is the single website publication. The runtime serves it and dispatches genuinely dynamic session/service regions; startup must never generate or copy site assets.

| Family | Maintained source | Preparation | Nift input | Destination / owner |
|---|---|---|---|---|
| Authored documents | sources/docs Markdown/frontmatter | Bounded pinned semantics renderer | Prepared HTML, metadata and real source dependencies | Tracked articles and complete page templates in public |
| Generated documentation | Structured maintained inputs | Family-specific projection | Prepared HTML/data, explicit dependencies | Tracked outputs in public |
| Homepage / marketing | Owned homepage component/content derived from pinned source | Static content projection; declared interactive regions | Shared page template and prepared content | Tracked homepage and marketing pages in public |
| Images / video / audio / icons | Ordinary untransformed assets maintained directly in public | None; one-time import with provenance | @path references | Same files in public; no duplicate sources/static tree |
| Fonts | Local maintained font assets in public | None | @path includes / stylesheet-owned URLs | public assets |
| CSS | Maintained CSS or declared stylesheet compiler source | Only when actually compiled | @path stylesheet includes | public assets |
| Browser JavaScript | frontend sources and retained narrow closure | Independent browser bundler | @path script includes and island bootstrap | Generated bundles in public assets |
| React / TanStack islands | frontend region owners | Browser bundle and optional renderer compilation | Explicit region HTML/bootstrap; no document AST | Declared browser roots only |
| SSR runtime | Request renderer sources | Independent Node/service compilation | Published templates and declared dynamic slots | Runtime artifact outside public; never publishes at startup |
| Downloads | Authoritative authored source | Derived byte-preserving export | Tracked export / explicit preparation dependency | public downloads |
| Search data | Corpus metadata/content | Required index preparation | Declared inputs and outputs | public index; external live search remains a documented integration |
| Backend endpoints | services sources | Independent protocol/backend compiler | Not a dependency of ordinary documents | Runtime artifact; never a substitute for publication |

Nift @path checks tracked page identities and local assets. Runtime/API, external URLs, fragment-only links and bundler-relative imports are documented exceptions. Prepared raw content must preserve literal code; path-bearing markup is handled separately from code text. @input owns shared template includes. Any remaining adapter must identify its responsibility, why ordinary Nift composition cannot perform it directly, and its input/output dependency contract.

The preparation pass now emits the homepage and complete tracked page bodies. Normal publication is being verified through the Nift compiler DAG. Existing corpus availability is not final parity acceptance. Unknown routes and unfinished runtime owners remain in the central ledger.

## Remaining runtime adapter justification

The request dispatcher reads the complete Nift-published HTML and replaces only declared request-context and shell slots. The static document content is the Nift publication, not a duplicate AST. Fresh sessions/partner placement require request evaluation and cannot be frozen into a build artifact. Canonical extensionless upstream application routes dispatch to the corresponding checked Nift page output; this is one route-family rule. The @path-derived URL map is a build-to-runtime interface for those request-rendered components and their assets. Shared Nift heads use direct @path expressions and @input; server startup performs no publication/copying. Homepage interactive regions are explicit React portals within a native PublishedRegion, preserving the outer publication.

## Compiler lifecycle and runtime interface

`_build/frontend` is a Nift custom action for the independent browser/publication compilers. `_build/preparation` depends on it and runs corpus projection. Ordinary source directories and compiler outputs participate in Nift file dependencies. Tracked articles/pages depend on preparation and retain their own prepared-file dependencies. The compiler caches verify input signatures and output bytes; they reuse transformations inside a Nift-scheduled action, rather than deciding whether the publication command runs. Route graph discovery bootstraps a clean workspace; normal builds execute the Nift DAG.

The preview consumes the checked URL manifest for request-rendered components and normalizes Nift-generated fragment references at the fragment response boundary. Real URL attributes, including srcset and poster, are parsed with source offsets so literal code is preserved. All retained JSX local URL attributes and the homepage video island consume the same Nift-generated publication path interface. Browser JavaScript contains no unevaluated Nift syntax. This interface is loaded before hydration; bundler imports and API paths retain their own owners.

Untransformed public assets are maintained in place with a compact hash inventory. Routine preparation no longer imports upstream public files or copied reference stylesheets. The current maintained stylesheet is pinned reference CSS; independent stylesheet-source compilation remains a packaging/parity gap. Backend compilation owns a separate artifact and 120 public API route modules; the Cloudflare-backed stream service remains an explicit runtime verification gap. Local session signing material is generated privately in ignored .work; production deployment must supply its ordinary session configuration.

Shared landing publication now projects original authored JSX into Nift-owned markup and explicit React portal slots, across 20 library families. The MCP family is an upstream redirect to the CLI migration guide, not a landing page. Chart catalog cards derive from the pinned, maintained generated-content index in sources/generated/charts. Preparation and output composition use sequential Nift invocations when Nift status identifies stale preparation actions; dependency decisions remain native to Nift.

The shared browser path interface now includes checked navigation identities and library-root aliases as well as all maintained assets. React `to` attributes also consume it. The former separate asset map is superseded by the single checked manifest. Native navigation covers homepage, published landings, docs and root-library redirects; application families still outside publication retain browser navigation and remain gaps.

## Application-family runtime publication

Maintained application views and structured original route identities compile independently of backend implementations. Nift owns the shared application envelope and 99 leaf-family native boundaries. Request-scoped original loaders evaluate current sessions/service data; SSR fills only declared request slots, and React portals activate only the explicit application island. The preview reads these built artifacts and does not manufacture publication files. A family boundary is a runtime contract, not a statically completed page. Browser smoke does not establish configured backend/visual parity. CSS bundles are projected through checked Nift URL expressions; Vite development-only HMR is disabled in the production browser compiler.
