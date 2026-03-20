import { AppText } from "@/components/AppText";
import StepTracker from "@/components/StepTracker/StepTracker";
import BackIcon2 from "@/assets/icons/BackIcon2";
import { calculateDailyWalk } from "@/utils/bodyMetrics";
import { loadUserProfile, type UserProfile } from "@/utils/userProfileStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function StepTrackerScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await loadUserProfile();
      if (!alive) return;
      setProfile(saved);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const walkData = useMemo(() => {
    if (!profile) return null;
    return calculateDailyWalk({
      weight: profile.weightKg,
      height: profile.heightCm,
      activityLevel: profile.activityLevel,
    });
  }, [profile]);

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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
            <BackIcon2 />
          </TouchableOpacity>
          <AppText size={22} weight="bold" color="#F9FAFB">
            Step Tracker
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <StepTracker
          currentSteps={5340}
          goalSteps={walkData ? walkData.dailyKm * 1300 : 8000}
        />

        <View style={styles.calcCard}>
          <AppText size={18} weight="semibold" color="#F9FAFB">
            Daily Walk Recommendation
          </AppText>

          {!profile || !walkData ? (
            <AppText size={14} color="#CBD5E1" style={styles.calcText}>
              Please complete your profile on Home screen first.
            </AppText>
          ) : (
            <>
              <AppText size={14} color="#E2E8F0" style={styles.calcText}>
                Ideal weight (BMI 22): {walkData.idealWeight.toFixed(1)} kg
              </AppText>
              <AppText size={14} color="#E2E8F0" style={styles.calcText}>
                Extra weight:{" "}
                {walkData.extraWeight > 0 ? `+${walkData.extraWeight.toFixed(1)} kg` : "0.0 kg"}
              </AppText>
              <AppText size={14} color="#E2E8F0" style={styles.calcText}>
                Activity: {profile.activityLevel}
              </AppText>
              <AppText size={20} weight="bold" color="#84CC16" style={styles.resultText}>
                Recommended: {walkData.dailyKm} km/day
              </AppText>
              <AppText size={14} color="#C4B5FD">
                Range: {walkData.recommendedMinKm}-{walkData.recommendedMaxKm} km
              </AppText>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bg: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  placeholder: {
    width: 44,
    height: 44,
  },
  calcCard: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.25)",
    backgroundColor: "rgba(49, 16, 123, 0.45)",
    padding: 14,
  },
  calcText: {
    marginTop: 8,
  },
  resultText: {
    marginTop: 10,
  },
});
