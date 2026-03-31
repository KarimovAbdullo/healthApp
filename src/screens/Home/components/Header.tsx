import HideIcon from "@/assets/icons/hideIcon";
import ShowIcon from "@/assets/icons/showIcon";
import { AppText } from "@/components/AppText";
import { useLanguageModal } from "@/contexts/LanguageModalContext";
import GlassTabBar from "@/components/GlowButton/GlowButton";
import { getBodyCategory } from "@/utils/bodyMetrics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { UserMetrics } from "../HomeScreen";
import Info from "./Info";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.45;

/** Must stay in sync with `styles.heroCard` / `styles.heroContent` vertical padding. */
const HERO_CARD_PADDING_TOP = 40;
const HERO_CARD_PADDING_BOTTOM = 24;
const HERO_CONTENT_PADDING_TOP = Platform.OS === "ios" ? 30 : 0;
const GAP_BELOW_INFO_BUTTON = 10;

function NeonBorderWrapper({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const glow = useSharedValue(0.4);

  useEffect(() => {
    glow.value = withRepeat(
      withSpring(1, { damping: 15, stiffness: 80 }),
      -1,
      true,
    );
  }, [glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      glow.value,
      [0.4, 1],
      ["rgba(148, 163, 253, 0.8)", "rgba(148, 163, 253, 1)"],
    ),
    shadowColor: "rgba(94, 234, 212, 1)",
    shadowOpacity: 0.95,
    shadowRadius: interpolate(glow.value, [0.4, 1], [20, 30]),
    shadowOffset: { width: 0, height: 0 },
  }));

  return (
    <Animated.View
      style={[
        {
          borderRadius: 20,
          borderWidth: 1.5,
          overflow: "hidden",
          ...(Platform.OS === "android" && { elevation: 10 }),
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

type HeaderProps = {
  metrics: UserMetrics | null;
};

const bodyImagesMale = {
  veryThin: require("../../../assets/images/person/very_thin_man.png"),
  normal: require("../../../assets/images/person/normal_man.png"),
  overweight: require("../../../assets/images/person/overweight_man.png"),
  obese: require("../../../assets/images/person/obese_man.png"),
  veryObese: require("../../../assets/images/person/very_obese_man.png"),
};

const bodyImagesFemale = {
  veryThin: require("../../../assets/images/person/very_thin_woman.png"),
  normal: require("../../../assets/images/person/normal_woman.png"),
  overweight: require("../../../assets/images/person/overweight_woman.png"),
  obese: require("../../../assets/images/person/obese_woman.png"),
  veryObese: require("../../../assets/images/person/very_obese_woman.png"),
};
const headerBgImg = require("../../../assets/images/hh.png");

const Header = ({ metrics }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { openLanguageModal } = useLanguageModal();
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const expandAnim = useSharedValue(1);
  const collapsedHeightSV = useSharedValue(220);

  const name = metrics?.name ?? t("home.friend");
  const weight = metrics?.weightKg ?? 110;
  const height = metrics?.heightCm ?? 170;
  const category = getBodyCategory(weight, height);
  const gender = metrics?.gender ?? "male";
  const personImage =
    gender === "female" ? bodyImagesFemale[category] : bodyImagesMale[category];

  const handleToggleInfo = () => {
    const nextExpanded = !isInfoExpanded;
    setIsInfoExpanded(nextExpanded);
    expandAnim.value = withTiming(nextExpanded ? 1 : 0, {
      duration: 300,
    });
  };

  const handleCompactChromeLayout = (e: LayoutChangeEvent) => {
    const chromeH = e.nativeEvent.layout.height;
    collapsedHeightSV.value =
      HERO_CARD_PADDING_TOP +
      HERO_CONTENT_PADDING_TOP +
      chromeH +
      HERO_CARD_PADDING_BOTTOM;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      expandAnim.value,
      [0, 1],
      [collapsedHeightSV.value, HEADER_HEIGHT],
    ),
  }));

  const infoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: expandAnim.value,
    maxHeight: interpolate(expandAnim.value, [0, 1], [0, 400]),
    overflow: "hidden" as const,
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: expandAnim.value,
  }));

  return (
    <Animated.View style={[styles.headerSection, headerAnimatedStyle]}>
      <LinearGradient
        colors={["#1A2B5B", "#2D2B6E", "#4D3E8C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Image
          source={headerBgImg}
          style={
            isInfoExpanded ? styles.headerBgImage : styles.headerBgImageExpanded
          }
          contentFit="cover"
        />

        <Animated.View
          style={[styles.heroImageWrapper, imageAnimatedStyle]}
          pointerEvents="none"
        >
          <Image
            source={personImage}
            style={styles.heroImage}
            contentFit="contain"
          />
        </Animated.View>

        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <View
              collapsable={false}
              onLayout={handleCompactChromeLayout}
            >
              <View style={styles.headerTopRow}>
                <AppText variant="subtitle" weight="medium" color="#E5E7EB">
                  {t("home.welcome")}{" "}
                  <AppText
                    variant="title"
                    weight="bold"
                    color="#FFFFFF"
                    style={{ marginBottom: 4 }}
                  >
                    {name}
                  </AppText>
                </AppText>
                <TouchableOpacity
                  onPress={openLanguageModal}
                  activeOpacity={0.85}
                  style={styles.languageBtn}
                >
                  <AppText size={12} weight="semibold" color="#F8FAFC">
                    {i18n.language.toUpperCase()}
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", width: "60%" }}>
                <NeonBorderWrapper style={{ flex: 1 }}>
                  <GlassTabBar style={{ borderRadius: 20, width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText size={12} color="black" style={{ marginRight: 4 }}>
                        {t("home.weight")}:
                      </AppText>
                      <AppText size={10} weight="semibold" color="black">
                        {weight} kg
                      </AppText>
                    </View>
                  </GlassTabBar>
                </NeonBorderWrapper>

                <View style={{ paddingHorizontal: 2 }} />
                <NeonBorderWrapper style={{ flex: 1 }}>
                  <GlassTabBar style={{ borderRadius: 20, width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText size={12} color="black" style={{ marginRight: 4 }}>
                        {t("home.height")}:
                      </AppText>
                      <AppText size={10} weight="semibold" color="black">
                        {height} cm
                      </AppText>
                    </View>
                  </GlassTabBar>
                </NeonBorderWrapper>
              </View>

              <TouchableOpacity
                onPress={handleToggleInfo}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "yellow",
                  alignSelf: "flex-start",
                  borderRadius: 8,
                  paddingHorizontal: 4,
                  height: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: "black" }}
                >
                  {isInfoExpanded ? t("home.hideInfo") : t("home.showInfo")}
                </Text>
                <View style={{ marginLeft: 4 }}>
                  {isInfoExpanded ? <HideIcon /> : <ShowIcon />}
                </View>
              </TouchableOpacity>
              <View style={{ height: GAP_BELOW_INFO_BUTTON }} />
            </View>
            <Animated.View
              style={infoAnimatedStyle}
              pointerEvents={isInfoExpanded ? "auto" : "none"}
            >
              <Info metrics={metrics} />
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerSection: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  heroCard: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    position: "relative",
  },
  headerBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.05,
  },
  headerBgImageExpanded: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.02,
  },
  heroContent: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
    paddingRight: 16,
    paddingLeft: 4,
  },
  heroLeft: {
    flex: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  languageBtn: {
    minWidth: 44,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "rgba(15,23,42,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  editButtonWrapper: {
    marginLeft: 8,
  },
  editButton: {
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  subMuted: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subDetails: {
    fontSize: 12,
    color: "rgba(209,213,219,0.9)",
    marginBottom: 2,
  },
  heroImageWrapper: {
    position: "absolute",
    // left: 120,
    top: 20,
    zIndex: 1,
    width: 240,
    height: 300,
    right: 0,
  },
  heroImage: {
    width: 300,
    height: 400,
  },
  statsCard: {
    marginHorizontal: 20,
    // marginTop: -40,
  },
  glassStats: {
    padding: 16,
  },
  statsText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalText: {
    fontSize: 12,
    color: "#9CA3AF",
    width: 70,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#4ADE80",
    borderRadius: 4,
  },
  progressThumb: {
    position: "absolute",
    left: "50%",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginLeft: -6,
  },
  targetWeight: {
    fontSize: 12,
    color: "#fff",
    width: 40,
    textAlign: "right",
  },
  focusButton: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  focusGlass: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  focusText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionCard: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 16,
  },
  calorieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "rgba(74, 222, 128, 0.6)",
  },
  calorieCircleInner: {
    alignItems: "center",
  },
  calorieNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  calorieLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  calorieInfo: {
    flex: 1,
  },
  calorieSummary: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  calorieLeft: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  mealLogBtn: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  mealLogText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  mealBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  mealSegment: {
    flex: 1,
  },
  breakfast: { backgroundColor: "#4ADE80" },
  lunch: { backgroundColor: "#FB923C" },
  dinner: { backgroundColor: "#F87171" },
  snack: { backgroundColor: "rgba(255,255,255,0.2)" },
  mealLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  targetText: {
    fontSize: 14,
    color: "#fff",
  },
  mealScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  mealCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mealTimeBadge: {
    backgroundColor: "#4ADE80",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 11,
    color: "#0F172A",
    fontWeight: "600",
  },
  mealImagePlaceholder: {
    width: "100%",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    marginBottom: 8,
  },
  mealType: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  mealKcal: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  viewPlanBtn: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  viewPlanText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default Header;
