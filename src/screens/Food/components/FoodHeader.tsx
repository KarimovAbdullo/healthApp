import { TouchableOpacity, View } from "react-native";

import BackIcon2 from "@/assets/icons/BackIcon2";
import { styles } from "../FoodScreen.styles";

export function FoodHeader({
  onBackPress,
  onHistoryPress,
  children,
}: {
  onBackPress: () => void;
  onHistoryPress: () => void;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <BackIcon2 />
      </TouchableOpacity>

      {children}

      <TouchableOpacity
        style={styles.headerRight}
        onPress={onHistoryPress}
        activeOpacity={0.8}
      >
        <View style={styles.historyIconWrap}>
          <View style={styles.historyIconLine} />
          <View style={styles.historyIconLine} />
          <View style={styles.historyIconLine} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
