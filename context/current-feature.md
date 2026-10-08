# Current Feature

## Dashboard UI Phase 3

Phase 3 of 3 for the dashboard UI layout: build the main area to the right of the sidebar, using data imported directly from the mock data file.

## Status

In Progress

## Goals

- Main area to the right of the sidebar
- Recent collections
- Pinned items
- 10 most recent items
- 4 stats cards at the top: number of items, collections, favorite items and favorite collections (not in the screenshot)

## Notes

- Spec: @context/features/dashboard-phase-3-spec.md
- Use @context/screenshots/dashboard-ui-main.png as a visual reference
- Import data directly from @src/lib/mock-data.ts until the database is in place
- Phase 1: @context/features/dashboard-phase-1-spec.md · Phase 2: @context/features/dashboard-phase-2-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial setup**: Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript. Removed the default Next.js boilerplate and assets, and added the project context docs.
- **Dashboard UI Phase 1**: Set up shadcn/ui with the Button and Input components. Added the `/dashboard` route, which has a placeholder sidebar, a top bar with search and a New Item button (display only), and a placeholder main area. Dark mode is on by default.
- **Dashboard UI Phase 2**: Replaced the placeholder sidebar with a collapsible shadcn/ui sidebar (added the Sidebar, Sheet, Collapsible, Avatar, Separator, Tooltip and Skeleton components and the `use-mobile` hook). It lists item types with links to `/items/TYPE`, favorite collections, the most recent collections and a user avatar area, all using mock data. A toggle in the top bar opens and closes it, and it always shows as a drawer on mobile.
