import { onlyUpdateForKeys } from "recompose";
import draggableClassnames from "../../constants/draggableClassnames";
import React from "react";
import Caret from "../Caret";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import { getOverlapsOfPotentiallyCircularRanges } from "ve-range-utils";

function SelectionLayer(props) {
  let {
    charWidth,
    bpsPerRow,
    isDraggable,
    row,
    sequenceLength,
    regions,
    getGaps,
    hideTitle: topLevelHideTitle,
    customTitle: topLevelCustomTitle,
    color: topLevelColor,
    hideCarets: topLevelHideCarets = false,
    selectionLayerRightClicked,
    className: globalClassname = "",
    onClick
  } = props;
  return (
    <div>
      {regions.map(function(selectionLayer, topIndex) {
        let {
          className = "",
          style = {},
          start,
          end,
          color,
          hideTitle,
          customTitle,
          hideCarets = false,
          ignoreGaps,
          height
        } = selectionLayer;
        let classNameToPass =
          "veRowViewSelectionLayer " +
          className +
          " " +
          className +
          " " +
          globalClassname;
        if (start > -1) {
          let overlaps = getOverlapsOfPotentiallyCircularRanges(
            selectionLayer,
            row,
            sequenceLength
          );
          //DRAW SELECTION LAYER

          return overlaps.map(function(overlap, index) {
            const key = topIndex + "-" + index;
            let isTrueStart = false;
            let isTrueEnd = false;
            if (overlap.start === selectionLayer.start) {
              isTrueStart = true;
            }
            if (overlap.end === selectionLayer.end) {
              isTrueEnd = true;
            }
            let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
              overlap,
              row,
              bpsPerRow,
              charWidth,
              sequenceLength,
              ...(ignoreGaps ? {} : getGaps(overlap))
            );
            let caretSvgs = [];
            if (!(hideCarets || topLevelHideCarets)) {
              //DRAW CARETS
              caretSvgs = [
                overlap.start === start && (
                  <Caret
                    {...{
                      charWidth,
                      row,
                      getGaps,
                      ignoreGaps,
                      key: key + "caret1",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " " +
                        (isDraggable ? draggableClassnames.selectionStart : ""),
                      caretPosition: overlap.start
                    }}
                  />
                ),
                overlap.end === end && (
                  <Caret
                    {...{
                      charWidth,
                      row,
                      getGaps,
                      ignoreGaps,
                      key: key + "caret2",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " " +
                        (isDraggable ? draggableClassnames.selectionEnd : ""),
                      caretPosition: overlap.end + 1
                    }}
                  />
                )
              ];
            }
            return [
              <div
                title={
                  hideTitle || topLevelHideTitle
                    ? ""
                    : `${customTitle ||
                        topLevelCustomTitle ||
                        "Selecting"} between ` +
                      (selectionLayer.start + 1) +
                      " - " +
                      (selectionLayer.end + 1)
                }
                onContextMenu={function(event) {
                  selectionLayerRightClicked && selectionLayerRightClicked({
                    event,
                    annotation: selectionLayer
                  });
                }}
                onClick={
                  onClick
                    ? function(event) {
                        onClick({
                          event,
                          annotation: selectionLayer
                        });
                      }
                    : () => {}
                }
                key={key}
                className={
                  classNameToPass +
                  (isTrueStart ? " isTrueStart " : "") +
                  (isTrueEnd ? " isTrueEnd " : "")
                }
                style={{
                  width,
                  left: xStart,
                  ...style,
                  background: color || topLevelColor,
                  height
                }}
              />,
              ...caretSvgs
            ];
          });
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default onlyUpdateForKeys([
  "charWidth",
  "bpsPerRow",
  "isDraggable",
  "row",
  "sequenceLength",
  "regions",
  "color",
  "hideCarets",
  "selectionLayerRightClicked",
  "className",
  "height"
])(SelectionLayer);
