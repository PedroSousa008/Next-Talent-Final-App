import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

type Props = {
  visible: boolean;
  initialValue: string;
  onSave: (name: string) => void;
  onClose: () => void;
};

export function PlayerNameModal({
  visible,
  initialValue,
  onSave,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (visible) setText(initialValue);
  }, [visible, initialValue]);

  const handleSave = () => {
    onSave(text.trim());
    onClose();
  };

  const handleClear = () => {
    setText("");
    onSave("");
    onClose();
  };

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
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={[styles.headerBtn, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Player name
          </Text>
          <Pressable onPress={handleSave} hitSlop={12}>
            <Text style={[styles.headerBtn, { color: colors.accent }]}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Type a player name
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="e.g. João Silva"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            autoCorrect
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          />
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Text style={[styles.clear, { color: colors.textSecondary }]}>
              Clear filter
            </Text>
          </Pressable>
        </View>
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
    minWidth: 52,
  },
  body: {
    padding: layout.gutter,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fontStack,
  },
  input: {
    borderWidth: 1,
    borderRadius: layout.radiusMd,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontFamily: fontStack,
  },
  clear: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: fontStack,
  },
});
