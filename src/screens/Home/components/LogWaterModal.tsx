import { AppText } from "@/components/AppText";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const glassImg: ImageSourcePropType = require("@/assets/images/stakan.png");

type GlassOption = {
  id: string;
  label: string;
  liters: number;
};

const GLASS_OPTIONS: GlassOption[] = [
  { id: "100", label: "100 ml", liters: 0.1 },
  { id: "250", label: "250 ml", liters: 0.25 },
  { id: "500", label: "500 ml", liters: 0.5 },
  { id: "1000", label: "1 L", liters: 1 },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (addedLiters: number) => void;
  history: { date: string; liters: number }[];
};

export const LogWaterModal = ({
  visible,
  onClose,
  onConfirm,
  history,
}: Props) => {
  const [totalSelected, setTotalSelected] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  const handleSelect = (amount: number) => {
    setTotalSelected((prev) => Number((prev + amount).toFixed(2)));
  };

  const handleConfirm = () => {
    if (totalSelected > 0) {
      onConfirm(totalSelected);
      setTotalSelected(0);
    }
    onClose();
  };

  useEffect(() => {
    if (totalSelected <= 0) {
      return;
    }

    scaleAnim.setValue(1);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalSelected, scaleAnim]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <AppText size={16} color="#E5E7EB">
              ←
            </AppText>
          </TouchableOpacity>
          <AppText variant="title" weight="bold" color="#F9FAFB">
            Log Water
          </AppText>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.row}>
              {GLASS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={styles.glassOption}
                  onPress={() => handleSelect(opt.liters)}
                  activeOpacity={0.8}
                >
                  <Image source={glassImg} style={styles.glassImage} />
                  <AppText
                    size={14}
                    weight="medium"
                    color="#E5E7EB"
                    style={{ marginTop: 4 }}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <AppText
              size={14}
              weight="semibold"
              color="#9CA3AF"
              style={{ marginTop: 16 }}
            >
              Each glass adds to your daily total
            </AppText>

            <Animated.View
              style={{
                marginTop: 24,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <AppText size={54} weight="bold" color="#22C55E">
                +{totalSelected.toFixed(1)} L
              </AppText>
            </Animated.View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.addButton,
                totalSelected === 0 && { opacity: 0.4 },
              ]}
              onPress={handleConfirm}
              disabled={totalSelected === 0}
            >
              <AppText weight="bold" color="#0F172A">
                Add Water
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setTotalSelected(0)}
              activeOpacity={0.8}
            >
              <AppText size={13} weight="medium" color="#E5E7EB">
                Clear
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.historyButton}
              activeOpacity={0.8}
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              <AppText size={13} weight="semibold" color="#0F172A">
                History – daily water tracking
              </AppText>
            </TouchableOpacity>

            <View style={styles.historySection}>
              <AppText
                size={12}
                weight="semibold"
                color="#9CA3AF"
                style={{ marginBottom: 8 }}
              >
                Previous days
              </AppText>

              {history.length === 0 ? (
                <AppText size={12} color="#6B7280">
                  No history yet. Start logging water today.
                </AppText>
              ) : (
                history.map((item) => {
                  const dateObj = new Date(item.date);
                  const weekday = dateObj.toLocaleDateString(undefined, {
                    weekday: "short",
                  });
                  const dateLabel = dateObj.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  return (
                    <View key={item.date} style={styles.historyCard}>
                      <AppText size={12} weight="semibold" color="#E5E7EB">
                        {weekday}
                      </AppText>
                      <AppText size={11} color="#9CA3AF">
                        {dateLabel}
                      </AppText>
                      <AppText
                        size={14}
                        weight="bold"
                        color="#38BDF8"
                        style={{ marginTop: 4 }}
                      >
                        {item.liters.toFixed(1)} L
                      </AppText>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  glassOption: {
    alignItems: "center",
    flex: 1,
  },
  glassImage: {
    width: 48,
    height: 72,
  },
  selectedRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 6,
  },
  selectedGlass: {
    width: 20,
    height: 30,
  },
  footer: {
    alignItems: "center",
    marginBottom: 24,
  },
  addButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  clearButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.6)",
  },
  historyButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#FACC15",
  },
  historySection: {
    marginTop: 20,
    width: "100%",
  },
  historyCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    marginBottom: 8,
  },
});

export default LogWaterModal;
