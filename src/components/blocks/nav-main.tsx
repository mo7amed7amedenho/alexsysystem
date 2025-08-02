"use client";

import { IconHome, IconNotification, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  groups,
}: {
  groups: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: Icon;
    }[];
  }[];
}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="الرئيسية"
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-8 duration-200 ease-linear"
              >
                <IconHome />
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span>الصفحة الرئيسية</span>
                </Link>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconNotification />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* باقي المجموعات */}
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupContent className="flex flex-col gap-1">
            <div className="px-3 pt-2 pb-1 text-xs font-bold text-muted-foreground uppercase">
              {group.label}
            </div>
            <SidebarMenu>
              {group.items.map((item) => (
                <Link key={item.title} href={item.url} className="cursor-pointer">
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={item.title} className="cursor-pointer">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
