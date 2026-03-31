import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Redirect, Href } from "expo-router";
import { useTranslation } from "react-i18next";

import { AnimatedTabBar } from "@/components/AnimatedTabBar";
import { useAppSelector } from "@/store/hooks";

export default function TabLayout() {
  const { t } = useTranslation();
  const profile = useAppSelector((s) => s.profile);
  if (!profile) {
    return <Redirect href={"/confirm" as Href} />;
  }

  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="results" options={{ title: t("tabs.results") }} />
      <Tabs.Screen name="traning" options={{ title: t("tabs.training") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    </Tabs>
  );
}
