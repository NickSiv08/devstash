import { ITEM_TYPE_SELECT, USER_FILTER, type ItemTypeSummary } from "@/lib/db/shared";
import { prisma } from "@/lib/prisma";

export interface ItemSummary {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: Date;
  tags: string[];
  type: ItemTypeSummary;
}

export interface ItemStats {
  total: number;
  favorites: number;
}

const ITEM_SELECT = {
  id: true,
  title: true,
  description: true,
  isPinned: true,
  isFavorite: true,
  updatedAt: true,
  type: { select: ITEM_TYPE_SELECT },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ItemRecord = Awaited<ReturnType<typeof findItems>>[number];

const findItems = async (args: { where?: { isPinned: boolean }; take?: number }) =>
  await prisma.item.findMany({
    where: { ...USER_FILTER, ...args.where },
    orderBy: { updatedAt: "desc" },
    take: args.take,
    select: ITEM_SELECT,
  });

const toSummary = ({ tags, ...item }: ItemRecord): ItemSummary => ({
  ...item,
  tags: tags.map(({ tag }) => tag.name),
});

export async function getPinnedItems(): Promise<ItemSummary[]> {
  const items = await findItems({ where: { isPinned: true } });
  return items.map(toSummary);
}

export async function getRecentItems(limit: number): Promise<ItemSummary[]> {
  const items = await findItems({ take: limit });
  return items.map(toSummary);
}

export async function getItemStats(): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: USER_FILTER }),
    prisma.item.count({ where: { ...USER_FILTER, isFavorite: true } }),
  ]);
  return { total, favorites };
}
