import { Tabs } from "expo-router";
import { Redirect, Href } from "expo-router";

import { AnimatedTabBar } from "@/components/AnimatedTabBar";
import { useAppSelector } from "@/store/hooks";

export default function TabLayout() {
  const profile = useAppSelector((s) => s.profile);
  if (!profile) {
    return <Redirect href={"/confirm" as Href} />;
  }

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="results" options={{ title: "Results" }} />
      <Tabs.Screen name="traning" options={{ title: "Traning" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
