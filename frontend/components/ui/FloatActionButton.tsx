import { Pressable } from "react-native";
import { Text as ThemedText } from "react-native";
import { styles } from "../../styles/components/ui/FloatActionButton.style";

type AppFabProps = {
  onPress: () => void;
};

export function AppFloatButton({ onPress }: AppFabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <ThemedText style={styles.label}>+ Create Group</ThemedText>
    </Pressable>
  );
}
