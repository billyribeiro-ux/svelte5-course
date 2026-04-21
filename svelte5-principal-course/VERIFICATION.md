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
