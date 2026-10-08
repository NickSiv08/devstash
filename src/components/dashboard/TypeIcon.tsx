import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import type { ItemType } from "@/lib/mock-data";

const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

interface TypeIconProps extends Omit<LucideProps, "type"> {
  type: ItemType | undefined;
}

export default function TypeIcon({ type, style, ...props }: TypeIconProps) {
  const Icon = (type && TYPE_ICONS[type.icon]) || File;
  return <Icon style={{ color: type?.color, ...style }} {...props} />;
}
