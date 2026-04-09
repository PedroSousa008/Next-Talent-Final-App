import React from "react";
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from "react-native";

/**
 * App logo — replace the image file (keep the same filename):
 *   assets/logo.png
 *
 * Prefer PNG or WebP (square or horizontal); e.g. 512×512 @1x.
 * `resizeMode="contain"` keeps aspect ratio inside the box.
 */
const LOGO = require("@/assets/logo.png");

type Props = {
  /** Outer box size (px). Logo scales inside with contain. */
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function BrandLogo({ size = 36, style }: Props) {
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Image
        source={LOGO}
        accessibilityLabel="Next Talent logo"
        resizeMode="contain"
        style={[{ width: size, height: size }, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
});
