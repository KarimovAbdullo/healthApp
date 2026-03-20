import { AppText } from "@/components/AppText";
import { Image, TouchableOpacity, View } from "react-native";

import BackIcon2 from "@/assets/icons/BackIcon2";
import { styles } from "../FoodScreen.styles";

export function FoodHeader({
  onBackPress,
  onInfoPress,
}: {
  onBackPress: () => void;
  onInfoPress: () => void;
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

      <AppText size={28} weight="bold" color="#F9FAFB">
        Food Tracker
      </AppText>

      <TouchableOpacity style={styles.headerRight} onPress={onInfoPress} activeOpacity={0.8}>
        <Image
          source={require("../../../assets/images/info.webp")}
          style={styles.infoIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
