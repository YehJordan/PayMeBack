import { StyleSheet } from "react-native";
import { Fonts } from "@/constants/theme";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#e5eff4",
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 26,
        paddingBottom: 100, // Leave some space for the FAB
        gap: 12,
    },
    emptyText: {
        textAlign: "center",
        color: "#6D8291",
        marginTop: 40,
        fontSize: 16,
        fontFamily: Fonts.rounded,
    },
    groupCard: {
        marginBottom: 8,
    },
    eyebrow: {
        fontFamily: Fonts.rounded,
        letterSpacing: 1,
        fontSize: 12,
        textTransform: "uppercase",
        color: "#2E6D86",
    },
    title: {
        fontFamily: Fonts.rounded,
        lineHeight: 38,
        fontSize: 32,
        marginBottom: 10,
    },
    subtitle: {
        color: "#345566",
        fontSize: 16,
    },
    cardTitle: {
        fontFamily: Fonts.rounded,
        fontSize: 20,
    },
    cardBody: {
        color: "#395C6E",
    },
    tagRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    tag: {
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    tagPrimary: {
        backgroundColor: "#0A7EA4",
    },
    tagNeutral: {
        backgroundColor: "#daeffd",
    },
    tagTextPrimary: {
        color: "#FFFFFF",
        fontSize: 12,
        fontFamily: Fonts.rounded,
    },
    tagTextNeutral: {
        color: "#22465A",
        fontSize: 12,
        fontFamily: Fonts.rounded,
    },
    fabWrap: {
        position: "absolute",
        right: 24,
        bottom: 26,
    },
    modalRoot: {
        flex: 1,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(5, 29, 43, 0.45)",
        justifyContent: "flex-end",
    },
    modalPanel: {
        backgroundColor: "#F7FCFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderColor: "#D8EAF4",
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 26,
        maxHeight: "82%",
    },
    modalContent: {
        gap: 12,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts.rounded,
        color: "#143446",
    },
    actionRow: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "flex-end",
    },
});
