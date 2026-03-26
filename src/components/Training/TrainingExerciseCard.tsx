import type { TrainingExerciseDef } from "@/constants/trainingExercises";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  exercise: TrainingExerciseDef;
  onPlay: () => void;
};

export function TrainingExerciseCard({ exercise, onPlay }: Props) {
  return (
    <Pressable
      onPress={onPlay}
      style={({ pressed }) => [styles.wrap, pressed && styles.wrapPressed]}
    >
      <LinearGradient
        colors={["rgba(167, 139, 250, 0.95)", "rgba(139, 92, 246, 0.75)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGlow}
      >
        <View style={styles.card}>
          <View style={styles.leftCol}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exercise.badge}</Text>
            </View>
            {/* <LinearGradient
              colors={["rgba(76, 29, 149, 0.9)", "rgba(49, 46, 129, 0.95)"]}
              style={styles.iconBox}
            > */}
            {/* <MaterialCommunityIcons
                name={exercise.iconName}
                size={52}
                color="#e9d5ff"
              /> */}
            <Image
              source={require("@/assets/images/winxez.png")}
              style={styles.icon}
            />
            {/* </LinearGradient> */}
          </View>

          <View style={styles.midCol}>
            <Text style={styles.title}>{exercise.title}</Text>
            <Text style={styles.subtitle}>{exercise.subtitle}</Text>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.playOuter}>
              <LinearGradient
                colors={["#c4b5fd", "#8b5cf6"]}
                style={styles.playRing}
              >
                <View style={styles.playInner}>
                  <MaterialCommunityIcons
                    name="play"
                    size={26}
                    color="#1e1b4b"
                  />
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 22,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  wrapPressed: { opacity: 0.92 },
  borderGlow: {
    borderRadius: 22,
    padding: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(15, 10, 35, 0.92)",
    paddingVertical: 14,
    paddingHorizontal: 12,
    minHeight: 112,
  },
  leftCol: {
    width: 100,
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    left: 0,
    zIndex: 2,
    backgroundColor: "rgba(139, 92, 246, 0.95)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#f5f3ff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  iconBox: {
    width: 84,
    height: 84,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  midCol: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    color: "rgba(203, 213, 225, 0.9)",
    fontSize: 14,
    fontWeight: "600",
  },
  rightCol: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingRight: 4,
  },
  timerBox: {
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.35)",
  },
  timerText: {
    color: "#e9d5ff",
    fontSize: 18,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  playOuter: {},
  playRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  playInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f3ff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 3,
  },
  icon: {
    width: 98,
    height: 98,
  },
});
