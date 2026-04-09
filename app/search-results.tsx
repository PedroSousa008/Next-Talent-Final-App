import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_PLAYERS } from "@/data/mockPlayers";
import { filterPlayersByCriteria, type PlayerSearchCriteria } from "@/lib/filterPlayers";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

export default function SearchResultsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    playerName?: string;
    position?: string;
    foot?: string;
    age?: string;
  }>();

  const criteria: PlayerSearchCriteria = useMemo(
    () => ({
      playerName: typeof params.playerName === "string" ? params.playerName : "",
      position: typeof params.position === "string" ? params.position : "Any",
      foot: typeof params.foot === "string" ? params.foot : "Any",
      age: typeof params.age === "string" ? params.age : "Any",
    }),
    [params.playerName, params.position, params.foot, params.age]
  );

  const results = useMemo(
    () => filterPlayersByCriteria(MOCK_PLAYERS, criteria),
    [criteria]
  );

  const summaryParts = [
    criteria.playerName.trim() ? `“${criteria.playerName.trim()}”` : null,
    criteria.position !== "Any" ? criteria.position : null,
    criteria.foot !== "Any" ? criteria.foot : null,
    criteria.age !== "Any" ? `age ${criteria.age}` : null,
  ].filter(Boolean);

  const summary =
    summaryParts.length > 0
      ? summaryParts.join(" · ")
      : "No filters — showing all demo players";

  return (
    <View style={[styles.root, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <View
        style={[
          styles.topBar,
          { borderBottomColor: colors.border, backgroundColor: colors.bgElevated },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <View style={styles.topTitleBlock}>
          <Text style={[styles.topTitle, { color: colors.text }]}>Results</Text>
          <Text style={[styles.topSub, { color: colors.textMuted }]} numberOfLines={2}>
            {summary}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Text style={[styles.count, { color: colors.textSecondary }]}>
        {results.length} player{results.length === 1 ? "" : "s"} match your filters
      </Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No players found
            </Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              Try relaxing one of the filters and search again.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/player/${item.id}`)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Open profile for ${item.name}`}
          >
            <View style={styles.cardRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                <Ionicons name="person" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.meta, { color: colors.textSecondary }]}>
                  {item.position} · {item.dominantFoot} · {item.age} yrs
                </Text>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  {item.club} · {item.nation}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitleBlock: { flex: 1, minWidth: 0 },
  topTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  topSub: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: fontStack,
  },
  count: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: layout.gutter,
    paddingTop: 12,
    paddingBottom: 8,
    fontFamily: fontStack,
  },
  list: {
    paddingHorizontal: layout.gutter,
    gap: 10,
  },
  card: {
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    padding: 14,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: fontStack,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  emptyBody: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: fontStack,
  },
});
