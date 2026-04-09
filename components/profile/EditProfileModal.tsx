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
  const [club, setClub] = useState(initial.club);
  const [nationality, setNationality] = useState(initial.nationality);
  const [dateOfBirth, setDateOfBirth] = useState(initial.dateOfBirth);
  const [shirtNumberStr, setShirtNumberStr] = useState(
    String(initial.shirtNumber)
  );
  const [searchPositionIndex, setSearchPositionIndex] = useState(0);
  const [searchFootIndex, setSearchFootIndex] = useState(0);
  const [heightMetersStr, setHeightMetersStr] = useState(
    String(initial.heightMeters)
  );
  const [weightKgStr, setWeightKgStr] = useState(String(initial.weightKg));
  const [pickKind, setPickKind] = useState<
    "search-position" | "search-foot" | null
  >(null);

  const footOptions = useMemo(
    () => ["Any", ...DOMINANT_FOOT_OPTIONS.filter((x) => x !== "Any")],
    []
  );
  const positionOptions = useMemo(() => [...POSITION_OPTIONS], []);

  useEffect(() => {
    if (visible) {
      setDisplayName(initial.displayName);
      setClub(initial.club);
      setNationality(initial.nationality);
      setDateOfBirth(initial.dateOfBirth);
      setShirtNumberStr(String(initial.shirtNumber));
      const pi = positionOptions.indexOf(
        initial.searchPosition as (typeof POSITION_OPTIONS)[number]
      );
      setSearchPositionIndex(pi >= 0 ? pi : 0);
      const footLabel = initial.searchFoot?.length ? initial.searchFoot : "Any";
      const fi = footOptions.indexOf(footLabel);
      setSearchFootIndex(fi >= 0 ? fi : 0);
      setHeightMetersStr(String(initial.heightMeters));
      setWeightKgStr(String(initial.weightKg));
    }
  }, [visible, initial, positionOptions, footOptions]);

  const handleSave = () => {
    const footPick = footOptions[searchFootIndex] ?? "Any";
    const spi = positionOptions[searchPositionIndex] ?? "Any";
    const hm = parseFloat(heightMetersStr.replace(",", "."));
    const wk = parseFloat(weightKgStr.replace(",", "."));
    const sn = parseInt(shirtNumberStr.replace(/\D/g, ""), 10);
    const dob = dateOfBirth.trim() || initial.dateOfBirth;

    onSave({
      displayName: displayName.trim() || initial.displayName,
      handle: initial.handle,
      position: spi !== "Any" ? spi : initial.position,
      club: club.trim() || initial.club,
      nationality: nationality.trim() || initial.nationality,
      avatarUri: initial.avatarUri,
      searchPosition: positionOptions[searchPositionIndex] ?? "Any",
      searchFoot: footPick === "Any" ? "" : footPick,
      heightMeters:
        Number.isFinite(hm) && hm > 0.5 && hm < 3 ? hm : initial.heightMeters,
      weightKg:
        Number.isFinite(wk) && wk > 20 && wk < 200 ? wk : initial.weightKg,
      dateOfBirth: dob,
      shirtNumber:
        Number.isFinite(sn) && sn >= 0 && sn <= 99
          ? sn
          : initial.shirtNumber,
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
          {field(
            "Date of birth",
            dateOfBirth,
            setDateOfBirth,
            "DD/MM/YYYY"
          )}
          {field(
            "Shirt number",
            shirtNumberStr,
            setShirtNumberStr,
            "e.g. 8"
          )}
          {field("Club", club, setClub, "Your club")}
          {field("Nationality", nationality, setNationality, "e.g. Portugal")}
          {field(
            "Height (m)",
            heightMetersStr,
            setHeightMetersStr,
            "e.g. 1.80"
          )}
          {field(
            "Weight (kg)",
            weightKgStr,
            setWeightKgStr,
            "e.g. 73"
          )}

          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Search filters (how others find you)
          </Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Set your playing position below (also used on your profile card).
            Age in Search uses your date of birth. Use “Any” to match any
            filter.
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
