import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type AppFabProps = {
  onPress: () => void;
};

export function AppFloatButton({ onPress }: AppFabProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <ThemedText style={styles.label}>+ Create Group</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    minWidth: 170,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0A7EA4',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: '#064A61',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
    overflow: 'hidden',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
