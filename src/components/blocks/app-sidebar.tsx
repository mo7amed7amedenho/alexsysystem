"use client";

import * as React from "react";
import { IconBarcode, IconChartBar, IconHelp } from "@tabler/icons-react";

import { NavMain } from "@/components/blocks/nav-main";
import { NavSecondary } from "@/components/blocks/nav-secondary";
import { NavUser } from "@/components/blocks/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  IconDashboard,
  IconSeedling,
  IconBug,
  IconPlant2,
  IconTruckDelivery,
  IconReportAnalytics,
  IconCash,
  IconUsers,
  IconShoppingCart,
  IconClipboardList,
  IconCalendarStats,
  IconSettings,
  IconBell,
  IconGps,
  IconFileText,
  IconChartHistogram,
  IconActivity,
  IconAlertTriangle,
  IconDatabase,
  IconGift,
  IconRecycle,
  IconUserShield,
} from "@tabler/icons-react";
const data = {
  navMainGroups: [
    {
      label: "بيانات العملاء",
      items: [
        {
          title: "إدارة العملاء",
          url: "/dashboard/Customers",
          icon: IconUsers,
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} side="right" className="font-sans">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center">
            <Image
              src={"https://alexasfor.com/wp-content/uploads/2023/03/Alex.png"}
              alt="logo"
              width={100}
              height={100}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-green-600 dark:text-white">
                نظام شركة أليكس
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Alex for agriculture Tools
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                نظام إدارة الشركة
              </p>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navMainGroups} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
