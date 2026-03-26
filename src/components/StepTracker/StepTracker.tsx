import { AppText } from "@/components/AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  currentSteps: number;
  goalSteps: number;
  onPress?: () => void;
};

export default function StepTracker({
  currentSteps,
  goalSteps,
  onPress,
}: Props) {
  const safeGoal = goalSteps > 0 ? goalSteps : 1;
  const progress = Math.min(1, currentSteps / safeGoal);
  const percent = Math.round(progress * 100);

  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#1A0B3A", "#3B1C72", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <Image
              source={require("@/assets/images/oyoq.png")}
              style={styles.icon}
            />
            <View>
              <AppText size={17} weight="semibold" color="#F9FAFB">
                Step Tracker
              </AppText>
              <AppText size={12} color="rgba(229,231,235,0.85)">
                Monitor your daily step count
              </AppText>
            </View>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={22}
            color="rgba(255,255,255,0.8)"
          />
        </View>

        <View style={styles.innerCard}>
          <View style={styles.valuesRow}>
            <AppText size={14} weight="bold" color="#F9FAFB">
              {currentSteps.toLocaleString()} Steps Today
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("@/assets/images/kras.png")}
                style={styles.icons}
              />
              <AppText size={12} color="#DDD6FE">
                Goal: {goalSteps.toLocaleString()} steps
              </AppText>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress * 100}%` }]} />
            </View>
            <AppText size={14} weight="bold" color="#84CC16">
              {percent}%
            </AppText>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.6)",
  },
  gradient: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(96,165,250,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCard: {
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.35)",
    backgroundColor: "rgba(124,58,237,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  valuesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  progressRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.24)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#84CC16",
  },
  icon: {
    width: 58,
    height: 58,
  },
  icons: {
    width: 20,
    height: 18,
    marginRight: 5,
  },
});
