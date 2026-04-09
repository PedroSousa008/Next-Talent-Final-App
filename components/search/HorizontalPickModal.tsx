import React, { useCallback, useEffect, useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";

const ITEM_W = 96;

type Props = {
  visible: boolean;
  title: string;
  options: readonly string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

export function HorizontalPickModal({
  visible,
  title,
  options,
  selectedIndex,
  onSelect,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const len = options.length;

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      const x = Math.max(0, Math.min(len - 1, index)) * ITEM_W;
      scrollRef.current?.scrollTo({ x, y: 0, animated });
    },
    [len]
  );

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => scrollToIndex(selectedIndex, false), 50);
      return () => clearTimeout(t);
    }
  }, [visible, selectedIndex, scrollToIndex]);

  const goPrev = () => {
    const next = (selectedIndex - 1 + len) % len;
    onSelect(next);
    scrollToIndex(next);
  };

  const goNext = () => {
    const next = (selectedIndex + 1) % len;
    onSelect(next);
    scrollToIndex(next);
  };

  const onScrollEnd = (x: number) => {
    let idx = Math.round(x / ITEM_W);
    idx = Math.max(0, Math.min(len - 1, idx));
    if (idx !== selectedIndex) onSelect(idx);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={[styles.shell, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <Text style={[styles.headerBtn, { color: colors.textSecondary }]}>
              Cancel
            </Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Done">
            <Text style={[styles.headerBtn, { color: colors.accent }]}>Done</Text>
          </Pressable>
        </View>

        <Text
          style={[styles.hint, { color: colors.textMuted }]}
        >
          Swipe horizontally or use the arrows to choose.
        </Text>

        <View style={styles.pickerRow}>
          <Pressable
            onPress={goPrev}
            style={({ pressed }) => [
              styles.arrow,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityLabel="Previous option"
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </Pressable>

          <View style={styles.scrollSlot}>
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_W}
              decelerationRate="fast"
              snapToAlignment="start"
              contentContainerStyle={styles.scrollContent}
              onMomentumScrollEnd={(e) =>
                onScrollEnd(e.nativeEvent.contentOffset.x)
              }
              onScrollEndDrag={(e) =>
                onScrollEnd(e.nativeEvent.contentOffset.x)
              }
            >
              {options.map((opt, i) => {
                const active = i === selectedIndex;
                return (
                  <View key={`${opt}-${i}`} style={[styles.item, { width: ITEM_W }]}>
                    <Text
                      style={[
                        styles.itemText,
                        {
                          color: active ? colors.accent : colors.textSecondary,
                          fontWeight: active ? "800" : "600",
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {opt}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.arrow,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityLabel="Next option"
          >
            <Ionicons name="chevron-forward" size={28} color={colors.text} />
          </Pressable>
        </View>

        <View
          style={[
            styles.selectionPill,
            { backgroundColor: colors.accentMuted, borderColor: colors.accent },
          ]}
        >
          <Text style={[styles.selectionText, { color: colors.accent }]}>
            {options[selectedIndex] ?? "—"}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.gutter,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: fontStack,
    marginHorizontal: 8,
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fontStack,
    minWidth: 52,
  },
  hint: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: fontStack,
    paddingHorizontal: layout.gutter,
    marginTop: 16,
    marginBottom: 12,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    minHeight: 120,
  },
  arrow: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollSlot: {
    flex: 1,
    minWidth: 0,
    maxHeight: 140,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  itemText: {
    fontSize: 13,
    textAlign: "center",
    fontFamily: fontStack,
  },
  selectionPill: {
    alignSelf: "center",
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: "800",
    fontFamily: fontStack,
  },
});
