import { Pressable } from "react-native";
import { Text as ThemedText } from "react-native";
import { styles } from "../../styles/components/ui/Button.style";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
