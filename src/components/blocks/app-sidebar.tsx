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
  navMain: [
    { title: "التحليلات الذكية", url: "/ai-analytics", icon: IconChartBar },
    // إدارة البذور
    { title: "مخزون البذور", url: "/seeds/stock", icon: IconSeedling },
    { title: "فواتير البذور", url: "/seeds/invoices", icon: IconClipboardList },
    { title: "جرد البذور", url: "/seeds/audit", icon: IconDatabase },
    { title: "طباعة باركود", url: "/seeds/barcode", icon: IconFileText },
    {
      title: "تقارير البذور",
      url: "/seeds/reports",
      icon: IconReportAnalytics,
    },

    // إدارة المبيدات
    { title: "مخزون المبيدات", url: "/pesticides/stock", icon: IconBug },
    {
      title: "مبيعات المبيدات",
      url: "/pesticides/sales",
      icon: IconShoppingCart,
    },
    {
      title: "مرتجعات المبيدات",
      url: "/pesticides/returns",
      icon: IconRecycle,
    },
    {
      title: "الهدايا والهوالك",
      url: "/pesticides/gifts-losses",
      icon: IconGift,
    },
    {
      title: "تقارير المبيدات",
      url: "/pesticides/reports",
      icon: IconReportAnalytics,
    },

    // إدارة المشتل
    { title: "شتلات المشتل", url: "/nursery/seedlings", icon: IconPlant2 },
    { title: "الحجوزات", url: "/nursery/bookings", icon: IconClipboardList },
    { title: "QR الحجوزات", url: "/nursery/qr", icon: IconBarcode },
    {
      title: "الأنشطة الزراعية",
      url: "/nursery/activities",
      icon: IconActivity,
    },
    {
      title: "تقارير المشتل",
      url: "/nursery/reports",
      icon: IconReportAnalytics,
    },

    // المندوبين وخط السير
    { title: "إدارة المندوبين", url: "/reps/manage", icon: IconUsers },
    { title: "مبيعات المندوبين", url: "/reps/sales", icon: IconShoppingCart },
    { title: "خط السير", url: "/reps/routes", icon: IconTruckDelivery },
    { title: "المصروفات", url: "/reps/expenses", icon: IconCash },
    { title: "تجارب البذور", url: "/reps/seed-trials", icon: IconSeedling },
    {
      title: "تقارير المندوبين",
      url: "/reps/reports",
      icon: IconReportAnalytics,
    },

    // نظام GPS
    { title: "تتبع المندوبين", url: "/gps/tracking", icon: IconGps },
    { title: "تحليل الانحرافات", url: "/gps/alerts", icon: IconAlertTriangle },

    // المحاسبة
    { title: "الحسابات العامة", url: "/accounts/ledger", icon: IconCash },
    {
      title: "تقارير الحسابات",
      url: "/accounts/reports",
      icon: IconChartHistogram,
    },

    // شؤون الموظفين
    { title: "إدارة الموظفين", url: "/employees/manage", icon: IconUsers },
    { title: "المرتبات", url: "/employees/salaries", icon: IconCash },

    // المبيعات بالصعيد
    { title: "مبيعات الصعيد", url: "/upper/sales", icon: IconShoppingCart },
    { title: "التحصيل بالصعيد", url: "/upper/collections", icon: IconCash },

    // CRM
    { title: "إدارة العملاء", url: "/crm/clients", icon: IconUsers },
    {
      title: "تفاعلات العملاء",
      url: "/crm/interactions",
      icon: IconClipboardList,
    },
    { title: "ديون العملاء", url: "/crm/debts", icon: IconCash },
    { title: "سقف الدين", url: "/crm/limits", icon: IconActivity },

    // الذكاء الاصطناعي
    {
      title: "تحليل الفواتير",
      url: "/ai/invoices-analysis",
      icon: IconChartBar,
    },
    { title: "تقييم الأداء", url: "/ai/rep-evaluation", icon: IconActivity },
    { title: "التوقعات الذكية", url: "/ai/forecasts", icon: IconChartBar },

    // الصلاحيات والإعدادات
    { title: "إدارة المستخدمين", url: "/admin/users", icon: IconUserShield },
    { title: "الصلاحيات", url: "/admin/roles", icon: IconSettings },
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
    <Sidebar {...props} side="right">
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
