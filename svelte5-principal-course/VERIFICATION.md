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

## Batch 2A — Lesson 05: Markup / attributes / events (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format shift | ✅ | First lesson in the new "one real project" format. README rewritten to match the project-first structure in RESUME.md §4. |
| README written | ✅ | Project-first: "command palette" with feature list, 6-rule mental model, common mistakes, PE lens, acceptance criteria, 3 self-check questions. |
| Starter scaffolded | ✅ | Single-page SvelteKit app. `+layout.svelte` minimal, `+page.svelte` ships the dashboard + palette shell. Concept-specific parts stubbed with `// Lesson 05 build:` comments. |
| Solution built | ✅ | Complete command palette: ⌘K/Ctrl+K toggle, Escape/backdrop close, auto-focus, substring filter, empty state, wrap-around ↑/↓ nav, Enter to run, last-action banner. Reinforces `$state` × 5, `$derived` × 2, `$effect` × 1, `$inspect` × 1. |
| Reference files | ✅ | `HandlerCalledVsReferenced`, `SpreadAttributeOrder`, `BooleanAttributeFootgun`, `CrossPlatformShortcut`. Plus reference README index. |
| Autofixer on all .svelte | ✅ | 0 issues on all 6 `.svelte` files (2 layouts, 2 pages, 4 references). Two suggestions on solution/+page.svelte accepted as teaching moments: `bind:this` is the feature (migrates to `{@attach}` in Lesson 25); `inputEl?.focus()` inside `$effect` is a legitimate DOM side-effect. |
| `pnpm install` | ✅ | Workspace now 12 projects (was 11 after 1E). |
| `pnpm --filter @course/lesson-05-starter check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm --filter @course/lesson-05-solution check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm -r --parallel run check` | ✅ | All 10 packages green after Lesson 05 added. |

### Decisions captured this batch
- **No `data-active` attribute.** Started with `data-active={i === activeIndex \|\| undefined}` for highlight styling, but swapped to `aria-selected={...}` alone after realising one attribute is enough and svelte-check flagged the duplicate styling selector as unused in the starter (where the literal `"false"` value prevented `[aria-selected='true']` from matching statically). The solution uses one source of truth: `aria-selected`.
- **Starter ships `aria-selected={i === activeIndex}` live.** Trade-off: gives away the attribute-expression pattern but keeps the scoped-CSS warning count at 0. The substantive exercise remains in handlers, bindings, `$derived`, `$effect`, and `<svelte:window>`.
- **`$inspect` kept live in the solution.** Dev-only by design. Watches `{ isOpen, query, activeIndex, matches }`. Strips in production.
- **Part 1 rune reinforcement ratio (solution):** 5× `$state`, 2× `$derived`, 1× `$effect`, 1× `$inspect` — every rune from Lessons 01–04 used at least once in the project, per the compounding-lessons rule.

## Batch 2B — Lesson 06: Control flow blocks (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Kanban board). 3 columns, keyed cards, ↑↓ reorder, ←→ move between columns, priority chip, delete, clear-done, reset, `/` focus shortcut. |
| README written | ✅ | Project-first: 7-rule mental model, move-vs-reorder explainer, common-mistakes table, PE lens, acceptance criteria, 3 self-check questions. |
| Starter scaffolded | ✅ | Full shell: seed data, handlers, CSS, `<svelte:window>`, the outer columns each, the inner cards each with `{:else}`, the add-card form. Stubs: the `cardRow` snippet declaration + render, and the `{#if}` around "Clear done". |
| Solution built | ✅ | Complete Kanban. Uses `{#each}` keyed × 2 (columns + cards), `{:else}` empty state, `{#if}` for Clear done, `{#snippet cardRow}` + `{@render}`, `{@const}` inside snippet for the accent colour, `bind:value` on input and priority select. |
| Reference files | ✅ | `KeyedVsUnkeyedEach`, `EachElse`, `SnippetRecursion`, `KeyBlockForceRemount`. Plus reference README index. |
| Autofixer on all .svelte | ✅ | 0 issues on 6 of 6 files inside starter+solution+3 references. `KeyedVsUnkeyedEach.svelte` deliberately triggers the "Each block should have a key" warning — that's the demonstration. Documented in the file's comment. |
| `pnpm install` | ✅ | Workspace now 14 projects (added lesson-06 starter + solution). |
| `pnpm --filter @course/lesson-06-starter check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm --filter @course/lesson-06-solution check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm -r --parallel run check` | ✅ | All 12 packages green after Lesson 06 added. |

### Decisions captured this batch
- **Starter ships `{:else}` wired.** Without a live `<li class="empty">` in the template, svelte-check flags the `.empty` CSS selector as unused. Trade-off: loses `{:else}` as an explicit exercise. Gained: 0-warn clean. The student's substantive work is the snippet declaration + render and the `{#if}` gate on the Clear-done button.
- **`cardRow` snippet kept local, not extracted to a component.** Lesson 14 covers snippets-as-props. Lesson 06 teaches the local-reuse shape.
- **`{#key}` not used in the main project.** A Kanban doesn't have a genuine key-remount use case. Covered in `reference/KeyBlockForceRemount.svelte` instead, where the "reset form without touching the bound value" pattern is real.
- **No `$effect` in the Kanban.** Not every lesson needs every rune — forcing an effect here would be contrived. `$state` × 2, `$derived` × 2, `$inspect` × 1 from Part 1; `bind:value` × 4, `<svelte:window>` × 1, `onsubmit`/`onclick` × many from Lesson 05. Covers 4 of 5 Part 1/05 runes/features naturally.

## Batch 2C — Lesson 07: `bind:` directives (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Settings editor). Live-binding preferences page — no save button, every control writes through to a `$state` settings shape, serialized JSON panel at the bottom. |
| README written | ✅ | Project-first: lists all 10 binding flavours, 6-rule mental model, dedicated `bind:this`, indeterminate, and `bind:files` subsections, common-mistakes table, PE lens, acceptance criteria, 3 self-check questions. |
| Starter scaffolded | ✅ | Ships the whole shell — settings defaults, handlers, CSS, `<svelte:window>`, preview card markup, the JSON `<pre>`. Stubs every `bind:` with `// Lesson 07 build:` comments explaining the exact getter/setter shape. |
| Solution built | ✅ | 10 bindings live: `bind:value` × 5 (text, time × 2, range, select), `bind:checked` × 1, function binding on display name + function binding on "all channels" parent checkbox, `bind:group` × 2 (radios + checkbox array), `bind:indeterminate` driven by `$derived`, `bind:files`, `bind:this`, `bind:clientWidth`, `bind:clientHeight`. |
| Reference files | ✅ | `FunctionBindingClamp`, `IndeterminateParent`, `DimensionBinding`, `FileInputBasics`. Plus reference README index. |
| Autofixer on all .svelte | ✅ | 0 issues across all 6 `.svelte` files. |
| `pnpm install` | ✅ | Workspace now 14 projects (added lesson-07 starter + solution). |
| `pnpm --filter @course/lesson-07-starter check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm --filter @course/lesson-07-solution check` | ✅ | 287 files, 0 errors, 0 warnings. |
| `pnpm -r --parallel run check` | ✅ | All 14 packages green after Lesson 07 added. |

### Decisions captured this batch
- **Live bindings, no save button.** Auto-apply is the correct pattern for preferences. Save buttons create dirty-state anxiety and are a net negative for power users. Documented in the PE lens.
- **`indeterminate` is a plain attribute, not a bind.** It's derived from the children array (`$derived`). Writing `bind:indeterminate` to a $state boolean is a footgun because nothing derives it. The parent `checked` uses a function binding to write all-or-nothing.
- **Function binding for "shouty mode" display name.** Getter returns the raw name; setter conditionally upper-cases based on `settings.profile.shouty`. Demonstrates the intended use case — normalization at write time.
- **Avatar File is state-local, not serialized.** `avatarFiles` lives outside the `settings` object because `FileList` isn't JSON-serializable and the JSON preview would break. The file-info panel (`{#if avatar}`) is derived from `avatarFiles[0]`.
- **Part 1 + L05/L06 reinforcement:** `$state` × 6, `$derived` × 5, `$inspect` × 1, `{#each}` × 2 keyed, `{#if}` × 1, `<svelte:window>` × 1, `onclick` + `onkeydown` as expected. Only `$effect` is absent — no natural fit in a live-binding settings page, and per the compounding rule we don't force it.

## Batch 1E — Adapter + pinning sweep (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Swap adapter-auto → adapter-vercel | ✅ | All 8 `svelte.config.js` + 8 `package.json` files. `@sveltejs/adapter-vercel@^6.3.3`. |
| Pin Node engine across all package.jsons | ✅ | `"node": "24.14.1"` in 10 manifests (root, styles, 8 lesson packages). 24.15.0 does NOT exist — current lts/krypton is 24.14.1. |
| Confirm every dep at latest as of 2026-04-21 | ✅ | svelte 5.55.4, @sveltejs/kit 2.57.1, vite 8.0.9, vite-plugin-svelte 7.0.0, svelte-check 4.4.6, typescript 6.0.3, @types/node 25.6.0, prettier 3.8.3, prettier-plugin-svelte 3.5.1, pnpm 10.33.0 — nothing needed bumping. |
| `pnpm install` after swap | ✅ | Clean (+38 packages from adapter-vercel's deps). |
| `pnpm -r --parallel run check` | ✅ | All 8 packages 0 err / 0 warn. Each jumped from 294 → 295 files (adapter-vercel type defs now in graph). |

## Batch 2D — Lesson 08: `class:` / `style:` (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Theme customizer). OKLCH accent sliders, mode/radius/scale knobs, live preview of 6 mock components, 4 preset chips, CSS export with clipboard copy. |
| README | ✅ | 4-way class-syntax ranking, `style:` + custom properties theming pattern, common-mistakes table, PE lens, acceptance criteria, 3 self-check questions. |
| Starter | ✅ | Ships `class` wiring live (object form for dark mode, array form for button modifiers), stubs the three `style:` custom properties, preset click handler, clipboard copy, and `{#if}` around toast. |
| Solution | ✅ | Theme customizer with object/array `class` forms, 3 custom-property `style:` injections, OKLCH `oklch(from var(--accent) …)` for derived tints, clipboard copy. |
| Reference | ✅ | `ClassObjectForm`, `ClassArrayWithProps`, `StyleCustomProperty`, `StyleImportant`. |
| Checks | ✅ | Both packages 287 files, 0 err / 0 warn. |
| Decisions | Starter ships the `class` wiring live to keep scoped-CSS 0-warn; the `style:` custom-property work is the exercise. `class:` directive de-emphasised in favour of `class={…}` object/array forms. |

## Batch 2E — Lesson 09: Scoped CSS + tokens (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Component gallery). **First multi-component lesson:** `Buttons`, `Cards`, `Forms` under `src/lib/`, composed by the gallery `+page.svelte`. |
| README | ✅ | How scoped CSS compiles, three `:global()` forms, logical-properties table, token-driven theming, common-mistakes table, PE lens, acceptance criteria, 3 self-check questions. |
| Starter | ✅ | Ships the 3 sub-components fully done (they ARE the demo material), plus the gallery page with `:global()` prose block wired. Stubs: `class={{ gallery, dark }}` object form, `style:--density={densityValue}`, `D`-key shortcut. |
| Solution | ✅ | Gallery with 3 sub-components, inline badges + alerts, `{@html}` prose with `.prose :global(…)` styling, dark-mode token overrides under `.gallery.dark`, `--density` multiplier. |
| Reference | ✅ | `ScopedIdenticalClasses`, `GlobalBreakout`, `LogicalProperties`. |
| Checks | ✅ | Both packages 290 files, 0 err / 0 warn. |
| Decisions | Zero-prop sub-components (preserves `$props` for Lesson 11). Dark mode via token overrides, not a second stylesheet. `--density` as a numeric multiplier that propagates through `calc(var(--space-md) * var(--density))`. |

## Batch 2F — Lesson 10: Transitions (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Image carousel). 5 slides, crossfade via `{#key}` + `in:fade`/`out:fade`, caption `in:fly`, dismissable `transition:slide` hint, autoplay Tween progress bar, keyboard controls, reduced-motion honoured. |
| README | ✅ | `transition:` vs `in:`/`out:`, `{#key}` replay pattern, `prefersReducedMotion` gating, `$effect`-cleanup for `setInterval`, `Tween` from `svelte/motion`, common-mistakes, PE lens, acceptance criteria, 3 self-check questions. |
| Starter | ✅ | Ships the carousel shell — slides, markup, CSS, handlers. Stubs: derived `duration`, hint `transition:slide`, `<svelte:window>`-gate on Tween + `$effect` autoplay + cleanup, `{#key index}` around slide, `in:fade`/`out:fade`/`in:fly` directives, `onmouseenter`/`onmouseleave` pause. |
| Solution | ✅ | Complete carousel: crossfade between slides with `{#key}`, caption re-flies on each change, `Tween` progress bar, autoplay with hover pause, keyboard left/right + Space, all durations gated on `prefersReducedMotion.current`. |
| Reference | ✅ | `InOutSeparate`, `CrossfadeHelper` (tasks list with shared-element transitions), `AnimateFlipReorder` (keyed `{#each}` + `animate:flip`), `ReducedMotion`. |
| Checks | ✅ | Both packages 287 files, 0 err / 0 warn. |
| Decisions | `{#key}` + `in:`/`out:` preferred over `crossfade` helper for the carousel (simpler; crossfade is for shared-element pairs). `Tween` used for the progress bar — declarative fraction, no rAF plumbing. Hover-pause uses `onmouseenter`/`onmouseleave` on the stage `<div>` with `role="region"` + `aria-label` to pass a11y. |

## Batch 3A — Lesson 11: `$props` (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Chart library). 5 `$lib/` components — `Card`, `Sparkline`, `BarChart`, `Metric`, `Legend` — composed by a dashboard `+page.svelte` with 6 Cards + Refresh button. **Start of Part 3 (Components and composition).** |
| README | ✅ | Typed `Props` interface shape, rename-`class` convention, rest-spread forwarding, mutation rules, generics, common-mistakes, PE lens, 3 self-check questions. |
| Starter | ✅ | Components ship with `Props` interface + destructure intact (compile requires it). Each has `// Lesson 11 build:` block documenting the pattern so the student traces the shape. |
| Solution | ✅ | Dashboard with 3 sparklines, 1 bar chart, 2 metrics, 1 legend. Typed exports (`BarDatum`, `LegendItem`). `{#key refreshCount}` + `in:fade` animate data change. |
| Reference | ✅ | `RestSpreadForward`, `GenericList` (with `generics="T"`), `MutationWarning`. |
| Checks | ✅ | Both packages 292 files, 0 err / 0 warn. |
| Decisions | Starter ships the destructure done because incomplete `$props()` breaks compilation. Pedagogy moves to the README + live composition on the dashboard page. |

## Batch 3B — Lesson 12: `$props.id()` (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Nested accordion). `AccordionItem` under `$lib/` + dashboard page with 3 outer sections, each containing 3 FAQ sub-items (12 total instances → 24 unique IDs). |
| Starter | ✅ | Ships markup + state. Stubs: the `$props.id()` call and the 4 `aria-*` / `id` wiring points. |
| Solution | ✅ | `AccordionItem` with `$props.id()` generating `${uid}-trigger` + `${uid}-panel`, wired to `aria-controls`, `aria-labelledby`, `aria-expanded`. `transition:slide` on panel. |
| Reference | ✅ | `FormLabelling.svelte` — same rune for `<label for>`/`<input id>`. |
| Checks | ✅ | Both packages 288 files, 0 err / 0 warn. |
| Decisions | `svelte-ignore state_referenced_locally` for the `isOpen = $state(open)` pattern — `open` is intentionally an initial value only. The two-way-sync version comes in Lesson 13 with `$bindable`. |

## Batch 3C — Lesson 13: `$bindable` (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Multi-step signup wizard). `Stepper` component with `step = $bindable(0)`; parent owns `let step = $state(0)` and uses `<Stepper bind:step />`. |
| Starter | ✅ | Stepper ships with `$bindable` already applied (compile fails without it). Stub: `<Stepper bind:step ... />` in parent. |
| Solution | ✅ | Wizard with 4 steps (Email / Password / Profile / Summary), fade between steps, per-step validation gating Next. |
| Reference | ✅ | `BindableWithFallback.svelte` — the optional-bind fallback shape. |
| Checks | ✅ | Both packages 288 files, 0 err / 0 warn. |

## Batch 3D — Lesson 14: Snippets (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Data table). Generic `<Table<T>>` component takes `data`, `columns`, `row` snippet, optional `header` and `empty` snippets. |
| Starter | ✅ | Ships the implementation; documented via comment block in Props interface. |
| Solution | ✅ | Users table with badge, usage-bar, empty-state toggle. |
| Reference | ✅ | `ChildrenVsNamed.svelte` — mixing implicit `children` with named header/footer. |
| Checks | ✅ | Both packages 288 files, 0 err / 0 warn. |

## Batch 3E — Lesson 15: Slots → snippets migration (2026-04-21)
| Step | Status | Notes |
|---|---|---|
| Format | ✅ | One-real-project (Notice migration). `NoticeLegacy.svelte` with `<svelte:options runes={false}>` + Svelte 4 slots, alongside `NoticeSnippets.svelte` with runes + `Snippet<[{ close }]>`. Page renders both side-by-side. |
| Starter | ✅ | Legacy component + page shipped; `NoticeSnippets.svelte` is the migration target (ships complete as a worked example since it has to compile). |
| Solution | ✅ | Both components render identical output. Typed slot args via `SlotArgs` interface. |
| Checks | ✅ | Both packages 289 files, 0 err / 0 warn. |
| Decisions | `<svelte:fragment slot="…" let:close>` in the page remains legacy syntax (consuming a legacy child). `onclick` replaces `on:click` inside runes-mode parents even when passing into a legacy child. |

**Part 3 (Components and composition) complete.** Lessons 11–15 green. Next: Part 4 — State beyond one component (L16–18).
