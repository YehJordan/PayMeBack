import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Dispatch, SetStateAction } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  memberEmail: string;
  setMemberEmail: Dispatch<SetStateAction<string>>;
  submitting: boolean;
};

export default function AddMemberModal({
  visible,
  onClose,
  onSave,
  memberEmail,
  setMemberEmail,
  submitting,
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
            Add Member
          </Text>

          <Text style={{ marginBottom: 8, color: "#6B7280" }}>
            Member Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 12,
              marginBottom: 24,
            }}
            placeholder="friend@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={memberEmail}
            onChangeText={setMemberEmail}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => {
                onClose();
                setMemberEmail("");
              }}
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
                <Text style={{ fontWeight: "600", color: "#fff" }}>Add</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
