# @course/styles

Shared design tokens + minimal reset for every lesson in the course.

## Files

- `tokens.css` — OKLCH color palette + semantic tokens, spacing, radius, type scale, motion. Imports into `@layer tokens`.
- `reset.css` — modern CSS reset with logical properties. Imports into `@layer reset`.
- `base.css` — body-level defaults that reference tokens. Imports into `@layer base`.
- `index.css` — one-stop import that declares the cascade order and pulls in the three above.

## Usage in a lesson

```css
/* src/app.css */
@import '@course/styles/index.css';

@layer base {
	/* page-level defaults specific to this lesson go here */
}
```

## Why a workspace package?

If every lesson had its own copy, updating one token (say, the accent color)
would mean touching 34 files. A workspace package gives you one source of truth
and pnpm symlinks it everywhere for free.
