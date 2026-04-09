import React, { useEffect, useState } from "react";
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
import { useAppTheme } from "@/contexts/ThemeContext";
import type { ProfileData } from "@/contexts/ProfileContext";
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

  useEffect(() => {
    if (visible) {
      setDisplayName(initial.displayName);
      setPosition(initial.position);
      setClub(initial.club);
      setNationality(initial.nationality);
    }
  }, [visible, initial]);

  const handleSave = () => {
    onSave({
      ...initial,
      displayName: displayName.trim() || initial.displayName,
      position: position.trim() || initial.position,
      club: club.trim() || initial.club,
      nationality: nationality.trim() || initial.nationality,
    });
    onClose();
  };

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
        </ScrollView>
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
});
