export default function getAngleForPositionMidpoint(position, maxLength) {
  return maxLength === 0 ? 0 : (position + 0.5) / maxLength * Math.PI * 2;
}
