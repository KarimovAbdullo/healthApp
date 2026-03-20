import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Keyboard, Modal, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodBottomBar } from "./components/FoodBottomBar";
import { FoodHeader } from "./components/FoodHeader";
import { FoodManualForm } from "./components/FoodManualForm";
import { FoodNoResults } from "./components/FoodNoResults";
import { FoodSearchBar } from "./components/FoodSearchBar";
import { FoodSearchResultsList } from "./components/FoodSearchResultsList";
import { FoodSelectedFoodsList } from "./components/FoodSelectedFoodsList";
import { styles } from "./FoodScreen.styles";
import type { FilteredFood, FoodEntry, SelectedFood } from "./FoodScreenTypes";

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

  const [query, setQuery] = useState("");
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [selectedById, setSelectedById] = useState<Record<string, SelectedFood>>({});

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

        <FoodBottomBar
          totalKcal={totalKcal}
          onAddFoodPress={() => {
            setQuery("");
            setShowManualForm(false);
            searchInputRef.current?.focus();
          }}
        />
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
              Enter the foods you have eaten.
              {"\n"}
              The app will calculate how many calories you consumed during the day.
              {"\n"}
              Search your eaten foods and add them from the results list.
              {"\n"}
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

/*
import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodBottomBar } from "./components/FoodBottomBar";
import { FoodHeader } from "./components/FoodHeader";
import { FoodManualForm } from "./components/FoodManualForm";
import { FoodNoResults } from "./components/FoodNoResults";
import { FoodSearchBar } from "./components/FoodSearchBar";
import { FoodSearchResultsList } from "./components/FoodSearchResultsList";
import { FoodSelectedFoodsList } from "./components/FoodSelectedFoodsList";
import { styles } from "./FoodScreen.styles";
import type { FilteredFood, FoodEntry, SelectedFood } from "./FoodScreenTypes";

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

  const [query, setQuery] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [selectedById, setSelectedById] = useState<Record<string, SelectedFood>>({});

  const searchResults = useMemo<FilteredFood[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return safeFoodData
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => item.name.toLowerCase().startsWith(q))
      .slice(0, 12);
  }, [query]);

  const selectedFoods = useMemo(
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
        <FoodHeader onBackPress={() => router.back()} />

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

        <FoodBottomBar
          totalKcal={totalKcal}
          onAddFoodPress={() => {
            setQuery("");
            setShowManualForm(false);
            searchInputRef.current?.focus();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodBottomBar } from "./components/FoodBottomBar";
import { FoodHeader } from "./components/FoodHeader";
import { FoodSearchBar } from "./components/FoodSearchBar";
import { FoodSearchResultsList } from "./components/FoodSearchResultsList";
import { FoodSelectedFoodsList } from "./components/FoodSelectedFoodsList";
import { styles } from "./FoodScreen.styles";
import type { FilteredFood, FoodEntry, SelectedFood } from "./FoodScreenTypes";

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

  const [query, setQuery] = useState("");
  const [qtyByIndex, setQtyByIndex] = useState<Record<number, number>>({});

  const searchInputRef = useRef<TextInput>(null);

  // Search list: show prefix matches.
  const searchResults = useMemo<FilteredFood[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return safeFoodData
      .map((it, originalIndex) => ({ item: it, originalIndex }))
      .filter(({ item }) => item.name.toLowerCase().startsWith(q))
      .slice(0, 12);
  }, [query]);

  // Today's foods: only selected foods.
  const selectedFoods = useMemo<SelectedFood[]>(() => {
    return Object.entries(qtyByIndex)
      .map(([idxStr, qty]) => {
        const originalIndex = Number(idxStr);
        const item = safeFoodData[originalIndex];
        if (!item) return null;
        return { item, originalIndex, qty };
      })
      .filter((x): x is SelectedFood => !!x)
      .filter((x) => x.qty > 0)
      .sort((a, b) => a.originalIndex - b.originalIndex);
  }, [qtyByIndex]);

  const totalKcal = useMemo(() => {
    let sum = 0;
    for (const [idxStr, qty] of Object.entries(qtyByIndex)) {
      const idx = Number(idxStr);
      const item = safeFoodData[idx];
      if (!item) continue;
      sum += item.calories * qty;
    }
    return sum;
  }, [qtyByIndex]);

  const setQty = (index: number, delta: number) => {
    Keyboard.dismiss();
    setQtyByIndex((prev) => {
      const current = prev[index] ?? 0;
      const next = Math.max(0, current + delta);

      if (next === 0) {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      }

      return { ...prev, [index]: next };
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#2A1569", "#4B1FA8", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />

      <View style={styles.container}>
        <FoodHeader onBackPress={() => router.back()} />

        <FoodSearchBar
          query={query}
          setQuery={setQuery}
          searchInputRef={searchInputRef}
        />

        {query.trim().length > 0 && (
          <FoodSearchResultsList
            results={searchResults}
            onAdd={(originalIndex) => {
              setQty(originalIndex, 1);
              setQuery("");
            }}
          />
        )}

        <AppText
          size={22}
          weight="semibold"
          color="#F9FAFB"
          style={styles.todayTitle}
        >
          Today&apos;s Foods
        </AppText>

        {selectedFoods.length === 0 ? (
          <AppText
            size={14}
            color="rgba(229,231,235,0.8)"
            style={styles.placeholderText}
          >
            No foods added yet. Search and tap Add.
          </AppText>
        ) : (
          <FoodSelectedFoodsList
            selectedFoods={selectedFoods}
            onInc={(originalIndex) => setQty(originalIndex, 1)}
            onDec={(originalIndex) => setQty(originalIndex, -1)}
          />
        )}

        <FoodBottomBar
          totalKcal={totalKcal}
          onAddFoodPress={() => {
            setQuery("");
            searchInputRef.current?.focus();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

/*
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

  const [query, setQuery] = useState("");
  const [qtyByIndex, setQtyByIndex] = useState<Record<number, number>>({});

  const searchInputRef = useRef<TextInput>(null);

  // Search list: always show matching items (prefix match).
  const searchResults = useMemo<FilteredFood[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return safeFoodData
      .map((it, originalIndex) => ({ item: it, originalIndex }))
      .filter(({ item }) => item.name.toLowerCase().startsWith(q))
      .slice(0, 12);
  }, [query]);

  // Today's foods: only items added via +/- buttons.
  const selectedFoods = useMemo<SelectedFood[]>(() => {
    return Object.entries(qtyByIndex)
      .map(([idxStr, qty]) => {
        const originalIndex = Number(idxStr);
        const item = safeFoodData[originalIndex];
        if (!item) return null;
        return { item, originalIndex, qty };
      })
      .filter((x): x is SelectedFood => !!x)
      .filter((x) => x.qty > 0)
      .sort((a, b) => a.originalIndex - b.originalIndex);
  }, [qtyByIndex]);

  const totalKcal = useMemo(() => {
    let sum = 0;
    for (const [idxStr, qty] of Object.entries(qtyByIndex)) {
      const idx = Number(idxStr);
      const item = safeFoodData[idx];
      if (!item) continue;
      sum += item.calories * qty;
    }
    return sum;
  }, [qtyByIndex]);

  const setQty = (index: number, delta: number) => {
    Keyboard.dismiss();
    setQtyByIndex((prev) => {
      const current = prev[index] ?? 0;
      const next = Math.max(0, current + delta);

      if (next === 0) {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      }

      return { ...prev, [index]: next };
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#2A1569", "#4B1FA8", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />

      <View style={styles.container}>
        <FoodHeader onBackPress={() => router.back()} />

        <FoodSearchBar
          query={query}
          setQuery={setQuery}
          searchInputRef={searchInputRef}
        />

        {query.trim().length > 0 && (
          <FoodSearchResultsList
            results={searchResults}
            onAdd={(originalIndex) => {
              setQty(originalIndex, 1);
              setQuery("");
            }}
          />
        )}

        <AppText
          size={22}
          weight="semibold"
          color="#F9FAFB"
          style={{ marginTop: 18 }}
        >
          Today&apos;s Foods
        </AppText>

        {selectedFoods.length === 0 ? (
          <AppText
            size={14}
            color="rgba(229,231,235,0.8)"
            style={{ marginTop: 12 }}
          >
            No foods added yet. Search and tap Add.
          </AppText>
        ) : (
          <FoodSelectedFoodsList
            selectedFoods={selectedFoods}
            onInc={(originalIndex) => setQty(originalIndex, 1)}
            onDec={(originalIndex) => setQty(originalIndex, -1)}
          />
        )}

        <FoodBottomBar
          totalKcal={totalKcal}
          onAddFoodPress={() => {
            setQuery("");
            searchInputRef.current?.focus();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type FoodEntry = {
  name: string;
  unit: string;
  calories: number;
  category?: string;
};

const foodData: FoodEntry[] = require("../../app/food.json");
const foodIcon: ImageSourcePropType = require("@/assets/images/food.webp");

const safeFoodData: FoodEntry[] = Array.isArray(foodData)
  ? foodData.filter(
      (it): it is FoodEntry =>
        !!it &&
        typeof (it as any).name === "string" &&
        typeof (it as any).unit === "string" &&
        typeof (it as any).calories === "number",
    )
  : [];

function formatUnit(unit: string) {
  const match = unit.trim().match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
  if (!match) return unit;
  return `${match[1]} ${match[2]}`;
}

type FilteredFood = {
  item: FoodEntry;
  originalIndex: number;
};

type SelectedFood = {
  item: FoodEntry;
  originalIndex: number;
  qty: number;
};

export default function FoodScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [qtyByIndex, setQtyByIndex] = useState<Record<number, number>>({});

  const searchInputRef = useRef<TextInput>(null);

  const searchResults = useMemo<FilteredFood[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return safeFoodData
      .map((it, originalIndex) => ({ item: it, originalIndex }))
      .filter(({ item }) => item.name.toLowerCase().startsWith(q))
      .slice(0, 12);
  }, [query]);

  const selectedFoods = useMemo<SelectedFood[]>(() => {
    return Object.entries(qtyByIndex)
      .map(([idxStr, qty]) => {
        const originalIndex = Number(idxStr);
        const item = safeFoodData[originalIndex];
        if (!item) return null;
        return { item, originalIndex, qty };
      })
      .filter((x): x is SelectedFood => !!x)
      .filter((x) => x.qty > 0)
      .sort((a, b) => a.originalIndex - b.originalIndex);
  }, [qtyByIndex]);

  const totalKcal = useMemo(() => {
    let sum = 0;
    for (const [idxStr, qty] of Object.entries(qtyByIndex)) {
      const idx = Number(idxStr);
      const item = safeFoodData[idx];
      if (!item) continue;
      sum += item.calories * qty;
    }
    return sum;
  }, [qtyByIndex]);

  const setQty = (index: number, delta: number) => {
    Keyboard.dismiss();
    setQtyByIndex((prev) => {
      const current = prev[index] ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      }
      return { ...prev, [index]: next };
    });
  };

  const renderSearchResult = ({ item, originalIndex }: FilteredFood) => {
    const subtitle = `${item.calories} kcal / ${formatUnit(item.unit)}`;

    return (
      <View style={styles.rowCard}>
        <View style={styles.rowLeft}>
          <Image
            source={foodIcon}
            style={styles.foodImg}
            resizeMode="contain"
          />
          <View style={styles.rowTextCol}>
            <AppText size={18} weight="semibold" color="#F9FAFB">
              {item.name}
            </AppText>
            <AppText size={13} color="rgba(229,231,235,0.9)">
              {subtitle}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.addMiniBtn}
          onPress={() => {
            setQty(originalIndex, 1);
            setQuery("");
          }}
        >
          <AppText size={14} weight="bold" color="#F9FAFB">
            Add
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedFood = ({ item, originalIndex, qty }: SelectedFood) => {
    const subtitle = `${item.calories} kcal / ${formatUnit(item.unit)}`;
    const itemTotal = item.calories * qty;

    return (
      <View style={styles.rowCard}>
        <View style={styles.rowLeft}>
          <Image
            source={foodIcon}
            style={styles.foodImg}
            resizeMode="contain"
          />
          <View style={styles.rowTextCol}>
            <AppText size={18} weight="semibold" color="#F9FAFB">
              {item.name}
            </AppText>
            <AppText size={13} color="rgba(229,231,235,0.9)">
              {subtitle}
            </AppText>
          </View>
        </View>

        <View style={styles.selectedRightCol}>
          <AppText
            size={14}
            weight="semibold"
            color="#F9FAFB"
            style={{ marginBottom: 8 }}
          >
            {itemTotal.toFixed(0)} kcal
          </AppText>

          <View style={styles.stepper}>
            <TouchableOpacity
              onPress={() => setQty(originalIndex, -1)}
              activeOpacity={0.75}
              style={styles.stepBtn}
            >
              <AppText size={18} weight="bold" color="#E5E7EB">
                −
              </AppText>
            </TouchableOpacity>

            <View style={styles.stepBox}>
              <AppText size={15} weight="semibold" color="#0F172A">
                {qty}x {item.unit}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => setQty(originalIndex, 1)}
              activeOpacity={0.75}
              style={styles.stepBtn}
            >
              <AppText size={18} weight="bold" color="#F9FAFB">
                +
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#2A1569", "#4B1FA8", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <AppText size={20} weight="bold" color="#F9FAFB">
                ←
              </AppText>
            </TouchableOpacity>

            <AppText size={28} weight="bold" color="#F9FAFB">
              Food Tracker
            </AppText>

            <View style={styles.headerRight}>
              <View style={styles.notifCircle}>
                <MaterialIcons name="notifications" size={18} color="#F9FAFB" />
              </View>
            </View>
          </View>

          <View style={styles.searchRow}>
            <MaterialIcons
              name="search"
              size={20}
              color="rgba(229,231,235,0.9)"
            />
            <TextInput
              ref={searchInputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="avocado"
              placeholderTextColor="rgba(229,231,235,0.6)"
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="never"
            />
            {query.trim().length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                activeOpacity={0.7}
                hitSlop={8}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color="rgba(229,231,235,0.9)"
                />
              </TouchableOpacity>
            )}
          </View>

          {query.trim().length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(it) => String(it.originalIndex)}
              renderItem={({ item }) => renderSearchResult(item)}
              style={{ marginTop: 10 }}
              contentContainerStyle={{ paddingBottom: 140, gap: 12 }}
              showsVerticalScrollIndicator={false}
            />
          )}

          <AppText
            size={22}
            weight="semibold"
            color="#F9FAFB"
            style={{ marginTop: 18 }}
          >
            Today&apos;s Foods
          </AppText>

          {selectedFoods.length === 0 ? (
            <AppText
              size={14}
              color="rgba(229,231,235,0.8)"
              style={{ marginTop: 12 }}
            >
              No foods added yet. Search and tap Add.
            </AppText>
          ) : (
            <FlatList
              data={selectedFoods}
              keyExtractor={(it) => String(it.originalIndex)}
              renderItem={({ item }) => renderSelectedFood(item)}
              style={{ marginTop: 14 }}
              contentContainerStyle={{ paddingBottom: 120, gap: 14 }}
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.bottomArea}>
            <AppText size={34} weight="bold" color="#F9FAFB">
              {totalKcal.toFixed(0)} kcal
            </AppText>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addBtn}
              onPress={() => {
                setQuery("");
                searchInputRef.current?.focus();
              }}
            >
              <AppText size={18} weight="semibold" color="#F9FAFB">
                Add Food
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  notifCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  searchInput: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 16,
    paddingVertical: 0,
  },

  rowCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    paddingRight: 10,
  },

  foodImg: {
    width: 42,
    height: 42,
  },

  rowTextCol: {
    flex: 1,
  },

  kcalPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBox: {
    minWidth: 84,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedRightCol: {
    alignItems: "flex-end",
    paddingLeft: 10,
  },

  addMiniBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomArea: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    alignItems: "center",
    gap: 12,
  },
  addBtn: {
    width: "70%",
    height: 46,
    borderRadius: 18,
    backgroundColor: "rgba(124, 58, 237, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});
*/
