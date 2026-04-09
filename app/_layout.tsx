import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "@/contexts/ThemeContext";

function ThemedStatusBar() {
  const { resolvedScheme } = useAppTheme();
  return (
    <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStatusBar />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
