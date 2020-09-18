import Color from "color";
import classnames from "classnames";
import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

import React from "react";
import { doesLabelFitInAnnotation } from "../utils";
import { noop } from "lodash";

class PointedAnnotation extends React.PureComponent {
  render() {
    let {
      className,
      widthInBps,
      charWidth,
      height,
      rangeType,
      forward,
      name = "",
      onMouseLeave,
      onMouseOver,
      isProtein,
      id,
      hideName,
      pointiness = 8,
      color = "orange",
      fill,
      stroke,
      opacity,
      onClick,
      onDoubleClick = noop,
      textColor,
      onRightClick,
      gapsInside,
      gapsBefore,
      annotation,
      externalLabels,
      onlyShowLabelsThatDoNotFit
    } = this.props;

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
    let hasAPoint = false;
    // starting from the top left of the annotation
    if (rangeType === "middle") {
      //draw a rectangle
      path = `
          M 0,0 
          L ${width - pointiness / 2},0
          Q ${width + pointiness / 2},${height / 2} ${
        width - pointiness / 2
      },${height}
          L ${0},${height}
          Q ${pointiness},${height / 2} ${0},${0}
          z`;
    } else if (rangeType === "start") {
      path = `
          M 0,0 
          L ${width - pointiness / 2},0 
          Q ${width + pointiness / 2},${height / 2} ${
        width - pointiness / 2
      },${height}
          L 0,${height} 
          z`;
    } else if (rangeType === "beginningAndEnd") {
      hasAPoint = true;
      path = `
          M 0,0 
          L ${widthMinusOne},0 
          L ${width},${height / 2} 
          L ${widthMinusOne},${height} 
          L 0,${height} 
          z`;
    } else {
      hasAPoint = true;
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
    let textOffset =
      width / 2 -
      (name.length * 5) / 2 -
      (hasAPoint ? (pointiness / 2) * (forward ? 1 : -1) : 0);
    if (
      !doesLabelFitInAnnotation(name, { width }, charWidth) ||
      (externalLabels &&
        !onlyShowLabelsThatDoNotFit &&
        ["parts", "features"].includes(annotation.annotationTypePlural))
    ) {
      textOffset = 0;
      nameToDisplay = "";
    }

    return (
      <g
        {...{ onMouseLeave, onMouseOver }}
        className={" clickable " + className}
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
        <title>
          {getAnnotationNameAndStartStopString(annotation, { isProtein })}
        </title>
        <path
          strokeWidth="1"
          stroke={stroke || "black"}
          opacity={opacity}
          fill={fill || color}
          transform={forward ? null : "translate(" + width + ",0) scale(-1,1) "}
          d={path}
        />
        {!hideName && nameToDisplay && (
          <text
            className={classnames(
              "ve-monospace-font",
              annotation.labelClassName
            )}
            style={{
              fontSize: ".9em",
              fill: textColor || (Color(color).isDark() ? "white" : "black")
            }}
            transform={`translate(${textOffset},${height - 2})`}
          >
            {nameToDisplay}
          </text>
        )}
      </g>
    );
  }
}

export default withHover(PointedAnnotation);
