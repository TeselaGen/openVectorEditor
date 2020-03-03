import React from "react";
import { onlyUpdateForKeys } from "recompose";
import withHover from "../helperComponents/withHover";
import getXStartAndWidthOfRowAnnotation from "./getXStartAndWidthOfRowAnnotation";
import IntervalTree from "node-interval-tree";
import getYOffset from "../CircularView/getYOffset";
import { reduce, values, startCase, filter } from "lodash";
import { getRangeLength } from "ve-range-utils/lib";
import { doesLabelFitInAnnotation } from "./utils";

const BUFFER_WIDTH = 6; //labels shouldn't be less than 6px from eachother on the same line

function Labels(props) {
  let {
    annotationRanges = {},
    bpsPerRow,
    charWidth,
    rangeMax,
    onlyShowLabelsThatDoNotFit,
    annotationHeight,
    textWidth = 6,
    editorName
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let warningMessage = null;
  // if (Object.keys(annotationRanges).length > 50) {
  //   warningMessage = (
  //     <span style={{ color: "red" }}>
  //       <br />
  //       Warning: Only the first 50 cutsites will be displayed. Filter the
  //       cutsites you wish to see using the filter tool <br />
  //     </span>
  //   );
  // }

  let rowLength = bpsPerRow * charWidth;
  // let counter = 0;
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  let rowCenter = rowLength / 2;
  let iTree = new IntervalTree(rowCenter);

  annotationRanges = values(
    reduce(
      annotationRanges,
      (accum, annotationRange) => {
        const identifier =
          annotationRange.annotation.annotationTypePlural +
          "--" +
          annotationRange.id;
        if (
          // annotationRange.annotation.annotationTypePlural === "parts" ||
          !accum[identifier] ||
          getRangeLength(accum[identifier], rangeMax) <
            getRangeLength(annotationRange, rangeMax)
        ) {
          accum[identifier] = annotationRange;
          return accum;
        } else {
          return accum;
        }
      },
      {}
    )
  );

  filter(annotationRanges, r => {
    if (onlyShowLabelsThatDoNotFit) {
      //tnrtodo: more work needs to be done here to make this actually configurable
      //check if annotation name will fit
      if (r.annotation.annotationTypePlural === "cutsites") {
        //we don't want to filter out any cutsite labels
        return true;
      }
      return !doesLabelFitInAnnotation(
        r.annotation.name,
        { range: r },
        charWidth
      );
    }
    return true;
  }).forEach(function(annotationRange, index) {
    const pluralType = annotationRange.annotation.annotationTypePlural;
    let annotation = annotationRange.annotation;
    if (!annotation) {
      annotation = annotationRange;
    }
    let annotationLength =
      (annotation.name || annotation.restrictionEnzyme.name).length * textWidth;
    let { xStart, width } = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth
    );

    xStart =
      annotation.annotationTypePlural === "cutsites"
        ? xStart
        : xStart + width / 2;

    const xStartOriginal = xStart;
    // if (annotation.name.includes("CmR I'm")) debugger
    let xEnd = xStart + annotationLength;

    if (xEnd > rowLength) {
      xStart = xStart - (xEnd - rowLength);
      xEnd = rowLength;
    }
    xEnd += BUFFER_WIDTH;
    let yOffset = getYOffset(iTree, xStart, xEnd);
    iTree.insert(xStart, xEnd, {
      ...annotationRange,
      yOffset
    });

    if (yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = yOffset;
    }
    let height = yOffset * annotationHeight;
    annotationsSVG.push(
      <DrawLabel
        id={annotation.id}
        key={"cutsiteLabel" + index}
        {...{
          editorName,
          annotation,
          className: `${annotationRange.annotation.labelClassName || ""} ${
            labelClassNames[pluralType]
          } veLabel `,
          xStartOriginal,
          onClick: annotationRange.onClick,
          onRightClick: annotationRange.onRightClick,
          height,
          xStart,
          xEnd
        }}
      />
    );
  });
  if (!annotationsSVG.length) return null;
  let containerHeight = (maxAnnotationYOffset + 1) * annotationHeight;
  return (
    <div
      width="100%"
      style={{
        position: "relative",
        height: containerHeight,
        display: "block"
      }}
      className="veRowViewLabelsContainer"
    >
      {annotationsSVG}
      {warningMessage}
    </div>
  );
}

export default onlyUpdateForKeys([
  "annotationRanges",
  "bpsPerRow",
  "charWidth",
  "annotationHeight",
  "spaceBetweenAnnotations",
  "onClick",
  "textWidth",
  "editorName"
])(Labels);

const DrawLabel = withHover(
  class DrawLabelInner extends React.Component {
    render() {
      const {
        hovered,
        className,
        annotation,
        onClick,
        onRightClick,
        height,
        xStartOriginal,
        xStart,
        onMouseLeave,
        onMouseOver
      } = this.props;
      let heightToUse = height;
      let bottom = 0;
      if (hovered) {
        try {
          const line = this.n;
          const isRowView = document.querySelector(".veRowView").contains(line);

          const el = line
            .closest(".veRowItem")

            .querySelector(
              annotation.annotationTypePlural === "cutsites"
                ? isRowView
                  ? ".cutsiteLabelSelectionLayer"
                  : ".veRowViewAxis"
                : `[dataId="${annotation.id}"].veRowView${startCase(
                    annotation.annotationTypePlural.slice(0, -1)
                  )}`
            );
          const annDims = el.getBoundingClientRect();
          const lineDims = line.getBoundingClientRect();
          const heightDiff =
            annDims.bottom - lineDims.bottom - annDims.height / 2;
          heightToUse = height + heightDiff;
          bottom = -heightDiff;
        } catch (e) {
          window.veDebugLabels && console.error(`err computing label line:`, e);
        }
      }
      return (
        <div>
          <div
            {...{ onMouseLeave, onMouseOver }}
            className={className + " ve-monospace-font"}
            onClick={function(event) {
              onClick({ event, annotation });
              event.stopPropagation();
            }}
            onContextMenu={function(event) {
              onRightClick({ event, annotation });
              event.stopPropagation();
            }}
            style={{
              cursor: "pointer",
              position: "absolute",
              bottom: height,
              ...(hovered && { fontWeight: "bold" }),
              ...(annotation.annotationTypePlural !== "cutsites" && {
                fontStyle: "normal"
              }),
              left: xStart,
              color: hovered
                ? "black"
                : annotation.annotationTypePlural === "parts"
                ? "purple"
                : annotation.labelColor,
              zIndex: 10
            }}
          >
            {annotation.name || annotation.restrictionEnzyme.name}
          </div>

          <div
            ref={n => {
              if (n) this.n = n;
            }}
            style={{
              zIndex: 50,
              position: "absolute",
              left: xStartOriginal,
              bottom,
              height: Math.max(heightToUse, 3),
              width: hovered ? 2 : 1,
              opacity: hovered ? 1 : 0.2,
              background: hovered ? "black" : "grey"
            }}
          />
        </div>
      );
    }
  }
);

const labelClassNames = {
  cutsites: "veCutsiteLabel",
  parts: "vePartLabel",
  features: "veFeatureLabel"
};
