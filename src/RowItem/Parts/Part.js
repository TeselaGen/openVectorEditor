import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

import React from "react";

function Part(props) {
  let {
    hoverActions,
    hoverProps: { className },
    widthInBps,
    charWidth,
    height,
    rangeType,
    forward,
    name,
    pointiness = 8,
    fontWidth = 12,
    partClicked,
    partRightClicked,
    annotation,
    gapsInside
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
  // starting from the top left of the feature
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
  let nameToDisplay = name;
  let textLength = name.length * fontWidth;
  let textOffset = widthMinusOne / 2;
  if (textLength > widthMinusOne) {
    textOffset = 0;
    nameToDisplay = "";
  }
  // path=path.replace(/ /g,'')
  // path=path.replace(/\n/g,'')
  return (
    <g
      {...hoverActions}
      className={"veRowViewPart clickable " + className}
      onClick={function(event) {
        partClicked({ annotation, event });
      }}
      onContextMenu={function(event) {
        partRightClicked({ annotation, event });
      }}
    >
      <title>
        {getAnnotationNameAndStartStopString(annotation, { isPart: true })}
      </title>
      <path
        strokeWidth="1"
        stroke="purple"
        fill="purple"
        fillOpacity={0}
        transform={forward ? null : "translate(" + width + ",0) scale(-1,1) "}
        d={path}
      />
      <text
        style={{ fill: "black", fontSize: ".75em" }}
        transform={`translate(${textOffset},${height - 2})`}
      >
        {nameToDisplay}
      </text>
    </g>
  );
}

export default withHover(Part);
