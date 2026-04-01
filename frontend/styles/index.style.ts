import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    headerRightContainer: {
        marginRight: 15,
        position: "relative",
        zIndex: 999, // Ensure modal renders over header
    },
    profileButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#E3EEF4",
        borderWidth: 1,
        borderColor: "#D1E0E8",
    },
    avatar: {
        width: "100%",
        height: "100%",
    },
    placeholderAvatar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c4c4c4",
    },
    placeholderText: {
        fontSize: 16,
        color: "#ffffff",
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1A2F3E",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6C7A89",
        marginBottom: 48,
        textAlign: "center",
    },
    buttonContainer: {
        width: "100%",
        gap: 16,
        maxWidth: 300,
    },
});
