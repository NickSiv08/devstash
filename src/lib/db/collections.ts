import { ITEM_TYPE_SELECT, USER_FILTER, type ItemTypeSummary } from "@/lib/db/shared";
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

const typesByUsage = (types: ItemTypeSummary[]): ItemTypeSummary[] => {
  const counts = new Map<string, { type: ItemTypeSummary; count: number }>();
  for (const type of types) {
    const entry = counts.get(type.id);
    if (entry) entry.count += 1;
    else counts.set(type.id, { type, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).map(({ type }) => type);
};

const findCollections = async (args: { where?: { isFavorite: boolean }; take?: number }) => {
  const collections = await prisma.collection.findMany({
    where: { ...USER_FILTER, ...args.where },
    orderBy: { updatedAt: "desc" },
    take: args.take,
    include: {
      items: {
        select: { item: { select: { type: { select: ITEM_TYPE_SELECT } } } },
      },
    },
  });

  return collections.map(({ items, ...collection }): CollectionSummary => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: items.length,
    types: typesByUsage(items.map(({ item }) => item.type)),
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
