import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Modal, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodBottomBar } from "./components/FoodBottomBar";
import { FoodHeader } from "./components/FoodHeader";
import { FoodHistorySection } from "./components/FoodHistorySection";
import { FoodManualForm } from "./components/FoodManualForm";
import { FoodNoResults } from "./components/FoodNoResults";
import { FoodSearchBar } from "./components/FoodSearchBar";
import { FoodSearchResultsList } from "./components/FoodSearchResultsList";
import { FoodSelectedFoodsList } from "./components/FoodSelectedFoodsList";
import { styles } from "./FoodScreen.styles";
import type { FilteredFood, FoodEntry, SelectedFood } from "./FoodScreenTypes";
import { loadFoodState, setTodayFoodItems, type FoodHistoryItem, type FoodItemLog } from "@/utils/foodStorage";

const foodData: FoodEntry[] = require("../../app/food.json");

const safeFoodData: FoodEntry[] = Array.isArray(foodData)
  ? foodData.filter(
      (it): it is FoodEntry =>
        !!it &&
        typeof (it as any).name === "string" &&
        typeof (it as any).unit === "string" &&
        typeof (it as any).calories === "number",
    )
  : [];

export default function FoodScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const historyYRef = useRef(0);

  const [query, setQuery] = useState("");
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [selectedById, setSelectedById] = useState<Record<string, SelectedFood>>({});
  const [history, setHistory] = useState<FoodHistoryItem[]>([]);

  const searchResults = useMemo<FilteredFood[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return safeFoodData
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => item.name.toLowerCase().startsWith(q))
      .slice(0, 12);
  }, [query]);

  const selectedFoods = useMemo<SelectedFood[]>(
    () =>
      Object.values(selectedById)
        .filter((x) => x.qty > 0)
        .sort((a, b) => a.item.name.localeCompare(b.item.name)),
    [selectedById],
  );

  const totalKcal = useMemo(
    () => selectedFoods.reduce((sum, x) => sum + x.item.calories * x.qty, 0),
    [selectedFoods],
  );

  useEffect(() => {
    (async () => {
      const state = await loadFoodState();
      const restored: Record<string, SelectedFood> = {};
      for (const item of state.currentItems) {
        restored[item.id] = {
          id: item.id,
          item: {
            name: item.name,
            unit: item.unit,
            calories: item.calories,
            category: "saved",
          },
          qty: item.qty,
        };
      }
      setSelectedById(restored);
      setHistory(state.history);
    })();
  }, []);

  useEffect(() => {
    const persist = async () => {
      const items: FoodItemLog[] = Object.values(selectedById).map((x) => ({
        id: x.id,
        name: x.item.name,
        unit: x.item.unit,
        calories: x.item.calories,
        qty: x.qty,
      }));
      const state = await setTodayFoodItems(items);
      setHistory(state.history);
    };
    persist();
  }, [selectedById]);

  const setQty = (id: string, delta: number) => {
    Keyboard.dismiss();
    setSelectedById((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      const nextQty = Math.max(0, existing.qty + delta);
      if (nextQty === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { ...existing, qty: nextQty } };
    });
  };

  const addFromSearch = (originalIndex: number) => {
    const item = safeFoodData[originalIndex];
    if (!item) return;
    const id = `db-${originalIndex}`;
    setSelectedById((prev) => {
      const existing = prev[id];
      return {
        ...prev,
        [id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { id, item, originalIndex, qty: 1 },
      };
    });
    setQuery("");
    setShowManualForm(false);
  };

  const addManualFood = () => {
    const name = manualName.trim();
    const calories = Number(manualCalories);
    if (!name || !Number.isFinite(calories) || calories <= 0) return;

    const id = `manual-${Date.now()}`;
    const item: FoodEntry = {
      name,
      unit: "1 serving",
      calories: Math.round(calories),
      category: "manual",
    };

    setSelectedById((prev) => ({
      ...prev,
      [id]: { id, item, qty: 1 },
    }));

    setManualName("");
    setManualCalories("");
    setShowManualForm(false);
    setQuery("");
    Keyboard.dismiss();
  };

  const hasSearch = query.trim().length > 0;
  const showNoResults = hasSearch && searchResults.length === 0 && !showManualForm;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#2A1569", "#4B1FA8", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />

      <View style={styles.container}>
        <FoodHeader onBackPress={() => router.back()} onInfoPress={() => setIsInfoVisible(true)} />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.screenContent}
        >
          <FoodSearchBar
            query={query}
            setQuery={(v) => {
              setQuery(v);
              if (showManualForm) setShowManualForm(false);
            }}
            searchInputRef={searchInputRef}
          />

          {hasSearch && searchResults.length > 0 && (
            <FoodSearchResultsList results={searchResults} onAdd={addFromSearch} />
          )}

          {showNoResults && (
            <FoodNoResults onAddManually={() => setShowManualForm(true)} />
          )}

          {showManualForm && (
            <FoodManualForm
              name={manualName}
              calories={manualCalories}
              onChangeName={setManualName}
              onChangeCalories={setManualCalories}
              onAdd={addManualFood}
            />
          )}

          <AppText size={22} weight="semibold" color="#F9FAFB" style={styles.todayTitle}>
            Today&apos;s Foods
          </AppText>

          {selectedFoods.length === 0 ? (
            <AppText size={14} color="rgba(229,231,235,0.8)" style={styles.placeholderText}>
              No foods added yet. Search and tap Add.
            </AppText>
          ) : (
            <FoodSelectedFoodsList
              selectedFoods={selectedFoods}
              onInc={(id) => setQty(id, 1)}
              onDec={(id) => setQty(id, -1)}
            />
          )}

          <FoodHistorySection
            history={history}
            onLayoutY={(y: number) => {
              historyYRef.current = y;
            }}
          />
        </ScrollView>

        <FoodBottomBar
          totalKcal={totalKcal}
          onAddFoodPress={() => {
            setQuery("");
            setShowManualForm(false);
            searchInputRef.current?.focus();
          }}
        >
          <TouchableOpacity
            style={styles.historyButton}
            activeOpacity={0.8}
            onPress={() => {
              scrollRef.current?.scrollTo({ y: historyYRef.current, animated: true });
            }}
          >
            <AppText size={13} weight="semibold" color="#F9FAFB">
              History - daily food tracking
            </AppText>
          </TouchableOpacity>
        </FoodBottomBar>
      </View>

      <Modal
        visible={isInfoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText size={22} weight="bold" color="#F9FAFB">
              Food Tracker Info
            </AppText>
            <AppText size={15} color="#E5E7EB" style={styles.modalBody}>
              Enter the foods you have eaten.{"\n"}
              The app will calculate how many calories you consumed during the day.{"\n"}
              Search your eaten foods and add them from the results list.{"\n"}
              If a product is not found in search, use Add manually and enter its calories yourself.
            </AppText>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setIsInfoVisible(false)}
              activeOpacity={0.85}
            >
              <AppText size={16} weight="bold" color="#F9FAFB">
                Close
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
