import { normalizeAngle } from "./normalizeAngle";

export function normalizeAngleRange(r) {
  return {
    ...r,
    start: normalizeAngle(r.start),
    end: normalizeAngle(r.end)
  };
}
