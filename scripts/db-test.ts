// Smoke test for the database: connection, seeded data, relations and cascade deletes.
// Run with `npm run db:test`. Creates a temporary user and removes it before exiting.
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

const SYSTEM_TYPE_COUNT = 7;

const check = (condition: boolean, message: string) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  ✓ ${message}`);
};

async function testConnection() {
  console.log("Connection");
  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`;
  check(now instanceof Date, `connected (server time ${now.toISOString()})`);
}

async function testSeedData() {
  console.log("Seed data");
  const systemTypes = await prisma.itemType.findMany({ where: { isSystem: true, userId: null } });
  check(
    systemTypes.length === SYSTEM_TYPE_COUNT,
    `${systemTypes.length}/${SYSTEM_TYPE_COUNT} system item types`,
  );
}

async function testRelationsAndCascade(email: string) {
  console.log("Relations and cascade deletes");
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
  check(item.type.name === "Snippet", "item linked to its type");
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
    await testSeedData();
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
