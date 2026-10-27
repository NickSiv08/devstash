import { Clock, Pin } from "lucide-react";

import CollectionCard from "@/components/dashboard/CollectionCard";
import ItemRow from "@/components/dashboard/ItemRow";
import StatsCards from "@/components/dashboard/StatsCards";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const [recentCollections, collectionStats, pinnedItems, recentItems, itemStats] = await Promise.all([
    getRecentCollections(RECENT_COLLECTIONS_LIMIT),
    getCollectionStats(),
    getPinnedItems(),
    getRecentItems(RECENT_ITEMS_LIMIT),
    getItemStats(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </header>

      <StatsCards
        stats={{
          items: itemStats.total,
          collections: collectionStats.total,
          favoriteItems: itemStats.favorites,
          favoriteCollections: collectionStats.favorites,
        }}
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Collections</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {pinnedItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-muted-foreground">
            <Pin className="size-4" />
            Pinned
          </h2>
          <div className="space-y-3">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          Recent
        </h2>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
