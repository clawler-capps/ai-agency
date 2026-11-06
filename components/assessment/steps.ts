// Snapshot funnel steps, shared by the client hook and /api/snapshot-event.
// Order matters: the index is the funnel position.
export const STEP_IDS = [
  "start",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "bottleneck",
  "followup",
  "numbers",
  "unlocked",
] as const;
export type StepId = (typeof STEP_IDS)[number];
