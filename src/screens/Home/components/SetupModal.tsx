import { AppText } from "@/components/AppText";
import type { ActivityLevel, Gender } from "../HomeScreen";
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

type SetupModalProps = {
  visible: boolean;
  canConfirm: boolean;
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
  canConfirm,
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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={modalStyles.container}>
        <ScrollView
          contentContainerStyle={modalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
                  if (text.length <= 9) onChangeName(text);
                }}
                placeholder="Your name"
                maxLength={9}
                style={modalStyles.input}
                placeholderTextColor="rgba(148,163,184,0.8)"
              />
            </View>

            <View style={modalStyles.rowFields}>
              <View style={[modalStyles.field, { flex: 1 }]}>
                <AppText size={14} weight="medium" style={modalStyles.label}>
                  Height (cm)
                </AppText>
                <TextInput
                  value={height}
                  onChangeText={onChangeHeight}
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
                  onChangeText={onChangeWeight}
                  placeholder="70"
                  keyboardType="number-pad"
                  maxLength={3}
                  style={modalStyles.input}
                  placeholderTextColor="rgba(148,163,184,0.8)"
                />
              </View>
            </View>

            <View style={modalStyles.field}>
              <AppText size={14} weight="medium" style={modalStyles.label}>
                Age
              </AppText>
              <TextInput
                value={age}
                onChangeText={onChangeAge}
                placeholder="25"
                keyboardType="number-pad"
                maxLength={3}
                style={modalStyles.input}
                placeholderTextColor="rgba(148,163,184,0.8)"
              />
            </View>

            <View style={modalStyles.field}>
              <AppText size={14} weight="medium" style={modalStyles.label}>
                Gender
              </AppText>
              <View style={modalStyles.row}>
                <TouchableOpacity
                  style={[
                    modalStyles.optionButton,
                    gender === "male" && modalStyles.optionButtonActive,
                  ]}
                  onPress={() => onSelectGender("male")}
                >
                  <AppText
                    size={14}
                    weight="medium"
                    color={gender === "male" ? "#0F172A" : "#E5E7EB"}
                  >
                    Male
                  </AppText>
                </TouchableOpacity>
                <View style={{ width: 12 }} />
                <TouchableOpacity
                  style={[
                    modalStyles.optionButton,
                    gender === "female" && modalStyles.optionButtonActive,
                  ]}
                  onPress={() => onSelectGender("female")}
                >
                  <AppText
                    size={14}
                    weight="medium"
                    color={gender === "female" ? "#0F172A" : "#E5E7EB"}
                  >
                    Female
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={modalStyles.field}>
              <AppText size={14} weight="medium" style={modalStyles.label}>
                Activity level
              </AppText>
              <View style={modalStyles.activityRow}>
                {(
                  ["sedentary", "light", "moderate", "active"] as ActivityLevel[]
                ).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      modalStyles.activityOption,
                      activityLevel === level && modalStyles.optionButtonActive,
                    ]}
                    onPress={() => onSelectActivity(level)}
                  >
                    <AppText
                      size={12}
                      weight="medium"
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

            <TouchableOpacity
              style={[modalStyles.button, !canConfirm && { opacity: 0.5 }]}
              activeOpacity={0.8}
              onPress={onConfirm}
              disabled={!canConfirm}
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

const modalStyles = StyleSheet.create({
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
    marginBottom: 0,
  },
  rowFields: {
    flexDirection: "row",
    marginBottom: 16,
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

