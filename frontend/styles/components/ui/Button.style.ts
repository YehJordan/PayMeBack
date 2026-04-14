import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";

export const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#0A7EA4",
  },
  secondary: {
    backgroundColor: "#E3EEF4",
  },
  pressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.92,
  },
  text: {
    fontSize: 15,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#1A2F3E",
  },
});
