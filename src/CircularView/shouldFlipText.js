export default function shouldFlipText(_angle) {
  const angle = _angle > 2 * Math.PI ? _angle - 2 * Math.PI : _angle;
  return angle > Math.PI * 0.5 && angle < Math.PI * 1.5;
}
