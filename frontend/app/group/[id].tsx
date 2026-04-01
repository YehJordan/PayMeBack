import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

import { styles } from "../../styles/group/details.style";
import AddExpenseModal from "../../components/group/AddExpenseModal";
import AssignExpenseModal from "../../components/group/AssignExpenseModal";
import AddMemberModal from "../../components/group/AddMemberModal";
import ChartsModal from "../../components/group/ChartsModal";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type TabType = "expenses" | "members" | "balances";

export default function GroupDetailsScreen() {
  // Force Metro re-parse
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("expenses");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Other");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<
    Record<string, boolean>
  >({});
  const [assignCategory, setAssignCategory] = useState("Other");
  const [assignPayer, setAssignPayer] = useState<string>("");
  const [assignAmount, setAssignAmount] = useState("");
  const [assignDescription, setAssignDescription] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Add member state
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [submittingMember, setSubmittingMember] = useState(false);

  // Current user info for checking permissions
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState(0);

  const EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Healthcare",
    "Other",
  ];

  const fetchGroupData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      const headers = { Authorization: `Bearer ${session.access_token}` };

      // Fetch group details
      const groupRes = await fetch(`${API_URL}/groups/${id}`, { headers });
      if (groupRes.ok) {
        setGroup(await groupRes.json());
      }

      // Fetch expenses
      const expensesRes = await fetch(`${API_URL}/groups/${id}/expenses`, {
        headers,
      });
      if (expensesRes.ok) {
        setExpenses(await expensesRes.json());
      }

      // Fetch members
      const membersRes = await fetch(`${API_URL}/groups/${id}/members`, {
        headers,
      });
      if (membersRes.ok) {
        setMembers(await membersRes.json());
      }

      // Fetch balances
      const balancesRes = await fetch(`${API_URL}/groups/${id}/balances`, {
        headers,
      });
      if (balancesRes.ok) {
        setBalances(await balancesRes.json());
      }
    } catch (error) {
      console.error("Failed to fecth group data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupData();
  };

  const handleAddExpense = async () => {
    if (
      !expenseAmount ||
      isNaN(Number(expenseAmount)) ||
      Number(expenseAmount) <= 0
    ) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    setSubmittingExpense(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${API_URL}/groups/${id}/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(expenseAmount),
          description: expenseDesc,
          category: expenseCategory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }

      setModalVisible(false);
      setExpenseAmount("");
      setExpenseDesc("");
      setExpenseCategory("Other");
      fetchGroupData(); // Refresh data to reflect the new expense and updated budget
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add expense. Try again.");
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleExpenseClick = (exp: any) => {
    setSelectedExpense(exp);
    const initialSelection: Record<string, boolean> = {};
    if (exp.splits && exp.splits.length > 0) {
      exp.splits.forEach((split: any) => {
        initialSelection[split.user_id] = true;
      });
    } else {
      initialSelection[exp.creator_id] = true;
    }
    setSelectedMembers(initialSelection);
    setAssignCategory(exp.category || "Other");
    setAssignPayer(exp.creator_id);
    setAssignAmount(exp.amount ? String(exp.amount) : "");
    setAssignDescription(exp.description || "");
    setAssignModalVisible(true);
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleAssignExpense = async () => {
    if (!selectedExpense) return;

    if (
      !assignAmount ||
      isNaN(Number(assignAmount)) ||
      Number(assignAmount) <= 0
    ) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    setSubmittingAssign(true);

    const selectedIds = Object.keys(selectedMembers).filter(
      (id) => selectedMembers[id],
    );
    if (selectedIds.length === 0) {
      Alert.alert("Error", "Please select at least one member.");
      setSubmittingAssign(false);
      return;
    }

    const splitAmount = Number(assignAmount) / selectedIds.length;
    const splits = selectedIds.map((userId) => ({
      userId,
      amount: splitAmount,
    }));

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${API_URL}/groups/${id}/expenses/${selectedExpense.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            splits,
            category: assignCategory,
            payerId: assignPayer,
            amount: Number(assignAmount),
            description: assignDescription,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to assign expense");
      }

      setAssignModalVisible(false);
      fetchGroupData();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not assign expense. Try again.");
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail || !memberEmail.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setSubmittingMember(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${API_URL}/groups/${id}/members`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: memberEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add member");
      }

      setAddMemberModalVisible(false);
      setMemberEmail("");
      fetchGroupData();
      Alert.alert("Success", "Member added successfully");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Could not add member. Try again.");
    } finally {
      setSubmittingMember(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${memberName} from this group? This will also remove all their expenses and contributions.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (!session) return;

              const res = await fetch(
                `${API_URL}/groups/${id}/members/${memberId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${session.access_token}`,
                  },
                },
              );

              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to remove member");
              }

              fetchGroupData();
              Alert.alert("Success", "Member removed successfully");
            } catch (error: any) {
              console.error(error);
              Alert.alert(
                "Error",
                error.message || "Could not remove member. Try again.",
              );
            }
          },
        },
      ],
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
      </View>
    );
  }

  // Chart Data Calculations
  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const cat = exp.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(exp.amount);
    });

    return Object.keys(categoryTotals).map((cat, index) => ({
      name: cat,
      amount: categoryTotals[cat],
      color: [
        "#f87171",
        "#34d399",
        "#60a5fa",
        "#fbbf24",
        "#a78bfa",
        "#a3e635",
        "#f472b6",
      ][index % 7],
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    }));
  };

  const getMemberData = () => {
    const memberTotals: Record<string, number> = {};
    expenses.forEach((exp: any) => {
      const member = exp.creator_name || "Unknown";
      memberTotals[member] = (memberTotals[member] || 0) + Number(exp.amount);
    });

    return Object.keys(memberTotals).map((member, index) => ({
      name: member,
      amount: memberTotals[member],
      color: [
        "#60a5fa",
        "#f87171",
        "#a3e635",
        "#fbbf24",
        "#34d399",
        "#f472b6",
        "#a78bfa",
      ][index % 7],
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    }));
  };

  if (!group && !loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Group not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#0A7EA4" }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Budget calculations
  const totalBudget = Number(group?.budget) || 0;
  const currentExpenses = Number(group?.total_expenses) || 0;
  const remainingBudget = Math.max(totalBudget - currentExpenses, 0);
  const remainingPercentage =
    totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

  const renderTabContent = () => {
    if (activeTab === "expenses") {
      return expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses yet.</Text>
      ) : (
        expenses.map((exp: any) => {
          const initials = exp.creator_name
            ? exp.creator_name.substring(0, 2).toUpperCase()
            : "U";
          return (
            <Pressable
              key={exp.id}
              style={styles.expenseItem}
              onPress={() => handleExpenseClick(exp)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDesc}>
                  {exp.description || exp.category || "Expense"}
                </Text>
                <Text style={styles.expensePayer}>
                  Paid by {exp.creator_name}
                </Text>
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>
                  ${Number(exp.amount).toFixed(2)}
                </Text>
                <Text style={styles.expenseDate}>
                  {exp.date ? new Date(exp.date).toLocaleDateString() : "N/A"}
                </Text>
              </View>
            </Pressable>
          );
        })
      );
    }

    if (activeTab === "members") {
      const isCurrentUserOwner =
        group?.creator_id === currentUserId ||
        (members.length > 0 &&
          members[0].id === currentUserId &&
          !group?.creator_id);

      return members.length === 0 ? (
        <Text style={styles.emptyText}>No members.</Text>
      ) : (
        members.map((m: any) => {
          const initials = m.name ? m.name.substring(0, 2).toUpperCase() : "U";
          return (
            <View key={m.id} style={styles.expenseItem}>
              <View style={[styles.avatar, { backgroundColor: "#E1E1E1" }]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.expenseInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text style={styles.expenseDesc}>{m.name || m.email}</Text>
                  {m.is_owner && (
                    <View
                      style={{
                        backgroundColor: "#E0F2FE",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#0A7EA4",
                          fontWeight: "600",
                        }}
                      >
                        OWNER
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.expensePayer}>{m.email}</Text>
              </View>

              {/* Show trash icon if current user is owner OR current user is looking at themselves, AND target is not owner */}
              {(isCurrentUserOwner || m.id === currentUserId) &&
                !m.is_owner && (
                  <Pressable
                    onPress={() => handleRemoveMember(m.id, m.name || m.email)}
                    style={{ padding: 8, justifyContent: "center" }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                )}
            </View>
          );
        })
      );
    }

    if (activeTab === "balances") {
      return balances.length === 0 ? (
        <Text style={styles.emptyText}>No balance data.</Text>
      ) : (
        balances.map((b: any) => {
          const balanceNum = Number(b.balance);
          return (
            <View key={b.userId} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDesc}>{b.name}</Text>
              </View>
              <View style={styles.expenseRight}>
                <Text
                  style={[
                    styles.expenseAmount,
                    { color: balanceNum >= 0 ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {balanceNum >= 0
                    ? `Gets $${balanceNum.toFixed(2)}`
                    : `Owes $${Math.abs(balanceNum).toFixed(2)}`}
                </Text>
              </View>
            </View>
          );
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ title: group?.name || "Group", headerBackVisible: true }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Budget Overview */}
        <Pressable
          style={styles.budgetCard}
          onPress={() => setChartModalVisible(true)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.sectionTitle}>Remaining Budget</Text>
            <Ionicons name="pie-chart" size={20} color="#0A7EA4" />
          </View>
          <View
            style={[
              styles.budgetRow,
              { justifyContent: "space-between", alignItems: "flex-end" },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text style={styles.spentText}>
                ${remainingBudget.toFixed(2)}
              </Text>
              <Text style={styles.totalText}> / ${totalBudget.toFixed(2)}</Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: remainingPercentage <= 20 ? "#EF4444" : "#10B981",
              }}
            >
              {remainingPercentage.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${remainingPercentage}%`,
                  backgroundColor:
                    remainingPercentage <= 20 ? "#EF4444" : "#10B981",
                },
              ]}
            />
          </View>
        </Pressable>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Add Expense</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnSecondary]}
            onPress={() => setAddMemberModalVisible(true)}
          >
            <Ionicons name="person-add-outline" size={20} color="#0A7EA4" />
            <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>
              Add Member
            </Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(["expenses", "members", "balances"] as TabType[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.listContainer}>{renderTabContent()}</View>
      </ScrollView>

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddExpense}
        expenseDesc={expenseDesc}
        setExpenseDesc={setExpenseDesc}
        expenseAmount={expenseAmount}
        setExpenseAmount={setExpenseAmount}
        expenseCategory={expenseCategory}
        setExpenseCategory={setExpenseCategory}
        submitting={submittingExpense}
        categories={EXPENSE_CATEGORIES}
      />

      <AssignExpenseModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        onSave={handleAssignExpense}
        assignDescription={assignDescription}
        setAssignDescription={setAssignDescription}
        assignAmount={assignAmount}
        setAssignAmount={setAssignAmount}
        assignCategory={assignCategory}
        setAssignCategory={setAssignCategory}
        assignPayer={assignPayer}
        setAssignPayer={setAssignPayer}
        selectedMembers={selectedMembers}
        toggleMemberSelection={toggleMemberSelection}
        submitting={submittingAssign}
        categories={EXPENSE_CATEGORIES}
        members={members}
      />

      <AddMemberModal
        visible={addMemberModalVisible}
        onClose={() => setAddMemberModalVisible(false)}
        onSave={handleAddMember}
        memberEmail={memberEmail}
        setMemberEmail={setMemberEmail}
        submitting={submittingMember}
      />

      <ChartsModal
        visible={chartModalVisible}
        onClose={() => setChartModalVisible(false)}
        activeChartIndex={activeChartIndex}
        setActiveChartIndex={setActiveChartIndex}
        getCategoryData={getCategoryData}
        getMemberData={getMemberData}
        hasExpenses={expenses.length > 0}
      />
    </SafeAreaView>
  );
}
