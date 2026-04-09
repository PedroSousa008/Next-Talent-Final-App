import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { fontStack } from "@/constants/theme";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionTitle({ title, subtitle, action }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  textBlock: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.4,
    fontFamily: fontStack,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontStack,
  },
});
