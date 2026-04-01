import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        padding: 16,
    },
    budgetCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
        marginBottom: 8,
    },
    budgetRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 12,
    },
    spentText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
    },
    totalText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#9CA3AF",
        marginLeft: 4,
    },
    progressContainer: {
        height: 8,
        backgroundColor: "#F3F4F6",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 4,
    },
    actionsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A7EA4",
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionBtnSecondary: {
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },
    actionBtnText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    actionBtnTextSecondary: {
        color: "#0A7EA4",
    },
    tabsRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    tabActive: {
        borderBottomColor: "#0A7EA4",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#6B7280",
    },
    tabTextActive: {
        color: "#0A7EA4",
        fontWeight: "600",
    },
    listContainer: {
        paddingBottom: 40,
    },
    emptyText: {
        textAlign: "center",
        color: "#6B7280",
        marginTop: 32,
        fontSize: 14,
    },
    expenseItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#DBEAFE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#1E3A8A",
        fontWeight: "600",
        fontSize: 14,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseDesc: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 2,
    },
    expensePayer: {
        fontSize: 13,
        color: "#6B7280",
    },
    expenseRight: {
        alignItems: "flex-end",
    },
    expenseAmount: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 2,
    },
    expenseDate: {
        fontSize: 12,
        color: "#9CA3AF",
    },
});
