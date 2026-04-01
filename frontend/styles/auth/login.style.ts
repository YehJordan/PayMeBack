import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333333",
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#6D8291",
        marginTop: 8,
        textAlign: "center",
    },
    formContainer: {
        gap: 16,
    },
    buttonContainer: {
        marginTop: 24,
        gap: 12,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },
    dividerText: {
        marginHorizontal: 12,
        color: "#6D8291",
        fontSize: 14,
        fontWeight: "600",
    },
});
