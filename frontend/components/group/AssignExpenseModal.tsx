import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  assignDescription: string;
  setAssignDescription: Dispatch<SetStateAction<string>>;
  assignAmount: string;
  setAssignAmount: Dispatch<SetStateAction<string>>;
  assignCategory: string;
  setAssignCategory: Dispatch<SetStateAction<string>>;
  assignPayer: string;
  setAssignPayer: Dispatch<SetStateAction<string>>;
  selectedMembers: Record<string, boolean>;
  toggleMemberSelection: (id: string) => void;
  submitting: boolean;
  categories: string[];
  members: any[];
};

export default function AssignExpenseModal({
  visible,
  onClose,
  onSave,
  assignDescription,
  setAssignDescription,
  assignAmount,
  setAssignAmount,
  assignCategory,
  setAssignCategory,
  assignPayer,
  setAssignPayer,
  selectedMembers,
  toggleMemberSelection,
  submitting,
  categories,
  members,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{ backgroundColor: "#fff", padding: 24, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
            Update Expense
          </Text>

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>Description</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="E.g. Electricity Bill"
            value={assignDescription}
            onChangeText={setAssignDescription}
          />

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>Amount</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
            placeholder="0.00"
            keyboardType="numeric"
            value={assignAmount}
            onChangeText={setAssignAmount}
          />

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16, flexGrow: 0, maxHeight: 40 }}
          >
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setAssignCategory(cat)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor:
                    assignCategory === cat ? "#0A7EA4" : "#F3F4F6",
                  marginRight: 8,
                  height: 32,
                }}
              >
                <Text
                  style={{ color: assignCategory === cat ? "#fff" : "#4B5563" }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>Paid By</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16, flexGrow: 0, maxHeight: 40 }}
          >
            {members.map((m: any) => (
              <Pressable
                key={`payer-${m.id}`}
                onPress={() => setAssignPayer(m.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: assignPayer === m.id ? "#0A7EA4" : "#F3F4F6",
                  marginRight: 8,
                  height: 32,
                }}
              >
                <Text
                  style={{ color: assignPayer === m.id ? "#fff" : "#4B5563" }}
                >
                  {m.name || m.email}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>
            Split Between
          </Text>
          <ScrollView style={{ maxHeight: 200, marginBottom: 24 }}>
            {members.map((m: any) => {
              const isSelected = !!selectedMembers[m.id];
              return (
                <Pressable
                  key={m.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                  }}
                  onPress={() => toggleMemberSelection(m.id)}
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={24}
                    color={isSelected ? "#0A7EA4" : "#9CA3AF"}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ fontSize: 16, color: "#1F2937", flex: 1 }}>
                    {m.name || m.email}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={{ fontWeight: "600", color: "#4B5563" }}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: "#0A7EA4",
                borderRadius: 8,
                alignItems: "center",
                opacity: submitting ? 0.7 : 1,
              }}
              onPress={onSave}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontWeight: "600", color: "#fff" }}>
                  Save Splits
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
