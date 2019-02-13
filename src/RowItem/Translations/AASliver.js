// import PropTypes from "prop-types";
import React from "react";
import pureNoFunc from "../../utils/pureNoFunc";

function AASliver(props) {
  const { forward, showAAColors = true } = props;

  if (props.letter === "-") {
    return null;
  }
  return (
    <g
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
      transform={
        "scale(" +
        (props.width / 100) * 1.25 +
        ", " +
        props.height / 100 +
        ") translate(" +
        ((forward ? -20 : -50) +
          ((props.relativeAAPositionInTranslation - 1) * 100) / 1.25) +
        ",0)"
      }
    >
      <title>{props.title}</title>
      {showAAColors && (
        <polyline
          className={props.letter}
          transform={forward ? "scale(3,1)" : "translate(300,0) scale(-3,1) "}
          points="0,0 74,0 85,50 74,100 0,100 16,50 0,0"
          strokeWidth="5"
          opacity={0.5}
          fill={props.color || "gray"}
        />
      )}
      {props.positionInCodon === 1 && (
        <text
          fontSize={25}
          stroke="black"
          strokeWidth={2}
          transform={`scale(3,3) translate(${forward ? 45 : 55},21)`}
          x="0"
          y="4"
          style={{ textAnchor: "middle" }}
        >
          {props.letter}
        </text>
      )}
    </g>
  );
}

export default pureNoFunc(AASliver);
