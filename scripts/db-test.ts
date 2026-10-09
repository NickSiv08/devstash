// Smoke test for the database: connection, seeded data, relations and cascade deletes.
// Displays the seeded demo data and checks it matches context/features/seed-spec.md.
// Run with `npm run db:test` after `npx prisma db seed`. Creates a temporary user and removes it before exiting.
import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

const SYSTEM_TYPES = ["command", "file", "image", "link", "note", "prompt", "snippet"];

const DEMO_USER = { email: "demo@devstash.io", name: "Demo User", password: "12345678", bcryptRounds: 12 };

// Expected item types per collection, from the seed spec.
const EXPECTED_COLLECTIONS: Record<string, Record<string, number>> = {
  "React Patterns": { snippet: 3 },
  "AI Workflows": { prompt: 3 },
  DevOps: { snippet: 1, command: 1, link: 2 },
  "Terminal Commands": { command: 4 },
  "Design Resources": { link: 4 },
};

const check = (condition: boolean, message: string) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  ✓ ${message}`);
};

const countBy = (values: string[]) =>
  values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});

const sameCounts = (a: Record<string, number>, b: Record<string, number>) =>
  JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

async function testConnection() {
  console.log("Connection");
  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;
  check(now instanceof Date, `connected (server time ${now.toISOString()})`);
}

async function testSystemTypes() {
  console.log("\nSystem item types");
  const types = await prisma.itemType.findMany({
    where: { isSystem: true, userId: null },
    select: { id: true, name: true, icon: true, color: true, _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  console.table(types.map(({ _count, ...type }) => ({ ...type, items: _count.items })));

  check(
    JSON.stringify(types.map((type) => type.name)) === JSON.stringify(SYSTEM_TYPES),
    `${types.length} system types: ${SYSTEM_TYPES.join(", ")}`,
  );
  check(types.every((type) => type.icon && type.color), "every type has an icon and a color");
}

async function testDemoUser() {
  console.log("\nDemo user");
  const user = await prisma.user.findUnique({ where: { email: DEMO_USER.email } });
  check(user !== null, `${DEMO_USER.email} exists`);
  if (!user) return;

  console.table([
    { email: user.email, name: user.name, isPro: user.isPro, emailVerified: user.emailVerified?.toISOString() },
  ]);
  check(user.name === DEMO_USER.name && !user.isPro && user.emailVerified !== null, "name, isPro and emailVerified");

  const password = user.password ?? "";
  check(await bcrypt.compare(DEMO_USER.password, password), "password matches its bcrypt hash");
  check(bcrypt.getRounds(password) === DEMO_USER.bcryptRounds, `password hashed with ${DEMO_USER.bcryptRounds} rounds`);
}

async function testDemoCollections() {
  console.log("\nDemo collections and items");
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER.email } },
    include: { items: { include: { item: { include: { type: true } } }, orderBy: { addedAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  for (const collection of collections) {
    const items = collection.items.map(({ item }) => item);
    console.log(`\n  ${collection.name} — ${collection.description}`);
    console.table(
      items.map((item) => ({
        type: item.type.name,
        title: item.title,
        detail: item.url ?? item.language ?? `${item.content?.length ?? 0} chars`,
      })),
    );

    const expected = EXPECTED_COLLECTIONS[collection.name];
    const actual = countBy(items.map((item) => item.type.name));
    check(expected !== undefined && sameCounts(actual, expected), `${collection.name}: ${JSON.stringify(actual)}`);
    check(
      items.every((item) => (item.contentType === "URL" ? item.url?.startsWith("https://") : item.content)),
      `${collection.name}: links have https URLs, other items have content`,
    );
  }

  check(collections.length === Object.keys(EXPECTED_COLLECTIONS).length, `${collections.length} collections`);
}

async function testRelationsAndCascade(email: string) {
  console.log("\nRelations and cascade deletes");
  const snippetType = await prisma.itemType.findUniqueOrThrow({ where: { id: "type_snippet" } });

  const user = await prisma.user.create({
    data: {
      email,
      name: "DB Test",
      collections: { create: { name: "Test Collection" } },
      tags: { create: { name: "test-tag" } },
    },
    include: { collections: true, tags: true },
  });

  const item = await prisma.item.create({
    data: {
      title: "Test Item",
      contentType: "TEXT",
      content: "console.log('hello')",
      userId: user.id,
      typeId: snippetType.id,
      collections: { create: { collectionId: user.collections[0].id } },
      tags: { create: { tagId: user.tags[0].id } },
    },
    include: { type: true, collections: true, tags: { include: { tag: true } } },
  });
  check(item.type.name === "snippet", "item linked to its type");
  check(item.collections.length === 1, "item added to a collection");
  check(item.tags[0]?.tag.name === "test-tag", "item tagged");

  await prisma.user.delete({ where: { id: user.id } });
  const [items, collections, tags, itemCollections, itemTags] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.tag.count({ where: { userId: user.id } }),
    prisma.itemCollection.count({ where: { itemId: item.id } }),
    prisma.itemTag.count({ where: { itemId: item.id } }),
  ]);
  check(
    items + collections + tags + itemCollections + itemTags === 0,
    "deleting the user removed its items, collections, tags and join rows",
  );
}

async function main() {
  const email = `db-test-${Date.now()}@devstash.test`;
  try {
    await testConnection();
    await testSystemTypes();
    await testDemoUser();
    await testDemoCollections();
    await testRelationsAndCascade(email);
    console.log("\nAll database checks passed");
  } finally {
    // Clean up if a check failed before the user was deleted.
    await prisma.user.deleteMany({ where: { email } });
  }
}

main()
  .catch((error) => {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
