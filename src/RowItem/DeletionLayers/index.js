import AnnotationPositioner from "../AnnotationPositioner";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import React from "react";
import pureNoFunc from "../../utils/pureNoFunc";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import { getOverlapsOfPotentiallyCircularRanges } from "ve-range-utils";

function DeletionLayers(props) {
  let {
    charWidth,
    bpsPerRow,
    row,
    sequenceLength,
    deletionLayerClicked,
    deletionLayerRightClicked,
    deletionLayers = {},
    deletionLineHeight = 6
  } = props;

  let deletionLayersToUse = Object.keys(deletionLayers).map(function(key) {
    return deletionLayers[key];
  });
  if (!deletionLayersToUse.length) return null;
  return (
    <AnnotationContainerHolder
      className="veRowViewDeletionLayers"
      containerHeight={deletionLineHeight}
    >
      {deletionLayersToUse
        .sort(function(deletionLayer) {
          return deletionLayer.inBetweenBps ? 1 : 0;
        })
        .map(function(deletionLayer, index) {
          let rangeSpansSequence =
            deletionLayer.start === deletionLayer.end + 1 ||
            (deletionLayer.start === 0 &&
              deletionLayer.end === sequenceLength - 1);
          let { /* className = "", style = {},  */ color } = deletionLayer;
          let overlaps = getOverlapsOfPotentiallyCircularRanges(
            deletionLayer,
            row,
            sequenceLength
          );
          return overlaps.map(function(overlap) {
            let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
              overlap,
              row,
              bpsPerRow,
              charWidth,
              sequenceLength
            );
            let deletionStart = overlap.start === deletionLayer.start;
            let deletionEnd = overlap.end === deletionLayer.end;

            return [
              <AnnotationPositioner
                height={deletionLineHeight}
                width={width}
                key={index}
                top={0}
                // className={classnames() }
                left={
                  xStart + (deletionLayer.inBetweenBps ? charWidth / 1.2 : 0)
                }
              >
                <g
                  className="clickable"
                  onClick={function(event) {
                    deletionLayerClicked({ annotation: deletionLayer, event });
                  }}
                  onContextMenu={function(event) {
                    deletionLayerRightClicked({
                      annotation: deletionLayer,
                      event
                    });
                  }}
                >
                  <rect
                    fill={color}
                    x="0"
                    y="0"
                    height={deletionLineHeight}
                    width={width}
                  />
                  {rangeSpansSequence &&
                    deletionStart && (
                      <rect
                        fill={"blue"}
                        x="0"
                        y="0"
                        height={deletionLineHeight}
                        width={4}
                      />
                    )}
                  {rangeSpansSequence &&
                    deletionEnd && (
                      <rect
                        fill={"blue"}
                        x={width - 4}
                        y="0"
                        height={deletionLineHeight}
                        width={4}
                      />
                    )}
                </g>
              </AnnotationPositioner>
            ];
          });
        })}
    </AnnotationContainerHolder>
  );
}

export default pureNoFunc(DeletionLayers);
