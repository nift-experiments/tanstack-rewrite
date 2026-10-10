# Local publication

From this repository:

```sh
npm run build
npm run serve
```

Open http://localhost:4173/ for the actual homepage. Documentation URLs use their upstream extensionless paths, for example `/start/latest/docs/eslint/eslint-plugin-start`. Complete Nift outputs are in `public/index.html` and `public/<route>.html`; `public/publication/` contains article fragments used by native client navigation.

The normal build uses the Nift DAG: frontend compilation, maintained blog projection, corpus preparation, independent service compilation, then tracked composition. A clean local application state first bootstraps the route graph. The current pinned compiler/browser dependencies are still supplied by the adjacent experiment toolchain; independent clean-checkout packaging is an open campaign gate.

Preview startup serves the publication and evaluates declared request-time session/shell slots. It does not build or copy website assets. It creates a private local signing key in ignored `.work` if `SESSION_SECRET` is unset. Set `DATABASE_URL` to a deliberately configured database to test authenticated behavior. The campaign's disposable fixture uses loopback port 5549 and the database `nift_rewrite_fixture`; it is not a production connection.

Untransformed publication assets are maintained directly in public. The stylesheet source is `sources/styles/site.css` and Nift resolves its local URL references. Browser/runtime chunks are compiler outputs. See `investigation/PUBLICATION-OWNERSHIP.md` for the source/output contract and `investigation/CORPUS-GAPS.json` for behavior that still blocks final acceptance.

This is a runnable campaign checkpoint, not a parity or benchmark closeout. Continue through the remaining route families, interactions, runtime tests, profiling and final evaluation.
