import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, StyleSheet, View } from "react-native";

type ProgressBarProps = {
  progressAnim: Animated.Value;
  currentMeters: number;
  goalMeters: number;
  percent: number;
};

export function ProgressBar({
  progressAnim,
  currentMeters,
  goalMeters,
  percent,
}: ProgressBarProps) {
  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <AppText size={16} weight="semibold" color="#E5E7EB">
          Bugungi progress
        </AppText>
        <AppText size={18} weight="bold" color="#FACC15">
          {percent}%
        </AppText>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fillWrap, { width: widthInterpolate }]}>
          <LinearGradient
            colors={["#FFF700", "#FFD600", "#FFEA00"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fill}
          />
        </Animated.View>
        <Animated.View style={[styles.glow, { width: widthInterpolate }]} />
      </View>

      <View style={styles.valuesRow}>
        <AppText size={30} weight="bold" color="#FACC15">
          {Math.round(currentMeters)} m
        </AppText>
        <AppText size={30} weight="semibold" color="#94A3B8">
          {goalMeters.toLocaleString()} m
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15,23,42,0.55)",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    marginTop: 10,
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "black",
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  fillWrap: {
    height: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#FFF700",
    opacity: 0.75,
    shadowColor: "#FFF700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  valuesRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
