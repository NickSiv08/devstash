// Seeds the system item types. Safe to run more than once.
// Run with `npx prisma db seed` (also runs after `prisma migrate reset`).
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

// Fixed ids so re-running updates the same rows. A unique key on (userId, name)
// can't do this, because Postgres treats the null userId of system types as distinct.
const SYSTEM_ITEM_TYPES = [
  { id: "type_snippet", name: "Snippet", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_note", name: "Note", icon: "StickyNote", color: "#fde047" },
  { id: "type_command", name: "Command", icon: "Terminal", color: "#f97316" },
  { id: "type_file", name: "File", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "Image", icon: "Image", color: "#ec4899" },
  { id: "type_url", name: "URL", icon: "Link", color: "#10b981" },
];

async function main() {
  for (const { id, ...type } of SYSTEM_ITEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id },
      update: { ...type, isSystem: true, userId: null },
      create: { id, ...type, isSystem: true },
    });
  }
  console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
