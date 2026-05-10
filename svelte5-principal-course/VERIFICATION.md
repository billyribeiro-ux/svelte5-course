# Verification log

Every batch appends to this file. A lesson is only "done" when it has a green row here.

Legend:
- **install** — `pnpm install` at workspace root completes without errors
- **check** — `pnpm --filter <pkg> check` reports 0 errors and 0 warnings
- **build** — `pnpm --filter <pkg> build` succeeds
- **autofixer** — every `.svelte` file in the package was passed through the Svelte MCP `svelte-autofixer` tool at its latest revision and reported no unfixed issues (other than documented false positives)

## Batch 0 — Repo scaffold + Part 1 docs fetched
| Step | Status | Notes |
|---|---|---|
| Root `package.json` written | ✅ | pnpm workspace |
| `@course/styles` package written | ✅ | OKLCH token system, logical props, `@layer` |
| Shared `tsconfig.base.json` | ✅ | `strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true` |
| Shared Prettier config | ✅ | |
| `pnpm install` at root | _pending_ | run after Lesson 01 scaffolded |
| Svelte MCP docs fetched for Part 1 | ✅ | $state, $derived, $effect, $inspect, .svelte.js files |
| April + March 2026 release notes captured | ✅ | noted `kit@2.54+` SSR boundaries, `svelte@5.55` motion types, `svelte@5.52` TrustedHTML |

## Batch 1A — Lesson 01: $state
| Step | Status | Notes |
|---|---|---|
| README written | ✅ | Plain-English concept, 4 worked examples, common mistakes, PE lens, build challenge, 3 self-check questions |
| Starter scaffolded | ✅ | +layout, +page, 4 route stubs, 2 $lib stubs, favicon |
| Solution built | ✅ | counter / todos / class-based todos / module state — full feature parity |
| Reference files | ✅ | 4 standalone .svelte files: raw perf, snapshot, passing to functions, destructuring gotcha |
| Autofixer on all .svelte | ✅ | 0 issues after one revision round in reference/ |
| `pnpm install` | ✅ | workspace + 4 packages |
| `pnpm --filter @course/lesson-01-starter check` | ✅ | 296 files, 0 errors, 0 warnings |
| `pnpm --filter @course/lesson-01-solution check` | ✅ | 296 files, 0 errors, 0 warnings |

### Version corrections discovered during install
- `typescript`: spec said 7.0.0, real latest is 6.0.3 (the 7.x tag on npm was non-standard). Fixed in course README and both package.jsons.
- `@sveltejs/vite-plugin-svelte`: spec said 6.0.3, required 7.0.0 for Vite 8 compat. Fixed.

## Batch 1B — Lesson 02: $derived
| Step | Status | Notes |
|---|---|---|
| README written | ✅ | 7-rule mental model, 4 worked examples, common mistakes table, PE lens, build challenge (4 pages), 3 self-check questions |
| Starter scaffolded | ✅ | +layout, +page, 4 route stubs; each route has the scaffolding + deliberate "wrong" locals for students to turn into `$derived` |
| Solution built | ✅ | cart (subtotal/tax/total chain), filter (live query), optimistic likes with rollback, destructured `{ valid, errors, warnings }` |
| Reference files | ✅ | 4 standalone .svelte: expression-vs-.by, conditional-dep tracking, push-pull short-circuit, derived-from-derived graph |
| Autofixer on all .svelte | ✅ | 0 issues on all 10 `.svelte` files (2 layouts, 2 landings, 4 solution routes, 4 starter routes, 4 references) |
| `pnpm install` | ✅ | workspace now at 6 projects (styles + 2× lesson-01 + 2× lesson-02 + root) |
| `pnpm --filter @course/lesson-02-starter check` | ✅ | 294 files, 0 errors, 0 warnings |
| `pnpm --filter @course/lesson-02-solution check` | ✅ | 294 files, 0 errors, 0 warnings |

### User feedback captured this batch
- Billy asked not to use PineScript/ThinkScript analogies. Removed two existing references (top-level README, Lesson 01 README) and removed the fresh one from Lesson 02. Saved to memory.

## Batch 1C — Lesson 03: $effect
| Step | Status | Notes |
|---|---|---|
| README written | ✅ | 9-rule mental model, 4 worked examples, common mistakes, PE lens, 4 build challenges, self-check questions |
| Starter scaffolded | ✅ | +layout, +page, 4 route stubs: canvas, timer, autoscroll, persist |
| Solution built | ✅ | Canvas rounded-rect redraw; timer with setInterval + teardown + pause; chat autoscroll with `$effect.pre` + `tick()`; localStorage theme persist with `untrack` mount-only read |
| Reference files | ✅ | `EffectVsDerivedAntipattern`, `AsyncReadsNotTracked`, `ObjectIdentityTracking`, `EffectPreVsEffectTiming` |
| Autofixer on all .svelte | ✅ | 0 issues; suggestions about setInterval-inside-$effect and `seconds += 1` in tick callback are legitimate patterns this lesson teaches |
| `pnpm --filter @course/lesson-03-starter check` | ✅ | 294 files, 0 errors, 0 warnings |
| `pnpm --filter @course/lesson-03-solution check` | ✅ | 294 files, 0 errors, 0 warnings |

## Batch 1D — Lesson 04: $inspect
| Step | Status | Notes |
|---|---|---|
| README written | ✅ | 5-rule mental model, 4 worked examples, common mistakes, PE lens, 4 build challenges, self-check questions |
| Starter scaffolded | ✅ | +layout, +page, 4 route stubs: basic, filtered, trace, debug |
| Solution built | ✅ | `$inspect(form)` deep watch; `.with((type, value) => ...)` threshold filter; `$inspect.trace` inside `$derived.by` and `$effect`; fixed reset-bug demo using `orders.length = 0` + push |
| Reference files | ✅ | `InspectIsDeep`, `InspectWithType`, `InspectStripsInProd`, `InspectDoesNotFireOnSameValue` |
| Autofixer on all .svelte | ✅ | 0 issues; one suggestion about function-calls-inside-$effect is a false positive (`console.log` + `$inspect.trace` do not mutate state) |
| `pnpm --filter @course/lesson-04-starter check` | ✅ | 294 files, 0 errors, 0 warnings |
| `pnpm --filter @course/lesson-04-solution check` | ✅ | 294 files, 0 errors, 0 warnings |

**Part 1 (Runes Mastery) complete.** Lessons 01–04 all green. Next: Lesson 5 onward switches to the "one real project per lesson" format per Billy's direction.

## Batch 1E — Adapter + pinning sweep (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Swap adapter-auto → adapter-vercel | ✅ | All 8 `svelte.config.js` + 8 `package.json` files. `@sveltejs/adapter-vercel@^6.3.3`. |
| Pin Node engine across all package.jsons | ✅ | `"node": "24.14.1"` in 10 manifests (root, styles, 8 lesson packages). 24.15.0 does NOT exist — current lts/krypton is 24.14.1. |
| Confirm every dep at latest as of 2026-04-21 | ✅ | svelte 5.55.4, @sveltejs/kit 2.57.1, vite 8.0.9, vite-plugin-svelte 7.0.0, svelte-check 4.4.6, typescript 6.0.3, @types/node 25.6.0, prettier 3.8.3, prettier-plugin-svelte 3.5.1, pnpm 10.33.0 — nothing needed bumping. |
| `pnpm install` after swap | ✅ | Clean (+38 packages from adapter-vercel's deps). |
| `pnpm -r --parallel run check` | ✅ | All 8 packages 0 err / 0 warn. Each jumped from 294 → 295 files (adapter-vercel type defs now in graph). |

## Batch 2A — Lesson 05: Markup, attributes, events (Command Palette) — 2026-05-10
| Step | Status | Notes |
|---|---|---|
| README written (new project-first format per RESUME.md §4) | ✅ | The project + What you learn + Mental model + 5 rules + Worked examples (⌘K, focus effect, keyed each) + Common mistakes + PE lens + Build challenge with success criteria + 3 self-check Q&A + Links. |
| Starter scaffolded | ✅ | Whole shell (markup, CSS, refs, action functions, existing $effect for index-clamp + scroll-into-view, action stubs for keydown handlers, run(), backdrop click) with seven numbered `// Lesson 05 build:` steps concentrated in `src/routes/+page.svelte`. |
| Solution built | ✅ | Full Command Palette: ⌘K/Ctrl+K toggle on `<svelte:window>`, Escape to close, focus management $effect, click-outside dismiss, ↑/↓ wrapping nav + Enter to run, recent-first ranking, localStorage persist (mount-only read in `untrack`, write-on-change), `$inspect.trace('ranked')` in the derived. |
| Reference/ — 3 standalone .svelte files + README index | ✅ | `BooleanAttributes.svelte` (present-or-absent semantics + `... ?? undefined` idiom), `SvelteWindowKeydown.svelte` (key recorder + auto-cleanup), `EventSyntaxMigration.svelte` (Svelte 4 `on:` + modifiers → Svelte 5 `on*` + method calls inside handler body). |
| Shared `commands.ts` library | ✅ | Plain TS data, no runes; consumed by both starter and solution. |
| All `.svelte` files passed `mcp__svelte__svelte-autofixer` | ✅ | 8 .svelte files (2 layouts, 2 +page, 3 reference, 1 ts module). All return `issues: []`. Only-suggestions are documented teaching patterns (`bind:this` deferred to L25/26; canvas/timer-style side effects in $effect; `untrack` in $effect for mount-only reads). |
| Cumulative-syntax rule honoured | ✅ | Solution exercises ALL four Part-1 runes: `$state` (open, query, selectedIndex, recent, 4× DOM refs), `$derived` (filtered + ranked + selectedDescendant), `$effect` (mount-read, write-on-change, focus management, index-clamp, scroll-into-view), `$inspect.trace` (on `ranked` derived). README explicitly names each rune at the call site. |
| Real svelte-check error caught + fixed during build | ✅ | TS-strict `noUncheckedIndexedAccess` flagged `ranked[selectedIndex].id` re-access in `aria-activedescendant`. Resolved by extracting a `$derived` `selectedDescendant` constant — both starter and solution. |
| `pnpm install` after scaffold | ✅ | 6 new packages from L05 deps + 2 from solution; lockfile clean. |
| `pnpm --filter @course/lesson-05-starter check` | ✅ | 288 files, 0 errors, 0 warnings. |
| `pnpm --filter @course/lesson-05-solution check` | ✅ | 288 files, 0 errors, 0 warnings. |
| `pnpm -r --parallel run check` (full workspace) | ✅ | All 10 packages 0/0. Counts: L01 297×2, L02 295×2, L03 295×2, L04 295×2, L05 288×2. |
| PROGRESS.md updated | ✅ | `Lesson 05` ticked in Part 2. |

## Batch 1G — "Deepen" supplements for Lessons 01–04 (2026-05-10)
| Step | Status | Notes |
|---|---|---|
| Lesson 01 deep-dive — 3 reference files + README index + Going-further README section | ✅ | `SvelteSetAndMap` (svelte/reactivity), `StateRunesInClasses` (private fields, arrow methods, getters as computed views), `module-counter.svelte.ts` + `ModuleStatePatterns` (object-mutate vs getter-functions). Commit `6b3a7a3`. |
| Lesson 02 deep-dive — 3 reference files + README index + Going-further README section | ✅ | `DerivedLaziness` (pull-not-push proved with run-counter), `DerivedOverrideOptimistic` (5.25+ reassign-derived with rollback), `DerivedReturningObjects` (fresh-object equality footgun, primitive vs object side-by-side). Commit `1c43a76`. |
| Lesson 03 deep-dive — 3 reference files + README index + Going-further README section | ✅ | `EffectRoot` (manual lifecycle), `EffectConditionalDeps` (re-track on every run), `EffectBatchedRuns` (sync writes coalesce into one effect run). Commit `d894dcb`. |
| Lesson 04 deep-dive — 3 reference files + README index + Going-further README section | ✅ | `InspectVsDebugTag` (script-inspect vs markup-debug), `InspectMultipleValues` (correlated debug via `.with`), `InspectTraceWithLabel` (Part-1 grand finale: $state + $derived + $effect + $inspect.trace together). |
| All deep-dive files passed `mcp__svelte__svelte-autofixer` | ✅ | 13 new files (12 .svelte + 1 .svelte.ts) — all `issues: []`. Suggestions match the documented patterns in Batch 1F (run-counters-in-$effect for teaching, attachment-not-yet-introduced for `bind:this`). |
| Post-deep-dive `pnpm -r --parallel run check` | ✅ | All 8 packages still 0 err / 0 warn. Deep-dive files live outside `src/`, so the build is unaffected by design. |
| Existing pages, route stubs, solutions, and original reference files | ✅ unchanged | RESUME.md lock on Lessons 01–04 is honoured. The deep-dive is purely additive. |

### Cumulative-syntax rule baked into the deep-dives

Each deep-dive file declares which runes it uses. The thread is enforced:
- L01 deep-dives use only `$state` (and one introduces `SvelteSet` from `svelte/reactivity`).
- L02 deep-dives use `$state` + `$derived`. The third file forward-references `$effect` purely as an observation tool (a run-counter), with a comment promising to switch to `$inspect` after Lesson 04.
- L03 deep-dives use `$state` + `$effect`. The first file introduces `$effect.root`.
- L04 deep-dives layer everything: the final file (`InspectTraceWithLabel.svelte`) exercises all four Part-1 runes in one realistic shopping calc — the "grand finale."

## Batch 1F — End-to-end MCP audit of Lessons 01–04 (2026-05-10)
| Step | Status | Notes |
|---|---|---|
| Baseline `pnpm -r --parallel run check` | ✅ | All 8 packages 0 err / 0 warn before audit started. |
| `mcp__svelte__svelte-autofixer` swept across all 60 source files | ✅ | Every `.svelte` and `.svelte.ts` across `lesson-01..04` × {starter, solution, reference}. |
| Files reporting `issues: []` (autofixer-clean) | ✅ | **60 / 60.** No file required a code edit. |
| Files with `suggestions` (non-blocking) | ⚠ documented | All suggestions categorized below. None warrant a change at this stage of the course. |
| Post-audit `pnpm -r --parallel run check` | ✅ | All 8 packages still 0 err / 0 warn (identical to baseline — no edits were applied). |

### Suggestion categories surfaced by the autofixer (and why each is intentional)

1. **"Calling function X inside $effect — could be $derived"** — surfaced in Lesson 03 canvas/timer/autoscroll/persist + Lesson 04 trace. These are textbook side-effect cases (canvas draw, `setInterval` + cleanup, `localStorage` write, DOM scroll). `$derived` cannot perform side effects. Code stays as-is.
2. **"Stateful variable assigned inside $effect"** — surfaced in:
   - `lesson-03-effect/reference/EffectVsDerivedAntipattern.svelte` — the file's whole purpose is to demonstrate the antipattern (comments say "❌ DO NOT DO THIS"). The autofixer correctly flagging it is proof the lesson teaches the correct rule.
   - `lesson-03-effect/reference/ObjectIdentityTracking.svelte` — `counts.identity += 1` / `counts.property += 1` are run-counters that prove the effect ran. They cannot be `$derived` because the whole point is counting executions.
   - `lesson-03-effect/solution/04-persist` — `theme = saved` happens inside an `untrack(() => { ... })` block on mount, which is the documented Svelte 5 idiom for "read once from storage without re-firing on every change."
3. **"`bind:this` could be replaced with an attachment"** — surfaced on every `bind:this` in Lessons 03/04. Attachments (`{@attach}`) are the subject of Lessons 25–26 in the syllabus. Introducing them in Lesson 03 would jump 22 lessons ahead. Migration is staged for those lessons.

### Files audited (60 total)
- `lesson-01-state` (20): 4 reference + 2 `.svelte.ts` × 2 + 6 routes × 2 = 4 + 4 + 12.
- `lesson-02-derived` (16): 4 reference + 6 routes × 2.
- `lesson-03-effect` (16): 4 reference + 6 routes × 2.
- `lesson-04-inspect` (16): 4 reference + 6 routes × 2.
