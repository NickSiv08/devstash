import { cn } from "cn";
import { FolderHeart, Folders, Layers, Star, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/dashboard-data";

interface StatsCardsProps {
  stats: DashboardStats;
}

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  toneClassName: string;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards: Stat[] = [
    {
      label: "Items",
      value: stats.items,
      icon: Layers,
      toneClassName: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
    },
    {
      label: "Collections",
      value: stats.collections,
      icon: Folders,
      toneClassName: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
    },
    {
      label: "Favorite Items",
      value: stats.favoriteItems,
      icon: Star,
      toneClassName: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20 [&_svg]:fill-current",
    },
    {
      label: "Favorite Collections",
      value: stats.favoriteCollections,
      icon: FolderHeart,
      toneClassName: "bg-pink-500/10 text-pink-500 ring-pink-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, toneClassName }) => (
        <Card key={label}>
          <CardContent className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-sm ring-1",
                  toneClassName,
                )}
              >
                <Icon className="size-4" />
              </div>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
