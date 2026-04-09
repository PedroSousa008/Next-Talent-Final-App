import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { useProfile } from "@/contexts/ProfileContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { getClubHubForSlug } from "@/data/clubHubMock";
import { slugToTitle } from "@/lib/clubSlug";
import { fontStack, layout } from "@/constants/theme";

const SLB_LOGO = require("@/assets/slbenfica.png");

type HubTab = "calendar" | "documents" | "squad";

export default function ClubHubScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { profile } = useProfile();
  const [tab, setTab] = useState<HubTab>("calendar");

  const clubSlug = typeof slug === "string" ? slug : "";
  const clubTitle = clubSlug ? slugToTitle(clubSlug) : "Club";

  const positionLabel =
    profile.searchPosition !== "Any"
      ? profile.searchPosition
      : profile.position || "—";

  const hub = useMemo(
    () =>
      getClubHubForSlug(clubSlug || "club", profile.displayName, positionLabel),
    [clubSlug, profile.displayName, positionLabel]
  );

  const showSlbMark = /benfica/i.test(clubSlug.replace(/-/g, " "));

  const openMatchLineup = (eventId: string) => {
    router.push(`/club/${clubSlug}/lineup?eventId=${encodeURIComponent(eventId)}`);
  };

  const onMessageTeam = () => {
    const n = hub.squad.filter((p) => !p.isYou).length + 1;
    Alert.alert(
      "Message team",
      `Opens a group thread with all ${n} players on this squad (including you). Coming soon.`
    );
  };

  const onMessageCoach = () => {
    Alert.alert(
      "Message coach",
      "Opens a direct conversation with the head coach. Coming soon."
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.topPad, { paddingTop: insets.top + 8 }]}>
        <View style={styles.dmRow}>
          <Pressable
            onPress={onMessageTeam}
            style={({ pressed }) => [
              styles.dmPill,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Direct message to the team, all squad players"
          >
            <Ionicons
              name="chatbubbles-outline"
              size={20}
              color={colors.accent}
            />
            <Text style={[styles.dmPillText, { color: colors.text }]}>
              Team
            </Text>
          </Pressable>
          <Pressable
            onPress={onMessageCoach}
            style={({ pressed }) => [
              styles.dmPill,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Direct message to the coach"
          >
            <Text style={[styles.dmPillText, { color: colors.text }]}>
              Coach
            </Text>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={colors.accent}
            />
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <View style={styles.titleCenter}>
            {showSlbMark ? (
              <Image
                source={SLB_LOGO}
                style={styles.clubMark}
                resizeMode="contain"
              />
            ) : (
              <View
                style={[
                  styles.clubMarkFallback,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                <Ionicons name="shield" size={24} color={colors.accent} />
              </View>
            )}
            <Text
              style={[styles.clubTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {clubTitle}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabRow}>
          {(
            [
              { id: "calendar" as const, label: "Calendar" },
              { id: "documents" as const, label: "Documents" },
              { id: "squad" as const, label: "Squad" },
            ] as const
          ).map((t) => {
            const active = tab === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTab(t.id)}
                style={[
                  styles.tabBtn,
                  {
                    backgroundColor: active ? colors.accent : colors.surface,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    { color: active ? "#fff" : colors.textSecondary },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollInner,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "calendar" ? (
          <View style={{ gap: 10 }}>
            {hub.calendar.map((item) => (
              <Card
                key={item.id}
                padding={14}
                onPress={
                  item.kind === "match"
                    ? () => openMatchLineup(item.id)
                    : undefined
                }
              >
                <View style={styles.calTop}>
                  <View
                    style={[
                      styles.calBadge,
                      {
                        backgroundColor:
                          item.kind === "match"
                            ? "rgba(34, 197, 94, 0.15)"
                            : item.kind === "training"
                              ? "rgba(59, 130, 246, 0.15)"
                              : "rgba(234, 179, 8, 0.18)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.calBadgeText,
                        {
                          color:
                            item.kind === "match"
                              ? "#16A34A"
                              : item.kind === "training"
                                ? "#2563EB"
                                : "#CA8A04",
                        },
                      ]}
                    >
                      {item.kind === "match"
                        ? "Match"
                        : item.kind === "training"
                          ? "Training"
                          : "Meeting"}
                    </Text>
                  </View>
                  <Text style={[styles.calWhen, { color: colors.textMuted }]}>
                    {item.dayLabel} · {item.time}
                  </Text>
                </View>
                <View style={styles.calTitleRow}>
                  <Text style={[styles.calTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  {item.kind === "match" ? (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textMuted}
                    />
                  ) : null}
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {tab === "documents" ? (
          <View style={{ gap: 10 }}>
            {hub.documents.map((doc) => (
              <Card key={doc.id} onPress={() => {}} padding={14}>
                <View style={styles.docRow}>
                  <View
                    style={[
                      styles.docIcon,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color={colors.accent}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={[styles.docTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {doc.title}
                    </Text>
                    <Text
                      style={[styles.docMeta, { color: colors.textMuted }]}
                    >
                      {doc.meta}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textMuted}
                  />
                </View>
              </Card>
            ))}
          </View>
        ) : null}

        {tab === "squad" ? (
          <View style={{ gap: 8 }}>
            <Text style={[styles.squadHint, { color: colors.textMuted }]}>
              Team chat includes everyone listed below.
            </Text>
            {hub.squad.map((row) => (
              <Card key={row.id} padding={12}>
                <View style={styles.squadRow}>
                  <View
                    style={[
                      styles.squadAvatar,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={22}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.squadName, { color: colors.text }]}>
                      {row.name}
                      {row.isYou ? (
                        <Text
                          style={{ color: colors.accent, fontWeight: "700" }}
                        >
                          {" "}
                          (you)
                        </Text>
                      ) : null}
                    </Text>
                    <Text
                      style={[styles.squadPos, { color: colors.textMuted }]}
                    >
                      {row.position}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topPad: {
    paddingHorizontal: layout.gutter,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
  dmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dmPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  dmPillText: {
    fontSize: 14,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  clubMark: {
    width: 40,
    height: 40,
  },
  clubMarkFallback: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  clubTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
    fontFamily: fontStack,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  scroll: { flex: 1 },
  scrollInner: {
    padding: layout.gutter,
    maxWidth: layout.maxWidth + layout.gutter * 2,
    width: "100%",
    alignSelf: "center",
  },
  calTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  calWhen: {
    fontSize: 12,
    fontFamily: fontStack,
  },
  calTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  calTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  docTitle: {
    fontSize: 15,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  docMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fontStack,
  },
  squadHint: {
    fontSize: 13,
    fontFamily: fontStack,
    marginBottom: 4,
  },
  squadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  squadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  squadName: {
    fontSize: 15,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  squadPos: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fontStack,
  },
});
