import { AppText } from "@/components/AppText";
import { addTodayWaterLiters, loadWaterState, setTodayWaterLiters, type WaterHistoryItem } from "@/utils/waterStorage";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, ImageSourcePropType, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const glassImg: ImageSourcePropType = require("@/assets/images/stakan.png");

type GlassOption = {
  id: string;
  label: string;
  liters: number;
};

const GLASS_OPTIONS: GlassOption[] = [
  { id: "100", label: "100 ml", liters: 0.1 },
  { id: "250", label: "250 ml", liters: 0.25 },
  { id: "500", label: "0.5 L", liters: 0.5 },
  { id: "1000", label: "1 L", liters: 1 },
];

export default function WaterScreen() {
  const router = useRouter();
  const [todayLiters, setTodayLiters] = useState(0);
  const [history, setHistory] = useState<WaterHistoryItem[]>([]);

  const [totalSelected, setTotalSelected] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const load = async () => {
      const state = await loadWaterState();
      setTodayLiters(state.currentLiters);
      setHistory(state.history);
    };
    load();
  }, []);

  useEffect(() => {
    if (totalSelected <= 0) return;
    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalSelected, scaleAnim]);

  const handleSelect = (amount: number) => {
    setTotalSelected((prev) => Number((prev + amount).toFixed(2)));
  };

  const handleClear = () => setTotalSelected(0);

  const handleConfirm = async () => {
    if (totalSelected <= 0) return;
    const state = await addTodayWaterLiters(totalSelected);
    setTodayLiters(state.currentLiters);
    setHistory(state.history);
    setTotalSelected(0);
    router.back();
  };

  const handleHistoryScroll = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const renderHistoryItem = (item: WaterHistoryItem) => {
    const date = moment(item.date, "YYYY-MM-DD");
    return (
      <View key={item.date} style={styles.historyCard}>
        <AppText size={12} weight="semibold" color="#E5E7EB">
          {date.format("ddd")}
        </AppText>
        <AppText size={11} color="#9CA3AF">
          {date.format("DD/MM/YYYY")}
        </AppText>
        <AppText size={14} weight="bold" color="#38BDF8" style={{ marginTop: 4 }}>
          {item.liters.toFixed(1)} L
        </AppText>
      </View>
    );
  };

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
            Log Water
          </AppText>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row}>
            {GLASS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.glassOption}
                onPress={() => handleSelect(opt.liters)}
                activeOpacity={0.8}
              >
                <Image source={glassImg} style={styles.glassImage} />
                <AppText size={14} weight="medium" color="#E5E7EB" style={{ marginTop: 4 }}>
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <AppText size={14} weight="semibold" color="#9CA3AF" style={{ marginTop: 16, textAlign: "center" }}>
            Tap a glass to add water
          </AppText>

          <Animated.View style={{ marginTop: 24, alignItems: "center", transform: [{ scale: scaleAnim }] }}>
            <AppText size={54} weight="bold" color="#22C55E">
              +{totalSelected.toFixed(1)} L
            </AppText>
          </Animated.View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.addButton, totalSelected === 0 && { opacity: 0.4 }]}
            onPress={handleConfirm}
            disabled={totalSelected === 0}
          >
            <AppText weight="bold" color="#0F172A">
              Add Water
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear} activeOpacity={0.8}>
            <AppText size={13} weight="medium" color="#E5E7EB">
              Clear
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyButton} activeOpacity={0.8} onPress={handleHistoryScroll}>
            <AppText size={13} weight="semibold" color="#0F172A">
              History – daily water tracking
            </AppText>
          </TouchableOpacity>

          <View style={styles.historySection}>
            <AppText size={12} weight="semibold" color="#9CA3AF" style={{ marginBottom: 8 }}>
              Today: {todayLiters.toFixed(1)} L
            </AppText>

            <AppText size={12} weight="semibold" color="#9CA3AF" style={{ marginBottom: 8 }}>
              Previous days
            </AppText>

            {history.length === 0 ? (
              <AppText size={12} color="#6B7280">
                No history yet.
              </AppText>
            ) : (
              history.slice().reverse().map(renderHistoryItem)
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  header: { alignItems: "center", marginBottom: 12 },
  backButton: { position: "absolute", left: 0, top: 0, paddingVertical: 4, paddingHorizontal: 4 },
  scrollContent: { paddingBottom: 32 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  glassOption: { alignItems: "center", flex: 1 },
  glassImage: { width: 48, height: 72 },
  addButton: {
    width: "100%",
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  clearButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
    alignSelf: "center",
  },
  historyButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#FACC15",
    alignSelf: "center",
  },
  historySection: { marginTop: 20, width: "100%" },
  historyCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    marginBottom: 8,
  },
});

