/**
 * Burchak asosida takror: “yuqori” holatdan “past” holatga, qayta yuqoriga = 1 rep.
 * Masalan: tizza (turgan/o‘tirgan) yoki tirsak (to‘g‘ri/qiyshaygan).
 */
export type AngleRepFsmState = {
  phase: "high" | "low";
  count: number;
  lowStreak: number;
  highStreak: number;
};

export function createAngleRepFsm(): AngleRepFsmState {
  return {
    phase: "high",
    count: 0,
    lowStreak: 0,
    highStreak: 0,
  };
}

export function updateAngleRepFsm(
  fsm: AngleRepFsmState,
  angleDeg: number,
  maxReps: number,
  opts: {
    /** Bundan past burchak = “chuqur / bukilgan” */
    lowBelow: number;
    /** Bundan yuqori = “yuqoriga / to‘liq cho‘zilgan” */
    highAbove: number;
    frames: number;
  },
): void {
  if (fsm.count >= maxReps) return;

  const { lowBelow, highAbove, frames } = opts;

  if (fsm.phase === "high") {
    if (angleDeg < lowBelow) {
      fsm.lowStreak++;
      fsm.highStreak = 0;
      if (fsm.lowStreak >= frames) {
        fsm.phase = "low";
        fsm.lowStreak = 0;
      }
    } else {
      fsm.lowStreak = 0;
    }
  } else {
    if (angleDeg > highAbove) {
      fsm.highStreak++;
      fsm.lowStreak = 0;
      if (fsm.highStreak >= frames) {
        fsm.phase = "high";
        fsm.highStreak = 0;
        fsm.count += 1;
      }
    } else {
      fsm.highStreak = 0;
    }
  }
}
