import { AppText } from "@/components/AppText";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearDailyResults } from "@/store/slices/dailyResultsSlice";
import { clearFoodTracking } from "@/store/slices/foodSlice";
import { clearProfile } from "@/store/slices/profileSlice";
import { clearSession } from "@/store/slices/stepSessionSlice";
import { clearWaterTracking } from "@/store/slices/waterSlice";
import { persistor } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

export function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile);
  const [showConfirm, setShowConfirm] = useState(false);

  const clearAllData = async () => {
    dispatch(clearProfile());
    dispatch(clearDailyResults());
    dispatch(clearFoodTracking());
    dispatch(clearWaterTracking());
    dispatch(clearSession(undefined as any));
    await persistor.purge();
    await AsyncStorage.multiRemove([
      "persist:root",
      "water-tracking",
      "food-tracking",
      "health_app_user_profile_v1",
      "step_tracker_active_session_v1",
    ]);
    setShowConfirm(false);
    router.replace("/confirm");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ alignSelf: "stretch" }} edges={["bottom"]}>
        <View style={{ marginHorizontal: 24, marginTop: 24 }}>
          <AppText size={30} weight="bold" color="#0F172A">
            Profile
          </AppText>
          <View style={{ marginTop: 20, gap: 10 }}>
            <AppText size={16} color="#0F172A">
              Name: {profile?.name ?? "-"}
            </AppText>
            <AppText size={16} color="#0F172A">
              Height: {profile?.heightCm ?? "-"} cm
            </AppText>
            <AppText size={16} color="#0F172A">
              Weight: {profile?.weightKg ?? "-"} kg
            </AppText>
            <AppText size={16} color="#0F172A">
              Age: {profile?.age ?? "-"}
            </AppText>
            <AppText size={16} color="#0F172A">
              Gender: {profile?.gender ?? "-"}
            </AppText>
            <AppText size={16} color="#0F172A">
              Activity: {profile?.activityLevel ?? "-"}
            </AppText>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 40,
              backgroundColor: "#DC2626",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
            onPress={() => setShowConfirm(true)}
            activeOpacity={0.85}
          >
            <AppText size={16} weight="bold" color="#fff">
              Clear profile
            </AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(2,6,23,0.7)",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              borderRadius: 16,
              backgroundColor: "white",
              padding: 16,
            }}
          >
            <AppText size={20} weight="bold" color="#0F172A">
              Are you sure?
            </AppText>
            <AppText size={14} color="#334155" style={{ marginTop: 8, lineHeight: 20 }}>
              Are you sure you want to clear profile? All saved data and tracking history
              will be deleted.
            </AppText>
            <View style={{ marginTop: 16, flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => setShowConfirm(false)}
              >
                <AppText size={15} weight="semibold" color="#0F172A">
                  No
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: "#DC2626",
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={() => void clearAllData()}
              >
                <AppText size={15} weight="bold" color="#fff">
                  Yes
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
