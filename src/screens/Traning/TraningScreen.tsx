import {
  PoseSkeletonOverlay,
  type PoseSkeleton,
} from "@/components/PoseSkeletonOverlay/PoseSkeletonOverlay";
import {
  SQUAT_TARGET_REPS,
  averageKneeAngleDeg,
  createSquatFsm,
  updateSquatFsm,
  type SquatFsmState,
} from "@/utils/squatCountFromPose";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Delegate,
  KnownPoseLandmarkConnections,
  MediapipeCamera,
  RunningMode,
  usePoseDetection,
  type DetectionError,
  type PoseDetectionResultBundle,
  type ViewCoordinator,
} from "react-native-mediapipe";
import {
  useCameraPermission,
  useMicrophonePermission,
} from "react-native-vision-camera";
import { SafeAreaView } from "react-native-safe-area-context";

const POSE_MODEL = "pose_landmarker_lite.task";

function isLandmarkUsable(lm: {
  visibility?: number;
  presence?: number;
}): boolean {
  if (lm.visibility != null && lm.visibility < 0.45) return false;
  if (lm.presence != null && lm.presence < 0.45) return false;
  return true;
}

function buildSkeleton(
  bundle: PoseDetectionResultBundle,
  vc: ViewCoordinator,
): PoseSkeleton | null {
  const poseLandmarks = bundle.results[0]?.landmarks?.[0];
  if (!poseLandmarks?.length) return null;

  const frameDims = vc.getFrameDims(bundle);
  const jointsScreen = poseLandmarks.map((lm) => {
    if (!isLandmarkUsable(lm)) return null;
    return vc.convertPoint(frameDims, { x: lm.x, y: lm.y });
  });

  const lines: PoseSkeleton["lines"] = [];
  for (const [a, b] of KnownPoseLandmarkConnections) {
    const p1 = jointsScreen[a];
    const p2 = jointsScreen[b];
    if (!p1 || !p2) continue;
    lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }

  return { lines };
}

const TraningScreen = () => {
  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: hasMicPermission,
    requestPermission: requestMicPermission,
  } = useMicrophonePermission();
  const [cameraFacing, setCameraFacing] = useState<"back" | "front">("front");
  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });
  const [skeleton, setSkeleton] = useState<PoseSkeleton | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingSkeletonRef = useRef<PoseSkeleton | null>(null);
  const pendingSquatRef = useRef<{
    angle: number | null;
    landmarks: boolean;
  }>({ angle: null, landmarks: false });

  const squatFsmRef = useRef<SquatFsmState>(createSquatFsm());
  const [squatCount, setSquatCount] = useState(0);
  const [squatComplete, setSquatComplete] = useState(false);

  const resetSquatSession = useCallback(() => {
    squatFsmRef.current = createSquatFsm();
    setSquatCount(0);
    setSquatComplete(false);
  }, []);

  const allMediaPermissionsGranted =
    hasCameraPermission && hasMicPermission;

  const requestAllMediaPermissions = useCallback(async () => {
    await requestCameraPermission();
    await requestMicPermission();
  }, [requestCameraPermission, requestMicPermission]);

  const onResults = useCallback(
    (bundle: PoseDetectionResultBundle, vc: ViewCoordinator) => {
      const next = buildSkeleton(bundle, vc);
      pendingSkeletonRef.current = next;

      const raw = bundle.results[0]?.landmarks?.[0];
      if (raw?.length) {
        pendingSquatRef.current = {
          angle: averageKneeAngleDeg(raw),
          landmarks: true,
        };
      } else {
        pendingSquatRef.current = { angle: null, landmarks: false };
      }

      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setSkeleton(pendingSkeletonRef.current);

        const { angle, landmarks } = pendingSquatRef.current;
        if (!landmarks || angle == null) return;

        const fsm = squatFsmRef.current;
        const before = fsm.count;
        updateSquatFsm(fsm, angle, SQUAT_TARGET_REPS);
        if (fsm.count !== before) {
          setSquatCount(fsm.count);
          if (fsm.count >= SQUAT_TARGET_REPS) {
            setSquatComplete(true);
          }
        }
      });
    },
    [],
  );

  const onCameraLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setOverlaySize({ w: width, h: height });
  }, []);

  useEffect(() => {
    setSkeleton(null);
    pendingSkeletonRef.current = null;
    resetSquatSession();
  }, [cameraFacing, resetSquatSession]);

  const onError = useCallback((error: DetectionError) => {
    console.warn("Pose detection:", error.message);
  }, []);

  const solution = usePoseDetection(
    { onResults, onError },
    RunningMode.LIVE_STREAM,
    POSE_MODEL,
    {
      delegate: Delegate.GPU,
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      fpsMode: "none",
    },
  );

  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        {!allMediaPermissionsGranted ? (
          <View style={styles.permsWrap}>
            <Text style={styles.permsTitle}>Kamera va mikrofon</Text>
            <Text style={styles.permsText}>
              Old kamera odatda o‘zingizni ko‘rish va pozani tekshirish uchun
              qulay; keyinchalik video/audio uchun mikrofon ham kerak. Iltimos,
              ikkala ruxsatni ham bering.
            </Text>
            {!hasCameraPermission ? (
              <Text style={styles.permsHint}>• Kamera: berilmagan</Text>
            ) : null}
            {!hasMicPermission ? (
              <Text style={styles.permsHint}>• Mikrofon: berilmagan</Text>
            ) : null}
            <Pressable
              style={styles.permsBtn}
              onPress={() => void requestAllMediaPermissions()}
            >
              <Text style={styles.permsBtnText}>Ruxsatlarni so‘rash</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cameraWrap} onLayout={onCameraLayout}>
            <MediapipeCamera
              style={styles.camera}
              solution={solution}
              activeCamera={cameraFacing}
            />
            <PoseSkeletonOverlay
              width={overlaySize.w}
              height={overlaySize.h}
              skeleton={skeleton}
            />

            <View style={styles.hud} pointerEvents="box-none">
              <View style={styles.hudCard}>
                <Text style={styles.hudLabel}>O‘tirish — turish</Text>
                <Text style={styles.hudCount}>
                  {squatCount}{" "}
                  <Text style={styles.hudSlash}>/ {SQUAT_TARGET_REPS}</Text>
                </Text>
                {squatComplete ? (
                  <Text style={styles.hudDone}>Bajarildi</Text>
                ) : (
                  <Text style={styles.hudHint}>
                    Telefonni uzoqroq qo‘ying, tanangiz butun ko‘rinsin. Chuqur
                    o‘tirib turing.
                  </Text>
                )}
                <Pressable
                  style={styles.resetBtn}
                  onPress={resetSquatSession}
                  hitSlop={8}
                >
                  <Text style={styles.resetBtnText}>Qayta boshlash</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={styles.flipBtn}
              onPress={() =>
                setCameraFacing((f) => (f === "back" ? "front" : "back"))
              }
            >
              <Text style={styles.flipBtnText}>
                {cameraFacing === "front" ? "Orqa kamera" : "Old kamera"}
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  cameraWrap: { flex: 1 },
  camera: { flex: 1 },
  flipBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 12,
  },
  flipBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  hud: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 24,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  hudCard: {
    backgroundColor: "rgba(15,23,42,0.82)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.35)",
  },
  hudLabel: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  hudCount: {
    color: "#FACC15",
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1,
  },
  hudSlash: {
    color: "#e2e8f0",
    fontSize: 28,
    fontWeight: "600",
  },
  hudDone: {
    marginTop: 8,
    color: "#4ade80",
    fontSize: 18,
    fontWeight: "700",
  },
  hudHint: {
    marginTop: 10,
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 18,
  },
  resetBtn: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  resetBtnText: {
    color: "#FACC15",
    fontSize: 14,
    fontWeight: "700",
  },
  permsWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  permsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  permsText: { fontSize: 15, color: "#e2e8f0", marginBottom: 12 },
  permsHint: {
    fontSize: 14,
    color: "#fcd34d",
    marginBottom: 6,
  },
  permsBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FACC15",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  permsBtnText: { color: "#111827", fontWeight: "700", fontSize: 16 },
});

export default TraningScreen;
