// Derived dashboard data. The sidebar still reads from the mock data until it moves to the database.
import { COLLECTIONS, ITEMS, type Collection } from "@/lib/mock-data";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

const lastUpdated = (collectionId: string) =>
  Math.max(
    0,
    ...ITEMS.filter((item) => item.collectionIds.includes(collectionId)).map((item) => Date.parse(item.updatedAt)),
  );

export const getFavoriteCollections = (): Collection[] =>
  COLLECTIONS.filter((collection) => collection.isFavorite);

export const getRecentCollections = (limit: number): Collection[] =>
  [...COLLECTIONS].sort((a, b) => lastUpdated(b.id) - lastUpdated(a.id)).slice(0, limit);
