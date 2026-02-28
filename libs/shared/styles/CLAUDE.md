# @retail/shared/styles — Shared SCSS

**Purpose**: SCSS variables, mixins, typography, and Angular Material theme shared between both apps.

**This is NOT an Nx project** — it's a plain SCSS directory without `project.json` or tags.

**Import**: Both apps use `stylePreprocessorOptions.includePaths: ["libs/shared/styles/src"]` in their `project.json`, then import with `@use` in their `styles.scss`.

## Structure

```
src/
├── _variables.scss     # Colors, spacing, breakpoints
├── _mixins.scss        # Responsive mixins, truncate, etc.
├── _typography.scss    # Font families, sizes
├── _theme.scss         # Angular Material custom theme
└── index.scss          # Entry point that re-exports everything
```

## Usage in Apps

```scss
// apps/retail-cliente/src/styles.scss
@use '@retail/shared/styles' as shared;
// or individual partials:
@use 'variables' as vars;
@use 'mixins';
```

## Principles

- Mobile-first breakpoints (target audience accesses primarily from mobile)
- Consistent spacing scale
- Angular Material theme customization via `_theme.scss`
- No component-specific styles here — those belong in component `.scss` files

## Cross-References

- `../../../CLAUDE.md` — workspace conventions, responsive requirement
