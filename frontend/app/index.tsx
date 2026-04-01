import { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter, Stack } from "expo-router";
import { AppButton } from "../components/ui/Button";
import { styles } from "../styles/index.style";

export default function Index() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    }
    getUser();
  }, []);

  const handleProfilePress = () => {
    Alert.alert("Account", "Would you like to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Home",
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={handleProfilePress}
              >
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.placeholderAvatar}>
                    <Text style={styles.placeholderText}>?</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PayMeBack!</Text>
        <Text style={styles.subtitle}>Manage your shared expenses easily</Text>

        <View style={styles.buttonContainer}>
          <AppButton
            label="View Groups"
            onPress={() => router.push("/groups")}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
