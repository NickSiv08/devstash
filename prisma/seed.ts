// Seeds system item types and a demo user with sample collections and items.
// Safe to run more than once. Run with `npx prisma db seed` (also runs after `prisma migrate reset`).
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

import { PrismaClient, type ContentType } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

type TypeName = "snippet" | "prompt" | "command" | "note" | "file" | "image" | "link";

interface SeedItem {
  title: string;
  type: TypeName;
  description: string;
  content?: string;
  language?: string;
  url?: string;
}

interface SeedCollection {
  name: string;
  description: string;
  items: SeedItem[];
}

// Fixed ids so re-running updates the same rows. A unique key on (userId, name)
// can't do this, because Postgres treats the null userId of system types as distinct.
const SYSTEM_ITEM_TYPES: { name: TypeName; icon: string; color: string }[] = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
];

const typeId = (name: TypeName) => `type_${name}`;

const CONTENT_TYPES: Record<TypeName, ContentType> = {
  snippet: "TEXT",
  prompt: "TEXT",
  command: "TEXT",
  note: "TEXT",
  file: "FILE",
  image: "FILE",
  link: "URL",
};

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        title: "useDebounce and useLocalStorage Hooks",
        type: "snippet",
        language: "typescript",
        description: "Debounce a changing value and persist state to localStorage",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        title: "Context Provider with Compound Components",
        type: "snippet",
        language: "typescript",
        description: "Typed context provider and a compound Tabs component",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        title: "Utility Functions",
        type: "snippet",
        language: "typescript",
        description: "Small helpers for class names, formatting and grouping",
        content: `export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));

export const truncate = (text: string, length: number) =>
  text.length > length ? text.slice(0, length - 1) + "…" : text;

export function groupBy<T, K extends PropertyKey>(items: T[], getKey: (item: T) => K) {
  return items.reduce(
    (groups, item) => {
      (groups[getKey(item)] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        type: "prompt",
        description: "Review a diff for bugs, security issues and readability",
        content: `You are a senior engineer reviewing a pull request.

Review the diff below and report, in order of severity:
1. Correctness bugs (with the input that triggers each one)
2. Security issues (injection, auth checks, secrets, unsafe input handling)
3. Performance problems
4. Readability and naming issues

For each finding, give the file and line, explain the problem in one sentence and suggest a fix.
Skip style nitpicks that a linter would catch. If the diff looks good, say so.

Diff:
{{diff}}`,
      },
      {
        title: "Documentation Generator",
        type: "prompt",
        description: "Generate clear docs for a function, module or API",
        content: `Write documentation for the code below.

Include:
- A one-paragraph summary of what it does and when to use it
- Parameters and return value, with types and defaults
- At least one realistic usage example
- Edge cases, errors thrown and side effects

Write for a developer who is new to this codebase. Use Markdown and keep it concise.

Code:
{{code}}`,
      },
      {
        title: "Refactoring Assistant",
        type: "prompt",
        description: "Refactor code for readability without changing behavior",
        content: `Refactor the code below to make it easier to read and maintain.

Rules:
- Do not change its behavior or public API
- Prefer small, well-named functions and early returns
- Remove duplication and dead code
- Keep the existing code style and conventions

First list the changes you plan to make and why, then show the refactored code.
Point out anything that looks like a bug, but don't fix it silently.

Code:
{{code}}`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Next.js Multi-Stage Dockerfile",
        type: "snippet",
        language: "dockerfile",
        description: "Small production image for a Next.js app with standalone output",
        content: `FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy to Production",
        type: "command",
        language: "bash",
        description: "Apply migrations, then deploy the app to Vercel",
        content: "npx prisma migrate deploy && vercel deploy --prod",
      },
      {
        title: "Docker Docs",
        type: "link",
        description: "Official Docker documentation and guides",
        url: "https://docs.docker.com/",
      },
      {
        title: "GitHub Actions Docs",
        type: "link",
        description: "Workflow syntax and guides for CI/CD with GitHub Actions",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        title: "Undo Last Commit (Keep Changes)",
        type: "command",
        language: "bash",
        description: "Undo the last commit but keep its changes staged",
        content: "git reset --soft HEAD~1",
      },
      {
        title: "Remove Unused Docker Data",
        type: "command",
        language: "bash",
        description: "Delete stopped containers, unused images, networks and build cache",
        content: "docker system prune -a",
      },
      {
        title: "Kill Process on a Port",
        type: "command",
        language: "bash",
        description: "Find and stop whatever is listening on port 3000",
        content: "lsof -ti :3000 | xargs kill -9",
      },
      {
        title: "Check for Outdated Packages",
        type: "command",
        language: "bash",
        description: "List npm dependencies with newer versions available",
        content: "npm outdated",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Docs",
        type: "link",
        description: "Utility class reference for Tailwind CSS",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui",
        type: "link",
        description: "Accessible components you copy into your project",
        url: "https://ui.shadcn.com/",
      },
      {
        title: "Material Design 3",
        type: "link",
        description: "Google's design system with guidelines and components",
        url: "https://m3.material.io/",
      },
      {
        title: "Lucide Icons",
        type: "link",
        description: "Open-source icon library used across DevStash",
        url: "https://lucide.dev/icons/",
      },
    ],
  },
];

async function seedItemTypes() {
  const ids = SYSTEM_ITEM_TYPES.map(({ name }) => typeId(name));

  // Remove retired system types (e.g. the old "URL" type, now "link") that no items use.
  await prisma.itemType.deleteMany({
    where: { isSystem: true, userId: null, id: { notIn: ids }, items: { none: {} } },
  });

  for (const { name, icon, color } of SYSTEM_ITEM_TYPES) {
    const data = { name, icon, color, isSystem: true, userId: null };
    await prisma.itemType.upsert({
      where: { id: typeId(name) },
      update: data,
      create: { id: typeId(name), ...data },
    });
  }
}

async function seedDemoUser() {
  const data = {
    name: DEMO_USER.name,
    password: await bcrypt.hash(DEMO_USER.password, 12),
    isPro: false,
    emailVerified: new Date(),
  };
  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: data,
    create: { email: DEMO_USER.email, ...data },
  });
}

// Replaces the demo user's collections and items so re-running doesn't add duplicates.
async function seedCollections(userId: string) {
  await prisma.item.deleteMany({ where: { userId } });
  await prisma.collection.deleteMany({ where: { userId } });

  for (const { name, description, items } of COLLECTIONS) {
    const collection = await prisma.collection.create({ data: { name, description, userId } });
    for (const { type, ...item } of items) {
      await prisma.item.create({
        data: {
          ...item,
          contentType: CONTENT_TYPES[type],
          userId,
          typeId: typeId(type),
          collections: { create: { collectionId: collection.id } },
        },
      });
    }
  }
}

async function main() {
  await seedItemTypes();
  const user = await seedDemoUser();
  await seedCollections(user.id);

  const itemCount = COLLECTIONS.reduce((total, collection) => total + collection.items.length, 0);
  console.log(
    `Seeded ${SYSTEM_ITEM_TYPES.length} system item types and ${DEMO_USER.email} ` +
      `with ${COLLECTIONS.length} collections and ${itemCount} items`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
