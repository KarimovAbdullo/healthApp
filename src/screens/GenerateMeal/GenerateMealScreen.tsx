import BackIcon2 from "@/assets/icons/BackIcon2";
import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GenerateMealScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#0F172A", "#1E1B4B", "#312E81"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <BackIcon2 />
          </TouchableOpacity>
          <AppText size={20} weight="bold" color="#F9FAFB" style={styles.headerTitle}>
            Generate Meal
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <AppText size={15} color="#CBD5E1" style={styles.sub}>
          Your personalized daily meal plan will appear here.
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  bg: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: { width: 44, height: 44 },
  headerTitle: { flex: 1, textAlign: "center" },
  sub: {
    marginTop: 24,
    textAlign: "center",
    lineHeight: 22,
  },
});
