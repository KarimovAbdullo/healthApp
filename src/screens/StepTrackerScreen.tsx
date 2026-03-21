import BackIcon2 from "@/assets/icons/BackIcon2";
import { AppText } from "@/components/AppText";
import { ProgressBar } from "@/components/ProgressBar";
import { calculateDistance } from "@/utils/distance";
import {
  checkPedometerCapability,
  getStepsBetweenDates,
  startPedometer,
  stopPedometer,
} from "@/utils/pedometer";
import { clearSession, getStartTime, saveStartTime } from "@/utils/storage";
import { loadUserProfile } from "@/utils/userProfileStorage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  AppState,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  type AppStateStatus,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GOAL_METERS = 3000;

export default function StepTrackerScreen() {
  const router = useRouter();
  const pedometerSubRef = useRef<{ remove: () => void } | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [heightCm, setHeightCm] = useState<number | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [deviceSupported, setDeviceSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [errorText, setErrorText] = useState("");

  const distanceMeters = useMemo(
    () => calculateDistance(totalSteps, heightCm),
    [totalSteps, heightCm],
  );
  const progress = useMemo(
    () => Math.max(0, Math.min(1, distanceMeters / GOAL_METERS)),
    [distanceMeters],
  );
  const percent = Math.round(progress * 100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const attachLiveWatcher = async (baseSteps: number) => {
    stopPedometer(pedometerSubRef.current);
    pedometerSubRef.current = await startPedometer((liveSteps) => {
      const merged = Math.max(0, baseSteps + liveSteps);
      setTotalSteps((prev) => (merged < prev ? prev : merged));
    });
  };

  const restoreSession = async () => {
    const profile = await loadUserProfile();
    setHeightCm(profile?.heightCm);

    const capability = await checkPedometerCapability();
    setDeviceSupported(capability.available);
    setPermissionGranted(capability.granted);

    if (!capability.available || !capability.granted) {
      setIsReady(true);
      return;
    }

    const savedStart = await getStartTime();
    if (!savedStart) {
      setIsRunning(false);
      setStartTime(null);
      setTotalSteps(0);
      setIsReady(true);
      return;
    }

    const steps = await getStepsBetweenDates(savedStart, new Date());
    setStartTime(savedStart);
    setTotalSteps(steps);
    setIsRunning(true);
    await attachLiveWatcher(steps);
    setIsReady(true);
  };

  useEffect(() => {
    void restoreSession();
    return () => {
      stopPedometer(pedometerSubRef.current);
      pedometerSubRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener(
      "change",
      async (next: AppStateStatus) => {
        if (next !== "active" || !isRunning || !startTime) return;
        const latest = await getStepsBetweenDates(startTime, new Date());
        setTotalSteps(latest);
        await attachLiveWatcher(latest);
      },
    );
    return () => sub.remove();
  }, [isRunning, startTime]);

  const handleStart = async () => {
    setErrorText("");
    const capability = await checkPedometerCapability();
    setDeviceSupported(capability.available);
    setPermissionGranted(capability.granted);

    if (!capability.available) {
      setErrorText("Pedometer is not available on this device.");
      return;
    }
    if (!capability.granted) {
      setErrorText("Pedometer permission is required.");
      return;
    }

    const start = new Date();
    await saveStartTime(start);
    setStartTime(start);
    setTotalSteps(0);
    setIsRunning(true);
    await attachLiveWatcher(0);
  };

  const handleStop = async () => {
    stopPedometer(pedometerSubRef.current);
    pedometerSubRef.current = null;
    await clearSession();
    setStartTime(null);
    setTotalSteps(0);
    setIsRunning(false);
    setErrorText("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#0B1022", "#121A33", "#1B2550"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <BackIcon2 />
          </TouchableOpacity>
          <AppText
            size={22}
            weight="bold"
            color="#F9FAFB"
            style={styles.headerTitle}
          >
            Step{" "}
            <AppText size={22} weight="bold" color="#FACC15">
              Tracker
            </AppText>
          </AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.heroCenter}>
          <View style={styles.circleOuter}>
            <View style={styles.circleMid}>
              <View style={styles.circleInner}>
                <Image
                  source={require("@/assets/images/kro.png")}
                  style={styles.shoe}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        <AppText
          size={45}
          weight="bold"
          color="#F9FAFB"
          style={styles.goalText}
        >
          Goal:{" "}
          <AppText size={45} weight="bold" color="#FACC15">
            {GOAL_METERS.toLocaleString()} m
          </AppText>
        </AppText>

        <View style={styles.content}>
          <ProgressBar
            progressAnim={progressAnim}
            currentMeters={distanceMeters}
            goalMeters={GOAL_METERS}
            percent={percent}
          />
          {!isReady ? (
            <AppText size={14} color="#CBD5E1" style={styles.note}>
              Loading...
            </AppText>
          ) : !deviceSupported ? (
            <AppText size={14} color="#FCA5A5" style={styles.note}>
              This device does not support pedometer.
            </AppText>
          ) : !permissionGranted ? (
            <AppText size={14} color="#FCA5A5" style={styles.note}>
              Allow motion/fitness permission to use step tracking.
            </AppText>
          ) : errorText ? (
            <AppText size={14} color="#FCA5A5" style={styles.note}>
              {errorText}
            </AppText>
          ) : (
            <AppText size={13} color="#CBD5E1" style={styles.note}>
              {isRunning
                ? "Tracking active. Steps update live and persist while app is closed."
                : "Boshlash uchun START bosing"}
            </AppText>
          )}

          <TouchableOpacity
            style={[
              styles.startBtn,
              isRunning ? styles.stopBtn : null,
              !isReady ? styles.disabledBtn : null,
            ]}
            activeOpacity={0.85}
            onPress={isRunning ? handleStop : handleStart}
            disabled={!isReady}
          >
            <AppText size={36} weight="bold" color="#111827">
              {isRunning ? "STOP" : "START"}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  bg: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    letterSpacing: 0.3,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  content: {
    marginTop: 12,
  },
  heroCenter: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circleOuter: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  circleMid: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  circleInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  shoe: {
    width: 300,
    height: 300,
  },
  goalText: {
    marginTop: 18,
    textAlign: "center",
  },
  startBtn: {
    marginTop: 18,
    width: "100%",
    height: 64,
    borderRadius: 999,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFF700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  stopBtn: {
    backgroundColor: "#F59E0B",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  note: {
    marginTop: 10,
    lineHeight: 20,
    textAlign: "center",
  },
});
