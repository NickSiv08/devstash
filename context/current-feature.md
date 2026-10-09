# Current Feature

## Seed Sample Data

Rewrite the seed script (`prisma/seed.ts`) to fill the database with sample data for development and demos.

## Status

In Progress

## Goals

- Demo user: demo@devstash.io, "Demo User", password `12345678` hashed with bcryptjs (12 rounds), `isPro: false`, `emailVerified` set to the current date
- 7 system item types (`isSystem: true`): snippet, prompt, command, note, file, image, link, with their Lucide icons and colors
- 5 collections for the demo user, with their items:
  - **React Patterns** (Reusable React patterns and hooks): 3 TypeScript snippets covering custom hooks, component patterns and utility functions
  - **AI Workflows** (AI prompts and workflow automations): 3 prompts covering code review, documentation generation and refactoring
  - **DevOps** (Infrastructure and deployment resources): 1 snippet (Docker or CI/CD config), 1 command (deployment script) and 2 links to real documentation URLs
  - **Terminal Commands** (Useful shell commands for everyday development): 4 commands covering git, Docker, process management and package managers
  - **Design Resources** (UI/UX resources and references): 4 links to real URLs covering CSS/Tailwind, component libraries, design systems and icon libraries

## Notes

- Spec: @context/features/seed-spec.md
- The existing seed file can be overwritten
- The spec uses lowercase type names and `link` instead of `URL`. The seed must update the already-seeded types instead of adding duplicates.
- Keep the seed safe to run more than once

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial setup**: Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript. Removed the default Next.js boilerplate and assets, and added the project context docs.
- **Dashboard UI Phase 1**: Set up shadcn/ui with the Button and Input components. Added the `/dashboard` route, which has a placeholder sidebar, a top bar with search and a New Item button (display only), and a placeholder main area. Dark mode is on by default.
- **Dashboard UI Phase 2**: Replaced the placeholder sidebar with a collapsible shadcn/ui sidebar (added the Sidebar, Sheet, Collapsible, Avatar, Separator, Tooltip and Skeleton components and the `use-mobile` hook). It lists item types with links to `/items/TYPE`, favorite collections, the most recent collections and a user avatar area, all using mock data. A toggle in the top bar opens and closes it, and it always shows as a drawer on mobile.
- **Dashboard UI Phase 3**: Built the dashboard main area with 4 stats cards (items, collections, favorite items and favorite collections, each with a tinted icon), the 6 most recent collections as cards showing their item types, pinned items and the 10 most recent items. Added the shadcn/ui Card and Badge components, a shared `TypeIcon` component, and `src/lib/dashboard-data.ts` for data derived from the mock data, which the sidebar now uses too.
- **Prisma + Neon PostgreSQL Setup**: Added Prisma 7 with a Neon serverless PostgreSQL database. The initial schema (`prisma/schema.prisma`) covers users, the NextAuth models (Account, Session, VerificationToken), items, item types, collections and tags, with indexes and cascade deletes, and is applied through the first migration (`init`). `prisma.config.ts` runs migrations over the direct connection (`DIRECT_URL`), and `src/lib/prisma.ts` provides a shared client that uses the Neon adapter over the pooled `DATABASE_URL`. `prisma/seed.ts` seeds the 7 system item types (`npx prisma db seed`), and `scripts/db-test.ts` (`npm run db:test`) checks the connection, seed data, relations and cascade deletes.
