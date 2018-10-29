import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  isBetweenLocations,
  arrowheadLength = 0.5,
  annotationHeight,
  totalAngle,
  ...rest
}) {
  if (isBetweenLocations) {
    let path = drawDirectedPiePiece({
      radius: radius,
      annotationHeight: annotationHeight / 4,
      totalAngle,
      arrowheadLength,
      tailThickness: 1 //feature specific
    });
    return (
      <path
        {...rest}
        className="veFeature veCircularViewFeature"
        strokeWidth=".5"
        stroke={"black"}
        fill={color}
        d={path.print()}
      />
    );
  }
  let path = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  return (
    <path
      {...rest}
      className="veFeature veCircularViewFeature"
      strokeWidth=".5"
      stroke={"black"}
      fill={color}
      d={path.print()}
    />
  );
}
