# Feature: Login

> Feature path: `features/login/`

## UX Screen

Employee Login

## Route

`/login` — outside shell, no authGuard

## Description

Authentication form. Only screen accessible without JWT.

## Structure

```
login/
├── login-page/
│   ├── login-page.component.ts/html/scss
├── (future: login-form/ component)
└── login.routes.ts
```

## Page Component

**`LoginPageComponent`** — renders login form, handles submit, redirects to `/dashboard` on success.

## Shared Dependencies

| Dependency | Library |
|------------|---------|
| `AuthApiService` | `@retail/shared/data-access` |
| `AuthStore` | `@retail/shared/data-access` |
| `LoginCredentials` | `@retail/shared/domain` |

## State

Uses `AuthStore` to set auth state on successful login.

## Error Handling

| Scenario | Message |
|----------|---------|
| 401 Unauthorized | "Credenciales incorrectas" |
| Network error | "No pudimos conectarnos" |

## Cross-References

- [`../../../CLAUDE.md`](../../../CLAUDE.md) — app-level auth flow
