# STATUS.md

Resumable rewrite state (EXPERIMENTAL, v4.8). Read REWRITE.md, AGENTS.md and HANDOVER.md.

Mark each phase: not started / in progress / blocked / done.

| Phase | Status | Acceptance criteria | Required evidence | Commands | Commit |
| --- | --- | --- | --- | --- | --- |
| 1 Understand old product | | | | | |
| 2 Freeze design/behaviour reference | | | | | |
| 3 Inventory content/routes/features | | | | | |
| 4 Extract requirements | | | | | |
| 5 Choose Nift-native architecture | | | | | |
| 6 Prove representative vertical slice | | | | | |
| 7 Rebuild shared structure | | | | | |
| 8 Rebuild full corpus | | | | | |
| 9 Validate design/behaviour parity | | | | | |
| 10 Performance campaign | | | | | |
| 11 Full parity revalidation | | | | | |
| 12 Final benchmarks | | | | | |
| 13 Clean-checkout proof | | | | | |
| 14 Handover | | | | | |

GATE: freeze product/design/behaviour evidence and prove a vertical slice before broad rebuilding.
GATE: complete validation precedes profiling/optimization; full revalidation precedes final benchmarks.

## Architecture and campaign evidence

- Significant retained/introduced islands; source model, accessibility/shared-state/maintenance/cost reasons:
- Complete production pipeline, including independently prepared browser-side bundles:
- Profiles/hotspots, general improvements, before/after measurements and justified deferrals:
- Final validation command/result and equivalent benchmark workloads (qualify changed workloads):

## Current

- Checkpoint:
- Commit SHA:
- Blockers/approved decisions:
- Next checkpoint:

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
