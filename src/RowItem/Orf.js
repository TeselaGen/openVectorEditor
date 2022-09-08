import getAnnotationNameAndStartStopString from "../utils/getAnnotationNameAndStartStopString";
import React from "react";
import orfFrameToColorMap from "../constants/orfFrameToColorMap";

function Orf(props) {
  const {
    height,
    rangeType,
    normalizedInternalStartCodonIndices = [],
    forward,
    frame = 0,
    annotation,
    width,
    onClick,
    isProtein,
    onRightClick,
    charWidth,
    readOnly,
    gapsInside,
    gapsBefore
  } = props;
  const heightToUse = height / 1.5;
  const color = orfFrameToColorMap[frame];
  let arrow = null;
  let endCircle = null;
  const circle = (
    <circle
      key="circle"
      r={heightToUse / 2}
      cx={heightToUse / 2}
      cy={heightToUse / 2}
    />
  );
  if (rangeType === "end" || rangeType === "beginningAndEnd") {
    arrow = (
      <path
        transform={`translate(${
          width + gapsInside - Math.max(charWidth, 5)
        },0) scale(${Math.max(charWidth, 8) / 64},${heightToUse / 64})`}
        d={
          rangeType === "start"
            ? "M0 16 L0 48 L16 64 L48 64 L64 48 L64 16 L48 0 L16 0 Z"
            : "M0 64 L64 32 L0 0 Z"
        }
      />
    );
  }
  if (rangeType === "start" || rangeType === "beginningAndEnd") {
    endCircle = circle;
  }
  const internalStartCodonCircles = normalizedInternalStartCodonIndices.map(
    function (internalStartCodon, index) {
      return React.cloneElement(circle, {
        key: index,
        transform: `translate(${charWidth * internalStartCodon},0)`
      });
    }
  );
  return (
    <g
      onClick={function (event) {
        onClick({ annotation, event, gapsInside, gapsBefore });
      }}
      onContextMenu={function (event) {
        onRightClick({ annotation, event, gapsInside, gapsBefore });
      }}
      className={`veRowViewOrf clickable frame${frame}`}
      strokeWidth="1"
      stroke={color}
      fillOpacity={1}
      fill={color}
      transform={
        forward ? null : `translate(${width + gapsInside},0) scale(-1,1)`
      }
    >
      <path
        transform={
          (rangeType === "start" ? `translate(${charWidth},0)` : "") +
          `scale(${
            (width + gapsInside - (rangeType === "middle" ? 0 : charWidth)) / 64
          },${heightToUse / 64})`
        }
        d="M0 40 L64 40 L64 20 L0 20 Z"
      />
      {arrow}
      {endCircle}
      {internalStartCodonCircles}
      <title>
        {" "}
        {getAnnotationNameAndStartStopString(annotation, {
          startText: "Open Reading Frame:",
          isProtein,
          readOnly
        })}{" "}
      </title>
    </g>
  );
}

// Orf.propTypes = {
//   width: PropTypes.number.isRequired,
//   charWidth: PropTypes.number.isRequired,
//   frame: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   rangeType: PropTypes.string.isRequired,
//   forward: PropTypes.bool.isRequired
// };

export default Orf;
