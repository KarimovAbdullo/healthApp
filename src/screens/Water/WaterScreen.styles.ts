import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  header: { alignItems: "center", marginBottom: 12 },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  scrollContent: { paddingBottom: 32 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  glassOption: { alignItems: "center", flex: 1 },
  glassImage: { width: 48, height: 72 },
  addButton: {
    width: "100%",
    marginTop: 24,
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
    alignSelf: "center",
  },
  historyButton: {
    marginTop: 82,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "center",
  },
  historySection: { marginTop: 20, width: "100%" },
  historyCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    marginBottom: 8,
  },

  tapText: {
    marginTop: 16,
    textAlign: "center",
  },
});

