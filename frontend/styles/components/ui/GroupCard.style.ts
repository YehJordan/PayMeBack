import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";

export const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 18,
        backgroundColor: "#F5FBFF",
        borderWidth: 1,
        borderColor: "#D4EAF6",
        shadowColor: "#0A3047",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3,
        gap: 10,
        fontFamily: Fonts.rounded,
    },
});
