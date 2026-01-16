# Tailwind CSS v4 Migration Research (DEFERRED)

## Recommendation: DEFER

Tailwind CSS v4 is a near-complete rewrite with extensive breaking changes. Recommend staying on v3.4.x for this project until:
1. Ecosystem stabilizes (shadcn/ui, plugins)
2. Browser support requirements can be verified
3. Dedicated migration sprint planned

## Key Breaking Changes

### 1. New Package Structure

| Purpose | v3 | v4 |
|---------|----|----|
| PostCSS | `tailwindcss` | `@tailwindcss/postcss` |
| Vite | N/A | `@tailwindcss/vite` |
| CLI | `tailwindcss` | `@tailwindcss/cli` |

### 2. Configuration Changes

- JS config (`tailwind.config.js`) not auto-detected
- CSS-first configuration using `@theme`
- Must use `@config` directive to load JS config

```css
/* Load JS config in CSS */
@import "tailwindcss";
@config "../../tailwind.config.js";
```

### 3. Import Syntax

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

### 4. Utility Renames

| v3 | v4 |
|----|----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` (3px) | `ring-3` (1px default) |
| `flex-grow-*` | `grow-*` |
| `flex-shrink-*` | `shrink-*` |
| `overflow-ellipsis` | `text-ellipsis` |

### 5. Opacity Utilities Removed

```html
<!-- v3 -->
<div class="bg-black bg-opacity-50">

<!-- v4 -->
<div class="bg-black/50">
```

### 6. Important Modifier Position

```html
<!-- v3 -->
<div class="!flex !bg-red-500">

<!-- v4 -->
<div class="flex! bg-red-500!">
```

### 7. Browser Requirements

v4 requires modern browsers:
- Safari 16.4+
- Chrome 111+
- Firefox 128+

Uses `@property` and `color-mix()` which older browsers don't support.

### 8. Removed Config Options

- `corePlugins`
- `safelist` (use `@source inline()`)
- `separator`

## Impact on This Project

### High Impact Areas

1. **tailwind.config.ts**
   - Extensive custom theme
   - `safelist` option used
   - Custom plugin using `addComponents`

2. **postcss.config.mjs**
   - Must switch to `@tailwindcss/postcss`
   - Remove `autoprefixer` (built-in)

3. **globals.css**
   - `@tailwind` directives -> `@import`

4. **All component files**
   - Shadow utilities
   - Ring utilities
   - Opacity utilities
   - Important modifier position

### Estimated Migration Effort

- Config migration: 2-4 hours
- Utility class updates: 4-8 hours (many files)
- Testing: 2-4 hours
- **Total**: 8-16 hours

### Upgrade Codemod

```bash
npx @tailwindcss/upgrade
```

Requires Node.js 20+.

## Alternative: Stay on v3.4.x

Current version (3.4.18) is stable and actively maintained. v3 will continue receiving bug fixes.

Update within v3:
```bash
npm install tailwindcss@^3.4.19
```

## References

- https://tailwindcss.com/docs/upgrade-guide
- https://tailwindcss.com/blog/tailwindcss-v4
