import { AppText } from "@/components/AppText";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import LogWaterButton from "../LogWaterButton/LogWaterButton";

type Props = {
  breakfast: number;
  current: number;
  totalCalories: number;
  style?: ViewStyle;
  onLogPress?: () => void;
};

const dishImg: ImageSourcePropType = require("@/assets/images/dish.png");
const doneImg: ImageSourcePropType = require("@/assets/images/done2.png");
const foodBgImg: ImageSourcePropType = require("@/assets/images/fots1.png");

const FoodTracker = ({
  breakfast: _breakfast,
  current,
  totalCalories,
  style,
  onLogPress,
}: Props) => {
  const safeTotal = totalCalories > 0 ? totalCalories : 1;
  const filledProgress = Math.min(1, current / safeTotal);
  const isDone = current >= totalCalories && totalCalories > 0;

  const neonStyle = useAnimatedStyle(() => ({
    borderColor: "rgba(167, 139, 250, 1)",
  }));

  return (
    <Animated.View style={[styles.wrapper, neonStyle, style]}>
      <LinearGradient
        colors={["#18122B", "#3B1C72", "#5B21B6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Image source={foodBgImg} style={styles.bgOverlay} contentFit="cover" />

        <View style={styles.row}>
          <View style={styles.dishWrapper}>
            <Image source={dishImg} style={styles.dish} contentFit="contain" />
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.headerRow}>
              <AppText size={14} weight="semibold" color="#F9FAFB">
                Daily Food Tracker
              </AppText>
            </View>

            <View style={styles.valueRow}>
              {isDone ? (
                <View style={styles.doneRow}>
                  <AppText size={16} weight="semibold" color="#22C55E">
                    Done
                  </AppText>
                  <Image
                    source={doneImg}
                    style={styles.doneIcon}
                    contentFit="contain"
                  />
                </View>
              ) : (
                <AppText size={16} weight="light" color="#9CA3AF">
                  {current} / {totalCalories} kcal
                </AppText>
              )}
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFillNeon,
                      {
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${filledProgress * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.rightSection}>
            <LogWaterButton onPress={onLogPress} text="Log Food" />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default FoodTracker;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1.5,
    marginHorizontal: 20,
    marginTop: 16,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 22,
    position: "relative",
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: 520,
    height: 100,
    opacity: 0.05,
  },
  headerRow: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightColumn: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doneIcon: {
    width: 18,
    height: 18,
  },
  progressCard: {
    marginTop: 4,
    borderRadius: 16,
    // paddingVertical: 6,
    paddingHorizontal: 8,
    overflow: "hidden",
    // backgroundColor: "rgba(255,255,255,0.08)",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  progressTrack: {
    position: "relative",
    flex: 1,
    height: 7,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFillNeon: {
    borderRadius: 999,
    backgroundColor: "#39FF14",
  },
  dishWrapper: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  dish: {
    width: 50,
    height: 80,
  },
  rightSection: {
    paddingLeft: 10,
    justifyContent: "center",
  },
});
