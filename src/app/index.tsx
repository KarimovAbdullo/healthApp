import { useAppSelector } from "@/store/hooks";
import { Redirect, Href } from "expo-router";

export default function Index() {
  const profile = useAppSelector((s) => s.profile);
  return <Redirect href={(profile ? "/(tabs)" : "/confirm") as Href} />;
}
