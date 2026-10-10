# API-only feasibility proof

This representative proof retains the official TanStack Start server-function compiler, wire protocol, request context and CSRF middleware. It does not use Start to publish or hydrate the site. Its router has only an empty root and its ordinary-request fallback returns 404. The generated client entry exposes three original auth calls for browser verification only.

The three function definitions are copied unchanged from the pinned upstream auth.functions.ts. The auth factory supplies retained AuthService, SessionService and guards with explicit local user/capability repository fixtures. No production provider, database, credentials, deployment or complete service parity is claimed.

`probe-api-build.mjs` creates ignored `.work/api-prototype` from these maintained files. For this feasibility test only, module resolution uses the existing frozen original dependencies and official Rsbuild toolchain read-only. The prototype is not a routine production build command; independently provisioned dependencies and a release lock remain required before acceptance. Run it with frozen Node 25.9.0, then run `proof-api-protocol.mjs` with `TANSTACK_TOOLCHAIN` pointing to the frozen browser toolchain.

Raw build logs and module manifests remain outside the repository under the rewrite baseline. Compact receipts cover generated-client anonymous/authenticated calls, capability enforcement, revocation, 403 CSRF rejection, 405 method rejection and the 404 ordinary-page boundary. The import audit includes orphan/nested modules and rejects original site source, publication views, document sources and content-collections.

Backend-function errors use the official Error serialization: custom `.code` fields are not preserved through this protocol. The HTTP proof checks the original error messages; direct service/guard proofs separately check the codes.
