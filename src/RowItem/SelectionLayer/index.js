import draggableClassnames from "../../constants/draggableClassnames";
import React from "react";
import Caret from "../Caret";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import getOverlapsOfPotentiallyCircularRanges from "ve-range-utils/getOverlapsOfPotentiallyCircularRanges";

function SelectionLayer(props) {
  let {
    charWidth,
    bpsPerRow,
    row,
    sequenceLength,
    regions,
    color: topLevelColor,
    hideCarets = false,
    selectionLayerRightClicked,
    className: globalClassname = ""
  } = props;
  return (
    <div>
      {regions.map(function(selectionLayer, topIndex) {
        let { className = "", style = {}, start, end, color } = selectionLayer;
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
              sequenceLength
            );
            let caretSvgs = [];
            if (!hideCarets) {
              //DRAW CARETS
              caretSvgs = [
                overlap.start === start && (
                  <Caret
                    {...{
                      charWidth,
                      row,
                      key: key + "caret1",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " " +
                        draggableClassnames.selectionStart,
                      caretPosition: overlap.start
                    }}
                  />
                ),
                overlap.end === end && (
                  <Caret
                    {...{
                      charWidth,
                      row,
                      key: key + "caret2",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " " +
                        draggableClassnames.selectionEnd,
                      caretPosition: overlap.end + 1
                    }}
                  />
                )
              ];
            }
            return [
              <div
                onContextMenu={function(event) {
                  selectionLayerRightClicked({
                    event,
                    annotation: selectionLayer
                  });
                }}
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
                  background: color || topLevelColor
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

export default SelectionLayer;
