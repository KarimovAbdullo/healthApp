import { AppText } from "@/components/AppText";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ActivityLevel, Gender } from "../HomeScreen";

type SetupModalProps = {
  visible: boolean;
  name: string;
  height: string;
  weight: string;
  age: string;
  gender: Gender | "";
  activityLevel: ActivityLevel | "";
  onChangeName: (value: string) => void;
  onChangeHeight: (value: string) => void;
  onChangeWeight: (value: string) => void;
  onChangeAge: (value: string) => void;
  onSelectGender: (value: Gender) => void;
  onSelectActivity: (value: ActivityLevel) => void;
  onConfirm: () => void;
};

export function SetupModal({
  visible,
  name,
  height,
  weight,
  age,
  gender,
  activityLevel,
  onChangeName,
  onChangeHeight,
  onChangeWeight,
  onChangeAge,
  onSelectGender,
  onSelectActivity,
  onConfirm,
}: SetupModalProps) {
  const heightNum = Number(height);
  const weightNum = Number(weight);
  const ageNum = Number(age);

  const heightError =
    height.length > 0 &&
    (isNaN(heightNum) || heightNum < 100 || heightNum > 250);

  const weightError =
    weight.length > 0 &&
    (isNaN(weightNum) || weightNum < 30 || weightNum > 300);

  const ageError =
    age.length > 0 && (isNaN(ageNum) || ageNum < 5 || ageNum > 120);

  const canConfirm =
    name.length > 0 &&
    height.length > 0 &&
    weight.length > 0 &&
    age.length > 0 &&
    !heightError &&
    !weightError &&
    !ageError &&
    gender !== "" &&
    activityLevel !== "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <AppText variant="title" weight="bold" style={styles.title}>
              Welcome
            </AppText>

            <AppText size={14} color="#9CA3AF" style={styles.subtitle}>
              Please enter your details to personalise your plan.
            </AppText>

            {/* NAME */}
            <View style={styles.field}>
              <AppText style={styles.label}>Name</AppText>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  if (text.length <= 9) onChangeName(text);
                }}
                placeholder="Enter your name"
                maxLength={9}
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* HEIGHT + WEIGHT */}
            <View style={styles.rowFields}>
              <View style={[styles.field, { flex: 1 }]}>
                <AppText style={styles.label}>Height (cm)</AppText>
                <TextInput
                  value={height}
                  onChangeText={onChangeHeight}
                  placeholder="170"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={[styles.input, heightError && styles.inputError]}
                  placeholderTextColor="#94A3B8"
                />
                {heightError && (
                  <AppText style={styles.errorText}>
                    Height must be between 100–250 cm
                  </AppText>
                )}
              </View>

              <View style={{ width: 12 }} />

              <View style={[styles.field, { flex: 1 }]}>
                <AppText style={styles.label}>Weight (kg)</AppText>
                <TextInput
                  value={weight}
                  onChangeText={onChangeWeight}
                  placeholder="70"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={[styles.input, weightError && styles.inputError]}
                  placeholderTextColor="#94A3B8"
                />
                {weightError && (
                  <AppText style={styles.errorText}>
                    Weight must be between 30–300 kg
                  </AppText>
                )}
              </View>
            </View>

            {/* AGE */}
            <View style={styles.field}>
              <AppText style={styles.label}>Age</AppText>
              <TextInput
                value={age}
                onChangeText={onChangeAge}
                placeholder="25"
                keyboardType="number-pad"
                maxLength={3}
                style={[styles.input, ageError && styles.inputError]}
                placeholderTextColor="#94A3B8"
              />
              {ageError && (
                <AppText style={styles.errorText}>
                  Age must be between 5–120
                </AppText>
              )}
            </View>

            {/* GENDER */}
            <View style={styles.field}>
              <AppText style={styles.label}>Gender</AppText>
              <View style={styles.row}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === "male" && styles.optionButtonActive,
                  ]}
                  onPress={() => onSelectGender("male")}
                >
                  <AppText
                    color={gender === "male" ? "#0F172A" : "#E5E7EB"}
                    weight="medium"
                  >
                    Male
                  </AppText>
                </TouchableOpacity>

                <View style={{ width: 12 }} />

                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    gender === "female" && styles.optionButtonActive,
                  ]}
                  onPress={() => onSelectGender("female")}
                >
                  <AppText
                    color={gender === "female" ? "#0F172A" : "#E5E7EB"}
                    weight="medium"
                  >
                    Female
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* ACTIVITY */}
            <View style={styles.field}>
              <AppText style={styles.label}>Activity level</AppText>

              <View style={styles.activityRow}>
                {(
                  [
                    "sedentary",
                    "light",
                    "moderate",
                    "active",
                  ] as ActivityLevel[]
                ).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.activityOption,
                      activityLevel === level && styles.optionButtonActive,
                    ]}
                    onPress={() => onSelectActivity(level)}
                  >
                    <AppText
                      size={12}
                      color={activityLevel === level ? "#0F172A" : "#E5E7EB"}
                      style={{ textAlign: "center" }}
                    >
                      {level === "sedentary"
                        ? "Sedentary"
                        : level === "light"
                          ? "Light"
                          : level === "moderate"
                            ? "Moderate"
                            : "Active"}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[styles.button, !canConfirm && { opacity: 0.5 }]}
              disabled={!canConfirm}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <AppText weight="bold" color="#0F172A">
                OK
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },

  content: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(148,163,253,0.6)",
  },

  title: { marginBottom: 4 },

  subtitle: { marginBottom: 16 },

  field: { marginBottom: 16 },

  label: {
    marginBottom: 6,
    color: "#E5E7EB",
    fontSize: 14,
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

  inputError: {
    borderColor: "#EF4444",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
  },

  rowFields: {
    flexDirection: "row",
  },

  optionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
  },

  optionButtonActive: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(34,197,94,0.25)",
  },

  activityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  activityOption: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.9)",
  },

  button: {
    marginTop: 4,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
});
