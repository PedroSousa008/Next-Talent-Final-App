import React, { useEffect } from "react";
import { Platform } from "react-native";
import { enableScreens } from "react-native-screens";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "@/contexts/ThemeContext";

if (Platform.OS === "web") {
  enableScreens(false);
}

function ThemedStatusBar() {
  const { resolvedScheme } = useAppTheme();
  return (
    <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
  );
}

function RootNavigation() {
  const { colors } = useAppTheme();

  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const bg = colors.bg;
      document.body.style.backgroundColor = bg;
      document.documentElement.style.backgroundColor = bg;
    }
    void SystemUI.setBackgroundColorAsync(colors.bg);
  }, [colors.bg]);

  return (
    <>
      <ThemedStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          ...(Platform.OS === "web"
            ? {}
            : { animation: "fade" as const }),
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
