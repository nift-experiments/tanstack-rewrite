# BEHAVIOR-CONTRACT.md

Specify route/content, redirects, search/download/export, responsive/browser interactions, keyboard/accessibility and SEO/meta parity.
Record equality rule, fixtures and validation command for each. Differences require explicit approval.

## R1 contract inventory

`evidence/r1/route-contract-inventory.json` enumerates 314 route patterns from the pinned generated route tree and classifies service, session, application and document responsibilities. Patterns are not concrete publication pages. Parameterized paths, negotiated responses and private states must receive explicit concrete tests before acceptance.

| Contract | Equality rule | Evidence / remaining proof |
| --- | --- | --- |
| Authored documents | Original input bytes and metadata identities; equivalent rendered content | 7,601 input identities, 7,527 nonempty render candidates; candidate rendering pending |
| Public assets | Exact bytes | 244 original assets; manifest frozen |
| Themes and widths | Same visible layout, type, assets, responsive behavior | Reference capture; candidate and interaction comparisons pending |
| Rich tabs | Keyboard semantics, selection and panel content | Reference click assertion; keyboard and candidate pending |
| SEO and HTTP | Status, canonical, title, metadata, redirect and negotiated output | Frozen HTTP and route receipts; candidate pending |
| Dynamic placement | Fresh valid request seed, original placement rules, hydration agreement | Must test repeated requests; frozen whole-page sessions forbidden |
| Auth/chat/services | Original observable permission, streaming, session and storage contracts | Controlled local fixtures required; no private-live certification implied |
| HTML ownership | Published article changes survive client activation and navigation | Mandatory representative candidate test |
| Search and exports | Same indexing scope and generated projections | Separate production stage; candidate pending |
