import React from "react";
export default function PositionAnnotationOnCircle({
  children,
  height = 0,
  sAngle = 0,
  eAngle = 0,
  forward = true,
  ...rest
}) {
  const sAngleDegs = sAngle * 360 / Math.PI / 2;
  const eAngleDegs = eAngle * 360 / Math.PI / 2;
  let transform;
  if (forward) {
    transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`;
  } else {
    transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `;
  }
  let props = { transform, ...rest };
  /* eslint-disable */
  if (!children) return { transform };
  /* eslint-enable */

  return React.cloneElement(children, props);
}
