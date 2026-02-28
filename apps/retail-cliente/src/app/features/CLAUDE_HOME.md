# Feature: `features/home/` — Homepage / Landing

## UX Screen
Homepage / Landing

## Route
`/` (default route)

## Description
Entry page. Featured categories, recent products, search bar.

## Structure
```
home/
├── home-page/
│   ├── home-page.component.ts
│   ├── home-page.component.html
│   └── home-page.component.scss
├── components/
│   ├── featured-products/    # Grid of highlighted/recent products
│   └── category-highlights/  # Category cards/links
└── home.routes.ts
```

## Page Component
`HomePageComponent` — orchestrates data loading, manages loading/error/empty states.

## Internal Components
- `FeaturedProductsComponent`: displays a grid of highlighted products, receives product list via input.
- `CategoryHighlightsComponent`: displays category cards for navigation, receives categories via input.

## Shared Dependencies
- `@retail/shared/ui`: ProductCardComponent, SearchInputComponent
- `@retail/shared/data-access`: ProductosApiService, CategoriasApiService
- `@retail/shared/domain`: ProductoResumen, Categoria

## State
No local store needed. HomePageComponent fetches data on init.

## Cross-References
- `../../../CLAUDE.md` (app)
- `../../../../CLAUDE.md` (workspace)
- `CLAUDE_CATALOGO.md` (catalog navigation)
