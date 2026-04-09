import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MockPlayer } from "@/data/mockPlayers";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

type Props = {
  player: MockPlayer;
  onPress?: () => void;
  /** Smaller variant for pitch / tactical view */
  compact?: boolean;
};

export function SearchPlayerRowCard({ player, onPress, compact }: Props) {
  const { colors } = useAppTheme();

  const inner = (
    <View style={[styles.cardRow, compact && styles.cardRowCompact]}>
      <View
        style={[
          styles.avatar,
          compact && styles.avatarCompact,
          { backgroundColor: colors.surfaceMuted },
        ]}
      >
        {player.avatarUri ? (
          <Image
            source={{ uri: player.avatarUri }}
            style={[styles.avatarImg, compact && styles.avatarImgCompact]}
          />
        ) : (
          <Ionicons
            name="person"
            size={compact ? 18 : 22}
            color={colors.accent}
          />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={[styles.name, compact && styles.nameCompact, { color: colors.text }]}
          numberOfLines={1}
        >
          {player.name}
        </Text>
        <Text
          style={[styles.meta, compact && styles.metaCompact, { color: colors.textSecondary }]}
          numberOfLines={compact ? 1 : 2}
        >
          {compact
            ? `${player.position} · ${player.age} yrs`
            : `${player.position} · ${player.dominantFoot} · ${player.age} yrs`}
        </Text>
        {!compact ? (
          <Text style={[styles.meta, { color: colors.textMuted }]} numberOfLines={1}>
            {player.club} · {player.nation}
          </Text>
        ) : null}
      </View>
      {!compact ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      ) : null}
    </View>
  );

  const pad = compact ? 8 : 14;
  const base = [
    styles.card,
    compact && styles.cardCompact,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      padding: pad,
    },
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...base, pressed && { opacity: 0.88 }]}
        accessibilityRole="button"
        accessibilityLabel={`Open profile for ${player.name}`}
      >
        {inner}
      </Pressable>
    );
  }

  return <View style={base}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radiusMd,
    borderWidth: 1,
  },
  cardCompact: {
    borderRadius: layout.radiusMd,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardRowCompact: { gap: 8, alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  avatarImgCompact: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  nameCompact: {
    fontSize: 12,
    fontWeight: "800",
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: fontStack,
  },
  metaCompact: {
    fontSize: 10,
    marginTop: 1,
  },
});
