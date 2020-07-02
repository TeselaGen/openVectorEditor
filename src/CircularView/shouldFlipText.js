import { mod } from "../utils/editorUtils";

export default function shouldFlipText(_angle) {
  const angle = mod(_angle, 2 * Math.PI);
  return angle > Math.PI * 0.5 && angle < Math.PI * 1.5;
}
