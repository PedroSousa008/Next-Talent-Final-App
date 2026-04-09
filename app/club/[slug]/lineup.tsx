import React, { useMemo } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchPlayerRowCard } from "@/components/search/SearchPlayerRowCard";
import { useProfile } from "@/contexts/ProfileContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { getBenficaCoachLineup } from "@/data/startingLineup";
import { getClubHubForSlug, isBenficaSlug } from "@/data/clubHubMock";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import { fontStack, layout } from "@/constants/theme";

const PITCH_BG = require("@/assets/pitch-bg.png");

const CARD_W = 132;

export default function ClubMatchLineupScreen() {
  const { slug, eventId } = useLocalSearchParams<{
    slug: string;
    eventId?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
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
          <>
            <Text style={[styles.intro, { color: colors.textMuted }]}>
              Same player cards as Search — tap you or a demo player with a full
              profile to open their page.
            </Text>
            <View style={[styles.pitchFrame, { width: pitchW, height: pitchH }]}>
              <ImageBackground
                source={PITCH_BG}
                style={styles.pitchBg}
                imageStyle={styles.pitchBgImage}
                resizeMode="cover"
              >
                <View style={styles.pitchTint} />
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
                        { backgroundColor: "rgba(15, 20, 28, 0.92)" },
                      ]}
                    >
                      <Text style={styles.posBadgeText}>{row.slotLabel}</Text>
                    </View>
                  </View>
                ))}
              </ImageBackground>
            </View>
          </>
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
  intro: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontStack,
    marginBottom: 14,
    textAlign: "center",
    maxWidth: 400,
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
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pitchBg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  pitchBgImage: {
    borderRadius: layout.radiusLg,
  },
  pitchTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 24, 12, 0.22)",
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
    borderColor: "rgba(255,255,255,0.2)",
  },
  posBadgeText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 10,
    fontWeight: "900",
    fontFamily: fontStack,
  },
});
