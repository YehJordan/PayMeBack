import { ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { styles } from "../../styles/components/ui/GroupCard.style";

type AppCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}
