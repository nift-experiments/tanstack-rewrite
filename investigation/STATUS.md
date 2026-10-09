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
