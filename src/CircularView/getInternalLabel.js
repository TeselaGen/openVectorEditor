import Color from "color";
import React from "react";

export function getInternalLabel({
  ellipsizedName,
  id,
  annotationType,
  revTransform,
  angleAdjust,
  isPart,
  colorToUse,
  textPath
}) {
  if (!ellipsizedName) return null;
  const pathId = `${annotationType}${id}`;
  return (
    <>
      <path id={pathId} fill="none" d={textPath.print()}></path>
      <text
        className="veLabelText ve-monospace-font"
        // transform={revTransform}
        transform={
          (revTransform || "") + (angleAdjust ? ` rotate(${angleAdjust})` : "")
        }
        fill={
          isPart ? "#ac68cc" : Color(colorToUse).isDark() ? "white" : "black"
        }
        dy={-2}
      >
        <textPath
          textAnchor="middle"
          startOffset="50%"
          xlinkHref={`#${pathId}`}
        >
          {ellipsizedName}
        </textPath>
      </text>
    </>
  );
}
