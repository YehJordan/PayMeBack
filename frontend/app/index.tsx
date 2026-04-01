import { Text, View, Button } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Welcome to PayMeBack!
      </Text>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
