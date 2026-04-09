import React, { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchPlayerRowCard } from "@/components/search/SearchPlayerRowCard";
import { useProfile } from "@/contexts/ProfileContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { getBenficaCoachLineup } from "@/data/startingLineup";
import { getClubHubForSlug, isBenficaSlug } from "@/data/clubHubMock";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import { fontStack, layout } from "@/constants/theme";

const CARD_W = 132;

export default function ClubMatchLineupScreen() {
  const { slug, eventId } = useLocalSearchParams<{
    slug: string;
    eventId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, resolvedScheme } = useAppTheme();
  const { profile } = useProfile();
  const { width: winW } = useWindowDimensions();

  const clubSlug = typeof slug === "string" ? slug : "";
  const benfica = isBenficaSlug(clubSlug);

  const positionLabel =
    profile.searchPosition !== "Any"
      ? profile.searchPosition
      : profile.position || "—";

  const eventTitle = useMemo(() => {
    if (typeof eventId !== "string" || !eventId) return "League match · home";
    const hub = getClubHubForSlug(
      clubSlug || "club",
      profile.displayName,
      positionLabel
    );
    return hub.calendar.find((c) => c.id === eventId)?.title ?? "League match · home";
  }, [
    clubSlug,
    eventId,
    profile.displayName,
    positionLabel,
  ]);

  const placements = useMemo(() => {
    if (!benfica) return [];
    return getBenficaCoachLineup(profile);
  }, [benfica, profile]);

  const pitchW = Math.min(winW - layout.gutter * 2, 440);
  const pitchH = pitchW * 1.42;

  const pitchGradient =
    resolvedScheme === "dark"
      ? (["#1a2e24", "#0f1f17"] as const)
      : (["#d4edda", "#a8d5ba"] as const);

  const pitchBorder =
    resolvedScheme === "dark"
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.08)";

  const openPlayer = (playerId: string) => {
    if (
      playerId === CURRENT_USER_PLAYER_ID ||
      /^\d+$/.test(playerId)
    ) {
      router.push(`/player/${playerId}`);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
            backgroundColor: colors.bg,
          },
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
          <Text style={[styles.topTitle, { color: colors.text }]}>
            Coach&apos;s starting XI
          </Text>
          <Text style={[styles.topSub, { color: colors.textMuted }]}>
            {benfica ? eventTitle : "Your club"}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollInner,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!benfica ? (
          <Text style={[styles.fallback, { color: colors.textSecondary }]}>
            Starting elevens open from home league fixtures on your club calendar.
            Demo line-up is available for Benfica.
          </Text>
        ) : (
          <View style={[styles.pitchFrame, { width: pitchW, height: pitchH, borderColor: pitchBorder }]}>
            <LinearGradient
              colors={pitchGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.pitchFill}
            />
            {placements.map((row) => (
              <View
                key={row.player.id + row.slotLabel}
                style={[
                  styles.slotWrap,
                  {
                    left: `${row.leftPct}%`,
                    top: `${row.topPct}%`,
                    width: CARD_W,
                    marginLeft: -CARD_W / 2,
                  },
                ]}
              >
                <SearchPlayerRowCard
                  compact
                  player={row.player}
                  onPress={
                    row.player.id === CURRENT_USER_PLAYER_ID ||
                    /^\d+$/.test(row.player.id)
                      ? () => openPlayer(row.player.id)
                      : undefined
                  }
                />
                <View
                  style={[
                    styles.posBadge,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.posBadgeText, { color: colors.text }]}>
                    {row.slotLabel}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.gutter,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  topTitleBlock: { flex: 1, minWidth: 0 },
  topTitle: {
    fontSize: 18,
    fontWeight: "900",
    fontFamily: fontStack,
  },
  topSub: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: fontStack,
  },
  scroll: { flex: 1 },
  scrollInner: {
    paddingHorizontal: layout.gutter,
    paddingTop: 16,
    alignItems: "center",
  },
  fallback: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontStack,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 12,
  },
  pitchFrame: {
    borderRadius: layout.radiusLg,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  pitchFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: layout.radiusLg,
  },
  slotWrap: {
    position: "absolute",
    alignItems: "center",
    zIndex: 2,
  },
  posBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  posBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    fontFamily: fontStack,
  },
});
