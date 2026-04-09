import React from "react";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppShell } from "@/components/layout/AppShell";

export default function MainLayout() {
  return (
    <AppShell>
      <View style={styles.slot}>
        <Slot />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
});
