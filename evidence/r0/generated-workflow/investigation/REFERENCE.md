# REFERENCE.md

Freeze the old product's design and behaviour as immutable evidence.
Record repository/SHA, screenshots/viewports, routes, content, browser/keyboard/accessibility/SEO behaviour and reference build command.
Old implementation is evidence, not architecture to copy.

## Source model and production pipeline

Choose authored / rendered / hybrid independently of transformation intent.
Record source SHA, immutable reference output, candidate output, toolchain/binary hashes, external inputs,
all production stages including island/bundle preparation, deployment transforms, search and exports.
Never compare candidate output against itself. Record nondeterminism and byte/semantic equality rules.
