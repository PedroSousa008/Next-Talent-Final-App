import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { MainHeader } from "./MainHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <MainHeader />
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: "100%" as unknown as number },
  body: { flex: 1 },
});
