import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onPress?: () => void;
};

const STAR_POSITIONS: {
  top: `${number}%`;
  left: `${number}%`;
  s: number;
  o: number;
}[] = [
  { top: "8%", left: "12%", s: 2, o: 0.45 },
  { top: "18%", left: "78%", s: 3, o: 0.55 },
  { top: "42%", left: "6%", s: 2, o: 0.35 },
  { top: "28%", left: "88%", s: 2, o: 0.5 },
  { top: "62%", left: "14%", s: 2, o: 0.4 },
  { top: "72%", left: "82%", s: 3, o: 0.5 },
  { top: "12%", left: "48%", s: 2, o: 0.3 },
  { top: "55%", left: "92%", s: 2, o: 0.4 },
  { top: "85%", left: "22%", s: 2, o: 0.45 },
  { top: "35%", left: "38%", s: 1.5, o: 0.25 },
];

export function GenerateMealCard({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.wrap}
      activeOpacity={0.92}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#12081F", "#1B1033", "#0F172A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {STAR_POSITIONS.map((star, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: star.top,
                left: star.left,
                width: star.s,
                height: star.s,
                borderRadius: star.s / 2,
                opacity: star.o,
              },
            ]}
          />
        ))}

        <Image
          source={require("@/assets/images/dish.png")}
          style={[styles.deco, styles.decoLeftTop]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/food.webp")}
          style={[styles.deco, styles.decoLeftMid]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/stakan.png")}
          style={[styles.deco, styles.decoRightTop]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/botll.png")}
          style={[styles.deco, styles.decoRightMid]}
          resizeMode="contain"
        />
        <Image
          source={require("@/assets/images/dis.png")}
          style={[styles.deco, styles.decoRightBottom]}
          resizeMode="contain"
        />

        <View style={styles.centerCol} pointerEvents="none">
          <AppText
            size={18}
            weight="bold"
            color="#F9FAFB"
            style={styles.title}
          >
            Generate Daily Meal Plan
          </AppText>
          <AppText size={12} color="rgba(226,232,240,0.88)" style={styles.desc}>
            Get a personalized daily meal plan tailored just for you based on
            your dietary needs.
          </AppText>
        </View>

        <View style={styles.btnOuter}>
          <LinearGradient
            colors={["#7C3AED", "#A855F7", "#C026D3"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btn}
          >
            <AppText size={15} weight="bold" color="#FFFFFF">
              Generate Plan
            </AppText>
          </LinearGradient>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.45)",
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 200,
    position: "relative",
  },
  star: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  deco: {
    position: "absolute",
    opacity: 0.92,
  },
  decoLeftTop: {
    width: 56,
    height: 56,
    top: 8,
    left: 4,
  },
  decoLeftMid: {
    width: 48,
    height: 48,
    bottom: 52,
    left: 0,
  },
  decoRightTop: {
    width: 44,
    height: 52,
    top: 6,
    right: 8,
  },
  decoRightMid: {
    width: 40,
    height: 72,
    top: 48,
    right: 4,
  },
  decoRightBottom: {
    width: 42,
    height: 42,
    bottom: 56,
    right: 12,
  },
  centerCol: {
    alignItems: "center",
    paddingHorizontal: 48,
    marginBottom: 14,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    textAlign: "center",
    lineHeight: 18,
  },
  btnOuter: {
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
