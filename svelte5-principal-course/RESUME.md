# Resume notes — Svelte 5 Principal Engineer course

**Paused:** 2026-04-21, mid-Lesson-03, after a scope direction change.

> Read this file top to bottom before doing anything. It captures what's built, what's verified, what the new rules are, and what needs to happen next.

---

## 1. The pivotal feedback

Billy said, verbatim, on 2026-04-21:

> "Man there's barely any difference from what you're doing to what svelte.dev has already done. I am expecting real fucking projects in each lesson putting what was learn into practice and not retatrded hello world lessons!!!!!!!!!!"

Then, immediately after:

> "Keep the lessons done as is and from now on do it the way i said."

### What that means, concretely

- **Lessons 01 and 02 stay as they are.** Do not touch them. They use the "4 small challenges per lesson" format. Billy is OK with them being like that because they're already built.
- **Lesson 03 and every lesson after it must use the new format: ONE real project per lesson.** The project is the lesson. Not four disconnected demos. A cohesive app a working engineer would actually build, that naturally stretches the rune or feature being taught.

The earlier feedback from the same day also stands:

- **No PineScript / ThinkScript analogies.** Removed from top-level README and Lesson 01 README already. Do not reintroduce.
- **Plain-English explanations, no jargon without unpacking.** Same as before.
- **Zero `// TODO` comments.** Stubs must be labeled `// Lesson XX build:` plus a concrete instruction. (This convention is already established in Lessons 01–02.)

---

## 2. Exact state of the repo at pause

### Directory layout

```
/Users/billyribeiro/Desktop/svelte5-course/svelte5-principal-course/
├── README.md                         ✅ written (course overview, version table)
├── RESUME.md                         ← THIS FILE
├── PROGRESS.md                       ✅ 34-lesson checklist; 01 & 02 ticked
├── VERIFICATION.md                   ✅ verification log with Batch 0, 1A, 1B
├── package.json                      ✅ root workspace, pnpm@10.33.0, node 24.x
├── pnpm-workspace.yaml               ✅ globs: packages/*, lesson-*/starter, lesson-*/solution, final-project/solution
├── .npmrc                            ✅ engine-strict=true
├── .prettierrc                       ✅ tabs, single quotes, 100 width, prettier-plugin-svelte
├── tsconfig.base.json                ✅ strict, noUncheckedIndexedAccess, verbatimModuleSyntax, NodeNext
├── pnpm-lock.yaml                    ✅ generated
├── node_modules/                     ✅ installed
├── packages/
│   └── styles/                       ✅ @course/styles — OKLCH tokens, @layer, reset, base
├── lesson-01-state/                  ✅ DONE. 296 files / 0 errors / 0 warnings (starter + solution)
│   ├── README.md                     (4-challenge format — keep)
│   ├── reference/                    (4 .svelte edge-case files)
│   ├── starter/
│   └── solution/
├── lesson-02-derived/                ✅ DONE. 294 files / 0 errors / 0 warnings (starter + solution)
│   ├── README.md                     (4-challenge format — keep)
│   ├── reference/                    (4 .svelte edge-case files)
│   ├── starter/
│   └── solution/
└── lesson-03-effect/                 🟡 PAUSED. Directory may be empty or near-empty.
```

Lesson directories 04 through 34 do **not** exist yet.

### What physically exists for Lesson 03

**Nothing useful.** I drafted a README in the toy-4-challenges format, then a pivot attempt was rejected, then work was paused. Run `ls lesson-03-effect/` on resume to confirm current state. Whatever is there, **throw it away and restart from scratch in the new format.**

### Verified green (via `pnpm --filter ... check`)

| Package | Last result | Files checked |
|---|---|---|
| `@course/lesson-01-starter` | 0 errors / 0 warnings | 296 |
| `@course/lesson-01-solution` | 0 errors / 0 warnings | 296 |
| `@course/lesson-02-starter` | 0 errors / 0 warnings | 294 |
| `@course/lesson-02-solution` | 0 errors / 0 warnings | 294 |

Run these again after the resume to confirm nothing has rotted:

```sh
cd /Users/billyribeiro/Desktop/svelte5-course/svelte5-principal-course
pnpm install
pnpm --filter @course/lesson-01-starter check
pnpm --filter @course/lesson-01-solution check
pnpm --filter @course/lesson-02-starter check
pnpm --filter @course/lesson-02-solution check
```

If any of them fail, fix before continuing to Lesson 03.

### Task list at pause (in-conversation Tasks tool)

```
#1 [completed] Batch 0: scaffold repo + fetch Part 1 docs
#2 [completed] Batch 1A: Lesson 01 — $state
#3 [completed] Lesson 02 — $derived
#4 [in_progress] Lesson 03 — $effect   ← reset this, restart with project-first approach
#5 [pending] Lesson 04 — $inspect
```

---

## 3. Locked technical decisions (do not re-litigate)

### Version pins (from the course README)

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
| node | 24.x |

### Stack choices

- **pnpm workspace** (single install at root propagates). `workspace:*` protocol for internal deps like `@course/styles`.
- **Strict TypeScript** — `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`, `strict: true`.
- **No Tailwind, no Lucide.** Design tokens via `@course/styles` package: OKLCH palette, `@layer tokens, reset, base, components, utilities`, logical properties (`margin-inline`, `block-size`, `inset-inline`, etc.).
- **Iconify/Phosphor only** for icons when needed (no icon library imports yet).
- **SvelteKit filesystem routing** (`src/routes/+page.svelte`, `+layout.svelte`).
- **`$app/state`** for page/navigation info (NOT `$app/stores` — that's the old module).
- **Runes mode** throughout (`$state`, `$derived`, `$effect`, `$props`, `$inspect`, `$bindable`, etc.). Never legacy stores/`$:`/`export let`.

### Conventions established in Lessons 01–02

- Starter stub comments use `// Lesson XX build:` followed by a concrete instruction. Never `// TODO`.
- Each lesson has:
  - `README.md` (plain-English concept + mental model + worked examples + common mistakes + PE lens + build challenge + self-check questions in `<details>` tags + links)
  - `starter/` — scaffolded SvelteKit app with stubs
  - `solution/` — complete working implementation
  - `reference/` — 3–4 standalone `.svelte` files showing edge cases, NOT a runnable app, just files to read
- Every `.svelte` file passes the Svelte MCP autofixer with zero issues before being saved.
- Every `starter/` and `solution/` package passes `svelte-check` with 0 errors / 0 warnings.
- `pnpm install` at the workspace root succeeds clean before a lesson is marked done.

### Per-lesson scaffolding boilerplate (copy from Lesson 02)

When creating a new lesson's starter or solution, copy the structure from `lesson-02-derived/starter/` (or `solution/`). Exact files needed:

- `package.json` — same shape as Lesson 02; just change the `name` (`@course/lesson-XX-starter` or `-solution`).
- `tsconfig.json` — `{ "extends": ["../../tsconfig.base.json", "./.svelte-kit/tsconfig.json"], "compilerOptions": { "allowJs": true, "checkJs": false } }`
- `svelte.config.js` — adapter-auto + vitePreprocess.
- `vite.config.ts` — `{ plugins: [sveltekit()] }`.
- `src/app.html` — title change to `Lesson XX — RUNE (starter|solution)`.
- `src/app.d.ts` — stock template.
- `src/app.css` — `@import '@course/styles/index.css';` + main layout block.
- `src/routes/+layout.svelte` — imports `app.css`, uses `$app/state`, `{@render children?.()}`.
- `src/routes/+page.svelte` — landing page (under the new format, this is the project's actual UI home, not a menu).
- `static/favicon.svg` — thematic OKLCH swatch.

---

## 4. New lesson format (Lesson 03 onward)

### Structural template

Each lesson is ONE real project. The README has this order:

1. **"The project you're building"** — one paragraph plus a bulleted feature list. What it does, what it looks like, why it's a real thing. Not a toy.
2. **"What this lesson teaches"** — the rune/feature in focus, framed around how the project uses it.
3. **Concept section** — plain-English mental model, rules, worked examples — all tied to the project, not abstract.
4. **Common mistakes** — table with the specific failure modes of the project's techniques.
5. **PE lens** — the "how a staff engineer thinks about this" perspective.
6. **Build challenge** — the specific feature(s) the student fills in. Concrete acceptance criteria (e.g. "when the timer hits 0, play a sound and log to the activity feed").
7. **Self-check** — 3 questions in `<details>` tags, about the project.
8. **Links** — official docs anchors.

### The project recipe

- Pick a project that makes the feature useful in a way that's NOT "here's $effect in isolation." The project has UI, state, interactions, edge cases.
- The `starter/` has the whole shell (routes, layout, non-concept logic) and only stubs out the concept-specific parts. The student is never re-implementing plumbing — they're filling in the actual new thing.
- The `solution/` is the same project, completed. Both check clean with svelte-check.
- The `reference/` folder: 3–4 tiny `.svelte` files showing edge cases of the concept, independent of the project. Keep these because they're the "interesting corners" catalog.

### Proposed projects per lesson (first pass)

These are the proposed projects for each upcoming lesson. Finalize as you start each one, but this is the shape:

| Lesson | Rune/Topic | Project |
|---|---|---|
| 03 | `$effect` | **Pomodoro Focus Tracker.** setInterval w/ teardown, canvas progress ring, $effect.pre autoscroll for activity log, localStorage persistence, keyboard shortcuts with listener cleanup, document.title sync. |
| 04 | `$inspect` / `$inspect.trace` | **Debug-this-broken-app.** A small app with 2–3 planted reactivity bugs (destructured state, object-identity effect, stale derived). The project is the debugging session — student uses $inspect to find and fix. |
| 05 | Markup, attributes, events | **Command palette (⌘K).** Search, keyboard nav (↑↓↵), click handlers, modifier keys, focus trap. |
| 06 | Control flow blocks | **Kanban board.** `{#each}` with keyed reordering, `{#if}` for empty states, `{#snippet}` for cards, nested loops for columns+cards. |
| 07 | `bind:` directives | **Settings editor.** Form bindings (text, select, checkbox, radio, range), `bind:group`, `bind:this` for a custom control, function bindings for computed fields. |
| 08 | `class:` / `style:` | **Theme customizer.** Live-editing tokens, class toggles, :hover states, accent-color swatches driving a component preview. |
| 09 | Scoped CSS + tokens | **Component gallery.** Button/Card/Input variants using OKLCH tokens, dark mode, logical properties. |
| 10 | Transitions | **Image carousel with route-cross-fade.** Enter/exit transitions, `crossfade`, prefers-reduced-motion. |
| 11 | `$props` | **Reusable chart component library.** One `<Sparkline>`, one `<BarChart>`, one `<Legend>` — all generic, typed, composable. |
| 12 | `$props.id()` | **Accordion with deeply nested headings.** Each item generates a stable id for aria-controls/labelledby wiring. |
| 13 | `$bindable` | **Stepper with editable current-step.** Parent owns step state, child exposes `bind:step` for two-way control. |
| 14 | Snippets | **Data table.** Parent passes `{#snippet cell(row, col)}` for custom cell renderers per column. |
| 15 | Slots → snippets migration | **Migrating a legacy component.** Take a Svelte 4-style slotted component and migrate it to snippets live. |
| 16 | `.svelte.js` / `.svelte.ts` modules | **Cross-route cart store.** Real multi-page shopping flow with cart state shared across routes via a `.svelte.ts` module. |
| 17 | Context API | **Nested form context.** A form that validates fields via a context-provided validator, deeply nested child inputs. |
| 18 | `svelte/reactivity` built-ins | **Tag filter UI using `SvelteSet`.** Real multi-select tag filter with the reactive `Set`, plus `SvelteMap` for per-tag metadata. |
| 19 | SvelteKit routing | **Blog with nested routes and layouts.** `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, group layouts, nested loading. |
| 20 | Load functions | **Public API dashboard.** Real load functions pulling from a public API (GitHub search API or similar), parallel loads, error boundaries. |
| 21 | Form actions + Superforms + Zod | **Multi-step signup flow.** Real server validation, error states, enhance, file upload step. |
| 22 | Hooks | **Rate limiter + logging middleware.** `handle` hook implementing per-IP rate limits, request logging, error transform. |
| 23 | Environment variables | **Feature-flagged admin page.** `PUBLIC_*` vs private env, runtime vs build-time, gated routes. |
| 24 | `$app/state` & navigation | **Stepped checkout with navigation guard.** `beforeNavigate` to block leaving mid-payment, `afterNavigate` to scroll-restore. |
| 25 | `bind:this` → `{@attach}` | **Tooltip library migration.** Write tooltips the old `bind:this` way, then migrate live to `{@attach}`. |
| 26 | Attachments deep dive | **IntersectionObserver image lazy-loader, ResizeObserver layout, focus-trap.** All written as attachments with cleanup. |
| 27 | `<svelte:boundary>` | **Dashboard with per-widget error boundaries.** A misbehaving widget must not crash neighbors. Includes async SSR boundaries (Kit 2.54+). |
| 28 | Async Svelte | **Search-as-you-type with awaited in markup.** `{#await}`, `await` in derived, `$effect.pending`, cancellation. |
| 29 | `transformError` + safe serialization | **Error reporter.** Catch server-side errors, strip PII, return safe shapes via `handleError` hook. |
| 30 | TypeScript strict patterns | **Typed event bus.** Discriminated unions for messages, exhaustive switches, `satisfies`, branded types. |
| 31 | Testing | **Test the Pomodoro tracker from Lesson 03.** Vitest + @testing-library/svelte, timer mocks, effect teardown assertions. |
| 32 | Build + deploy | **Ship a lesson to Cloudflare/Vercel.** Real adapter, env vars, preview deploys. |
| 33 | Performance | **Profile and optimize the Kanban from Lesson 06.** Measure, find the slow effect/derived, fix it. |
| 34 | Capstone / final project | **Free-book lead magnet flow.** Landing → email gate → PDF delivery → analytics. Pulls together everything. |

**None of these are locked.** Confirm with Billy at the start of each lesson or use your judgement — just make sure the project is real, not toy.

---

## 5. Mandatory workflow per lesson

Every lesson follows this sequence exactly. Do not skip steps.

1. **Mark the task `in_progress`.** (`TaskUpdate`.)
2. **Fetch docs** via Svelte MCP `get-documentation` for the feature + all subfeatures (e.g. `$effect`, `$effect.pre`, `$effect.tracking`, `$effect.root`, `$effect.pending`).
3. **Decide the project** (use the list above as a starting point, adjust to what will exercise the concept best).
4. **Write the README first** in the new format. README is the spec for the starter and solution.
5. **Scaffold starter/** — copy boilerplate from Lesson 02, edit for this lesson:
   - package.json (name only)
   - tsconfig.json, svelte.config.js, vite.config.ts
   - src/app.html (title)
   - src/app.d.ts, src/app.css
   - static/favicon.svg
6. **Scaffold solution/** — same boilerplate.
7. **Write the solution code** in full. This is the real app.
8. **Write the starter code** — same app with the concept-specific parts stubbed. Use `// Lesson XX build:` comments.
9. **Write the reference/ folder** — 3–4 edge-case `.svelte` files + README.md index.
10. **Autofix every .svelte file** via Svelte MCP `svelte-autofixer`. Zero issues required.
11. **Run `pnpm install`** at workspace root to register the new packages.
12. **Run `pnpm --filter @course/lesson-XX-starter check`** — require `0 errors, 0 warnings`.
13. **Run `pnpm --filter @course/lesson-XX-solution check`** — require `0 errors, 0 warnings`.
14. **Append a Batch row to VERIFICATION.md** with the status.
15. **Tick the box in PROGRESS.md.**
16. **Mark the task `completed`.**
17. **Move to the next lesson.**

---

## 6. Files to read on resume (in order)

1. This file (`RESUME.md`).
2. `README.md` — course overview, version table, how to work through a lesson.
3. `VERIFICATION.md` — last green state per package.
4. `PROGRESS.md` — 34-lesson checklist with current ticks.
5. `lesson-02-derived/README.md` — **the model for README voice and structure.** The *structure* is fine, just the build-challenge section changes from 4-tiny to 1-big.
6. `lesson-02-derived/solution/package.json` — **the scaffolding model for copying to new lessons.**
7. `packages/styles/index.css` — design tokens available (`var(--color-*)`, `var(--space-*)`, `var(--text-*)`, `var(--radius-*)`, `var(--duration-*)`, `var(--ease-*)`, `var(--container-*)`).
8. Memory file `feedback_one_real_project_per_lesson.md` (the new rule).
9. Memory file `feedback_no_pinescript_analogies.md` (the ban).
10. Memory file `project_course_status.md` (duplicate of this, short form, so future conversations see it in context).

---

## 7. Exact first actions on resume

```text
a. Run `pnpm install` and the four check commands listed in §2 — confirm Lesson 01 and 02 still green.
b. If lesson-03-effect/ has stale files, `rm -rf` them (get explicit ok from Billy first).
c. Reset task #4 or create a new one: "Lesson 03 — Pomodoro Focus Tracker build".
d. Fetch $effect, $effect.pre, $effect.tracking, $effect.root, $effect.pending docs via MCP.
e. Write the new README for Lesson 03 in the project-first format.
f. Proceed through the 17-step workflow in §5.
```

When in doubt about whether a project is "real enough," ask yourself: **would someone actually build this feature at a company, or is it a demo from the docs?** If it's the second one, pick a different project.
