import { AppText } from "@/components/AppText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function FoodScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AppText size={18} color="#E5E7EB">
              ←
            </AppText>
          </TouchableOpacity>
          <AppText variant="title" weight="bold" color="#F9FAFB">
            Log Food
          </AppText>
        </View>

        <View style={{ marginTop: 24 }}>
          <AppText size={14} color="#9CA3AF">
            Food logging screen will be implemented next.
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  header: { alignItems: "center", marginBottom: 12 },
  backButton: { position: "absolute", left: 0, top: 0, paddingVertical: 4, paddingHorizontal: 4 },
});

