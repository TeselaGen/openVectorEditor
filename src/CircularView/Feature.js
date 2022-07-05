import Color from "color";
import React from "react";

import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength = 0.5,
  annotationHeight,
  className,
  ellipsizedName,
  annotationType,
  id,
  rotationRadians,
  revTransform,
  centerAngle,
  isForward,
  totalAngle
}) {
  const labelNeedsFlip =
    centerAngle + rotationRadians > Math.PI / 2 &&
    centerAngle + rotationRadians < (Math.PI * 3) / 2;
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
    hasLabel: ellipsizedName,
    radius,
    annotationHeight,
    totalAngle,
    isForward,
    labelNeedsFlip,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  const pathId = `${annotationType}${id}`;
  return (
    <>
      <path
        className={className}
        strokeWidth=".5"
        stroke="black"
        fill={color}
        d={path.print()}
      />

      {ellipsizedName && (
        <>
          <path
            id={pathId}
            stroke="black"
            fill="none"
            d={textPath.print()}
          ></path>
          <text
            transform={revTransform}
            fill={Color(color).isDark() ? "white" : "black"}
            dy={-2}
          >
            <textPath
              text-anchor="middle"
              startOffset="50%"
              xlinkHref={`#${pathId}`}
            >
              {ellipsizedName}
            </textPath>
          </text>
        </>
      )}
    </>
  );
}
