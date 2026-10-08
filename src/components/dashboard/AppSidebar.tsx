import Link from "next/link";
import { ChevronDown, Folder, Layers, Settings, Star } from "lucide-react";

import TypeIcon from "@/components/dashboard/TypeIcon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getFavoriteCollections, getRecentCollections } from "@/lib/dashboard-data";
import { CURRENT_USER, ITEM_TYPES } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

const FAVORITE_COLLECTIONS = getFavoriteCollections();

const RECENT_COLLECTIONS = getRecentCollections(RECENT_COLLECTIONS_LIMIT);

const initials = CURRENT_USER.name
  .split(" ")
  .map((part) => part[0])
  .join("");

export default function AppSidebar() {
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
                  {ITEM_TYPES.map((type) => (
                    <SidebarMenuItem key={type.id}>
                      <SidebarMenuButton
                        tooltip={type.name}
                        render={<Link href={`/items/${type.name.toLowerCase()}`} />}
                      >
                        <TypeIcon type={type} />
                        <span>{type.name}</span>
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
                <p className="px-2 pt-2 pb-1 text-[0.7rem] font-medium tracking-wider text-sidebar-foreground/50 uppercase group-data-[collapsible=icon]:hidden">
                  Favorites
                </p>
                <SidebarMenu>
                  {FAVORITE_COLLECTIONS.map((collection) => (
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

                <p className="px-2 pt-4 pb-1 text-[0.7rem] font-medium tracking-wider text-sidebar-foreground/50 uppercase group-data-[collapsible=icon]:hidden">
                  Recent
                </p>
                <SidebarMenu>
                  {RECENT_COLLECTIONS.map((collection) => (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton tooltip={collection.name}>
                        <Folder />
                        <span>{collection.name}</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
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
