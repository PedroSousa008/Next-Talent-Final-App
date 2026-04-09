import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { HorizontalPickModal } from "@/components/search/HorizontalPickModal";
import type { ProfileData } from "@/contexts/ProfileContext";
import {
  AGE_OPTIONS,
  DOMINANT_FOOT_OPTIONS,
  POSITION_OPTIONS,
} from "@/constants/searchFilters";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

type Props = {
  visible: boolean;
  initial: ProfileData;
  onClose: () => void;
  onSave: (next: ProfileData) => void;
};

export function EditProfileModal({
  visible,
  initial,
  onClose,
  onSave,
}: Props) {
  const { colors } = useAppTheme();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [position, setPosition] = useState(initial.position);
  const [club, setClub] = useState(initial.club);
  const [nationality, setNationality] = useState(initial.nationality);
  const [searchPositionIndex, setSearchPositionIndex] = useState(0);
  const [searchFootIndex, setSearchFootIndex] = useState(0);
  const [searchAgeIndex, setSearchAgeIndex] = useState(0);
  const [pickKind, setPickKind] = useState<
    "search-position" | "search-foot" | "search-age" | null
  >(null);

  const footOptions = useMemo(
    () => ["Any", ...DOMINANT_FOOT_OPTIONS.filter((x) => x !== "Any")],
    []
  );
  const ageOptions = useMemo(() => [...AGE_OPTIONS], []);
  const positionOptions = useMemo(() => [...POSITION_OPTIONS], []);

  useEffect(() => {
    if (visible) {
      setDisplayName(initial.displayName);
      setPosition(initial.position);
      setClub(initial.club);
      setNationality(initial.nationality);
      const pi = positionOptions.indexOf(
        initial.searchPosition as (typeof POSITION_OPTIONS)[number]
      );
      setSearchPositionIndex(pi >= 0 ? pi : 0);
      const footLabel = initial.searchFoot?.length ? initial.searchFoot : "Any";
      const fi = footOptions.indexOf(footLabel);
      setSearchFootIndex(fi >= 0 ? fi : 0);
      const ageLabel =
        initial.searchAge != null ? String(initial.searchAge) : "Any";
      const ai = ageOptions.indexOf(
        ageLabel as (typeof AGE_OPTIONS)[number]
      );
      setSearchAgeIndex(ai >= 0 ? ai : 0);
    }
  }, [visible, initial, positionOptions, footOptions, ageOptions]);

  const handleSave = () => {
    const footPick = footOptions[searchFootIndex] ?? "Any";
    const agePick = ageOptions[searchAgeIndex] ?? "Any";
    onSave({
      ...initial,
      displayName: displayName.trim() || initial.displayName,
      position: position.trim() || initial.position,
      club: club.trim() || initial.club,
      nationality: nationality.trim() || initial.nationality,
      searchPosition: positionOptions[searchPositionIndex] ?? "Any",
      searchFoot: footPick === "Any" ? "" : footPick,
      searchAge:
        agePick === "Any" ? null : parseInt(agePick, 10),
    });
    onClose();
  };

  const pickRow = (
    label: string,
    value: string,
    onOpen: () => void
  ) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Pressable
        onPress={onOpen}
        style={[
          styles.input,
          styles.pickInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text style={[styles.pickValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.pickChev, { color: colors.textMuted }]}>▸</Text>
      </Pressable>
    </View>
  );

  const field = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    placeholder?: string
  ) => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: colors.bg }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <Text style={[styles.headerBtn, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Edit profile
          </Text>
          <Pressable onPress={handleSave} hitSlop={12} accessibilityLabel="Save">
            <Text style={[styles.headerBtn, { color: colors.accent }]}>
              Save
            </Text>
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {field("Name", displayName, setDisplayName, "Your name")}
          {field("Position", position, setPosition, "e.g. Winger")}
          {field("Club", club, setClub, "Your club")}
          {field("Nationality", nationality, setNationality, "e.g. Portugal")}

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Search filters (how others find you)
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Leave as “Any” or empty to match any Search filter. Your profile photo
            appears in results when your name matches.
          </Text>
          {pickRow(
            "Search · Position",
            positionOptions[searchPositionIndex] ?? "Any",
            () => setPickKind("search-position")
          )}
          {pickRow(
            "Search · Dominant foot",
            footOptions[searchFootIndex] ?? "Any",
            () => setPickKind("search-foot")
          )}
          {pickRow(
            "Search · Age",
            ageOptions[searchAgeIndex] ?? "Any",
            () => setPickKind("search-age")
          )}
        </ScrollView>

        <HorizontalPickModal
          visible={pickKind === "search-position"}
          title="Search · Position"
          options={positionOptions}
          selectedIndex={searchPositionIndex}
          onSelect={setSearchPositionIndex}
          onClose={() => setPickKind(null)}
        />
        <HorizontalPickModal
          visible={pickKind === "search-foot"}
          title="Search · Dominant foot"
          options={footOptions}
          selectedIndex={searchFootIndex}
          onSelect={setSearchFootIndex}
          onClose={() => setPickKind(null)}
        />
        <HorizontalPickModal
          visible={pickKind === "search-age"}
          title="Search · Age"
          options={ageOptions}
          selectedIndex={searchAgeIndex}
          onSelect={setSearchAgeIndex}
          onClose={() => setPickKind(null)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.gutter,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: fontStack,
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontStack,
    minWidth: 64,
  },
  scroll: {
    padding: layout.gutter,
    paddingBottom: 40,
    gap: 18,
  },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: fontStack,
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.radiusMd,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: fontStack,
  },
  pickInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickValue: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontStack,
  },
  pickChev: {
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    fontFamily: fontStack,
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fontStack,
  },
});
