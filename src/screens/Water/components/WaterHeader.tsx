import { AppText } from "@/components/AppText";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import BackIcon2 from "@/assets/icons/BackIcon2";
import { styles } from "../WaterScreen.styles";

export function WaterHeader({ onBackPress }: { onBackPress: () => void }) {
  const { t } = useTranslation();
  const onInfoPress = () => {
    console.log("info pressed");
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <BackIcon2 size={34} />
      </TouchableOpacity>

      <View style={styles.headerTitleWrap}>
        <AppText variant="title" weight="bold" color="#F9FAFB">
          {t("water.logWater")}
        </AppText>
      </View>

      <TouchableOpacity
        style={styles.headerRight}
        onPress={onInfoPress}
        activeOpacity={0.8}
      >
        <Image
          source={require("../../../assets/images/info.webp")}
          style={styles.infoIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
