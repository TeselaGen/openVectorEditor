import Color from "color";
import classnames from "classnames";
import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

import React, { useState } from "react";
import { doesLabelFitInAnnotation } from "../utils";
import { noop } from "lodash";
import getAnnotationClassnames from "../../utils/getAnnotationClassnames";
import { getStripedPattern } from "../../utils/editorUtils";
import { ANNOTATION_LABEL_FONT_WIDTH } from "../constants";
import { partOverhangs } from "../partOverhangs";
import { Tooltip } from "@blueprintjs/core";

function PointedAnnotation(props) {
  const {
    className,
    widthInBps,
    charWidth,
    height,
    rangeType,
    forward,
    arrowheadType,
    name: _name = "",
    customName,
    type,
    readOnly,
    isStriped,
    onMouseLeave,
    onMouseOver,
    isProtein,
    id,
    extraHeight,
    flipAnnotation,
    insertPaths,
    insertTicks,
    hideName,
    color = "orange",
    fill,
    stroke,
    opacity,
    onClick = noop,
    onDoubleClick = noop,
    textColor,
    onRightClick = noop,
    gapsInside,
    gapsBefore,
    annotation,
    truncateLabelsThatDoNotFit,
    onlyShowLabelsThatDoNotFit
  } = props;

  const name = customName || _name;
  let pointiness = props.pointiness || 4;
  let arrowPointiness = props.arrowPointiness || 1;
  const [isOpen, setOpen] = useState(false);
  const [isOpen2, setOpen2] = useState(false);
  if (arrowheadType === "NONE") {
    pointiness = 0;
    arrowPointiness = 0;
  }
  const _rangeType = annotation.rangeTypeOverride || rangeType;

  const classNames = getAnnotationClassnames(annotation, {
    isProtein,
    type,
    viewName: "RowView"
  });
  let partOverhangStart;
  let partOverhangEnd;

  partOverhangs.forEach((h) => {
    const overhangBps = props[h];
    if (overhangBps) {
      if (h.includes("fivePrime")) {
        partOverhangStart = overhangBps;
        if (h.includes("Underhang")) {
          partOverhangStart += " Underhang";
        } else if (h.includes("Overhang")) {
          partOverhangStart += " Overhang";
        }
      } else {
        partOverhangEnd = overhangBps;
        if (h.includes("Underhang")) {
          partOverhangEnd += " Underhang";
        } else if (h.includes("Overhang")) {
          partOverhangEnd += " Overhang";
        }
      }
    }
  });

  const width = (widthInBps + gapsInside) * charWidth;
  let charWN = charWidth; //charWN is normalized
  if (charWidth < 15) {
    //allow the arrow width to adapt
    if (width > 15) {
      charWN = 15; //tnr: replace 15 here with a non-hardcoded number..
    } else {
      charWN = width;
    }
  }
  charWN = arrowPointiness * charWN;

  const widthMinusOne = width - charWN;
  let path;
  let hasAPoint = false;
  const endLine = annotation.overlapsSelf
    ? `L 0,${height / 2}
  L -10,${height / 2}
  L 0,${height / 2} `
    : "";
  const bottomLine = `${insertTicks || ""} L 0,${height}`;
  const startLines = `M 0,0
  ${insertPaths || ""}`;
  const arrowLine = annotation.overlapsSelf
    ? `L ${width + 10},${height / 2}
  L ${width},${height / 2} `
    : "";

  // starting from the top left of the annotation
  if (_rangeType === "middle") {
    //draw a rectangle
    path = `
        ${startLines}
        L ${width - pointiness / 2},0
        Q ${width + pointiness / 2},${height / 2} ${
      width - pointiness / 2
    },${height}
        ${bottomLine}
        Q ${pointiness},${height / 2} ${0},${0}
        z`;
  } else if (_rangeType === "start") {
    path = `
        ${startLines}
        L ${width - pointiness / 2},0

        Q ${width + pointiness / 2},${height / 2} ${
      width - pointiness / 2
    },${height}

        ${bottomLine}
        ${endLine}
        z`;
  } else if (_rangeType === "beginningAndEnd") {
    hasAPoint = true;
    path = `
        ${startLines}
        L ${widthMinusOne},0
        L ${width},${height / 2}
        ${arrowLine}
        L ${widthMinusOne},${height}
        ${bottomLine}
        ${endLine}
        z`;
  } else {
    hasAPoint = true;
    path = `
      ${startLines}
      L ${widthMinusOne},0
      L ${width},${height / 2}
      ${arrowLine}
      L ${widthMinusOne},${height}
      ${bottomLine}
      Q ${pointiness},${height / 2} ${0},${0}
      z`;
  }
  let nameToDisplay = name;
  let textOffset =
    width / 2 -
    (name.length * 5) / 2 -
    (hasAPoint ? (pointiness / 2) * (forward ? 1 : -1) : 0);
  if (
    !doesLabelFitInAnnotation(name, { width }, charWidth) ||
    (!onlyShowLabelsThatDoNotFit &&
      ["parts", "features"].includes(annotation.annotationTypePlural))
  ) {
    if (truncateLabelsThatDoNotFit) {
      const fractionToDisplay =
        width / (name.length * ANNOTATION_LABEL_FONT_WIDTH);
      const numLetters = Math.floor(fractionToDisplay * name.length);
      nameToDisplay = name.slice(0, numLetters);
      if (nameToDisplay.length > 3) {
        if (nameToDisplay.length !== name.length) {
          nameToDisplay += "..";
        }

        textOffset =
          width / 2 -
          (nameToDisplay.length * 5) / 2 -
          (hasAPoint ? (pointiness / 2) * (forward ? 1 : -1) : 0);
      } else {
        textOffset = 0;
        nameToDisplay = "";
      }
    } else {
      textOffset = 0;
      nameToDisplay = "";
    }
  }
  let _textColor = textColor;
  if (!textColor) {
    try {
      _textColor = Color(color).isDark() ? "white" : "black";
    } catch (error) {
      _textColor = "white";
    }
  }

  return (
    <g
      {...{ onMouseLeave, onMouseOver }}
      className={` clickable ${className} ${classNames} ${
        forward ? "ann-forward" : `ann-reverse`
      }`}
      data-id={id}
      onClick={function (event) {
        onClick({ annotation, event, gapsBefore, gapsInside });
      }}
      onDoubleClick={function (event) {
        onDoubleClick &&
          onDoubleClick({ annotation, event, gapsBefore, gapsInside });
      }}
      onContextMenu={function (event) {
        onRightClick({ annotation, event, gapsBefore, gapsInside });
      }}
    >
      {!(isOpen || isOpen2) && (
        <title>
          {getAnnotationNameAndStartStopString(annotation, {
            isProtein,
            readOnly
          })}
        </title>
      )}
      {isStriped && getStripedPattern({ color })}

      <path
        strokeWidth="1"
        stroke={stroke || "black"}
        opacity={opacity}
        fill={isStriped ? "url(#diagonalHatch)" : fill || color}
        transform={
          forward
            ? null
            : "translate(" +
              width +
              `,${flipAnnotation ? -extraHeight + 10 : 0}) scale(-1,${
                flipAnnotation ? "-" : ""
              }1) `
        }
        d={path}
      />
      {partOverhangStart &&
        (rangeType === (forward ? "start" : "end") ||
          rangeType === "beginningAndEnd") && (
          <Tooltip
            onInteraction={(isOpen) => {
              setOpen(isOpen);
            }}
            isOpen={isOpen}
            wrapperTagName="g"
            targetTagName="g"
            content={partOverhangStart}
          >
            <circle
              className="partWithOverhangsIndicator"
              style={{ fillOpacity: 1 }}
              fill="#ac68cc"
              cx={(forward ? -7 : 0) + 15}
              cy={7}
              r={4}
            ></circle>
          </Tooltip>
        )}
      {partOverhangEnd &&
        (rangeType === (forward ? "end" : "start") ||
          rangeType === "beginningAndEnd") && (
          <Tooltip
            onInteraction={(isOpen) => {
              setOpen2(isOpen);
            }}
            isOpen={isOpen2}
            wrapperTagName="g"
            targetTagName="g"
            content={partOverhangEnd}
          >
            <circle
              className="partWithOverhangsIndicator"
              style={{ fillOpacity: 1 }}
              fill="#ac68cc"
              cx={(forward ? -7 : 0) + width - 10}
              cy={7}
              r={4}
            ></circle>
          </Tooltip>
        )}
      {!hideName && nameToDisplay && (
        <text
          className={classnames(
            "veLabelText ve-monospace-font",
            annotation.labelClassName
          )}
          style={{
            fontSize: ".9em",
            fill: _textColor
          }}
          transform={`translate(${textOffset},${height - 2})`}
        >
          {nameToDisplay}
        </text>
      )}
    </g>
  );
}

export default withHover(PointedAnnotation);

//  {/* <Tooltip
//               wrapperTagName="g"
//               targetTagName="g"
//               content={"asdfasdfasdfasfdp"}
//             >
//               <rect
//                 style={{ fillOpacity: 1 }}
//                 stroke="#ac68cc"
//                 fill="none"
//                 x={-10}
//                 width={10}
//                 height={5}
//               ></rect>
//             </Tooltip>
//             <Tooltip
//               wrapperTagName="g"
//               targetTagName="g"
//               content={"asdfasdfasdfasfdp"}
//             >
//               <rect
//                 style={{ fillOpacity: 1 }}
//                 stroke="#ac68cc"
//                 fill="none"
//                 x={ width + 2 }
//                 y={7}
//                 width={10}
//                 height={5}
//               ></rect>
//             </Tooltip> */}
