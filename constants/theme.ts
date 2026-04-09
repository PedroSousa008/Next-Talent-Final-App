import { Platform } from "react-native";

export type ColorScheme = "light" | "dark";

export const theme = {
  light: {
    bg: "#F4F5F7",
    bgElevated: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#ECEEF2",
    border: "rgba(15, 23, 42, 0.08)",
    borderStrong: "rgba(15, 23, 42, 0.12)",
    text: "#0B0F14",
    textSecondary: "rgba(11, 15, 20, 0.62)",
    textMuted: "rgba(11, 15, 20, 0.42)",
    accent: "#0E7C3A",
    accentMuted: "rgba(14, 124, 58, 0.12)",
    accentSecondary: "#2563EB",
    danger: "#DC2626",
    warning: "#D97706",
    shadow: "rgba(15, 23, 42, 0.08)",
    overlay: "rgba(255, 255, 255, 0.72)",
    star: "#F59E0B",
    challenges: "linear" as const,
  },
  dark: {
    bg: "#0B0F14",
    bgElevated: "#11161D",
    surface: "#141A22",
    surfaceMuted: "#1C2430",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    text: "#F4F5F7",
    textSecondary: "rgba(244, 245, 247, 0.72)",
    textMuted: "rgba(244, 245, 247, 0.48)",
    accent: "#22C55E",
    accentMuted: "rgba(34, 197, 94, 0.14)",
    accentSecondary: "#60A5FA",
    danger: "#F87171",
    warning: "#FBBF24",
    shadow: "rgba(0, 0, 0, 0.45)",
    overlay: "rgba(11, 15, 20, 0.72)",
    star: "#FBBF24",
    challenges: "linear" as const,
  },
} as const;

export type ThemeColors = (typeof theme)["light"];

export const fontStack =
  Platform.select({
    ios: "System",
    android: "sans-serif",
    default:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  }) ?? "System";

export const layout = {
  maxWidth: 1180,
  gutter: 20,
  radiusSm: 10,
  radiusMd: 14,
  radiusLg: 20,
  headerHeight: 56,
};

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};
