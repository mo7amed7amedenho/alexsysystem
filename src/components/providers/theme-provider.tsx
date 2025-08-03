"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
  mergeMantineTheme,
  DEFAULT_THEME,
} from "@mantine/core";

// تعريف الألوان الأساسية (أخضر)
const green: MantineColorsTuple = [
  "#e5feee",
  "#d2f9e0",
  "#a8f1c0",
  "#7aea9f",
  "#53e383",
  "#3bdf70",
  "#2bdd66",
  "#1ac455",
  "#0caf49",
  "#00963c",
];

// إنشاء ثيم مخصص
const customTheme = createTheme({
  primaryColor: "green",
  colors: {
    green,
  },
  fontFamily: "Alexandria",
  defaultRadius: 4,
});

// دمج الثيم المخصص مع الثيم الافتراضي
const mantineTheme = mergeMantineTheme(DEFAULT_THEME, customTheme);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MantineThemeWrapper>{children}</MantineThemeWrapper>
    </NextThemesProvider>
  );
}

function MantineThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <MantineProvider
      theme={mantineTheme}
      forceColorScheme={theme === "dark" ? "dark" : "light"} // استخدام forceColorScheme بدلاً من colorScheme
      withGlobalClasses
    >
      {children}
    </MantineProvider>
  );
}
