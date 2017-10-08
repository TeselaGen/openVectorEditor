import getAnnotationNameAndStartStopString
  from "../utils/getAnnotationNameAndStartStopString";
import PropTypes from "prop-types";
import React from "react";
import orfFrameToColorMap from "../constants/orfFrameToColorMap";

function Orf(props) {
  let {
    height,
    rangeType,
    normalizedInternalStartCodonIndices = [],
    forward,
    frame = 0,
    annotation,
    width,
    orfClicked,
    orfRightClicked,
    charWidth
  } = props;
  let heightToUse = height / 1.5;
  let color = orfFrameToColorMap[frame];
  let arrow = null;
  let endCircle = null;
  let circle = (
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
        transform={`translate(${width - charWidth},0) scale(${charWidth / 64},${heightToUse / 64})`}
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
  let internalStartCodonCircles = normalizedInternalStartCodonIndices.map(
    function(internalStartCodon, index) {
      return React.cloneElement(circle, {
        key: index,
        transform: `translate(${charWidth * internalStartCodon},0)`
      });
    }
  );
  return (
    <g
      onClick={function(event) {
        orfClicked({ annotation, event });
      }}
      onContextMenu={function(event) {
        orfRightClicked({ annotation, event });
      }}
      className={`veRowViewOrf clickable frame${frame}`}
      strokeWidth="1"
      stroke={color}
      fillOpacity={1}
      fill={color}
      transform={forward ? null : `translate(${width},0) scale(-1,1)`}
    >
      <path
        transform={
          (rangeType === "start" ? `translate(${charWidth},0)` : "") +
            `scale(${(width - (rangeType === "middle" ? 0 : charWidth)) / 64},${heightToUse / 64})`
        }
        d="M0 40 L64 40 L64 20 L0 20 Z"
      />
      {arrow}
      {endCircle}
      {internalStartCodonCircles}
      <title>
        {" "}
        {getAnnotationNameAndStartStopString(annotation, {
          startText: "Open Reading Frame:"
        })}
        {" "}
      </title>

    </g>
  );
}

Orf.propTypes = {
  width: PropTypes.number.isRequired,
  charWidth: PropTypes.number.isRequired,
  frame: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rangeType: PropTypes.string.isRequired,
  forward: PropTypes.bool.isRequired
};

export default Orf;
