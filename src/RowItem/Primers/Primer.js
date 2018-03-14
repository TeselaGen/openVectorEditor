import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

// import PropTypes from "prop-types";

import React from "react";

function Primer(props) {
  let {
    widthInBps,
    charWidth,
    height,
    rangeType,
    forward,
    name,
    pointiness = 8,
    // fontWidth = 9,
    color = "orange",
    primerClicked,
    primerRightClicked,
    gapsInside = 0,
    annotation
  } = props;

  let width = (widthInBps + gapsInside) * charWidth;
  let charWN = charWidth; //charWN is normalized
  if (charWidth < 15) {
    //allow the arrow width to adapt
    if (width > 15) {
      charWN = 15; //tnr: replace 15 here with a non-hardcoded number..
    } else {
      charWN = width;
    }
  }
  let widthMinusOne = width - charWN;
  let path;
  // starting from the top left of the primer
  if (rangeType === "middle") {
    //draw a rectangle
    path = `
        M 0,0 
        L ${width - pointiness / 2},0
        Q ${width + pointiness / 2},${height / 2} ${width -
      pointiness / 2},${height}
        L ${0},${height}
        Q ${pointiness},${height / 2} ${0},${0}
        z`;
  } else if (rangeType === "start") {
    path = `
        M 0,0 
        L ${width - pointiness / 2},0 
        Q ${width + pointiness / 2},${height / 2} ${width -
      pointiness / 2},${height}
        L 0,${height} 
        z`;
  } else if (rangeType === "beginningAndEnd") {
    path = `
        M 0,0 
        L ${widthMinusOne},0 
        L ${width},${height / 2} 
        L ${widthMinusOne},${height} 
        L 0,${height} 
        z`;
  } else {
    path = `
      M 0,0 
      L ${widthMinusOne},0 
      L ${width},${height / 2} 
      L ${widthMinusOne},${height} 
      L 0,${height} 
      Q ${pointiness},${height / 2} ${0},${0}
      z`;
  }

  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    let canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
  }
  let textLength = getTextWidth(name, "normal 10pt Maven Pro");
  let nameToDisplay = name;
  // var textLength = name.length * fontWidth
  let textOffset = rangeType === "end" && !forward ? 14 : 6;
  if (textLength - 30 > widthMinusOne) {
    textOffset = 0;
    nameToDisplay = "";
  }
  // path=path.replace(/ /g,'')
  // path=path.replace(/\n/g,'')
  return (
    <g
      className="veRowViewPrimer clickable"
      onClick={function(event) {
        primerClicked({ annotation, event });
      }}
      onContextMenu={function(event) {
        primerRightClicked({ annotation, event });
      }}
    >
      <title>{getAnnotationNameAndStartStopString(annotation)}</title>
      <path
        strokeWidth="1"
        stroke={"black"}
        fill={color}
        transform={forward ? null : "translate(" + width + ",0) scale(-1,1) "}
        d={path}
      />
      <text
        style={{ fill: "black", fontSize: "10px" }}
        transform={`translate(${textOffset},${height - 2})`}
      >
        {nameToDisplay}
      </text>
    </g>
  );
}

// Primer.propTypes = {
//   widthInBps: PropTypes.number.isRequired,
//   charWidth: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   rangeType: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   forward: PropTypes.bool.isRequired,
//   primerClicked: PropTypes.func.isRequired
// };

export default withHover(Primer);
