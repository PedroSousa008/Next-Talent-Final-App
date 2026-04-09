import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

type Filter = "all" | "players" | "clubs" | "users" | "content";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "players", label: "Players" },
  { id: "clubs", label: "Clubs" },
  { id: "users", label: "Users" },
  { id: "content", label: "Content" },
];

const MOCK = {
  players: [
    { id: "p1", title: "João Silva", meta: "AM · Portugal · 21" },
    { id: "p2", title: "Marcus Cole", meta: "CM · England · 19" },
  ],
  clubs: [
    { id: "c1", title: "North City FC", meta: "Premier Division" },
    { id: "c2", title: "Harbor United", meta: "Cup holders" },
  ],
  users: [
    { id: "u1", title: "@scout_pt", meta: "Analyst · 12k followers" },
    { id: "u2", title: "@tacticsweekly", meta: "Creator · 8k followers" },
  ],
  content: [
    { id: "x1", title: "Set-piece trends this month", meta: "Article · 6 min" },
    { id: "x2", title: "Clip: top saves of the week", meta: "Video · 2 min" },
  ],
};

export default function SearchScreen() {
  const { colors } = useAppTheme();
  const { isDesktop } = useBreakpoint();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (s: string) =>
      !q || s.toLowerCase().includes(q);

    const pick = <T extends { title: string; meta: string }>(rows: T[]) =>
      rows.filter((r) => match(r.title) || match(r.meta));

    const out: { key: keyof typeof MOCK; title: string; rows: typeof MOCK.players }[] =
      [
        { key: "players", title: "Players", rows: pick(MOCK.players) },
        { key: "clubs", title: "Clubs", rows: pick(MOCK.clubs) },
        { key: "users", title: "Users", rows: pick(MOCK.users) },
        { key: "content", title: "Content", rows: pick(MOCK.content) },
      ];

    if (filter === "all") return out.filter((s) => s.rows.length);
    return out
      .filter((s) => s.key === filter)
      .filter((s) => s.rows.length);
  }, [filter, query]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.max}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Search</Text>
        <Text style={[styles.pageSub, { color: colors.textMuted }]}>
          Discover players, clubs, people, and posts. Layout is modular for easy
          iteration when you add a reference design.
        </Text>

        <View
          style={[
            styles.searchShell,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Next Talent…"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { color: colors.text }]}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={8}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? colors.accent : colors.border,
                    backgroundColor: active ? colors.accentMuted : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: active ? colors.accent : colors.textSecondary,
                      fontWeight: active ? "700" : "600",
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.resultsLayout,
            isDesktop && styles.resultsLayoutWide,
          ]}
        >
          <View style={styles.resultsMain}>
            {sections.length === 0 ? (
              <Card padding={20}>
                <Text style={[styles.empty, { color: colors.textSecondary }]}>
                  No matches yet — try another keyword or filter.
                </Text>
              </Card>
            ) : (
              sections.map((sec) => (
                <View key={sec.key} style={styles.block}>
                  <SectionTitle title={sec.title} />
                  <View style={styles.resultList}>
                    {sec.rows.map((row) => (
                      <Card key={row.id} padding={14}>
                        <View style={styles.resultRow}>
                          <View
                            style={[
                              styles.avatar,
                              { backgroundColor: colors.surfaceMuted },
                            ]}
                          >
                            <Ionicons
                              name={
                                sec.key === "players"
                                  ? "person"
                                  : sec.key === "clubs"
                                    ? "shield"
                                    : sec.key === "users"
                                      ? "at"
                                      : "document-text"
                              }
                              size={18}
                              color={colors.textSecondary}
                            />
                          </View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text
                              style={[styles.rTitle, { color: colors.text }]}
                              numberOfLines={2}
                            >
                              {row.title}
                            </Text>
                            <Text
                              style={[styles.rMeta, { color: colors.textMuted }]}
                            >
                              {row.meta}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={colors.textMuted}
                          />
                        </View>
                      </Card>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>

          {isDesktop ? (
            <View style={styles.side}>
              <Card padding={16}>
                <Text style={[styles.sideTitle, { color: colors.text }]}>
                  Quick filters
                </Text>
                <Text style={[styles.sideBody, { color: colors.textMuted }]}>
                  Reserve this column for facets (league, role, region) or
                  promotional modules. Swap content without restructuring the page.
                </Text>
                <View style={styles.sideChips}>
                  {["Top rated", "Rising", "Verified only"].map((t) => (
                    <View
                      key={t}
                      style={[
                        styles.miniChip,
                        { borderColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[styles.miniChipText, { color: colors.textSecondary }]}
                      >
                        {t}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40, flexGrow: 1 },
  max: {
    width: "100%",
    maxWidth: layout.maxWidth + layout.gutter * 2,
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    paddingTop: 8,
    gap: 14,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
    fontFamily: fontStack,
  },
  pageSub: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fontStack,
  },
  searchShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: layout.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontStack,
    paddingVertical: 0,
  },
  chips: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: fontStack },
  resultsLayout: { gap: 16 },
  resultsLayoutWide: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  resultsMain: { flex: 1, minWidth: 0, gap: 8 },
  side: { width: 300 },
  block: { marginBottom: 8 },
  resultList: { gap: 10 },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rTitle: { fontSize: 15, fontWeight: "700", fontFamily: fontStack },
  rMeta: { marginTop: 2, fontSize: 12, fontFamily: fontStack },
  empty: { fontSize: 14, lineHeight: 20, fontFamily: fontStack },
  sideTitle: { fontSize: 15, fontWeight: "800", fontFamily: fontStack },
  sideBody: { marginTop: 8, fontSize: 13, lineHeight: 18, fontFamily: fontStack },
  sideChips: { marginTop: 14, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  miniChip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  miniChipText: { fontSize: 12, fontWeight: "600", fontFamily: fontStack },
});
