import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useProfile } from "@/contexts/ProfileContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const LEVEL_STARS = 4;

const STATS = [
  { label: "Goals", value: "12", delta: "+3 vs last season" },
  { label: "Assists", value: "7", delta: "Top 8% for role" },
  { label: "Minutes", value: "1,842", delta: "98% availability" },
];

const BARS = [
  { label: "Finishing", v: 0.78 },
  { label: "Vision", v: 0.86 },
  { label: "Work rate", v: 0.91 },
  { label: "Discipline", v: 0.95 },
];

export default function ProfileScreen() {
  const { colors, resolvedScheme } = useAppTheme();
  const { profile, updateProfile, replaceProfile } = useProfile();
  const { isDesktop } = useBreakpoint();
  const [editOpen, setEditOpen] = useState(false);

  const cover = resolvedScheme === "dark"
    ? (["#1E3A8A", "#0B0F14"] as const)
    : (["#DBEAFE", "#F4F5F7"] as const);

  const pickFromLibrary = useCallback(async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to set your profile picture."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  }, [updateProfile]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow camera access to take a profile photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      updateProfile({ avatarUri: result.assets[0].uri });
    }
  }, [updateProfile]);

  const removePhoto = useCallback(() => {
    updateProfile({ avatarUri: null });
  }, [updateProfile]);

  const onAvatarPress = useCallback(() => {
    if (Platform.OS === "web") {
      void pickFromLibrary();
      return;
    }
    const buttons: {
      text: string;
      style?: "cancel" | "destructive";
      onPress?: () => void;
    }[] = [];
    if (profile.avatarUri) {
      buttons.push({
        text: "Remove photo",
        style: "destructive",
        onPress: removePhoto,
      });
    }
    buttons.push(
      { text: "Take photo", onPress: () => void takePhoto() },
      { text: "Choose from library", onPress: () => void pickFromLibrary() },
      { text: "Cancel", style: "cancel" }
    );
    Alert.alert("Profile photo", "Choose a source", buttons);
  }, [pickFromLibrary, takePhoto, profile.avatarUri, removePhoto]);

  const subtitle = `@${profile.handle} · ${profile.position} · ${profile.nationality}`;

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={cover} style={styles.cover}>
          <View style={styles.coverTopBar}>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => setEditOpen(true)}
              style={({ pressed }) => [
                styles.editPill,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={colors.accent}
              />
              <Text style={[styles.editLabel, { color: colors.text }]}>
                Edit
              </Text>
            </Pressable>
          </View>

          <View style={styles.coverInner}>
            <Pressable
              onPress={onAvatarPress}
              style={styles.avatarPress}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <View style={styles.avatarWrap}>
                {profile.avatarUri ? (
                  <Image
                    source={{ uri: profile.avatarUri }}
                    style={[styles.avatarImg, { borderColor: colors.border }]}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={44}
                      color={colors.textSecondary}
                    />
                  </View>
                )}
                <View
                  style={[
                    styles.photoHint,
                    { backgroundColor: colors.accent, borderColor: colors.bg },
                  ]}
                >
                  <Ionicons name="camera" size={14} color="#fff" />
                </View>
                <View style={[styles.levelBadge, { backgroundColor: colors.accent }]}>
                  <Text style={styles.levelBadgeText}>Lv. 4</Text>
                </View>
              </View>
            </Pressable>
            <Text style={[styles.name, { color: colors.text }]}>
              {profile.displayName}
            </Text>
            <Text style={[styles.handle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
            {profile.avatarUri ? (
              <Pressable
                onPress={removePhoto}
                style={({ pressed }) => [
                  styles.removePhotoBtn,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
                accessibilityLabel="Remove profile photo"
              >
                <Text style={[styles.removePhotoText, { color: colors.danger }]}>
                  Remove photo
                </Text>
              </Pressable>
            ) : null}
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < LEVEL_STARS ? "star" : "star-outline"}
                  size={18}
                  color={colors.star}
                />
              ))}
              <Text style={[styles.levelLabel, { color: colors.textMuted }]}>
                Player level
              </Text>
            </View>
            <View style={styles.followRow}>
              <View style={styles.followBlock}>
                <Text style={[styles.followNum, { color: colors.text }]}>
                  18.4k
                </Text>
                <Text style={[styles.followLbl, { color: colors.textMuted }]}>
                  Followers
                </Text>
              </View>
              <View style={[styles.vsep, { backgroundColor: colors.border }]} />
              <View style={styles.followBlock}>
                <Text style={[styles.followNum, { color: colors.text }]}>
                  412
                </Text>
                <Text style={[styles.followLbl, { color: colors.textMuted }]}>
                  Following
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.max}>
          <SectionTitle
            title="Season performance"
            subtitle="Snapshot — swap for live analytics later"
          />
          <View style={[styles.statGrid, isDesktop && styles.statGridWide]}>
            {STATS.map((s) => (
              <Card
                key={s.label}
                padding={16}
                style={isDesktop ? { flex: 1, minWidth: 200 } : undefined}
              >
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                  {s.label}
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {s.value}
                </Text>
                <Text style={[styles.statDelta, { color: colors.textSecondary }]}>
                  {s.delta}
                </Text>
              </Card>
            ))}
          </View>

          <Card padding={16}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Performance profile
            </Text>
            <View style={{ marginTop: 14, gap: 12 }}>
              {BARS.map((b) => (
                <View key={b.label}>
                  <View style={styles.barTop}>
                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                      {b.label}
                    </Text>
                    <Text style={[styles.barPct, { color: colors.textMuted }]}>
                      {Math.round(b.v * 100)}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.round(b.v * 100)}%`,
                          backgroundColor: colors.accent,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <SectionTitle title="Club" subtitle="Your organization on Next Talent" />
          <Card onPress={() => {}} padding={16} style={styles.clubCard}>
            <View style={styles.clubRow}>
              <View
                style={[
                  styles.clubLogo,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                <Ionicons name="shield" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.clubName, { color: colors.text }]}>
                  {profile.club}
                </Text>
                <Text style={[styles.clubMeta, { color: colors.textMuted }]}>
                  First team · Verified club page
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>

          <SectionTitle
            title="Challenges Arena"
            subtitle="Compete, climb, and earn recognition"
          />
          <LinearGradient
            colors={
              resolvedScheme === "dark"
                ? (["#22C55E33", "#22C55E00"] as const)
                : (["#DCFCE7", "#FFFFFF"] as const)
            }
            style={styles.arenaOuter}
          >
            <Card padding={0} elevated style={styles.arenaCard}>
              <LinearGradient
                colors={["#16A34A", "#22C55E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.arenaBanner}
              >
                <View style={styles.arenaTop}>
                  <View style={styles.arenaIcon}>
                    <Ionicons name="trophy" size={22} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.arenaKicker}>Featured</Text>
                    <Text style={styles.arenaTitle}>Weekly finishing challenge</Text>
                    <Text style={styles.arenaSub}>
                      Top 50 leaderboard · closes Sunday 23:59
                    </Text>
                  </View>
                </View>
              </LinearGradient>
              <View style={styles.arenaBody}>
                <Text style={[styles.arenaCopy, { color: colors.textSecondary }]}>
                  Enter with one tap. Progress syncs your season stats and club
                  visibility settings.
                </Text>
                <View style={styles.arenaActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryCta,
                      { opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <Text style={styles.primaryCtaText}>Enter arena</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.ghostCta,
                      {
                        borderColor: colors.border,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.ghostCtaText, { color: colors.text }]}>
                      View rules
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Card>
          </LinearGradient>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>

      <EditProfileModal
        visible={editOpen}
        initial={profile}
        onClose={() => setEditOpen(false)}
        onSave={(next) => replaceProfile(next)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40, flexGrow: 1 },
  cover: {
    paddingTop: 4,
    paddingBottom: 22,
  },
  coverTopBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.gutter,
    marginBottom: 8,
    minHeight: 40,
  },
  editPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: fontStack,
  },
  coverInner: {
    maxWidth: layout.maxWidth + layout.gutter * 2,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    alignItems: "center",
  },
  avatarPress: { alignItems: "center" },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 32,
    borderWidth: 3,
  },
  photoHint: {
    position: "absolute",
    right: -2,
    bottom: 28,
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  levelBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    fontFamily: fontStack,
  },
  name: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.6,
    fontFamily: fontStack,
  },
  handle: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: fontStack,
    textAlign: "center",
  },
  removePhotoBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: fontStack,
    textAlign: "center",
  },
  starsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  levelLabel: { marginLeft: 8, fontSize: 13, fontFamily: fontStack },
  followRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  followBlock: { alignItems: "center" },
  followNum: { fontSize: 18, fontWeight: "800", fontFamily: fontStack },
  followLbl: { marginTop: 2, fontSize: 12, fontFamily: fontStack },
  vsep: { width: 1, height: 28 },
  max: {
    width: "100%",
    maxWidth: layout.maxWidth + layout.gutter * 2,
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    marginTop: 4,
    gap: 18,
  },
  statGrid: { gap: 12 },
  statGridWide: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statLabel: { fontSize: 12, fontWeight: "700", fontFamily: fontStack },
  statValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
    fontFamily: fontStack,
  },
  statDelta: { marginTop: 6, fontSize: 12, fontFamily: fontStack },
  chartTitle: { fontSize: 15, fontWeight: "900", fontFamily: fontStack },
  barTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barLabel: { fontSize: 12, fontWeight: "700", fontFamily: fontStack },
  barPct: { fontSize: 12, fontFamily: fontStack },
  barTrack: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 999 },
  clubCard: {},
  clubRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  clubLogo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  clubName: { fontSize: 16, fontWeight: "900", fontFamily: fontStack },
  clubMeta: { marginTop: 4, fontSize: 12, fontFamily: fontStack },
  arenaOuter: {
    borderRadius: layout.radiusLg,
    padding: 1,
  },
  arenaCard: { overflow: "hidden" },
  arenaBanner: { padding: 16 },
  arenaTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  arenaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  arenaKicker: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "800",
    fontFamily: fontStack,
  },
  arenaTitle: {
    marginTop: 4,
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
    fontFamily: fontStack,
  },
  arenaSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontFamily: fontStack,
  },
  arenaBody: { padding: 16, gap: 14 },
  arenaCopy: { fontSize: 14, lineHeight: 20, fontFamily: fontStack },
  arenaActions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#16A34A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryCtaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    fontFamily: fontStack,
  },
  ghostCta: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  ghostCtaText: { fontSize: 14, fontWeight: "800", fontFamily: fontStack },
});
