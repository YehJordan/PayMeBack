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

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  expenseDesc: string;
  setExpenseDesc: Dispatch<SetStateAction<string>>;
  expenseAmount: string;
  setExpenseAmount: Dispatch<SetStateAction<string>>;
  expenseCategory: string;
  setExpenseCategory: Dispatch<SetStateAction<string>>;
  submitting: boolean;
  categories: string[];
};

export default function AddExpenseModal({
  visible,
  onClose,
  onSave,
  expenseDesc,
  setExpenseDesc,
  expenseAmount,
  setExpenseAmount,
  expenseCategory,
  setExpenseCategory,
  submitting,
  categories,
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
            Add Expense
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
            value={expenseDesc}
            onChangeText={setExpenseDesc}
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
            value={expenseAmount}
            onChangeText={setExpenseAmount}
          />

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
          >
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setExpenseCategory(cat)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor:
                    expenseCategory === cat ? "#0A7EA4" : "#F3F4F6",
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: expenseCategory === cat ? "#fff" : "#4B5563",
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
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
                <Text style={{ fontWeight: "600", color: "#fff" }}>Save</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
