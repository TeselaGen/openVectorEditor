import React from "react";
// we use PositionAnnotationOnCircle for multiple cases, 
// either for feature-like annotations to rotate them as necessary
// or for cutsite-like annotations to both rotate and adjust their height
// we can also use it to "flip" reverse annotations
//finally it can either return a transform object or 
// if passed children it can clone a react component and add a transform prop to it 
export default function PositionAnnotationOnCircle({
  children,
  height = 0,
  sAngle = 0,
  eAngle = 0,
  zoomLevel,
  tuckInHeight = 0,
  forward = true,
  ...rest
}) {
  const sAngleDegs = (sAngle * 360) / Math.PI / 2;
  const eAngleDegs = (eAngle * 360) / Math.PI / 2;
  let transform;
  if (forward) {
    transform = `translate(0,${-height +
      tuckInHeight}) rotate(${sAngleDegs},0,${height})`;
  } else {
    transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `;
  }
  let props = { transform, ...rest };
  /* eslint-disable */
  if (!children) return { transform };
  /* eslint-enable */

  return React.cloneElement(children, props);
}
