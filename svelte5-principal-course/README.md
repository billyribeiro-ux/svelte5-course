# Svelte 5 Principal Engineer Course

A build-along course for engineers who already know how to ship — just not in this stack yet. Designed for Billy Ribeiro: strong Python background, zero web-framework experience, high expectations.

No toy examples. Every lesson has a real build. Every build compiles, runs, and passes strict TypeScript.

Built against the state of Svelte on **2026-04-21**:

| Package | Version |
|---|---|
| svelte | 5.55.4 |
| @sveltejs/kit | 2.57.1 |
| @sveltejs/vite-plugin-svelte | 7.0.0 |
| vite | 8.0.9 |
| typescript | 6.0.3 |
| svelte-check | 4.4.6 |
| pnpm | 10.33.0 |
| node | 24.x |

## What you need before starting

- **Node 24** — `node --version` should show `v24.x.y`. If you don't have it, use `fnm` or `nvm` to install.
- **pnpm 10+** — `corepack enable && corepack prepare pnpm@10.33.0 --activate`. Do not use npm or yarn with this course.
- **VS Code + Svelte extension** — the official one, `svelte.svelte-vscode`. It is the difference between "productive" and "miserable."
- **A real terminal** — iTerm2, Ghostty, or whatever. Not the VS Code integrated terminal alone — some lessons run long-lived dev servers and you'll want a separate window.

## How the course is laid out

This is a pnpm workspace. One install at the root gives you every lesson wired up:

```
svelte5-principal-course/
├── packages/
│   └── styles/               ← shared design tokens (OKLCH, @layer, logical props)
├── lesson-01-state/
│   ├── README.md             ← read this first
│   ├── starter/              ← you build here
│   ├── solution/             ← reference implementation — peek only if stuck
│   └── reference/            ← edge-case examples to read, not run
├── lesson-02-derived/
│   └── ...
└── final-project/
    └── ...
```

## How to work through a lesson

1. **Read the lesson's `README.md` start to finish.** Don't skim. The concept section is where the mental model lives.
2. **Open the `starter/` folder in VS Code.** Do `pnpm --filter @course/lesson-XX-starter dev` from the course root, or `cd` into the starter and run `pnpm dev`.
3. **Do the build challenge.** Don't look at `solution/` first. You will learn more from being stuck for 15 minutes than from reading a working answer cold.
4. **When you finish, diff your work against `solution/`.** Note what you did differently and why. If your version is better, keep it. If theirs is, understand *why* before copying.
5. **Read the `reference/` folder.** These are edge cases and alternate patterns you would otherwise find the hard way.
6. **Check the lesson off in `PROGRESS.md`.** Don't skip this — it is a forcing function to notice your own progress.

## The learning contract

Three rules, in order of importance:

1. **Don't skip lessons.** Each one builds on the last. Lesson 14 assumes you understood Lesson 11.
2. **Do every build.** Reading code is not learning. Typing code into your own starter, making mistakes, fixing them — that is learning.
3. **Answer the self-check questions out loud before opening the `<details>` tag.** If you can't explain it to an empty room, you don't have it yet.

## When you get stuck

In this order:

1. Re-read the lesson's "Common mistakes" section.
2. Read the relevant Svelte docs section — links are inline in every lesson README.
3. Open the `solution/` folder and diff.
4. Open the Svelte Discord's `#help` channel.

## First command

```sh
cd svelte5-principal-course
pnpm install
pnpm --filter @course/lesson-01-starter dev
```

Then open `lesson-01-state/README.md` and start reading.
