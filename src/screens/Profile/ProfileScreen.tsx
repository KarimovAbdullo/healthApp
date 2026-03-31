import { AppText } from "@/components/AppText";
import { useLanguageModal } from "@/contexts/LanguageModalContext";
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
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./ProfileScreen.styles";

export function ProfileScreen() {
  const { t } = useTranslation();
  const { openLanguageModal } = useLanguageModal();
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
              {profile?.name || t("profile.user")}
            </AppText>
            <AppText style={styles.headerSubtitle}>
              {profile?.age} {t("profile.yearsShort")} • {profile?.weightKg} kg
            </AppText>
          </View>

          <View style={styles.content}>
            <AppText style={styles.sectionTitle}>{t("profile.profileInfo")}</AppText>

            <View style={styles.card}>
              <AppText color="black">{t("profile.name")}: {profile?.name}</AppText>
              <AppText color="black">{t("profile.height")}: {profile?.heightCm} cm</AppText>
              <AppText color="black">{t("profile.weight")}: {profile?.weightKg} kg</AppText>
              <AppText color="black">{t("profile.gender")}: {profile?.gender}</AppText>
            </View>

            <AppText style={[styles.sectionTitle, { marginTop: 24 }]}>
              {t("profile.settings")}
            </AppText>

            <Item title={`🌐 ${t("profile.changeLanguage")}`} onPress={openLanguageModal} />
            <Item title={`💬 ${t("profile.contactSupport")}`} onPress={() => {}} />
            <Item title={`🚫 ${t("profile.removeAds")}`} onPress={() => {}} />

            <Item
              title={`🗑 ${t("profile.clearProfile")}`}
              danger
              onPress={() => setShowConfirm(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <AppText style={styles.modalTitle}>{t("profile.confirm")}</AppText>

            <AppText style={styles.modalText}>
              {t("profile.deleteAllData")}
            </AppText>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnOutline]}
                onPress={() => setShowConfirm(false)}
              >
                <AppText style={styles.btnText}>{t("common.cancel")}</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnDanger]}
                onPress={clearAllData}
              >
                <AppText style={[styles.btnText, styles.btnTextWhite]}>
                  {t("profile.delete")}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
