import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProfileProvider } from "@/contexts/ProfileContext";
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
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ProfileProvider>
            <RootNavigation />
          </ProfileProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
