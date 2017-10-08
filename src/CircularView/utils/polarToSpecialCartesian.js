export default function polarToSpecialCartesian(radius, angle) {
  //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
  return {
    x: radius * Math.cos(angle - Math.PI / 2),
    y: radius * Math.sin(angle - Math.PI / 2)
  };
}
