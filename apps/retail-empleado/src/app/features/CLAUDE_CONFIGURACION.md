# Feature: Configuracion

> Feature path: `features/configuracion/`

## UX Screen

Parameter Configuration (§4.7)

## Route

`/configuracion`

## Description

List of operational parameters with current value. Inline or modal editing. ADMIN profile only.

## Structure

```
configuracion/
├── configuracion-page/
│   ├── configuracion-page.component.ts/html/scss
├── components/
│   └── parametro-editor/      # Inline or modal editor for a parameter value
└── configuracion.routes.ts
```

## Page Component

**`ConfiguracionPageComponent`** — loads parameter list, manages editing state.

## Internal Components

### `ParametroEditorComponent`

Inline or modal editor for a single parameter. Receives parameter via input, emits updated value.

## Shared Dependencies

| Dependency | Library |
|------------|---------|
| `ConfirmDialogComponent` | `@retail/shared/ui` |
| `ConfiguracionApiService` | `@retail/shared/data-access` |
| `Parametro` | `@retail/shared/domain` |

## Access Control

Only ADMIN profile should access this feature (enforced by backend + optional frontend guard post-MVP).

## State

No local store. Page fetches on init, re-fetches after edit.

## Cross-References

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — app-level docs
