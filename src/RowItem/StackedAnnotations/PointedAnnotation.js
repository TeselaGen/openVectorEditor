import Color from "color";
import classnames from "classnames";
import withHover from "../../helperComponents/withHover";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";

import React from "react";
import { map } from "lodash";
import { doesLabelFitInAnnotation } from "../utils";
import { noop } from "lodash";
import getAnnotationClassnames from "../../utils/getAnnotationClassnames";
import { getStripedPattern } from "../../utils/editorUtils";
import { fudge2, realCharWidth } from "../constants";
import getSequenceWithinRange from "ve-range-utils/lib/getSequenceWithinRange";
import { getComplementSequenceString } from "ve-sequence-utils/lib";

class PointedAnnotation extends React.PureComponent {
  render() {
    const {
      className,
      widthInBps,
      charWidth,
      height,
      rangeType,
      forward,
      name = "",
      type,
      isStriped,
      onMouseLeave,
      onMouseOver,
      isProtein,
      id,
      annotationRange,
      hideName,
      pointiness = 8,
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
      externalLabels,
      onlyShowLabelsThatDoNotFit
    } = this.props;
    const _rangeType = annotation.rangeTypeOverride || rangeType;

    const classNames = getAnnotationClassnames(annotation, {
      isProtein,
      type,
      viewName: "RowView"
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
    let basesToShow;
    if (annotation && annotation.bases) {
      const basesForRange = getSequenceWithinRange(
        {
          start: annotationRange.start - annotation.start,
          end: annotationRange.end - annotation.start
        },
        annotation.forward
          ? annotation.bases
          : annotation.bases.split("").reverse().join("")
      );

      const fudge = charWidth - realCharWidth;
      const textLength = charWidth * basesForRange.length - fudge - fudge2;

      basesToShow = (
        <text
          {...{ textLength, y: forward ? 22 : -3, x: fudge / 2 }}
          className="ve-monospace-font"
        >
          {map(basesForRange.split(""), (b, i) => {
            const indexOfBase = i + annotationRange.start;
            let seqForBase = annotation.fullSeq[indexOfBase] || "";
            if (!annotation.forward) {
              seqForBase = getComplementSequenceString(seqForBase);
            }
            const isMatch = seqForBase.toLowerCase() === b.toLowerCase();
            return (
              <tspan
                className={isMatch ? "" : "tg-no-match-seq"}
                fill={isMatch ? "black" : "red"}
                textLength={textLength}
              >
                {b}
              </tspan>
            );
          })}
        </text>
      );
    }
    const widthMinusOne = width - charWN;
    let path;
    let hasAPoint = false;
    const endLine = annotation.overlapsSelf
      ? `L 0,${height / 2} 
    L -10,${height / 2} 
    L 0,${height / 2} `
      : "";
    const arrowLine = annotation.overlapsSelf
      ? `L ${width + 10},${height / 2} 
    L ${width},${height / 2} `
      : "";

    // starting from the top left of the annotation
    if (_rangeType === "middle") {
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
    } else if (_rangeType === "start") {
      path = `
          M 0,0 
          L ${width - pointiness / 2},0 
          Q ${width + pointiness / 2},${height / 2} ${
        width - pointiness / 2
      },${height}
          L 0,${height} 
          ${endLine}
          z`;
    } else if (_rangeType === "beginningAndEnd") {
      hasAPoint = true;
      path = `
          M 0,0 
          L ${widthMinusOne},0 
          L ${width},${height / 2} 
          ${arrowLine}
          L ${widthMinusOne},${height} 
          L 0,${height} 
          ${endLine}
          z`;
    } else {
      hasAPoint = true;
      path = `
        M 0,0 
        L ${widthMinusOne},0 
        L ${width},${height / 2} 
        ${arrowLine}
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
        className={` clickable ${className} ${classNames}`}
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
        style={{
          transform: `translateY(${
            basesToShow ? (forward ? "-8px" : "6px") : 0
          })`
        }}
      >
        <title>
          {getAnnotationNameAndStartStopString(annotation, { isProtein })}
        </title>
        {basesToShow}
        {isStriped && getStripedPattern(color)}
        <path
          strokeWidth="1"
          stroke={stroke || "black"}
          opacity={opacity}
          fill={isStriped ? "url(#diagonalHatch)" : fill || color}
          transform={forward ? null : "translate(" + width + ",0) scale(-1,1) "}
          d={path}
        />
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
}

export default withHover(PointedAnnotation);
