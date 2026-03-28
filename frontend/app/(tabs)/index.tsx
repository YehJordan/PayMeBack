import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { AppButton } from '@/components/ui/Button';
import { AppCard } from '@/components/ui/GroupCard';
import { AppFloatButton } from '@/components/ui/FloatActionButton';
import { AppInput } from '@/components/ui/Input';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const onCreateGroup = () => {
    const parsedBudget = Number(budget);

    if (!groupName.trim()) {
      Alert.alert('Group name required', 'Please give your group a name.');
      return;
    }

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      Alert.alert('Invalid budget', 'Please enter a non-negative number.');
      return;
    }

    Alert.alert('Nice', `"${groupName.trim()}" is ready for backend integration.`);
    setGroupName('');
    setDescription('');
    setBudget('');
    setIsModalVisible(false);
  };

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <ThemedText style={styles.eyebrow}>PayMeBack</ThemedText>
        <ThemedText type="title" style={styles.title}>
          Group List Overview
        </ThemedText>
        <AppCard>
          <ThemedText style={styles.cardTitle}>Preview style</ThemedText>
          <ThemedText style={styles.cardBody}>This is your new custom UI layer. No default look.</ThemedText>
          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.tagPrimary]}>
              <ThemedText style={styles.tagTextPrimary}>Shared</ThemedText>
            </View>
            <View style={[styles.tag, styles.tagNeutral]}>
              <ThemedText style={styles.tagTextNeutral}>Budget-first</ThemedText>
            </View>
          </View>
        </AppCard>
      </View>

      <View style={styles.fabWrap}>
        <AppFloatButton onPress={() => setIsModalVisible(true)} />
      </View>

      <Modal transparent animationType="slide" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsModalVisible(false)}>
            <Pressable style={styles.modalPanel} onPress={() => {}}>
              <ScrollView
                contentContainerStyle={styles.modalContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.modalTitle}>New group</ThemedText>
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
                  <AppButton label="Cancel" variant="secondary" onPress={() => setIsModalVisible(false)} />
                  <AppButton label="Create group" onPress={onCreateGroup} />
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e5eff4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    gap: 12,
  },
  eyebrow: {
    fontFamily: Fonts.rounded,
    letterSpacing: 1,
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#2E6D86',
  },
  title: {
    fontFamily: Fonts.rounded,
    lineHeight: 38,
  },
  subtitle: {
    color: '#345566',
    fontSize: 16,
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
  },
  cardBody: {
    color: '#395C6E',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagPrimary: {
    backgroundColor: '#0A7EA4',
  },
  tagNeutral: {
    backgroundColor: '#daeffd',
  },
  tagTextPrimary: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  tagTextNeutral: {
    color: '#22465A',
    fontSize: 12,
    fontFamily: Fonts.rounded,
  },
  fabWrap: {
    position: 'absolute',
    right: 24,
    bottom: 26,
  },
  modalRoot: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 29, 43, 0.45)',
    justifyContent: 'flex-end',
  },
  modalPanel: {
    backgroundColor: '#F7FCFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#D8EAF4',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 26,
    maxHeight: '82%',
  },
  modalContent: {
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
    color: '#143446',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
});
