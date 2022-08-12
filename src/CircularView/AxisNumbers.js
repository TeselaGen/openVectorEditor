import React from "react";
import shouldFlipText from "./shouldFlipText";
import { divideBy3 } from "../utils/proteinUtils";

export function AxisNumbers({
  rotationRadians,
  textHeightOffset = -5,
  annotation,
  isProtein,
  hideNumbers
}) {
  const shouldFlip = shouldFlipText(annotation.startAngle + rotationRadians);
  return (
    <g>
      <rect y={-17} width={1} height={5} fill="black"></rect>
      {!hideNumbers && (
        <text
          transform={
            (shouldFlip ? "rotate(180)" : "") +
            ` translate(0, ${
              shouldFlip ? -textHeightOffset : textHeightOffset
            })`
          }
          style={{
            textAnchor: "middle",
            dominantBaseline: "central",
            fontSize: "small"
          }}
        >
          {divideBy3(annotation.tickPosition + 1, isProtein) + ""}
        </text>
      )}
    </g>
  );
}
