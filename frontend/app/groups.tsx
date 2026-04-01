import { useState, useCallback, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import { Fonts } from "@/constants/theme";
import { AppButton } from "@/components/ui/Button";
import { AppCard } from "@/components/ui/GroupCard";
import { AppFloatButton } from "@/components/ui/FloatActionButton";
import { AppInput } from "@/components/ui/Input";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import { styles } from "../styles/groups.style";

// Use the API URL from .env or fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function GroupsScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const fetchGroups = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_URL}/groups`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(
          `Failed to fetch groups: ${response.status} ${response.statusText} - ${errText}`,
        );
      }

      const data = await response.json();
      setGroups(data);
    } catch (error: any) {
      console.error("fetchGroups error:", error.message || error);
      Alert.alert(
        "Error",
        `Could not load groups: ${error.message || "Unknown error"}`,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups();
  }, [fetchGroups]);

  const onCreateGroup = async () => {
    const parsedBudget = Number(budget);

    if (!groupName.trim()) {
      Alert.alert("Group name required", "Please give your group a name.");
      return;
    }

    if (
      budget.trim() !== "" &&
      (!Number.isFinite(parsedBudget) || parsedBudget < 0)
    ) {
      Alert.alert(
        "Invalid budget",
        "Please enter a valid non-negative number.",
      );
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert("Error", "You must be logged in to create a group.");
        return;
      }

      const response = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: groupName.trim(),
          description: description.trim(),
          budget: parsedBudget,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group");
      }

      Alert.alert("Success", `"${groupName.trim()}" has been created!`);
      setGroupName("");
      setDescription("");
      setBudget("");
      setIsModalVisible(false);

      // Refresh the group list
      setLoading(true);
      fetchGroups();
    } catch (error: any) {
      console.error("Create group error:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0A7EA4"
          />
        }
      >
        <Text style={styles.eyebrow}>PayMeBack</Text>
        <Text style={styles.title}>Group List Overview</Text>

        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color="#0A7EA4"
            style={{ marginTop: 40 }}
          />
        ) : groups.length === 0 ? (
          <Text style={styles.emptyText}>
            No groups yet. Create one to get started!
          </Text>
        ) : (
          groups.map((group) => (
            <Pressable
              key={group.id}
              onPress={() =>
                router.push({
                  pathname: "/group/[id]",
                  params: { id: group.id },
                })
              }
            >
              <AppCard style={styles.groupCard}>
                <Text style={styles.cardTitle}>{group.name}</Text>
                {group.description ? (
                  <Text style={styles.cardBody}>{group.description}</Text>
                ) : null}
                <View style={styles.tagRow}>
                  <View style={[styles.tag, styles.tagPrimary]}>
                    <Text style={styles.tagTextPrimary}>
                      Budget: ${(group.budget || 0).toString()}
                    </Text>
                  </View>
                  <View style={[styles.tag, styles.tagNeutral]}>
                    <Text style={styles.tagTextNeutral}>Shared</Text>
                  </View>
                </View>
              </AppCard>
            </Pressable>
          ))
        )}
      </ScrollView>

      <View style={styles.fabWrap}>
        <AppFloatButton onPress={() => setIsModalVisible(true)} />
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsModalVisible(false)}
          >
            <Pressable style={styles.modalPanel} onPress={() => {}}>
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>New group</Text>
                <AppInput
                  label="Group name"
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Hawaii trip, Bros' Hangout, Tea Party..."
                />
                <AppInput
                  label="Group description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Optional details"
                  multiline
                />
                <AppInput
                  label="Budget ($)"
                  value={budget}
                  onChangeText={setBudget}
                  placeholder="e.g. 1500"
                  keyboardType="decimal-pad"
                />
                <View style={styles.actionRow}>
                  <AppButton
                    label="Cancel"
                    variant="secondary"
                    onPress={() => setIsModalVisible(false)}
                  />
                  <AppButton label="Create group" onPress={onCreateGroup} />
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
