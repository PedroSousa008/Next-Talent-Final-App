import { useWindowDimensions } from "react-native";
import { breakpoints } from "@/constants/theme";

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
  };
}
