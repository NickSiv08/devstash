// Derived dashboard data. Reads from the mock data until the database is in place.
import { COLLECTIONS, ITEM_TYPES, ITEMS, type Collection, type Item, type ItemType } from "@/lib/mock-data";

export interface DashboardStats {
  items: number;
  collections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

const TYPES_BY_ID = new Map(ITEM_TYPES.map((type) => [type.id, type]));

export const getItemType = (typeId: string): ItemType | undefined => TYPES_BY_ID.get(typeId);

const itemsInCollection = (collectionId: string) =>
  ITEMS.filter((item) => item.collectionIds.includes(collectionId));

const lastUpdated = (collectionId: string) =>
  Math.max(0, ...itemsInCollection(collectionId).map((item) => Date.parse(item.updatedAt)));

const byUpdatedDesc = (a: Item, b: Item) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);

export const getFavoriteCollections = (): Collection[] =>
  COLLECTIONS.filter((collection) => collection.isFavorite);

export const getRecentCollections = (limit: number): Collection[] =>
  [...COLLECTIONS].sort((a, b) => lastUpdated(b.id) - lastUpdated(a.id)).slice(0, limit);

// Item types found in a collection, most common first.
export const getCollectionTypes = (collectionId: string): ItemType[] => {
  const counts = new Map<string, number>();
  for (const item of itemsInCollection(collectionId)) {
    counts.set(item.typeId, (counts.get(item.typeId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([typeId]) => getItemType(typeId))
    .filter((type): type is ItemType => type !== undefined);
};

export const getPinnedItems = (): Item[] => ITEMS.filter((item) => item.isPinned).sort(byUpdatedDesc);

export const getRecentItems = (limit: number): Item[] => [...ITEMS].sort(byUpdatedDesc).slice(0, limit);

export const getDashboardStats = (): DashboardStats => ({
  items: ITEM_TYPES.reduce((total, type) => total + type.itemCount, 0),
  collections: COLLECTIONS.length,
  favoriteItems: ITEMS.filter((item) => item.isFavorite).length,
  favoriteCollections: getFavoriteCollections().length,
});
