import Link from "next/link";
import { ChevronDown, Folder, FolderOpen, Layers, Settings, Star } from "lucide-react";

import TypeIcon from "@/components/dashboard/TypeIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getFavoriteCollections, getRecentCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { CURRENT_USER } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

// Types that are only available on the Pro plan.
const PRO_TYPES = new Set(["file", "image"]);

// Type names are stored singular and lowercase, e.g. "snippet" -> "Snippets".
const typeLabel = (name: string) => `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;

const initials = CURRENT_USER.name
  .split(" ")
  .map((part) => part[0])
  .join("");

export default async function AppSidebar() {
  const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    getSidebarItemTypes(),
    getFavoriteCollections(),
    getRecentCollections(RECENT_COLLECTIONS_LIMIT),
  ]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="DevStash" render={<Link href="/dashboard" />}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Layers className="size-4" />
              </div>
              <span className="text-base font-semibold">DevStash</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Types
              <ChevronDown className="ml-auto transition-transform group-data-[open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {itemTypes.map((type) => (
                    <SidebarMenuItem key={type.id}>
                      <SidebarMenuButton tooltip={typeLabel(type.name)} render={<Link href={`/items/${type.name}`} />}>
                        <TypeIcon type={type} />
                        <span>{typeLabel(type.name)}</span>
                        {PRO_TYPES.has(type.name) && (
                          <Badge
                            variant="outline"
                            className="h-4 px-1.5 text-[0.6rem] font-semibold tracking-wider text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden"
                          >
                            PRO
                          </Badge>
                        )}
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{type.itemCount}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarSeparator />

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Collections
              <ChevronDown className="ml-auto transition-transform group-data-[open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {favoriteCollections.length > 0 && (
                  <>
                    <p className="px-2 pt-2 pb-1 text-[0.7rem] font-medium tracking-wider text-sidebar-foreground/50 uppercase group-data-[collapsible=icon]:hidden">
                      Favorites
                    </p>
                    <SidebarMenu>
                      {favoriteCollections.map((collection) => (
                        <SidebarMenuItem key={collection.id}>
                          <SidebarMenuButton tooltip={collection.name}>
                            <Folder />
                            <span>{collection.name}</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          </SidebarMenuBadge>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </>
                )}

                <p className="px-2 pt-4 pb-1 text-[0.7rem] font-medium tracking-wider text-sidebar-foreground/50 uppercase group-data-[collapsible=icon]:hidden">
                  Recent
                </p>
                <SidebarMenu>
                  {recentCollections.map((collection) => (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton tooltip={collection.name}>
                        <Folder />
                        <span>{collection.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>
                        <span
                          className="size-2.5 rounded-full bg-sidebar-foreground/30"
                          style={{ backgroundColor: collection.types[0]?.color ?? undefined }}
                        />
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="View all collections"
                      className="text-sidebar-foreground/70"
                      render={<Link href="/collections" />}
                    >
                      <FolderOpen />
                      <span>View all collections</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={CURRENT_USER.name}>
              <Avatar className="size-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-medium">{CURRENT_USER.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {CURRENT_USER.email}
                </span>
              </div>
              <Settings className="ml-auto text-sidebar-foreground/70" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
