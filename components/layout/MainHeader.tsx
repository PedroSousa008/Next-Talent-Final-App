import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePathname, useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const NAV = [
  { href: "/", label: "Feed", icon: "newspaper-outline" as const },
  { href: "/search", label: "Search", icon: "search-outline" as const },
  {
    href: "/notifications",
    label: "Notifications",
    icon: "notifications-outline" as const,
  },
  { href: "/profile", label: "Profile", icon: "person-outline" as const },
];

export function MainHeader() {
  const { colors, resolvedScheme, toggleScheme } = useAppTheme();
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isMobile } = useBreakpoint();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/index";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top,
          backgroundColor: colors.overlay,
          borderBottomColor: colors.border,
        },
        Platform.OS === "web"
          ? ({
              position: "sticky",
              top: 0,
              zIndex: 100,
              backdropFilter: "blur(12px)",
            } as object)
          : null,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.brandRow}>
          <View style={styles.brand}>
            <View
              style={[styles.mark, { backgroundColor: colors.accentMuted }]}
            >
              <Ionicons name="football" size={18} color={colors.accent} />
            </View>
            {!isMobile && (
              <Text style={[styles.wordmark, { color: colors.text }]}>
                Next Talent
              </Text>
            )}
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

        <View style={styles.nav}>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as Href)}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.navItem,
                  {
                    backgroundColor: active
                      ? colors.accentMuted
                      : "transparent",
                    borderColor: active ? colors.accent : "transparent",
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={active ? colors.accent : colors.textSecondary}
                />
                {!isMobile && (
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: active ? colors.accent : colors.textSecondary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
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
    paddingBottom: 10,
    gap: 12,
  },
  brandRow: {
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
  nav: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fontStack,
  },
});
