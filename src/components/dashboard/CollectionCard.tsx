import { Star } from "lucide-react";

import TypeIcon from "@/components/dashboard/TypeIcon";
import { Card, CardContent } from "@/components/ui/card";
import { getCollectionTypes } from "@/lib/dashboard-data";
import type { Collection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const types = getCollectionTypes(collection.id);

  return (
    <Card className="border-l-4 border-l-border" style={{ borderLeftColor: types[0]?.color }}>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{collection.itemCount} items</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
        <div className="flex items-center gap-2">
          {types.map((type) => (
            <TypeIcon key={type.id} type={type} className="size-4" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
