// import PropTypes from "prop-types";
import React from "react";
import pureNoFunc from "../../utils/pureNoFunc";

function AASliver(props) {
  const {
    forward,
    aminoAcidIndex,
    showAAColors = true,
    onClick,
    onContextMenu,
    width,
    height,
    relativeAAPositionInTranslation,
    title,
    color,
    showAminoAcidNumbers,
    letter
  } = props;

  if (letter === "-") {
    return null;
  }
  return (
    <g
      onClick={onClick}
      onContextMenu={onContextMenu}
      transform={
        "scale(" +
        (width / 100) * 1.25 +
        ", " +
        height / 100 +
        ") translate(" +
        ((forward ? -20 : -50) +
          ((relativeAAPositionInTranslation - 1) * 100) / 1.25) +
        ",0)"
      }
    >
      <title>{title}</title>
      {showAAColors && (
        <polyline
          className={letter}
          transform={forward ? "scale(3,1)" : "translate(300,0) scale(-3,1) "}
          points="0,0 74,0 85,50 74,100 0,100 16,50 0,0"
          strokeWidth="5"
          opacity={0.5}
          fill={color || "gray"}
        />
      )}

      <text
        fontSize={25}
        stroke="black"
        strokeWidth={2}
        transform={`scale(3,3) translate(${forward ? 45 : 55},21)`}
        x="0"
        y="4"
        style={{ textAnchor: "middle" }}
      >
        {letter}
      </text>

      {showAminoAcidNumbers && (aminoAcidIndex + 1) % 5 === 0 && (
        <text
          fontSize={25}
          stroke="black"
          strokeWidth={2}
          transform={`scale(3,3) translate(${forward ? 45 : 55},51)`}
          x="0"
          y="4"
          style={{ textAnchor: "middle" }}
        >
          {aminoAcidIndex + 1}
        </text>
      )}
    </g>
  );
}

export default pureNoFunc(AASliver);
