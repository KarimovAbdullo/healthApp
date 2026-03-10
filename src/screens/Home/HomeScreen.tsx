import { AppText } from "@/components/AppText";
import GlassTabBar from "@/components/GlowButton/GlowButton";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";

const MOCK_DATA = {
  userName: "John",
  weightToLose: 2.5,
  currentWeight: 82,
  height: 180,
  dailyCalories: 2450,
  consumedCalories: 1376,
  goalWeight: 80,
  goalProgress: 50,
  meals: {
    breakfast: 423,
    lunch: 530,
    dinner: 670,
    snack: 0,
  },
  mealPlans: [
    { time: "8:00 AM", type: "Breakfast", kcal: 423 },
    { time: "12:30 PM", type: "Lunch", kcal: 530 },
    { time: "7:00 PM", type: "Dinner", kcal: 670 },
  ],
};

export function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <LinearGradient
            colors={["#1A2B5B", "#2D2B6E", "#4D3E8C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <Image
              source={require("../../assets/images/nor.png")}
              style={styles.heroImage}
              contentFit="contain"
            />
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <AppText variant="subtitle" weight="medium" color="#E5E7EB">
                  Welcome Back
                </AppText>
                <AppText
                  variant="title"
                  weight="bold"
                  color="#FFFFFF"
                  style={{ marginTop: 4 }}
                >
                  {MOCK_DATA.userName}
                </AppText>
                <View style={{ flexDirection: "row" }}>
                  <GlassTabBar style={{ borderRadius: 20, width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText
                        size={12}
                        color="black"
                        style={{ marginRight: 4 }}
                      >
                        Weight:
                      </AppText>
                      <AppText size={10} weight="semibold" color="black">
                        110 kg
                      </AppText>
                    </View>
                  </GlassTabBar>
                  <View style={{ paddingHorizontal: 2 }} />
                  <GlassTabBar style={{ borderRadius: 20, width: "100%" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText
                        size={12}
                        color="black"
                        style={{ marginRight: 4 }}
                      >
                        Height:
                      </AppText>
                      <AppText size={10} weight="semibold" color="black">
                        170 cm
                      </AppText>
                    </View>
                  </GlassTabBar>
                </View>

                <View style={{ width: "70%", marginTop: 10 }}>
                  <GlassTabBar
                    style={{
                      borderRadius: 80,
                      shadowColor: "white",
                      elevation: 44,
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        // width: "100%",
                      }}
                    >
                      <View
                        style={{
                          alignSelf: "center",
                          borderBottomWidth: 1,
                          // width: "100%",
                        }}
                      >
                        <AppText size={24} weight="semibold">
                          Owerweight
                        </AppText>
                      </View>

                      <View
                        style={{
                          // flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <View
                          style={{
                            // borderWidth: 1,
                            // borderColor: "red",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <AppText size={18} weight="light">
                            Abovew
                          </AppText>
                          <AppText size={22} weight="medium">
                            100 kg
                          </AppText>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <AppText size={18} weight="light">
                            Abovew
                          </AppText>
                          <AppText size={22} weight="medium">
                            100 kg
                          </AppText>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <AppText size={18} weight="light">
                            Abovew
                          </AppText>
                          <AppText size={22} weight="medium">
                            100 kg
                          </AppText>
                        </View>
                      </View>
                    </View>
                  </GlassTabBar>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
