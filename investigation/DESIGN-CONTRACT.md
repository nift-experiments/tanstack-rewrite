# DESIGN-CONTRACT.md

Freeze visual design, layout, typography, breakpoints, assets and interaction states.
Record reference viewports and comparison tolerances; new internal architecture does not authorize design changes.

## Frozen product, independent architecture

Preserve original Inter typography, colors, spacing, gradients, partner assets, menus, theme behavior, tab states and responsive geometry. The rewrite has no authority to redesign TanStack.com. Both themes are verified against actual root classes and computed background colors, not merely requested browser color schemes.

Compare matching routes, widths, themes, data fixtures and interaction states against the independent reference. Normalize only demonstrated nondeterministic identifiers or placement order; do not mask missing content, geometry, interactions or client errors. Rasterization differences must be classified with evidence, not handled by a broad permissive screenshot threshold.
