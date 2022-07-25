import React from "react";

function Axis({
  radius,
  showAxisNumbers,
  tickMarkHeight = 5,
  textOffset = 15,
  ringThickness = 4,
  zoomLevel
}) {
  const height =
    (ringThickness + (showAxisNumbers ? textOffset + tickMarkHeight : 0)) /
    zoomLevel;
  const radiusToUse = showAxisNumbers
    ? radius + textOffset + tickMarkHeight
    : radius;

  const component = (
    <g key="veAxis" className="veAxis">
      <circle
        className="veAxisLine veAxisOuter"
        key="circleOuter"
        r={radiusToUse + ringThickness}
        style={{ fill: "#ffffff00", stroke: "black", strokeWidth: 0.5 }}
      />
      <circle
        className="veAxisLine veAxisInner"
        key="circle"
        r={radiusToUse}
        style={{ fill: "#ffffff00", stroke: "black", strokeWidth: 0.5 }}
      />
    </g>
  );
  return {
    component,
    height
  };
}

export default Axis;
