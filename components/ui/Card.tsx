import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";
import { layout } from "@/constants/theme";

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
  padding?: number;
};

export function Card({
  children,
  style,
  onPress,
  elevated = true,
  padding = 16,
}: CardProps) {
  const { colors } = useAppTheme();

  const baseStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    padding,
    ...(elevated
      ? Platform.select({
          web: {
            boxShadow: `0 1px 2px ${colors.shadow}, 0 8px 24px -4px ${colors.shadow}`,
          },
          default: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 3,
          },
        })
      : {}),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ hovered, pressed }) => [
          baseStyle,
          hovered && Platform.OS === "web" && { opacity: 0.96 },
          pressed && { opacity: 0.92, transform: [{ scale: 0.995 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[baseStyle, style]}>{children}</View>;
}
