import { AppText } from "@/components/AppText";
import {
  addTodayWaterLiters,
  loadWaterState,
  type WaterHistoryItem,
} from "@/utils/waterStorage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WaterActionButtons } from "./components/WaterActionButtons";
import { WaterGlassPicker, type GlassOption } from "./components/WaterGlassPicker";
import { WaterHeader } from "./components/WaterHeader";
import { WaterHistorySection } from "./components/WaterHistorySection";
import { WaterSelectedAmount } from "./components/WaterSelectedAmount";
import { styles } from "./WaterScreen.styles";

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

  return (
    <SafeAreaView style={styles.safe}>
      <SafeAreaView style={{ flex: 1 }}>
        <WaterHeader onBackPress={() => router.back()} />

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <WaterGlassPicker options={GLASS_OPTIONS} onSelect={handleSelect} />

          <AppText
            size={14}
            weight="semibold"
            color="#9CA3AF"
            style={styles.tapText}
          >
            Tap a glass to add water
          </AppText>

          <WaterSelectedAmount
            scaleAnim={scaleAnim}
            totalSelected={totalSelected}
          />

          <WaterActionButtons
            totalSelected={totalSelected}
            onConfirm={handleConfirm}
            onClear={handleClear}
          />

          <WaterHistorySection
            todayLiters={todayLiters}
            history={history}
            onHistoryScroll={handleHistoryScroll}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

