# CONTENT-INVENTORY.md

Inventory routes, content, assets, metadata, search/download/export and client interactions.

| Item/route | Source | Requirement | Proposed disposition | Owner/approval | Validation evidence |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Corpus-driven syntax coverage

`evidence/r1/document-feature-inventory.json` parses all 7,527 nonempty maintained render candidates (one empty input remains separately identified). It inventories raw syntax, not resolved include/output correctness. Seven actual component kinds occur: tabs (135 files), framework (55), framework-panel (54), live-example (36), tab-panel (31), chart-example (14) and client-example (7). These constrain implementation and representative tests; do not add unused component conventions.

Standard article rendering is proved on three real documents. Remaining required owners include package/file tabs, framework filtering/profile state, live workbench, chart/client examples, Mermaid and site-specific mapped HTML elements. Counts/examples in the receipt identify real test sources. Literal Nift-like code is inventoried separately and must remain data through composition.
