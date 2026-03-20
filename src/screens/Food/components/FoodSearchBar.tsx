import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";

export function FoodSearchBar({
  query,
  setQuery,
  searchInputRef,
}: {
  query: string;
  setQuery: (q: string) => void;
  searchInputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <View style={styles.searchRow}>
      <MaterialIcons name="search" size={20} color="rgba(229,231,235,0.9)" />
      <TextInput
        ref={searchInputRef}
        value={query}
        onChangeText={setQuery}
        placeholder="Find products..."
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
          <MaterialIcons name="close" size={20} color="rgba(229,231,235,0.9)" />
        </TouchableOpacity>
      )}
    </View>
  );
}
