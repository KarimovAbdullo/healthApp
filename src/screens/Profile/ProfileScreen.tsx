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
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
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

  const Item = ({ title, onPress, danger }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <AppText style={[styles.itemText, danger && styles.itemDanger]}>
        {title}
      </AppText>
      <AppText>›</AppText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView>
          <View style={styles.header}>
            <AppText style={styles.headerTitle}>
              {profile?.name || "User"}
            </AppText>
            <AppText style={styles.headerSubtitle}>
              {profile?.age} yrs • {profile?.weightKg} kg
            </AppText>
          </View>

          <View style={styles.content}>
            <AppText style={styles.sectionTitle}>Profile Info</AppText>

            <View style={styles.card}>
              <AppText color="black">Name: {profile?.name}</AppText>
              <AppText color="black">Height: {profile?.heightCm} cm</AppText>
              <AppText color="black">Weight: {profile?.weightKg} kg</AppText>
              <AppText color="black">Gender: {profile?.gender}</AppText>
            </View>

            <AppText style={[styles.sectionTitle, { marginTop: 24 }]}>
              Settings
            </AppText>

            <Item title="🌐 Change Language" onPress={() => {}} />
            <Item title="💬 Contact Support" onPress={() => {}} />
            <Item title="🚫 Remove Ads (advertising)" onPress={() => {}} />

            <Item
              title="🗑 Clear Profile"
              danger
              onPress={() => setShowConfirm(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>Confirm</AppText>

            <AppText style={styles.modalText}>
              All data will be deleted.
            </AppText>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={() => setShowConfirm(false)}
              >
                <AppText style={styles.btnText}>Cancel</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={clearAllData}
              >
                <AppText style={[styles.btnText, styles.btnTextWhite]}>
                  Delete
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
