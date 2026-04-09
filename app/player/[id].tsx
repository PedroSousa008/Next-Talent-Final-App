import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CURRENT_USER_PLAYER_ID } from "@/constants/playerSearch";
import { useProfile } from "@/contexts/ProfileContext";
import {
  getPlayerWithProfile,
  playerLastName,
  preferredFootShort,
  type AttributeLevel,
  type PlayerAttributeRatings,
  type PlayerWithProfile,
  type SeasonDetails,
} from "@/data/playerProfileExtras";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import {
  formatHeightMeters,
  formatWeightKg,
  formatWeightLb,
  metersToFeetInches,
} from "@/lib/playerMeasurements";
import { nationFlagEmoji } from "@/constants/nationFlagEmoji";
import { fontStack, layout } from "@/constants/theme";

const LEAGUE_BADGE = require("@/assets/league.png");

const SCREEN_BG = "#0B0E12";
const CARD_GOLD_TOP = "rgba(201, 162, 39, 0.35)";
const CARD_GOLD_BOTTOM = "rgba(12, 16, 24, 0.95)";
const TEXT_MUTED = "rgba(255,255,255,0.45)";
const DIVIDER = "rgba(255,255,255,0.08)";

const STRENGTH_COLUMNS: {
  title?: string;
  rows: { label: string; key: keyof PlayerAttributeRatings }[];
}[] = [
  {
    rows: [
      { label: "Shooting", key: "shooting" },
      { label: "Long Shooting", key: "longShooting" },
      { label: "Penalty Taker", key: "penaltyTaker" },
      { label: "Free Kick Taker", key: "freeKickTaker" },
    ],
  },
  {
    rows: [
      { label: "Passing", key: "passing" },
      { label: "Vision", key: "vision" },
      { label: "Crossing", key: "crossing" },
      { label: "Corner Taker", key: "cornerTaker" },
    ],
  },
  {
    rows: [
      { label: "Dribbling", key: "dribbling" },
      { label: "Ball Control", key: "ballControl" },
      { label: "First Touch", key: "firstTouch" },
      { label: "Composure", key: "composure" },
    ],
  },
  {
    rows: [
      { label: "Tackling", key: "tackling" },
      { label: "Positioning", key: "positioning" },
      { label: "Work Rate", key: "workRate" },
      { label: "Leadership", key: "leadership" },
    ],
  },
];

const SEASON_ROWS: { key: keyof SeasonDetails; label: string }[] = [
  { key: "games", label: "Games" },
  { key: "starts", label: "Starts" },
  { key: "goals", label: "Goals" },
  { key: "goalsPerGame", label: "Goals per Game" },
  { key: "assists", label: "Assists" },
  { key: "assistsPerGame", label: "Assists per Game" },
  { key: "minutes", label: "Minutes" },
  { key: "yellows", label: "Yellows" },
  { key: "reds", label: "Reds" },
  { key: "freeKickGoals", label: "Free Kick Goals" },
  { key: "penaltyGoals", label: "Penalty Goals" },
  { key: "rightFootedGoals", label: "Right Footed Goals" },
  { key: "leftFootedGoals", label: "Left Footed Goals" },
  { key: "headerGoals", label: "Header Goals" },
];

function strengthCellColors(level: AttributeLevel): {
  backgroundColor: string;
  borderColor: string;
} {
  switch (level) {
    case "strong":
      return {
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 0.45)",
      };
    case "medium":
      return {
        backgroundColor: "rgba(234, 179, 8, 0.22)",
        borderColor: "rgba(234, 179, 8, 0.45)",
      };
    case "weak":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 0.42)",
      };
    default:
      return {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.08)",
      };
  }
}

function formatSeasonValue(
  v: number | null,
  key?: keyof SeasonDetails
): string {
  if (v === null) return "—";
  if (key === "goalsPerGame" || key === "assistsPerGame") {
    return v.toFixed(2);
  }
  if (Number.isInteger(v)) return v.toLocaleString("en-US");
  return Number.isFinite(v) ? String(v) : "—";
}

type TabId = "bio" | "details";

function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {children ?? (
        <Text style={styles.infoValue}>{value ?? "—"}</Text>
      )}
      <View style={[styles.infoDivider, { backgroundColor: DIVIDER }]} />
    </View>
  );
}

function ToggleMetricRow({
  label,
  value,
  switchLabel,
  onToggle,
}: {
  label: string;
  value: string;
  switchLabel: string;
  onToggle: () => void;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${switchLabel}`}
        style={styles.toggleMetricPress}
      >
        <Text style={styles.infoValue}>{value}</Text>
        <Text style={styles.unitSwitchHint}>{switchLabel}</Text>
      </Pressable>
      <View style={[styles.infoDivider, { backgroundColor: DIVIDER }]} />
    </View>
  );
}

function PlayerFifaCard({ p }: { p: PlayerWithProfile }) {
  const last = playerLastName(p.name);
  const flag = nationFlagEmoji(p.nation);
  return (
    <View style={styles.cardOuter}>
      <LinearGradient
        colors={[CARD_GOLD_TOP, CARD_GOLD_BOTTOM]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.cardAge}>{p.age}</Text>
          <Text style={styles.cardPos}>{p.position}</Text>
        </View>
        <View style={styles.cardPhoto}>
          {p.avatarUri ? (
            <Image source={{ uri: p.avatarUri }} style={styles.cardPhotoImg} />
          ) : (
            <Ionicons name="person" size={56} color="rgba(255,255,255,0.35)" />
          )}
        </View>
        <View style={styles.cardNameBlock}>
          <Text style={styles.cardSurname} numberOfLines={1}>
            {last}
          </Text>
        </View>
        <View style={styles.cardMetaRow}>
          <View style={styles.metaTripLeft}>
            <Image
              source={LEAGUE_BADGE}
              style={styles.metaLeagueImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.metaTripRight}>
            <View style={styles.metaFlagWrap}>
              <Text style={styles.metaFlagEmoji} allowFontScaling={false}>
                {flag}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function PlayerBioPanel({ p }: { p: PlayerWithProfile }) {
  const [heightUnit, setHeightUnit] = useState<"m" | "ft">("m");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  const heightDisplay =
    heightUnit === "m"
      ? formatHeightMeters(p.heightMeters)
      : metersToFeetInches(p.heightMeters);
  const weightDisplay =
    weightUnit === "kg"
      ? formatWeightKg(p.weightKg)
      : formatWeightLb(p.weightKg);

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Player</Text>
      <InfoRow label="Name" value={p.name} />
      <InfoRow label="Date of Birth" value={p.dateOfBirth} />
      <ToggleMetricRow
        label="Height"
        value={heightDisplay}
        switchLabel={
          heightUnit === "m" ? "Tap for ft / in" : "Tap for metres"
        }
        onToggle={() => setHeightUnit((u) => (u === "m" ? "ft" : "m"))}
      />
      <ToggleMetricRow
        label="Weight"
        value={weightDisplay}
        switchLabel={weightUnit === "kg" ? "Tap for lbs" : "Tap for kg"}
        onToggle={() => setWeightUnit((u) => (u === "kg" ? "lb" : "kg"))}
      />
      <InfoRow label="Nationality" value={p.nation} />
      <InfoRow
        label="Dominant Foot"
        value={preferredFootShort(String(p.dominantFoot))}
      />
    </View>
  );
}

function StrengthCell({
  label,
  level,
}: {
  label: string;
  level: AttributeLevel;
}) {
  const c = strengthCellColors(level);
  return (
    <View style={[styles.strengthCell, c]}>
      <Text style={styles.strengthCellLabel}>{label}</Text>
    </View>
  );
}

function PlayerDetailsPanel({ p }: { p: PlayerWithProfile }) {
  const sd = p.seasonDetails;
  return (
    <View style={styles.panel}>
      <Text style={styles.staffOnlyNote}>
        Staff only — coaches, referees, and app-authorized roles can add or edit
        this data. Players cannot change it here.
      </Text>

      <Text style={styles.panelTitle}>Details</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strengthScroll}
      >
        <View style={styles.strengthRow}>
          {STRENGTH_COLUMNS.map((col, ci) => (
            <View key={ci} style={styles.strengthCol}>
              {col.rows.map((row) => (
                <StrengthCell
                  key={row.key}
                  label={row.label}
                  level={p.attributeRatings[row.key]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <Text style={[styles.panelTitle, styles.seasonTitle]}>Season Details</Text>
      <View style={styles.seasonList}>
        {SEASON_ROWS.map(({ key, label }) => (
          <View key={key} style={styles.seasonRow}>
            <Text style={styles.seasonLabel}>{label}</Text>
            <Text style={styles.seasonValue}>
              {formatSeasonValue(sd[key], key)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function PlayerProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { isDesktop } = useBreakpoint();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<TabId>("bio");

  const player = useMemo(() => {
    if (typeof id !== "string") return undefined;
    if (id === CURRENT_USER_PLAYER_ID) {
      return getPlayerWithProfile(id, profile);
    }
    return getPlayerWithProfile(id);
  }, [id, profile]);

  if (!player) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, backgroundColor: SCREEN_BG }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </Pressable>
          <Text style={styles.topTitle}>Player</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Player not found.</Text>
          <Pressable onPress={() => router.back()} style={styles.missingBtn}>
            <Text style={styles.missingBtnText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const threeCol = isDesktop;

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: SCREEN_BG }]}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {playerLastName(player.name)}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabRow}>
        {(
          [
            { id: "bio" as const, label: "Player Bio" },
            { id: "details" as const, label: "Player Details" },
          ] as const
        ).map((t) => {
          const active = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={styles.tabBtn}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.tabLabel, active && styles.tabLabelActive]}
              >
                {t.label}
              </Text>
              {active ? <View style={styles.tabUnderline} /> : null}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollInner,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "bio" ? (
          <View
            style={[
              styles.bioLayout,
              threeCol && styles.bioLayoutDesktop,
            ]}
          >
            <View style={styles.colLeft}>
              <Text style={styles.colHeadName}>{playerLastName(player.name)}</Text>
              <Text style={styles.colHeadNumber}>
                Number: {player.shirtNumber}
              </Text>
              <PlayerFifaCard p={player} />
            </View>
            <PlayerBioPanel p={player} />
          </View>
        ) : (
          <View style={styles.detailsOnly}>
            <PlayerDetailsPanel p={player} />
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DIVIDER,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: layout.gutter,
    gap: 28,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DIVIDER,
  },
  tabBtn: {
    paddingVertical: 14,
    minWidth: 100,
  },
  tabLabel: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontStack,
  },
  tabLabelActive: {
    color: "#fff",
  },
  tabUnderline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  scroll: { flex: 1 },
  scrollInner: {
    paddingHorizontal: layout.gutter,
    paddingTop: 20,
    maxWidth: layout.maxWidth + layout.gutter * 2,
    width: "100%",
    alignSelf: "center",
  },
  bioLayout: {
    gap: 24,
  },
  bioLayoutDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 28,
  },
  colLeft: {
    flexShrink: 0,
  },
  colHeadName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    fontFamily: fontStack,
    marginBottom: 4,
  },
  colHeadNumber: {
    fontSize: 13,
    fontWeight: "800",
    fontFamily: fontStack,
    marginBottom: 14,
    color: "rgba(255,255,255,0.85)",
  },
  cardOuter: {
    width: 200,
    maxWidth: "100%",
  },
  cardGradient: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(201, 162, 39, 0.45)",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    minHeight: 220,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardAge: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    fontFamily: fontStack,
    lineHeight: 30,
  },
  cardPos: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "800",
    fontFamily: fontStack,
    marginTop: 4,
  },
  cardPhoto: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    minHeight: 100,
  },
  cardPhotoImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  cardNameBlock: {
    alignItems: "center",
    marginBottom: 10,
  },
  cardSurname: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  /** Two columns: league.png | nationality flag */
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    width: "100%",
    paddingHorizontal: 8,
  },
  metaTripLeft: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  metaTripRight: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  metaFlagWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  metaFlagEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  metaLeagueImg: {
    width: 48,
    height: 34,
  },
  metaDot: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 6,
    minHeight: 28,
  },
  panel: {
    flex: 1,
    minWidth: 0,
  },
  panelTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
    fontFamily: fontStack,
  },
  infoRow: {
    paddingBottom: 12,
    marginBottom: 4,
  },
  infoLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "none",
    marginBottom: 6,
    fontFamily: fontStack,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  toggleMetricPress: {
    alignSelf: "flex-start",
  },
  unitSwitchHint: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    fontFamily: fontStack,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 12,
  },
  detailsOnly: {
    maxWidth: 960,
    alignSelf: "stretch",
    width: "100%",
  },
  staffOnlyNote: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 18,
    fontFamily: fontStack,
  },
  strengthScroll: {
    paddingBottom: 8,
    gap: 0,
  },
  strengthRow: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 8,
  },
  strengthCol: {
    width: 132,
    gap: 8,
  },
  strengthCell: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  strengthCellLabel: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: fontStack,
    lineHeight: 14,
  },
  seasonTitle: {
    marginTop: 28,
  },
  seasonList: {
    gap: 0,
    marginTop: 4,
  },
  seasonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DIVIDER,
  },
  seasonLabel: {
    color: TEXT_MUTED,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: fontStack,
    flex: 1,
    paddingRight: 12,
  },
  seasonValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  missing: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  missingText: {
    color: TEXT_MUTED,
    fontSize: 16,
    fontFamily: fontStack,
  },
  missingBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: layout.radiusMd,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  missingBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontFamily: fontStack,
  },
});
