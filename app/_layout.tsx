import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider, useAppTheme } from "@/contexts/ThemeContext";

function ThemedStatusBar() {
  const { resolvedScheme } = useAppTheme();
  if (Platform.OS === "web") {
    return null;
  }
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
      const root = document.getElementById("root");
      if (root) {
        root.style.backgroundColor = bg;
      }
    }
  }, [colors.bg]);

  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.bg },
        Platform.OS === "web" && ({ minHeight: "100vh" } as const),
      ]}
    >
      <ThemedStatusBar />
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
