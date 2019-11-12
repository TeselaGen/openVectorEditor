// import { onlyUpdateForKeys } from "recompose";
import draggableClassnames from "../../constants/draggableClassnames";
import React from "react";
import Caret from "../Caret";
import pureNoFunc from "../../utils/pureNoFunc";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import { getOverlapsOfPotentiallyCircularRanges } from "ve-range-utils";
import {
  getSelectionMessage,
  preventDefaultStopPropagation
} from "../../utils/editorUtils";

function SelectionLayer(props) {
  let {
    charWidth,
    bpsPerRow,
    isDraggable,
    row,
    sequenceLength,
    regions,
    isProtein,
    getGaps,
    hideTitle: topLevelHideTitle,
    customTitle: topLevelCustomTitle,
    color: topLevelColor,
    hideCarets: topLevelHideCarets = false,
    selectionLayerRightClicked,
    className: globalClassname = "",
    onClick
  } = props;
  let hasSelection = false;

  const toReturn = (
    <React.Fragment>
      {regions.map(function(selectionLayer, topIndex) {
        const _onClick = onClick
          ? function(event) {
              onClick({
                event,
                annotation: selectionLayer
              });
            }
          : undefined;
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
        const selectionMessage =
          hideTitle || topLevelHideTitle
            ? ""
            : getSelectionMessage({
                selectionLayer,
                customTitle: customTitle || topLevelCustomTitle,
                sequenceLength,
                isProtein
              });
        const onSelectionContextMenu = function(event) {
          selectionLayerRightClicked &&
            selectionLayerRightClicked({
              event,
              annotation: selectionLayer
            });
        };

        let classNameToPass = className + " " + globalClassname;
        if (start > -1) {
          let overlaps = getOverlapsOfPotentiallyCircularRanges(
            selectionLayer,
            row,
            sequenceLength
          );
          //DRAW SELECTION LAYER
          if (overlaps.length) hasSelection = true;
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
                      onClick: _onClick || preventDefaultStopPropagation,
                      onRightClick: onSelectionContextMenu,
                      charWidth,
                      row,
                      getGaps,
                      ignoreGaps,
                      key: key + "caret1",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " selectionLayerCaret " +
                        (isDraggable ? draggableClassnames.selectionStart : ""),
                      caretPosition: overlap.start
                    }}
                  />
                ),
                overlap.end === end && (
                  <Caret
                    {...{
                      onClick: _onClick || preventDefaultStopPropagation,
                      onRightClick: onSelectionContextMenu,
                      charWidth,
                      row,
                      getGaps,
                      ignoreGaps,
                      key: key + "caret2",
                      sequenceLength,
                      className:
                        classNameToPass +
                        " selectionLayerCaret " +
                        (isDraggable ? draggableClassnames.selectionEnd : ""),
                      caretPosition: overlap.end + 1
                    }}
                  />
                )
              ];
            }
            return [
              <div
                onClick={_onClick}
                title={selectionMessage}
                onContextMenu={onSelectionContextMenu}
                key={key}
                className={
                  classNameToPass +
                  " veSelectionLayer veRowViewSelectionLayer notCaret " +
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
    </React.Fragment>
  );
  return hasSelection ? toReturn : null;
}

export default pureNoFunc(SelectionLayer);
