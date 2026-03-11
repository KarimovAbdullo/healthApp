import { AppText } from "@/components/AppText";
import { useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";
import Header from "./components/Header";

export type UserMetrics = {
  name: string;
  heightCm: number;
  weightKg: number;
};

export function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isSetupVisible, setIsSetupVisible] = useState(true);

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const canConfirm =
    name.trim().length > 0 &&
    name.trim().length <= 9 &&
    !!Number(height) &&
    !!Number(weight);

  const handleConfirm = () => {
    if (!canConfirm) return;
    const heightNum = Number(height);
    const weightNum = Number(weight);
    setMetrics({
      name: name.trim(),
      heightCm: heightNum,
      weightKg: weightNum,
    });
    setIsSetupVisible(false);
  };

  const handleOpenEdit = () => {
    if (metrics) {
      setName(metrics.name);
      setHeight(String(metrics.heightCm));
      setWeight(String(metrics.weightKg));
    }
    setIsSetupVisible(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <Header metrics={metrics} onEditPress={handleOpenEdit} />
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={isSetupVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={modalStyles.container}>
          <View style={modalStyles.content}>
            <AppText variant="title" weight="bold" style={modalStyles.title}>
              Welcome
            </AppText>
            <AppText size={14} color="#9CA3AF" style={modalStyles.subtitle}>
              Please enter your details to personalise your plan.
            </AppText>

            <View style={modalStyles.field}>
              <AppText size={14} weight="medium" style={modalStyles.label}>
                Name
              </AppText>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  if (text.length <= 9) setName(text);
                }}
                placeholder="Your name"
                maxLength={9}
                style={modalStyles.input}
                placeholderTextColor="rgba(148,163,184,0.8)"
              />
            </View>

            <View style={modalStyles.row}>
              <View style={[modalStyles.field, { flex: 1 }]}>
                <AppText size={14} weight="medium" style={modalStyles.label}>
                  Height (cm)
                </AppText>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={modalStyles.input}
                  placeholderTextColor="rgba(148,163,184,0.8)"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={[modalStyles.field, { flex: 1 }]}>
                <AppText size={14} weight="medium" style={modalStyles.label}>
                  Weight (kg)
                </AppText>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={modalStyles.input}
                  placeholderTextColor="rgba(148,163,184,0.8)"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[modalStyles.button, !canConfirm && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={handleConfirm}
              disabled={!canConfirm}
            >
              <AppText weight="bold" color="#0F172A">
                OK
              </AppText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  content: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(148,163,253,0.6)",
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#E5E7EB",
    backgroundColor: "rgba(15,23,42,0.9)",
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  button: {
    marginTop: 4,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
});
