import { prisma } from "@/lib/prisma";

// Until auth is in place, the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";
const USER_FILTER = { user: { email: DEMO_USER_EMAIL } };

export interface CollectionType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Item types in the collection, most used first.
  types: CollectionType[];
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

const typesByUsage = (types: CollectionType[]): CollectionType[] => {
  const counts = new Map<string, { type: CollectionType; count: number }>();
  for (const type of types) {
    const entry = counts.get(type.id);
    if (entry) entry.count += 1;
    else counts.set(type.id, { type, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).map(({ type }) => type);
};

export async function getRecentCollections(limit: number): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where: USER_FILTER,
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      items: {
        select: { item: { select: { type: { select: { id: true, name: true, icon: true, color: true } } } } },
      },
    },
  });

  return collections.map(({ items, ...collection }) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: items.length,
    types: typesByUsage(items.map(({ item }) => item.type)),
  }));
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: USER_FILTER }),
    prisma.collection.count({ where: { ...USER_FILTER, isFavorite: true } }),
  ]);
  return { total, favorites };
}
