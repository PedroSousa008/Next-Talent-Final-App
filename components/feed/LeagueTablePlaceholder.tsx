import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

/**
 * Reserved area for a manually embedded league table (iframe, WebView, or native table).
 */
export function LeagueTablePlaceholder() {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.box,
        {
          borderColor: colors.borderStrong,
          backgroundColor: colors.surfaceMuted,
        },
      ]}
    >
      <View style={styles.iconRow}>
        <Ionicons name="grid-outline" size={22} color={colors.accent} />
        <Text style={[styles.title, { color: colors.text }]}>
          League table
        </Text>
      </View>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        Placeholder — embed your standings component here (manual insertion).
      </Text>
      <View
        style={[
          styles.embed,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text style={[styles.embedLabel, { color: colors.textSecondary }]}>
          Your league table content
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: layout.radiusLg,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 20,
    gap: 12,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    fontFamily: fontStack,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontStack,
  },
  embed: {
    marginTop: 4,
    minHeight: 200,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  embedLabel: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: fontStack,
  },
});
