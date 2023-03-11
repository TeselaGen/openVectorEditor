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
  textPath,
  locationNumber
}) {
  if (!ellipsizedName) return null;
  const pathId = `${annotationType}${id}${locationNumber ?? ""}`;
  return (
    <>
      <path id={pathId} fill="none" d={textPath.print()}></path>
      <text
        className="veLabelText veCircularViewInternalLabelText ve-monospace-font"
        transform={
          (revTransform || "") + (angleAdjust ? ` rotate(${angleAdjust})` : "")
        }
        fill={
          isPart ? "#ac68cc" : Color(colorToUse).isDark() ? "white" : "black"
        }
        dy={-3}
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
