import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

/**
 * Minimal top bar (brand + theme) — navigation lives in the bottom tab bar.
 */
export function TopChrome() {
  const { colors, resolvedScheme, toggleScheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.bgElevated,
          borderBottomColor: colors.border,
        },
        Platform.OS === "web"
          ? ({
              position: "sticky",
              top: 0,
              zIndex: 50,
            } as object)
          : null,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.brand}>
          <View
            style={[styles.mark, { backgroundColor: colors.accentMuted }]}
          >
            <Ionicons name="football" size={18} color={colors.accent} />
          </View>
          <Text style={[styles.wordmark, { color: colors.text }]}>
            Next Talent
          </Text>
        </View>
        <Pressable
          onPress={toggleScheme}
          accessibilityRole="button"
          accessibilityLabel="Toggle color theme"
          style={({ pressed }) => [
            styles.themeBtn,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons
            name={resolvedScheme === "dark" ? "moon" : "sunny-outline"}
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    maxWidth: layout.maxWidth + layout.gutter * 2,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
    fontFamily: fontStack,
  },
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
