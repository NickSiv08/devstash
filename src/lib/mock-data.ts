// Mock data for the dashboard UI. Replace with Prisma queries once the database is set up.

export type ContentType = "TEXT" | "FILE" | "URL";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
  isSystem: boolean;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileName: string | null;
  language: string | null;
  typeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CURRENT_USER: User = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  image: null,
  isPro: true,
};

export const ITEM_TYPES: ItemType[] = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6", isSystem: true, itemCount: 24 },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6", isSystem: true, itemCount: 18 },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316", isSystem: true, itemCount: 15 },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047", isSystem: true, itemCount: 12 },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280", isSystem: true, itemCount: 5 },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899", isSystem: true, itemCount: 3 },
  { id: "type_url", name: "Links", icon: "Link", color: "#10b981", isSystem: true, itemCount: 8 },
];

export const COLLECTIONS: Collection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
  },
  {
    id: "col_git",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
  },
];

export const ITEMS: Item[] = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "TEXT",
    content: `export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}`,
    url: null,
    fileName: null,
    language: "typescript",
    typeId: "type_snippet",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "auth", "hooks"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "TEXT",
    content: `async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.ok) return res;
    await new Promise((r) => setTimeout(r, 2 ** i * 1000));
  }
  throw new Error(\`Failed to fetch \${url}\`);
}`,
    url: null,
    fileName: null,
    language: "typescript",
    typeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["api", "fetch", "error-handling"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-01-12T09:30:00Z",
    updatedAt: "2026-01-12T09:30:00Z",
  },
  {
    id: "item_3",
    title: "React Docs: Hooks Reference",
    description: "Official reference for built-in React hooks",
    contentType: "URL",
    content: null,
    url: "https://react.dev/reference/react/hooks",
    fileName: null,
    language: null,
    typeId: "type_url",
    collectionIds: ["col_react", "col_interview"],
    tags: ["react", "docs"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-10T14:00:00Z",
    updatedAt: "2026-01-10T14:00:00Z",
  },
  {
    id: "item_4",
    title: "Component Composition Notes",
    description: "When to use children, render props and compound components",
    contentType: "TEXT",
    content: "## Composition\n\n- Prefer `children` for simple slots\n- Use compound components for related UI",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_note",
    collectionIds: ["col_react"],
    tags: ["react", "patterns"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-08T11:00:00Z",
    updatedAt: "2026-01-09T08:00:00Z",
  },
  {
    id: "item_5",
    title: "List Comprehension Examples",
    description: "Filtering and mapping with list comprehensions",
    contentType: "TEXT",
    content: "evens = [n for n in range(20) if n % 2 == 0]\nsquares = {n: n * n for n in range(10)}",
    url: null,
    fileName: null,
    language: "python",
    typeId: "type_snippet",
    collectionIds: ["col_python"],
    tags: ["python", "lists"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-07T16:20:00Z",
    updatedAt: "2026-01-07T16:20:00Z",
  },
  {
    id: "item_6",
    title: "Virtual Environments",
    description: "Notes on setting up venv for Python projects",
    contentType: "TEXT",
    content: "python -m venv .venv\nsource .venv/bin/activate",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_note",
    collectionIds: ["col_python"],
    tags: ["python", "setup"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-06T10:00:00Z",
    updatedAt: "2026-01-06T10:00:00Z",
  },
  {
    id: "item_7",
    title: "CLAUDE.md Template",
    description: "Starter context file for AI coding assistants",
    contentType: "FILE",
    content: null,
    url: null,
    fileName: "CLAUDE.md",
    language: null,
    typeId: "type_file",
    collectionIds: ["col_context"],
    tags: ["ai", "context"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-05T12:00:00Z",
    updatedAt: "2026-01-05T12:00:00Z",
  },
  {
    id: "item_8",
    title: "Project Context Checklist",
    description: "What to include in a project context file",
    contentType: "TEXT",
    content: "- Stack and versions\n- Coding standards\n- Commands\n- Current feature",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_note",
    collectionIds: ["col_context", "col_interview"],
    tags: ["ai", "context"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-04T09:00:00Z",
    updatedAt: "2026-01-04T09:00:00Z",
  },
  {
    id: "item_9",
    title: "Undo Last Commit",
    description: "Undo the last commit but keep the changes staged",
    contentType: "TEXT",
    content: "git reset --soft HEAD~1",
    url: null,
    fileName: null,
    language: "bash",
    typeId: "type_command",
    collectionIds: ["col_git"],
    tags: ["git"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-01-03T15:00:00Z",
    updatedAt: "2026-01-03T15:00:00Z",
  },
  {
    id: "item_10",
    title: "Branch Naming Conventions",
    description: "Team conventions for naming git branches",
    contentType: "TEXT",
    content: "feature/<name>, fix/<name>, chore/<name>",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_note",
    collectionIds: ["col_git"],
    tags: ["git", "conventions"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-02T10:00:00Z",
    updatedAt: "2026-01-02T10:00:00Z",
  },
  {
    id: "item_11",
    title: "Code Review Prompt",
    description: "Prompt for reviewing a diff for bugs and readability",
    contentType: "TEXT",
    content: "Review the following diff. List correctness bugs first, then readability issues.",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_prompt",
    collectionIds: ["col_ai", "col_interview"],
    tags: ["ai", "code-review"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-01-01T13:00:00Z",
    updatedAt: "2026-01-01T13:00:00Z",
  },
  {
    id: "item_12",
    title: "Explain Regex",
    description: "Snippet showing a commented regular expression",
    contentType: "TEXT",
    content: "const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;",
    url: null,
    fileName: null,
    language: "typescript",
    typeId: "type_snippet",
    collectionIds: ["col_ai"],
    tags: ["regex"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2025-12-30T10:00:00Z",
    updatedAt: "2025-12-30T10:00:00Z",
  },
  {
    id: "item_13",
    title: "Prompt Writing Tips",
    description: "Notes on writing clear prompts for coding tasks",
    contentType: "TEXT",
    content: "- Give context\n- State constraints\n- Ask for one thing at a time",
    url: null,
    fileName: null,
    language: null,
    typeId: "type_note",
    collectionIds: ["col_ai"],
    tags: ["ai", "prompts"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2025-12-28T10:00:00Z",
    updatedAt: "2025-12-28T10:00:00Z",
  },
];
