import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

/**
 * Eight filter tiles — behaviors are wired later (modals, navigation, etc.).
 * IDs are stable for future integration.
 */
export const SEARCH_FILTER_BOXES = [
  {
    id: "player-name",
    title: "Player Name",
    icon: "person" as const,
    bottom: "Any",
  },
  {
    id: "quality",
    title: "Quality",
    icon: "star-outline" as const,
    bottom: "Any",
  },
  {
    id: "position",
    title: "Position",
    icon: "shirt-outline" as const,
    bottom: "Any",
  },
  {
    id: "style",
    title: "Chemistry Style",
    icon: "sparkles-outline" as const,
    bottom: "Any",
  },
  {
    id: "value",
    title: "Value",
    icon: "cash-outline" as const,
    bottom: "Any",
  },
  {
    id: "nation",
    title: "Nation / Region",
    icon: "flag-outline" as const,
    bottom: "Any",
  },
  {
    id: "league",
    title: "League",
    icon: "globe-outline" as const,
    bottom: "Any",
  },
  {
    id: "club",
    title: "Club",
    icon: "shield-outline" as const,
    bottom: "Any",
  },
] as const;

const STADIUM_BG =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80";

export default function SearchScreen() {
  const { colors, resolvedScheme } = useAppTheme();
  const { isDesktop } = useBreakpoint();
  const { width: screenW } = useWindowDimensions();
  const [activeId, setActiveId] = useState<string | null>(null);

  const cols = isDesktop ? 4 : 2;
  const gap = 10;
  const gridWidth = Math.min(screenW - layout.gutter * 2, layout.maxWidth);
  const boxW = Math.max(96, (gridWidth - gap * (cols - 1)) / cols);

  const onBoxPress = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
    // Future: open sheet / route / modal per id
  }, []);

  const overlayColors =
    resolvedScheme === "dark"
      ? (["rgba(5,8,14,0.92)", "rgba(5,8,14,0.78)"] as const)
      : (["rgba(10,18,32,0.88)", "rgba(15,25,45,0.72)"] as const);

  const gold = "#C9A227";
  const highlightBorder = gold;
  const highlightBg = resolvedScheme === "dark" ? "rgba(201,162,39,0.22)" : "rgba(201,162,39,0.18)";

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ImageBackground
        source={{ uri: STADIUM_BG }}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient colors={overlayColors} style={styles.overlay}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.head}>
              <Text style={[styles.pageTitle, { color: "#fff" }]}>Search</Text>
              <Text style={[styles.pageSub, { color: "rgba(255,255,255,0.72)" }]}>
                Tap a tile to focus it — actions coming next.
              </Text>
            </View>

            <View
              style={[
                styles.grid,
                {
                  maxWidth: layout.maxWidth + layout.gutter * 2,
                  alignSelf: "center",
                  width: "100%",
                },
              ]}
            >
              {SEARCH_FILTER_BOXES.map((box) => {
                const selected = activeId === box.id;
                return (
                  <Pressable
                    key={box.id}
                    onPress={() => onBoxPress(box.id)}
                    style={({ pressed }) => [
                      styles.box,
                      {
                        width: boxW,
                        backgroundColor: selected
                          ? highlightBg
                          : "rgba(255,255,255,0.08)",
                        borderColor: selected ? highlightBorder : "rgba(255,255,255,0.22)",
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.boxTitle, { color: "rgba(255,255,255,0.92)" }]}>
                      {box.title}
                    </Text>
                    <View style={styles.boxIconWrap}>
                      <Ionicons
                        name={box.icon}
                        size={36}
                        color={selected ? gold : "rgba(255,255,255,0.55)"}
                      />
                    </View>
                    <Text style={[styles.boxBottom, { color: "rgba(255,255,255,0.65)" }]}>
                      {box.bottom}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1 },
  overlay: { flex: 1 },
  scroll: { flex: 1 },
  scrollInner: {
    paddingHorizontal: layout.gutter,
    paddingTop: 12,
    paddingBottom: 24,
  },
  head: { marginBottom: 18, gap: 6 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    fontFamily: fontStack,
  },
  pageSub: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontStack,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  box: {
    borderRadius: 6,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 132,
  },
  boxTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    fontFamily: fontStack,
    textTransform: "none",
  },
  boxIconWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    marginVertical: 6,
  },
  boxBottom: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: fontStack,
    textAlign: "center",
  },
});
