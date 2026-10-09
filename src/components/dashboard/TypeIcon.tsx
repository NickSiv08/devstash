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
  type: { icon: string | null; color: string | null } | undefined;
}

export default function TypeIcon({ type, style, ...props }: TypeIconProps) {
  const Icon = (type?.icon && TYPE_ICONS[type.icon]) || File;
  return <Icon style={{ color: type?.color ?? undefined, ...style }} {...props} />;
}
