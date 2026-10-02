# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types

## Context Files

Read tge following to get the full context of the project:

-@context/project-overview.md
-@context/coding-standards.md
-@context/ai-interaction.md
-@context/current-feature.md

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (also type-checks)
npm run start   # serve the production build
npm run lint    # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit  # type-check without building
```

No test runner is configured. If tests are needed, a framework has to be added first.

## Stack

- **Next.js 16.3 (App Router) + React 19.2**. As AGENTS.md says, APIs differ from older Next.js. Check `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`) before using Next APIs.
- **Route type helpers**: layouts and pages use the globally generated `LayoutProps<"/">` / `PageProps<...>` types (generated into `.next/types`), not hand-written props interfaces.
- **Tailwind CSS v4** through `@tailwindcss/postcss`. There is no `tailwind.config.*`; configuration lives in CSS (`src/app/globals.css`, which starts with `@import "tailwindcss"`).
- **Fonts**: Geist and Geist Mono via `next/font/google`, exposed as the CSS variables `--font-geist-sans` and `--font-geist-mono` on `<html>`.
- **Path alias**: `@/*` maps to `src/*`.
- TypeScript is in `strict` mode.
