import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { makeRedirectUri } from "expo-auth-session";
import { styles } from "../../styles/auth/login.style";
import { AppInput } from "../../components/ui/Input";
import { AppButton } from "../../components/ui/Button";

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Parse the Supabase session from the OAuth redirect URL
  const createSessionFromUrl = async (url: string) => {
    try {
      const { params, errorCode } = QueryParams.getQueryParams(url);
      if (errorCode) throw new Error(errorCode);

      const { access_token, refresh_token } = params;
      if (!access_token) return;

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) throw error;
      return data.session;
    } catch (error: any) {
      Alert.alert("OAuth Error", error.message);
    }
  };

  async function signInWithGoogle() {
    setLoading(true);
    try {
      // Use makeRedirectUri from expo-auth-session as standard for Expo Auth Flows
      const redirectUri = makeRedirectUri();

      console.log("\n\n--- SUPABASE REDIRECT URL ---");
      console.log(
        "Add this exact URL to your Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs:",
      );
      console.log(redirectUri);
      console.log("-----------------------------\n\n");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri,
        );

        if (result.type === "success") {
          await createSessionFromUrl(result.url);
        }
      }
    } catch (e: any) {
      Alert.alert("Google Sign-in Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <AppInput
              label="Email"
              onChangeText={setEmail}
              value={email}
              placeholder="email@address.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonContainer}>
            <AppButton
              label={loading ? "Loading..." : "Sign in"}
              onPress={signInWithEmail}
            />
            <AppButton
              label="Create an account"
              variant="secondary"
              onPress={signUpWithEmail}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            label="Sign in with Google"
            variant="secondary"
            onPress={signInWithGoogle}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
