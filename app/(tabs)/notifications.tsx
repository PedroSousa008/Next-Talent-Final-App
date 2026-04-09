import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack, layout } from "@/constants/theme";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const NOTIFS = [
  {
    id: "n1",
    icon: "heart" as const,
    title: "Alex and 12 others liked your highlight",
    time: "2m",
    unread: true,
  },
  {
    id: "n2",
    icon: "person-add" as const,
    title: "Coach Rivera started following you",
    time: "1h",
    unread: true,
  },
  {
    id: "n3",
    icon: "megaphone" as const,
    title: "Your club posted a new training update",
    time: "Yesterday",
    unread: false,
  },
];

const THREADS = [
  {
    id: "t1",
    name: "Performance Lab",
    preview: "Sent you a clip from yesterday’s session.",
    time: "09:12",
    unread: 2,
  },
  {
    id: "t2",
    name: "Scout — North City",
    preview: "Availability for the weekend?",
    time: "Mon",
    unread: 0,
  },
];

const CHAT = [
  { id: "m1", me: false, text: "Hey — loved the breakdown you posted." },
  { id: "m2", me: true, text: "Thanks! I’ll share the data source later today." },
  {
    id: "m3",
    me: false,
    text: "Perfect. Also, can you tag the pressing triggers?",
  },
];

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const { isDesktop } = useBreakpoint();
  const [draft, setDraft] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.max, isDesktop && styles.split]}>
        <View style={[styles.col, isDesktop && styles.colLeft]}>
          <View style={styles.colHead}>
            <Text style={[styles.h1, { color: colors.text }]}>Notifications</Text>
            <Pressable
              style={[
                styles.textBtn,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.textBtnLabel, { color: colors.accent }]}>
                Mark all read
              </Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listPad}
          >
            {NOTIFS.map((n) => (
              <Pressable
                key={n.id}
                style={({ pressed }) => [
                  styles.notifRow,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.92 : 1,
                  },
                  n.unread && { backgroundColor: colors.accentMuted },
                ]}
              >
                <View
                  style={[
                    styles.notifIcon,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Ionicons name={n.icon} size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.notifTitle, { color: colors.text }]}>
                    {n.title}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.textMuted }]}>
                    {n.time}
                  </Text>
                </View>
                {n.unread ? (
                  <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {isDesktop ? (
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        ) : (
          <View
            style={[styles.dividerH, { backgroundColor: colors.border }]}
          />
        )}

        <View style={[styles.col, isDesktop && styles.colRight]}>
          <Text style={[styles.h1, { color: colors.text }]}>Messages</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Inbox + chat — separated from alerts, same screen.
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.threadStrip}
          >
            {THREADS.map((t) => (
              <Card key={t.id} padding={12} style={styles.threadCard}>
                <View style={styles.threadTop}>
                  <Text style={[styles.threadName, { color: colors.text }]}>
                    {t.name}
                  </Text>
                  <Text style={[styles.threadTime, { color: colors.textMuted }]}>
                    {t.time}
                  </Text>
                </View>
                <Text
                  style={[styles.threadPreview, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {t.preview}
                </Text>
                {t.unread > 0 ? (
                  <View style={styles.unreadPill}>
                    <Text style={styles.unreadText}>{t.unread}</Text>
                  </View>
                ) : null}
              </Card>
            ))}
          </ScrollView>

          <View
            style={[
              styles.chatShell,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.chatHeader}>
              <Text style={[styles.chatTitle, { color: colors.text }]}>
                Performance Lab
              </Text>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
            </View>
            <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatPad}>
              {CHAT.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.bubbleWrap,
                    m.me ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: m.me ? colors.accent : colors.surfaceMuted,
                        borderColor: m.me ? "transparent" : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        { color: m.me ? "#fff" : colors.text },
                      ]}
                    >
                      {m.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View
              style={[
                styles.composer,
                { borderTopColor: colors.border, backgroundColor: colors.bgElevated },
              ]}
            >
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message…"
                placeholderTextColor={colors.textMuted}
                style={[styles.composerInput, { color: colors.text }]}
              />
              <Pressable
                style={[
                  styles.send,
                  { backgroundColor: colors.accent },
                ]}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
    width: "100%",
    maxWidth: layout.maxWidth + layout.gutter * 2,
    alignSelf: "center",
    paddingHorizontal: layout.gutter,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  split: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 0,
  },
  col: { minWidth: 0 },
  colLeft: { paddingRight: 12, flex: 1 },
  colRight: { paddingLeft: 12, flex: 1.15, minHeight: 0 },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  dividerH: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    marginVertical: 6,
  },
  colHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  h1: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    fontFamily: fontStack,
  },
  sub: { fontSize: 14, lineHeight: 20, fontFamily: fontStack, marginBottom: 8 },
  textBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textBtnLabel: { fontSize: 12, fontWeight: "700", fontFamily: fontStack },
  listPad: { paddingBottom: 24, gap: 10 },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notifTitle: { fontSize: 14, fontWeight: "600", fontFamily: fontStack },
  notifTime: { marginTop: 4, fontSize: 12, fontFamily: fontStack },
  dot: { width: 8, height: 8, borderRadius: 4 },
  threadStrip: { gap: 10, paddingVertical: 4 },
  threadCard: { width: 240 },
  threadTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
  },
  threadName: { fontSize: 13, fontWeight: "800", fontFamily: fontStack },
  threadTime: { fontSize: 12, fontFamily: fontStack },
  threadPreview: { fontSize: 12, lineHeight: 16, fontFamily: fontStack },
  unreadPill: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "800", fontFamily: fontStack },
  chatShell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: layout.radiusLg,
    overflow: "hidden",
    minHeight: 360,
  },
  chatHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatTitle: { fontSize: 14, fontWeight: "800", fontFamily: fontStack },
  chatScroll: { flex: 1 },
  chatPad: { padding: 14, gap: 10 },
  bubbleWrap: { width: "100%" },
  bubbleMe: { alignItems: "flex-end" },
  bubbleThem: { alignItems: "flex-start" },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: fontStack },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  composerInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fontStack,
    paddingVertical: 8,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
