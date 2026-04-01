import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TextInput, Button } from "react-native";
import { supabase } from "../../lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>

      <Text style={{ textAlign: "center", marginVertical: 10 }}>OR</Text>

      <View style={styles.verticallySpaced}>
        <Button
          title="Sign in with Google"
          disabled={loading}
          onPress={() => signInWithGoogle()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
});
