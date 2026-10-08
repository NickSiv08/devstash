import { Pin, Star } from "lucide-react";

import TypeIcon from "@/components/dashboard/TypeIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getItemType } from "@/lib/dashboard-data";
import type { Item } from "@/lib/mock-data";

interface ItemRowProps {
  item: Item;
}

// Fixed locale and time zone so the server and client render the same date.
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export default function ItemRow({ item }: ItemRowProps) {
  const type = getItemType(item.typeId);

  return (
    <Card className="border-l-4 border-l-border" style={{ borderLeftColor: type?.color }}>
      <CardContent className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <TypeIcon type={type} className="size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{item.title}</h3>
            {item.isPinned && <Pin className="size-3.5 shrink-0 text-muted-foreground" />}
            {item.isFavorite && <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />}
          </div>
          <p className="truncate text-sm text-muted-foreground">{item.description}</p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <time dateTime={item.updatedAt} className="shrink-0 text-xs text-muted-foreground">
          {DATE_FORMAT.format(new Date(item.updatedAt))}
        </time>
      </CardContent>
    </Card>
  );
}
