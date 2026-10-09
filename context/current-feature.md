# Current Feature

## Dashboard Collections

## Status

Completed

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial setup**: Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript. Removed the default Next.js boilerplate and assets, and added the project context docs.
- **Dashboard UI Phase 1**: Set up shadcn/ui with the Button and Input components. Added the `/dashboard` route, which has a placeholder sidebar, a top bar with search and a New Item button (display only), and a placeholder main area. Dark mode is on by default.
- **Dashboard UI Phase 2**: Replaced the placeholder sidebar with a collapsible shadcn/ui sidebar (added the Sidebar, Sheet, Collapsible, Avatar, Separator, Tooltip and Skeleton components and the `use-mobile` hook). It lists item types with links to `/items/TYPE`, favorite collections, the most recent collections and a user avatar area, all using mock data. A toggle in the top bar opens and closes it, and it always shows as a drawer on mobile.
- **Dashboard UI Phase 3**: Built the dashboard main area with 4 stats cards (items, collections, favorite items and favorite collections, each with a tinted icon), the 6 most recent collections as cards showing their item types, pinned items and the 10 most recent items. Added the shadcn/ui Card and Badge components, a shared `TypeIcon` component, and `src/lib/dashboard-data.ts` for data derived from the mock data, which the sidebar now uses too.
- **Prisma + Neon PostgreSQL Setup**: Added Prisma 7 with a Neon serverless PostgreSQL database. The initial schema (`prisma/schema.prisma`) covers users, the NextAuth models (Account, Session, VerificationToken), items, item types, collections and tags, with indexes and cascade deletes, and is applied through the first migration (`init`). `prisma.config.ts` runs migrations over the direct connection (`DIRECT_URL`), and `src/lib/prisma.ts` provides a shared client that uses the Neon adapter over the pooled `DATABASE_URL`. `prisma/seed.ts` seeds the 7 system item types (`npx prisma db seed`), and `scripts/db-test.ts` (`npm run db:test`) checks the connection, seed data, relations and cascade deletes.
- **Dashboard Collections**: The recent collection cards in the dashboard main area now come from the Neon database through Prisma instead of the mock data. Added `src/lib/db/collections.ts` with `getRecentCollections` (item count and item types per collection, most-used first) and `getCollectionStats`, both fetched in the async dashboard page. Each card's border color comes from its most-used item type, and it shows an icon for each type in it. The collection stats cards use the database counts. Until auth is added, the queries read the seeded demo user's data.
