# @retail/shared/ui — Reusable Visual Components

**Purpose**: Presentational ("dumb") components reusable between both apps. Receive data via input, emit events via output. No API injection, no business logic.

**Tags**: `scope:shared`, `type:ui`

**Allowed Dependencies**: `@retail/shared/domain` (model types), `@retail/shared/util` (formatters). NEVER depend on `@retail/shared/data-access`.

**Import Path**: `@retail/shared/ui`

## Principles

- Every component is `standalone: true`
- Every component uses `ChangeDetectionStrategy.OnPush`
- Use signal-based `input()` / `output()`, NOT decorators
- CSS selector prefix: `retail-`
- No service injection. If it needs data, it receives via input.
- No business logic. Parent decides what to show, component just renders.

## Components

| Component | Selector | Description | Used by Cliente | Used by Empleado |
|-----------|----------|-------------|-----------------|------------------|
| ProductCardComponent | `retail-product-card` | Product card: image, name, price, availability | Catalog, Home | Product search |
| PriceDisplayComponent | `retail-price-display` | Formatted COP price | All | All |
| AvailabilityBadgeComponent | `retail-availability-badge` | Indicator: available/few units/sold out | Catalog, Detail | Inventory |
| LoadingSkeletonComponent | `retail-loading-skeleton` | Visual placeholder during loading | All | All |
| EmptyStateComponent | `retail-empty-state` | Message + CTA when no data | Empty catalog | Empty lists |
| ErrorStateComponent | `retail-error-state` | Error message + retry button | All | All |
| ImageGalleryComponent | `retail-image-gallery` | Image gallery with navigation | Product detail | Product detail |
| PaginationComponent | `retail-pagination` | Pagination controls | Catalog | Lists |
| SearchInputComponent | `retail-search-input` | Search input with debounce | Client header | Employee lists |
| ConfirmDialogComponent | `retail-confirm-dialog` | Confirmation modal for destructive actions | (post-MVP) | Status change, delete |

## Pipes

- **CurrencyCopPipe** — formats COP currency
- **RelativeTimePipe** — relative timestamps

## Directives

- **LazyImageDirective** — Intersection Observer lazy loading

## Structure

```
src/lib/
├── components/
│   ├── product-card/
│   ├── price-display/
│   ├── availability-badge/
│   ├── loading-skeleton/
│   ├── empty-state/
│   ├── error-state/
│   ├── confirm-dialog/
│   ├── image-gallery/          # .gitkeep (to implement)
│   ├── quantity-selector/      # .gitkeep (to implement)
│   ├── pagination/
│   └── search-input/
├── directives/
│   └── lazy-image.directive.ts
├── pipes/
│   ├── currency-cop.pipe.ts
│   └── relative-time.pipe.ts
└── index.ts                    # Barrel export
```

## Rule for Adding Components

Only add to shared/ui if BOTH apps use it TODAY, not "just in case". Review in PR.

## Cross-References

- `../../../CLAUDE.md` — workspace conventions
