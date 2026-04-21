# Resume notes — Svelte 5 Principal Engineer course

**Paused:** 2026-04-21, after Lesson 05 went green. **Part 1 DONE + Lesson 05 DONE (first lesson in the new "one real project per lesson" format).** Next work starts at Lesson 06 — Kanban board for control-flow blocks.

> Read this file top to bottom before doing anything. It captures what's built, what's verified, what the rules are, and what's next.

---

## 1. Where we are

**Part 1 — Runes fundamentals — COMPLETE.**

| Lesson | Rune | Format | Status |
|---|---|---|---|
| 01 | `$state` | 4-challenge (legacy) | ✅ Green — 296 files / 0 err / 0 warn on starter + solution |
| 02 | `$derived` | 4-challenge (legacy) | ✅ Green — 294 files / 0 err / 0 warn on starter + solution |
| 03 | `$effect` | 4-challenge (legacy) | ✅ Green — 294 files / 0 err / 0 warn on starter + solution |
| 04 | `$inspect` / `.trace` | 4-challenge (legacy) | ✅ Green — 294 files / 0 err / 0 warn on starter + solution |
| 05 | markup / attributes / events | one-real-project (Command Palette) | ✅ Green — 287 files / 0 err / 0 warn on starter + solution |

Billy's explicit instruction that anchors this: **"Keep the lessons done as is and from now on do it the way i said."** Then later: **"as a matter of fact finish lesson 3 and 4 so we start fresh 5 onwards"**. So Lessons 01–04 stay in the legacy 4-challenge format. Lesson 05 onward uses the new one-real-project format (see §4).

---

## 2. Exact state of the repo at pause

### Directory layout

```
/Users/billyribeiro/Desktop/svelte5-course/svelte5-principal-course/
├── README.md                         ✅ course overview, version table
├── RESUME.md                         ← THIS FILE
├── PROGRESS.md                       ✅ 34-lesson checklist; 01–04 ticked
├── VERIFICATION.md                   ✅ Batch 0, 1A, 1B, 1C, 1D rows
├── package.json                      ✅ root workspace, pnpm@10.33.0, node 24.x
├── pnpm-workspace.yaml               ✅ packages/*, lesson-*/starter, lesson-*/solution, final-project/solution
├── .npmrc                            ✅ engine-strict=true
├── .prettierrc                       ✅ tabs, single quotes, 100 width, prettier-plugin-svelte
├── tsconfig.base.json                ✅ strict, noUncheckedIndexedAccess, verbatimModuleSyntax, NodeNext
├── pnpm-lock.yaml                    ✅ generated
├── node_modules/                     ✅ installed
├── packages/
│   └── styles/                       ✅ @course/styles — OKLCH tokens, @layer, reset, base
├── lesson-01-state/                  ✅ DONE
├── lesson-02-derived/                ✅ DONE
├── lesson-03-effect/                 ✅ DONE — Pomodoro-adjacent 4-challenge format (canvas / timer / autoscroll / persist)
├── lesson-04-inspect/                ✅ DONE — 4-challenge format (basic / filtered / trace / debug)
└── lesson-05-markup/                 ✅ DONE — one-real-project format: Command Palette (⌘K / Ctrl+K, filter, ↑↓ nav, Enter to run, Esc to close)
```

Lesson directories 06 through 34 do **not** exist yet.

### Verified green (via `pnpm --filter ... check`)

| Package | Result | Files |
|---|---|---|
| `@course/lesson-01-starter` | 0 err / 0 warn | 297 |
| `@course/lesson-01-solution` | 0 err / 0 warn | 297 |
| `@course/lesson-02-starter` | 0 err / 0 warn | 295 |
| `@course/lesson-02-solution` | 0 err / 0 warn | 295 |
| `@course/lesson-03-starter` | 0 err / 0 warn | 295 |
| `@course/lesson-03-solution` | 0 err / 0 warn | 295 |
| `@course/lesson-04-starter` | 0 err / 0 warn | 295 |
| `@course/lesson-04-solution` | 0 err / 0 warn | 295 |
| `@course/lesson-05-starter` | 0 err / 0 warn | 287 |
| `@course/lesson-05-solution` | 0 err / 0 warn | 287 |

_File counts re-measured 2026-04-21 after the adapter-auto → adapter-vercel swap (Batch 1E). Lesson 01 is at 297, Lesson 02 at 295, because Lesson 01 ships extra `$lib` stubs._

To re-verify nothing has rotted:

```sh
cd /Users/billyribeiro/Desktop/svelte5-course/svelte5-principal-course
pnpm install
pnpm -r --parallel run check
```

### Task list at pause (in-conversation Tasks tool)

```
#1 [completed] Batch 0: scaffold repo + fetch Part 1 docs
#2 [completed] Batch 1A: Lesson 01 — $state
#3 [completed] Lesson 02 — $derived
#4 [completed] Lesson 03 — $effect
#5 [completed] Lesson 04 — $inspect
#6 [completed] Lesson 05 — Markup/attributes/events (Command Palette)
```

Next task to create: `Lesson 06 — Control flow blocks (Kanban board project)`.

---

## 3. Locked technical decisions (do not re-litigate)

### Version pins

| Package | Version |
|---|---|
| svelte | 5.55.4 |
| @sveltejs/kit | 2.57.1 |
| @sveltejs/vite-plugin-svelte | 7.0.0 (NOT 6.x — Vite 8 needs 7) |
| vite | 8.0.9 |
| typescript | 6.0.3 (NOT 7.x — npm's 7 tag is non-standard, 6 is actually latest) |
| svelte-check | 4.4.6 |
| @types/node | 25.6.0 |
| @sveltejs/adapter-auto | 7.0.1 |
| pnpm | 10.33.0 |
| node | 24.14.1 (current lts/krypton — pin the exact version, not `24.x`; 24.15.0 does not exist yet) |
| @sveltejs/adapter-vercel | 6.3.3 (course deploys to Vercel — NEVER use adapter-auto) |

### Stack choices

- **pnpm workspace**, `workspace:*` for internal deps like `@course/styles`.
- **Strict TypeScript** — `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`, `strict: true`.
- **No Tailwind, no Lucide.** Design tokens via `@course/styles`: OKLCH, `@layer tokens, reset, base, components, utilities`, logical properties.
- **SvelteKit filesystem routing** (`src/routes/+page.svelte`, `+layout.svelte`).
- **`$app/state`** (not `$app/stores`).
- **Runes mode** throughout.

### Conventions established in Lessons 01–04

- Starter stub comments: `// Lesson XX build:` + concrete instruction. Never `// TODO`.
- Each lesson has `README.md`, `starter/`, `solution/`, `reference/` (3–4 standalone `.svelte` files + README index).
- Every `.svelte` passes Svelte MCP autofixer with zero issues before being saved.
- Every starter/solution package passes svelte-check with 0 err / 0 warn.
- `pnpm install` clean at root before marking a lesson done.
- **No PineScript/ThinkScript analogies.** Ever.
- Plain-English mental models first, then code.

### Per-lesson scaffolding boilerplate

Copy from `lesson-04-inspect/starter/` (or `/solution/`) when creating a new lesson. Exact files:

- `package.json` — change the `name` to `@course/lesson-XX-starter` or `-solution`.
- `tsconfig.json` — extends `../../tsconfig.base.json` + `./.svelte-kit/tsconfig.json`.
- `svelte.config.js`, `vite.config.ts` — stock.
- `src/app.html` — title: `Lesson XX — TOPIC (starter|solution)`.
- `src/app.d.ts`, `src/app.css`.
- `src/routes/+layout.svelte`, `src/routes/+page.svelte`.
- `static/favicon.svg` — thematic OKLCH swatch.

---

## 4. NEW lesson format — Lesson 05 onward

### Structural template for the README

One cohesive project per lesson. README order:

1. **"The project you're building"** — one paragraph plus bulleted feature list. What it does, why it's a real thing a working engineer would build.
2. **"What this lesson teaches"** — the feature in focus, framed around how the project uses it.
3. **Concept section** — plain-English mental model, rules, worked examples — all tied to the project, not abstract.
4. **Common mistakes** — table with failure modes of the project's techniques.
5. **PE lens** — "how a staff engineer thinks about this."
6. **Build challenge** — the specific feature(s) the student fills in. Concrete acceptance criteria.
7. **Self-check** — 3 questions in `<details>` tags.
8. **Links** — official docs anchors.

### The project recipe

- Pick a project that makes the feature useful in a non-toy way. UI, state, interactions, edge cases.
- `starter/` ships the whole shell (routes, layout, non-concept logic) and stubs only the concept-specific parts. The student is never re-implementing plumbing.
- `solution/` is the same project, completed. Both pass svelte-check clean.
- `reference/` — 3–4 tiny `.svelte` files showing edge cases of the concept, independent of the project.

### Proposed projects per upcoming lesson (first pass — not locked)

| Lesson | Topic | Project |
|---|---|---|
| 05 | Markup, attributes, events | **Command palette (⌘K).** Search, keyboard nav (↑↓↵), click handlers, modifier keys, focus trap. |
| 06 | Control flow blocks | **Kanban board.** `{#each}` keyed reordering, `{#if}` empty states, `{#snippet}` cards, nested columns+cards. |
| 07 | `bind:` directives | **Settings editor.** Form bindings (text, select, checkbox, radio, range), `bind:group`, `bind:this`, function bindings. |
| 08 | `class:` / `style:` | **Theme customizer.** Live token editing, class toggles, hover states, accent-color swatches. |
| 09 | Scoped CSS + tokens | **Component gallery.** Button/Card/Input variants, OKLCH tokens, dark mode, logical properties. |
| 10 | Transitions | **Image carousel with route crossfade.** Enter/exit transitions, `crossfade`, prefers-reduced-motion. |
| 11 | `$props` | **Reusable chart library.** `<Sparkline>`, `<BarChart>`, `<Legend>` — typed, composable. |
| 12 | `$props.id()` | **Accordion with deeply nested headings.** Stable ids for aria-controls/labelledby. |
| 13 | `$bindable` | **Stepper with editable current-step.** Parent owns step, child exposes `bind:step`. |
| 14 | Snippets | **Data table.** Parent passes `{#snippet cell(row, col)}` per column. |
| 15 | Slots → snippets migration | **Migrating a legacy component.** Svelte 4 slots → snippets live. |
| 16 | `.svelte.js` / `.svelte.ts` | **Cross-route cart.** Multi-page shopping flow with module-level state. |
| 17 | Context API | **Nested form context.** Context-provided validator, deeply nested child inputs. |
| 18 | `svelte/reactivity` | **Tag filter UI.** `SvelteSet` for selections, `SvelteMap` for per-tag metadata. |
| 19 | SvelteKit routing | **Blog.** `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, group layouts, nested loading. |
| 20 | Load functions | **Public API dashboard.** Real load functions, parallel loads, error boundaries. |
| 21 | Form actions + Superforms + Zod | **Multi-step signup.** Server validation, error states, enhance, file upload. |
| 22 | Hooks | **Rate limiter + logging middleware.** Per-IP limits, request logging, error transform. |
| 23 | Environment variables | **Feature-flagged admin page.** `PUBLIC_*` vs private, runtime vs build-time. |
| 24 | `$app/state` & navigation | **Stepped checkout with nav guards.** `beforeNavigate` block, `afterNavigate` scroll-restore. |
| 25 | `bind:this` → `{@attach}` | **Tooltip library migration.** Old way, then migrate live. |
| 26 | Attachments deep dive | **IntersectionObserver image lazy-loader, ResizeObserver, focus-trap.** All attachments with cleanup. |
| 27 | `<svelte:boundary>` | **Dashboard with per-widget error boundaries.** Plus async SSR boundaries (Kit 2.54+). |
| 28 | Async Svelte | **Search-as-you-type.** `{#await}`, `await` in derived, `$effect.pending`, cancellation. |
| 29 | `transformError` + safe serialization | **Error reporter.** Catch server errors, strip PII, return safe shapes. |
| 30 | TypeScript strict patterns | **Typed event bus.** Discriminated unions, exhaustive switches, `satisfies`, branded types. |
| 31 | Testing | **Test the command palette from Lesson 05.** Vitest + @testing-library/svelte. |
| 32 | Build + deploy | **Ship a lesson to Cloudflare/Vercel.** Real adapter, env vars, preview deploys. |
| 33 | Performance | **Profile and optimize the Kanban from Lesson 06.** Measure, find slow effect/derived, fix. |
| 34 | Capstone | **Free-book lead magnet flow.** Landing → email gate → PDF delivery → analytics. |

**None are locked.** Confirm at the start of each lesson or use judgement — just make sure the project is real, not toy.

---

## 5. Mandatory workflow per lesson (Lesson 05 onward)

1. **Mark the task `in_progress`.**
2. **Fetch docs** via Svelte MCP `get-documentation` for the feature + all subfeatures.
3. **Decide the project** (use §4 list as starting point).
4. **Write the README first** in the new format. README is the spec.
5. **Scaffold starter/** — copy boilerplate from `lesson-04-inspect/starter/`.
6. **Scaffold solution/** — same boilerplate.
7. **Write the solution code** in full.
8. **Write the starter code** — same app with concept-specific parts stubbed. Use `// Lesson XX build:` comments.
9. **Write the reference/ folder** — 3–4 edge-case `.svelte` files + README.md index.
10. **Autofix every .svelte file** via Svelte MCP `svelte-autofixer`. Zero issues required.
11. **`pnpm install`** at workspace root.
12. **`pnpm --filter @course/lesson-XX-starter check`** — require 0 err / 0 warn.
13. **`pnpm --filter @course/lesson-XX-solution check`** — require 0 err / 0 warn.
14. **Append Batch row to VERIFICATION.md**.
15. **Tick PROGRESS.md.**
16. **Mark task `completed`.**
17. **Next lesson.**

---

## 6. Files to read on resume (in order)

1. This file (`RESUME.md`).
2. `README.md` — course overview, version table.
3. `VERIFICATION.md` — last green state per package.
4. `PROGRESS.md` — 34-lesson checklist.
5. `lesson-04-inspect/README.md` — last legacy-format lesson (for voice, mental-model structure).
6. `lesson-04-inspect/solution/package.json` — boilerplate model for copying.
7. `packages/styles/index.css` — available tokens (`var(--color-*)`, `var(--space-*)`, `var(--text-*)`, `var(--radius-*)`, `var(--duration-*)`, `var(--ease-*)`, `var(--container-*)`).
8. Memory `feedback_one_real_project_per_lesson.md` — the new rule.
9. Memory `feedback_no_pinescript_analogies.md` — the ban.
10. Memory `project_course_status.md` — short-form status.

---

## 7. Exact first actions on resume

```text
a. Run `pnpm install` and `pnpm -r --parallel run check` — confirm all 10 packages (Part 1 + L05) still green.
b. Create task: "Lesson 06 — Control flow blocks (Kanban board)".
c. Fetch docs via MCP: {#if}, {#each} (keyed, else), {#key}, {#snippet} / {@render}.
d. Write the Lesson 06 README in the project-first format (§4).
e. Proceed through the 17-step workflow in §5. Reinforce: $state for board data, $derived for per-column counts and filtered views, $effect if persistence, $inspect in dev; bind:value / bind:this / <svelte:window> / onclick events from Lesson 05.
```

When in doubt whether a project is "real enough," ask: **would someone actually build this feature at a company, or is it a demo from the docs?** If the second, pick a different project.
