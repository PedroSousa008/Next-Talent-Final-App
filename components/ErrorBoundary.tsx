import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (Platform.OS === "web" && typeof console !== "undefined") {
      console.error(error, info.componentStack);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 14, color: "#333" },
});
