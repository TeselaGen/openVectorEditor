import React from "react";

import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength = 0.5,
  annotationHeight,
  className,
  name,
  annotationType,
  id,
  isForward,
  totalAngle
}) {
  // const cleanedRest = cleanRest(rest);
  if (containsLocations) {
    const path = drawDirectedPiePiece({
      radius,
      annotationHeight: annotationHeight / 8,
      totalAngle,
      arrowheadLength,
      tailThickness: 1 //feature specific
    });
    return (
      <path
        className={className}
        strokeWidth=".5"
        id={id}
        stroke="black"
        fill={color}
        d={path.print()}
      />
    );
  }
  const [path, textPath] = drawDirectedPiePiece({
    returnTextPath: true,
    radius,
    annotationHeight,
    totalAngle,
    isForward,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  const pathId = `${annotationType}${id}`;
  const annLength = Math.floor((totalAngle * Math.PI * radius) / 50);
  const ellipsizedName = (name || "").slice(0, annLength);
  return (
    <>
      <path
        className={className}
        strokeWidth=".5"
        stroke="black"
        fill={color}
        d={path.print()}
      />
      <path id={pathId} stroke="black" fill="none" d={textPath.print()}></path>
      <text dy={-2}>
        <textPath
          text-anchor="middle"
          startOffset="50%"
          xlinkHref={`#${pathId}`}
        >
          {ellipsizedName}
        </textPath>
      </text>
    </>
  );
}
