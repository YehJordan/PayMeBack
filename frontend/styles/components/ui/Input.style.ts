import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";

export const styles = StyleSheet.create({
    wrapper: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        letterSpacing: 0.5,
        fontFamily: Fonts.rounded,
        textTransform: "uppercase",
        opacity: 0.75,
    },
    input: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#BCD9E9",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 16,
        minHeight: 48,
        color: "#173041",
        fontFamily: Fonts.sans,
    },
    multiline: {
        minHeight: 96,
    },
    focused: {
        borderColor: "#0A7EA4",
        shadowColor: "#0A7EA4",
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
});
