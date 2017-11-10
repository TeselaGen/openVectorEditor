// import lruMemoize from "lru-memoize";
import getAngleForPositionMidpoint from "./getAngleForPositionMidpoint";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import shouldFlipText from "./shouldFlipText";
import React from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";

function Axis({
  radius,
  sequenceLength,
  showAxisNumbers,
  circularAndLinearTickSpacing,
  tickMarkHeight = 10,
  tickMarkWidth = 1,
  textOffset = 20,
  ringThickness = 6
}) {
  let height =
    ringThickness + (showAxisNumbers ? textOffset + tickMarkHeight : 0);
  const radiusToUse = showAxisNumbers
    ? radius + textOffset + tickMarkHeight
    : radius;
  let tickPositions = calculateTickMarkPositionsForGivenRange({
    range: {
      start: 0,
      end: sequenceLength
    },
    tickSpacing: circularAndLinearTickSpacing,
    sequenceLength
  });

  let tickMarksAndLabels = showAxisNumbers
    ? tickPositions.map(function(tickPosition, index) {
        let tickAngle = getAngleForPositionMidpoint(
          tickPosition,
          sequenceLength
        );
        console.log("tickPosition + 1:", tickPosition + 1);
        return (
          <PositionAnnotationOnCircle
            key={"axis" + index}
            sAngle={tickAngle}
            eAngle={tickAngle}
            height={radiusToUse}
          >
            <g>
              <text
                transform={
                  (shouldFlipText(tickAngle) ? "rotate(180)" : "") +
                  ` translate(0, ${
                    shouldFlipText(tickAngle) ? -textOffset : textOffset
                  })`
                }
                style={{
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fontSize: "small"
                }}
              >
                {tickPosition + 1 + ""}
              </text>
              <rect width={tickMarkWidth} height={tickMarkHeight} />
            </g>
          </PositionAnnotationOnCircle>
        );
      })
    : null;
  let component = (
    <g key="veAxis" className="veAxis">
      <circle
        className="veAxisFill"
        id="circularViewAxis"
        key="circleOuter"
        r={radiusToUse + ringThickness}
        style={{ fill: "#FFFFB3", stroke: "black", strokeWidth: 0.5 }}
      />
      <circle
        id="circularViewAxis"
        key="circle"
        r={radiusToUse}
        style={{ fill: "white", stroke: "black", strokeWidth: 0.5 }}
      />
      {tickMarksAndLabels}
    </g>
  );
  return {
    component,
    height
  };
}

// export default lruMemoize(5, undefined, true)(Axis);
export default Axis;
