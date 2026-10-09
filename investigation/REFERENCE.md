# REFERENCE.md

Freeze the old product's design and behaviour as immutable evidence.
Record repository/SHA, screenshots/viewports, routes, content, browser/keyboard/accessibility/SEO behaviour and reference build command.
Old implementation is evidence, not architecture to copy.

## Source model and production pipeline

Choose authored / rendered / hybrid independently of transformation intent.
Record source SHA, immutable reference output, candidate output, toolchain/binary hashes, external inputs,
all production stages including island/bundle preparation, deployment transforms, search and exports.
Never compare candidate output against itself. Record nondeterminism and byte/semantic equality rules.

## R1 frozen reference

Upstream: `862ccc3d191818320c3e6d217542883f80cb907a`. The independent production-output copy contains 1,867 files; every byte matches the accepted upstream output. `evidence/r1/reference-output-manifest.json` records identities. External docs, catalog and blog captures are separately pinned in the adjacent receipts; a website commit alone does not freeze those inputs.

Reference server: `scripts/reference/runtime-server.mjs`, port 4121, using the real compiled upstream Worker and controlled external fixtures. This is not a claim of live private-provider integration. The reference copy, browser images and toolchain remain outside website source in `../tanstack-rewrite-baseline`.

`capture.mjs` captures 12 representative routes at 1440, 768, 390 and 320 pixels in both themes. It records HTML, pixels, metadata, headings and errors, and exercises a rich-document tab. Reduced motion captures one state; animation, keyboard, search, navigation, session and authenticated contracts require additional proof. These captures are reference evidence, not candidate certification.

The capture initializer is restricted to the top window: chart frames intentionally have sandboxed origins. The initial initializer error was a harness defect and cannot be treated as an upstream behavior.
