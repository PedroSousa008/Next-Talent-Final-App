import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { theme, ThemeColors, ColorScheme } from "@/constants/theme";

type ThemeContextValue = {
  colors: ThemeColors;
  resolvedScheme: ColorScheme;
  toggleScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [manual, setManual] = useState<ColorScheme | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const resolvedScheme: ColorScheme = useMemo(() => {
    if (manual) return manual;
    if (!hydrated) {
      return "light";
    }
    return system === "dark" ? "dark" : "light";
  }, [manual, system, hydrated]);

  const colors = theme[resolvedScheme];

  const toggleScheme = useCallback(() => {
    setManual((prev) => {
      const base = prev ?? (system === "dark" ? "dark" : "light");
      return base === "dark" ? "light" : "dark";
    });
  }, [system]);

  const value = useMemo(
    () => ({
      colors,
      resolvedScheme,
      toggleScheme,
    }),
    [colors, resolvedScheme, toggleScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return ctx;
}
