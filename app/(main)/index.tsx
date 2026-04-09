import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { LeagueTablePlaceholder } from "@/components/feed/LeagueTablePlaceholder";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const BREAKING = {
  title: "Title race tightens after late drama",
  meta: "Premier League · 12 min ago",
  excerpt:
    "Leaders drop points as challengers close the gap with two games in hand.",
};

const TRENDING = [
  { id: "1", tag: "Transfer", title: "Midfield target opens door to move" },
  { id: "2", tag: "Injury", title: "Star forward cleared for weekend squad" },
  { id: "3", tag: "UCL", title: "Knockout draw sets up heavyweight ties" },
];

const LATEST = [
  {
    id: "a",
    title: "Press conference: coach on tactics and fitness",
    source: "Club · Video",
    time: "1h",
  },
  {
    id: "b",
    title: "Expected goals breakdown — who’s overperforming?",
    source: "Analysis",
    time: "2h",
  },
  {
    id: "c",
    title: "Youth cup: academy side reaches semi-finals",
    source: "Academy",
    time: "3h",
  },
];

export default function FeedScreen() {
  const { colors, resolvedScheme } = useAppTheme();
  const { isDesktop } = useBreakpoint();

  const grad = resolvedScheme === "dark"
    ? (["#14532D", "#0B0F14"] as const)
    : (["#DCFCE7", "#F4F5F7"] as const);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.max}>
        <LinearGradient colors={grad} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={[styles.pill, { backgroundColor: colors.accentMuted }]}>
              <Text style={[styles.pillText, { color: colors.accent }]}>
                Live briefing
              </Text>
            </View>
            <Text style={[styles.kicker, { color: colors.textSecondary }]}>
              Today in football
            </Text>
          </View>
          <Text style={[styles.headline, { color: colors.text }]}>
            News, trends, and context — curated for you.
          </Text>
        </LinearGradient>

        <SectionTitle
          title="Breaking"
          subtitle="High-signal stories right now"
        />
        <Card style={styles.breakingCard} padding={0}>
          <LinearGradient
            colors={["#166534", "#0f172a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.breakingImg}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.88)"]}
              style={styles.breakingGrad}
            >
              <View style={styles.breakingBadge}>
                <Ionicons name="flash" size={14} color="#fff" />
                <Text style={styles.breakingBadgeText}>Breaking</Text>
              </View>
              <Text style={styles.breakingTitle}>{BREAKING.title}</Text>
              <Text style={styles.breakingMeta}>{BREAKING.meta}</Text>
              <Text style={styles.breakingExcerpt}>{BREAKING.excerpt}</Text>
            </LinearGradient>
          </LinearGradient>
        </Card>

        <SectionTitle
          title="Trending"
          subtitle="What fans are talking about"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendRow}
        >
          {TRENDING.map((item) => (
            <Card key={item.id} style={styles.trendCard} padding={14}>
              <Text style={[styles.trendTag, { color: colors.accent }]}>
                {item.tag}
              </Text>
              <Text style={[styles.trendTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <View style={styles.trendFoot}>
                <Ionicons
                  name="trending-up"
                  size={16}
                  color={colors.textMuted}
                />
                <Text style={[styles.trendHint, { color: colors.textMuted }]}>
                  Rising fast
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>

        <SectionTitle title="Latest" subtitle="Fresh updates across the game" />
        <View style={[styles.latestGrid, isDesktop && styles.latestGridWide]}>
          {LATEST.map((n) => (
            <Card
              key={n.id}
              style={[styles.latestCard, isDesktop && styles.latestCardWide]}
            >
              <View style={styles.latestTop}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors.accentMuted },
                  ]}
                />
                <Text style={[styles.latestSource, { color: colors.textMuted }]}>
                  {n.source}
                </Text>
                <Text style={[styles.latestTime, { color: colors.textMuted }]}>
                  {n.time}
                </Text>
              </View>
              <Text style={[styles.latestTitle, { color: colors.text }]}>
                {n.title}
              </Text>
              <View style={styles.latestRow}>
                <Text style={[styles.read, { color: colors.accent }]}>
                  Read
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={colors.accent}
                />
              </View>
            </Card>
          ))}
        </View>

        <SectionTitle
          title="Standings"
          subtitle="League table — embed zone below"
        />
        <LeagueTablePlaceholder />

        {isDesktop ? <View style={{ height: 32 }} /> : <View style={{ height: 24 }} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  max: {
    width: "100%",
    maxWidth: layout.maxWidth + layout.gutter * 2,
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    paddingTop: 8,
    gap: 4,
  },
  hero: {
    borderRadius: layout.radiusLg,
    padding: 22,
    marginBottom: 20,
  },
  heroTop: { gap: 10 },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { fontSize: 12, fontWeight: "700", fontFamily: fontStack },
  kicker: { fontSize: 14, fontFamily: fontStack },
  headline: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    lineHeight: 28,
    fontFamily: fontStack,
  },
  breakingCard: { overflow: "hidden", padding: 0 },
  breakingImg: { minHeight: 220, justifyContent: "flex-end" },
  breakingGrad: { padding: 18, borderRadius: layout.radiusMd },
  breakingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(239,68,68,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  breakingBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: fontStack,
  },
  breakingTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
    fontFamily: fontStack,
  },
  breakingMeta: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 6,
    fontSize: 13,
    fontFamily: fontStack,
  },
  breakingExcerpt: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontStack,
  },
  trendRow: { gap: 12, paddingBottom: 4 },
  trendCard: { width: 260 },
  trendTag: { fontSize: 12, fontWeight: "700", fontFamily: fontStack },
  trendTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    fontFamily: fontStack,
  },
  trendFoot: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trendHint: { fontSize: 12, fontFamily: fontStack },
  latestGrid: { gap: 12 },
  latestGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  latestCard: {},
  latestCardWide: {
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 280,
    maxWidth: "100%",
  },
  latestTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  latestSource: { flex: 1, fontSize: 12, fontWeight: "600", fontFamily: fontStack },
  latestTime: { fontSize: 12, fontFamily: fontStack },
  latestTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    fontFamily: fontStack,
  },
  latestRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  read: { fontSize: 14, fontWeight: "700", fontFamily: fontStack },
});
