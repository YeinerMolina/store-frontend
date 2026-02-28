# @retail/shared/util — Pure Functions

**Purpose**: Pure utility functions without Angular dependencies. Formatters, validators, helpers.

**Tags**: `scope:shared`, `type:util`

**Allowed Dependencies**: NONE. This is the base layer.

**Import Path**: `@retail/shared/util`

## Principles

- NO imports from `@angular/*`. If it needs Angular, it doesn't belong here.
- Pure functions, testable without TestBed.
- No side effects, no service injection.

## Structure

```
src/lib/
├── formatters/
│   ├── currency.formatter.ts   # formatCurrencyCOP(amount) → formatted COP string
│   └── date.formatter.ts       # Date formatting utilities
├── validators/
│   └── documento.validator.ts  # Document number validation
├── helpers/
│   ├── pagination.helper.ts    # Pagination calculation helpers
│   └── http-params.helper.ts   # buildHttpParams(params) → HttpParams (omits null/undefined)
└── index.ts
```

## Key Functions

- `formatCurrencyCOP(amount: number): string` — formats number as Colombian Peso using `Intl.NumberFormat`
- `buildHttpParams(params: Record<string, unknown>): HttpParams` — builds HttpParams skipping null/undefined values
- Note: `buildHttpParams` imports `HttpParams` from `@angular/common/http` — this is the one Angular exception for this utility (it's a value object, not a service)

## Cross-References

- `../../../CLAUDE.md` — workspace conventions
