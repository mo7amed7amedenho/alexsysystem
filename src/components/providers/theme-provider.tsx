"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ConfigProvider, theme as antdTheme } from "antd";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AntdThemeWrapper>{children}</AntdThemeWrapper>
    </NextThemesProvider>
  );
}

function AntdThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // اختار theme antd حسب theme الحالي
  const antdAlgorithm =
    theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        algorithm:
          theme === "dark" ? antdAlgorithm : antdTheme.compactAlgorithm,
        token: {
          borderRadius: 4,
          colorPrimary: "#007D35",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
