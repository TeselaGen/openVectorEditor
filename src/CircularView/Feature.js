import React from "react";

import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength = 0.5,
  annotationHeight,
  className,
  totalAngle
}) {
  // const cleanedRest = cleanRest(rest);
  if (containsLocations) {
    let path = drawDirectedPiePiece({
      radius: radius,
      annotationHeight: annotationHeight / 8,
      totalAngle,
      arrowheadLength,
      tailThickness: 1 //feature specific
    });
    return (
      <path
        // {...cleanedRest}
        className={className}
        strokeWidth=".5"
        stroke="black"
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
      // {...cleanedRest}
      className={className}
      strokeWidth=".5"
      stroke="black"
      fill={color}
      d={path.print()}
    />
  );
}
