import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    position: "relative",
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  screenContent: {
    paddingBottom: 260,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  notifCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },
  searchInput: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 16,
    paddingVertical: 0,
  },

  todayTitle: {
    marginTop: 18,
  },

  placeholderText: {
    marginTop: 12,
  },
  noResultsWrap: {
    marginTop: 24,
  },
  manualWrap: {
    marginTop: 18,
  },
  manualInput: {
    marginTop: 8,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    color: "#F9FAFB",
    fontSize: 16,
  },
  addManualBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  rowCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
    paddingRight: 10,
  },

  foodImg: {
    width: 42,
    height: 42,
  },

  rowTextCol: {
    flex: 1,
  },

  kcalPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBox: {
    minWidth: 84,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedRightCol: {
    alignItems: "flex-end",
    paddingLeft: 10,
  },

  addMiniBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomArea: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    alignItems: "center",
    gap: 12,
  },
  addBtn: {
    width: "70%",
    height: 46,
    borderRadius: 18,
    backgroundColor: "rgba(124, 58, 237, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchResultsWrap: {
    marginTop: 10,
    gap: 12,
  },
  selectedFoodsWrap: {
    marginTop: 14,
    gap: 14,
  },
  infoIcon: {
    width: 50,
    height: 50,
  },
  historySectionWrap: {
    marginTop: 18,
  },
  historyButton: {
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(124,58,237,0.45)",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  historySection: {
    marginTop: 14,
    gap: 10,
  },
  historyCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(15,23,42,0.45)",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.65)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(49, 16, 123, 0.95)",
    padding: 16,
  },
  modalBody: {
    marginTop: 10,
    lineHeight: 22,
  },
  modalCloseBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(124, 58, 237, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
