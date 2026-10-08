# Current Feature

<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

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
