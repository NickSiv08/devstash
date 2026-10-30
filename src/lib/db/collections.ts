import { USER_FILTER, type ItemTypeSummary } from "@/lib/db/shared";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Item types in the collection, most used first.
  types: ItemTypeSummary[];
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

// Item types per collection, most used first, counted in the database instead of loading every item.
const findTypesByCollection = async (
  collectionIds: string[],
): Promise<Map<string, ItemTypeSummary[]>> => {
  const typesByCollection = new Map<string, ItemTypeSummary[]>();
  if (collectionIds.length === 0) return typesByCollection;

  const rows = await prisma.$queryRaw<(ItemTypeSummary & { collectionId: string })[]>`
    SELECT ic."collectionId", t.id, t.name, t.icon, t.color
    FROM "ItemCollection" ic
    JOIN "Item" i ON i.id = ic."itemId"
    JOIN "ItemType" t ON t.id = i."typeId"
    WHERE ic."collectionId" IN (${Prisma.join(collectionIds)})
    GROUP BY ic."collectionId", t.id
    ORDER BY ic."collectionId", COUNT(*) DESC, t.name
  `;

  for (const { collectionId, ...type } of rows) {
    const types = typesByCollection.get(collectionId);
    if (types) types.push(type);
    else typesByCollection.set(collectionId, [type]);
  }
  return typesByCollection;
};

const findCollections = async (args: { where?: { isFavorite: boolean }; take?: number }) => {
  const collections = await prisma.collection.findMany({
    where: { ...USER_FILTER, ...args.where },
    orderBy: { updatedAt: "desc" },
    take: args.take,
    include: { _count: { select: { items: true } } },
  });
  const typesByCollection = await findTypesByCollection(collections.map(({ id }) => id));

  return collections.map((collection): CollectionSummary => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: collection._count.items,
    types: typesByCollection.get(collection.id) ?? [],
  }));
};

export async function getRecentCollections(limit: number): Promise<CollectionSummary[]> {
  return await findCollections({ take: limit });
}

export async function getFavoriteCollections(): Promise<CollectionSummary[]> {
  return await findCollections({ where: { isFavorite: true } });
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: USER_FILTER }),
    prisma.collection.count({ where: { ...USER_FILTER, isFavorite: true } }),
  ]);
  return { total, favorites };
}
