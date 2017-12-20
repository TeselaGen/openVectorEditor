import {
  normalizePositionByRangeLength,
  getSequenceWithinRange,
  getOverlapsOfPotentiallyCircularRanges
} from "ve-range-utils";
import map from "lodash/map";
import flatMap from "lodash/flatMap";
import { getComplementSequenceString } from "ve-sequence-utils";
import React from "react";
import SelectionLayer from "./SelectionLayer";
import Sequence from "./Sequence";
import LineageLines from "./LineageLines";
import DeletionLayers from "./DeletionLayers";
import Axis from "./Axis";
import Orfs from "./Orfs";
import Translations from "./Translations";
import Features from "./Features";
import Primers from "./Primers";
import CutsiteLabels from "./CutsiteLabels";
import Cutsites from "./Cutsites";
import Caret from "./Caret";
import Parts from "./Parts";
import "./style.css";
function noop() {}

export class RowItem extends React.Component {
  render() {
    let {
      charWidth = 12,
      selectionLayer = { start: -1, end: -1 },
      deletionLayers = {},
      replacementLayers = {},
      searchLayers = [],
      rowTopComp,
      rowBottomComp,
      // setSelectionLayer = noop,
      cutsiteLabelSelectionLayer = [{ start: -1, end: -1, color: "black" }],
      annotationHeight = 14,
      featureHeight = 16,
      partHeight = 16,
      primerHeight = 16,
      tickSpacing = 10,
      sequenceHeight = 16,
      spaceBetweenAnnotations = 2,
      width,
      annotationVisibility = {},
      annotationLabelVisibility = {},
      additionalSelectionLayers = [],
      lineageLines = [],
      caretPosition = -1,
      sequenceLength = 0,
      row = {
        sequence: "",
        start: 0,
        end: 0,
        rowNumber: 0
      },
      fullSequence = "",
      deletionLayerClicked = noop,
      deletionLayerRightClicked = noop,
      replacementLayerClicked = noop,
      replacementLayerRightClicked = noop,
      featureClicked = noop,
      featureRightClicked = noop,
      partClicked = noop,
      partRightClicked = noop,
      translationRightClicked = noop,
      primerClicked = noop,
      primerRightClicked = noop,
      selectionLayerRightClicked = noop,
      orfClicked = noop,
      orfRightClicked = noop,
      translationClicked = noop,
      translationDoubleClicked = noop,
      cutsiteClicked = noop,
      bpsPerRow,
      editorName
    } = this.props;
    let {
      features: showFeatures = true,
      primers: showPrimers = true,
      // featureLabels: showFeatureLabels=true,
      translations: showTranslations = true,
      // translationLabels: showTranslationLabels=true,
      parts: showParts = true,
      // partLabels: showPartLabels=true,
      orfs: showOrfs = true,
      lineageLines: showLineageLines = true,
      // orfLabels: showOrfLabels=true,
      cutsites: showCutsites = true,
      axis: showAxis = true,
      yellowAxis: showYellowAxis = false,
      caret: showCaret = true,
      reverseSequence: showReverseSequence = true,
      sequence: showSequence = true
    } = annotationVisibility;
    let {
      features: showFeatureLabels = true,
      parts: showPartLabels = true,
      cutsites: showCutsiteLabels = true
    } = annotationLabelVisibility;
    let {
      sequence = "",
      features = [],
      primers = [],
      translations = [],
      parts = [],
      cutsites = [],
      orfs = []
    } = row;
    let reverseSequence = getComplementSequenceString(sequence);
    if (!row) {
      return null;
    }
    let selectionLayers = [
      ...additionalSelectionLayers,
      ...(Array.isArray(selectionLayer) ? selectionLayer : [selectionLayer])
    ];

    if (!width) {
      width = bpsPerRow * charWidth;
    } else {
      charWidth = width / bpsPerRow;
    }
    let rowContainerStyle = {
      position: "relative",
      width: width + "px"
    };
    let annotationCommonProps = {
      editorName,
      charWidth,
      bpsPerRow,
      sequenceLength,
      annotationHeight,
      spaceBetweenAnnotations,
      row
    };

    let deletionLayersToDisplay = flatMap(
      { ...replacementLayers, ...deletionLayers },
      function(layer) {
        if (layer.caretPosition > -1) {
          return [];
        }
        let overlaps = getOverlapsOfPotentiallyCircularRanges(
          layer,
          row,
          sequenceLength
        );
        return overlaps;
      }
    );
    let deletionLayerStrikeThrough = deletionLayersToDisplay.length
      ? deletionLayersToDisplay.map(function(layer, index) {
          let left = (layer.start - row.start) * charWidth;
          let width = (layer.end - layer.start + 1) * charWidth;
          return (
            <div
              key={"deletionLayer" + index}
              className={"ve_sequence_strikethrough"}
              style={{
                left,
                width,
                top: 10,
                height: 2,
                position: "absolute",
                background: "black"
              }}
            />
          );
        })
      : null;

    return (
      <div className="veRowItemWrapper">
        {rowTopComp && rowTopComp}
        <div
          className="veRowItem"
          style={rowContainerStyle}
          // onMouseMove={this.onMouseMove}
          // onMouseUp={this.onMouseUp}
          // onMouseDown={this.onMouseDown}
        >
          <div className="ve-spacer" />

          <SelectionLayer
            color={"yellow"}
            regions={searchLayers}
            {...annotationCommonProps}
          />
          <SelectionLayer
            isDraggable
            selectionLayerRightClicked={selectionLayerRightClicked}
            {...annotationCommonProps}
            regions={selectionLayers}
          />

          {showFeatures &&
            Object.keys(features).length > 0 && (
              <Features
                showFeatureLabels={showFeatureLabels}
                featureClicked={featureClicked}
                featureRightClicked={featureRightClicked}
                annotationRanges={features}
                {...annotationCommonProps}
                annotationHeight={featureHeight}
              />
            )}

          {showParts &&
            Object.keys(parts).length > 0 && (
              /* <Parts
                showPartLabels={showPartLabels}
                partClicked={partClicked}
                partRightClicked={partRightClicked}
                annotationRanges={parts}
                {...annotationCommonProps}
                annotationHeight={partHeight}
              /> */
              <Features
                isPart
                showFeatureLabels={showPartLabels}
                featureClicked={partClicked}
                featureRightClicked={partRightClicked}
                annotationRanges={parts}
                {...annotationCommonProps}
                annotationHeight={partHeight}
              />
            )}

          {showPrimers &&
            Object.keys(primers).length > 0 && (
              <Primers
                sequence={fullSequence}
                primerClicked={primerClicked}
                primerRightClicked={primerRightClicked}
                annotationRanges={primers}
                {...annotationCommonProps}
                annotationHeight={primerHeight}
              />
            )}

          {showOrfs &&
            Object.keys(orfs).length > 0 && (
              <Orfs
                orfClicked={orfClicked}
                orfRightClicked={orfRightClicked}
                annotationRanges={orfs}
                {...annotationCommonProps}
              />
            )}

          {showTranslations &&
            Object.keys(translations).length > 0 && (
              <Translations
                translationClicked={translationClicked}
                translationRightClicked={translationRightClicked}
                translationDoubleClicked={translationDoubleClicked}
                annotationRanges={translations}
                {...annotationCommonProps}
              />
            )}
          {showCutsiteLabels &&
            showCutsites &&
            Object.keys(cutsites).length > 0 && (
              <CutsiteLabels
                cutsiteClicked={cutsiteClicked}
                annotationRanges={cutsites}
                {...annotationCommonProps}
              />
            )}

          <div
            className="veRowItemSequenceContainer"
            style={{ position: "relative" }}
          >
            {showSequence &&
              charWidth > 7 && (
                <Sequence
                  sequence={sequence}
                  height={sequenceHeight}
                  length={sequence.length}
                  charWidth={charWidth}
                >
                  {showCutsites &&
                    Object.keys(cutsites).length > 0 && (
                      <Cutsites
                        sequenceLength={sequenceLength}
                        annotationRanges={cutsites}
                        topStrand
                        {...annotationCommonProps}
                      />
                    )}
                  {deletionLayerStrikeThrough}
                </Sequence>
              )}

            {showReverseSequence &&
              charWidth > 7 && (
                <Sequence
                  length={sequence.length}
                  sequence={reverseSequence}
                  height={sequenceHeight}
                  charWidth={charWidth}
                >
                  {showCutsites &&
                    Object.keys(cutsites).length > 0 && (
                      <Cutsites
                        topStrand={false}
                        annotationRanges={cutsites}
                        {...annotationCommonProps}
                      />
                    )}
                  {deletionLayerStrikeThrough}
                </Sequence>
              )}
            {cutsiteLabelSelectionLayer.map(function(/* layer */) {
              return "";
              // let { color = "black" } = layer;
              // return (
              //   layer.start > -1 && (
              //     <SelectionLayer
              //       {...{
              //         height: showReverseSequence
              //           ? sequenceHeight * 2 + 1
              //           : sequenceHeight + 1,
              //         hideCarets: true,
              //         opacity: 0.3,
              //         className: "cutsiteLabelSelectionLayer",
              //         border: `2px solid ${color}`,
              //         // background: 'none',
              //         background: color,
              //         regions: [layer]
              //       }}
              //       {...annotationCommonProps}
              //     />
              //   )
              // );
            })}
            {showCutsites &&
              Object.keys(cutsites).map(function(id, index) {
                let cutsite = cutsites[id];
                let layer = cutsite.annotation.recognitionSiteRange;
                return (
                  layer.start > -1 && (
                    <SelectionLayer
                      {...{
                        key: "restrictionSiteRange" + index,
                        height: showReverseSequence
                          ? sequenceHeight * 2 + 1
                          : sequenceHeight + 1,
                        hideCarets: true,
                        opacity: 0.3,
                        className: "cutsiteLabelSelectionLayer",
                        border: `2px solid ${"lightblue"}`,
                        // background: 'none',
                        background: "lightblue",
                        regions: [layer]
                      }}
                      {...annotationCommonProps}
                    />
                  )
                );
              })}
          </div>

          {showLineageLines && lineageLines.length ? (
            <LineageLines
              lineageLines={lineageLines}
              {...annotationCommonProps}
            />
          ) : null}

          {map(replacementLayers, function(replacementLayer) {
            if (!replacementLayer) return null;
            let atCaret = replacementLayer.caretPosition > -1;
            let normedCaretPos;
            if (atCaret) {
              normedCaretPos = normalizePositionByRangeLength(
                replacementLayer.caretPosition,
                sequenceLength
              );
            }
            let insertedBpsLayer = {
              ...replacementLayer,
              start: atCaret ? normedCaretPos : replacementLayer.start,
              end:
                (atCaret ? normedCaretPos : replacementLayer.start) +
                replacementLayer.sequence.length
            };
            let { sequence } = insertedBpsLayer;
            let layerRangeOverlaps = getOverlapsOfPotentiallyCircularRanges(
              insertedBpsLayer,
              row,
              sequenceLength
            );
            return layerRangeOverlaps.map(function(layer, index) {
              let isStart = layer.start === insertedBpsLayer.start;
              let seqInRow = getSequenceWithinRange(
                {
                  start: layer.start - insertedBpsLayer.start,
                  end: layer.end - insertedBpsLayer.start
                },
                sequence
              );
              let startOffset = layer.start - row.start;
              let width = seqInRow.length * charWidth;
              let height = sequenceHeight;
              let bufferBottom = 4;
              let bufferLeft = 2;
              let arrowHeight = isStart ? 8 : 0;
              return (
                <Sequence
                  key={index}
                  sequence={seqInRow}
                  startOffset={startOffset}
                  height={height}
                  containerStyle={{
                    marginTop: 8,
                    marginBottom: 6
                  }}
                  length={seqInRow.length}
                  charWidth={charWidth}
                >
                  <svg
                    style={{
                      left: startOffset * charWidth,
                      height: sequenceHeight,
                      position: "absolute"
                    }}
                    ref="rowViewTextContainer"
                    onClick={function(event) {
                      replacementLayerClicked({
                        annotation: replacementLayer,
                        event
                      });
                    }}
                    onContextMenu={function(event) {
                      replacementLayerRightClicked({
                        annotation: replacementLayer,
                        event
                      });
                    }}
                    className="rowViewTextContainer clickable"
                    width={width}
                    height={height}
                  >
                    <polyline
                      points={`${-bufferLeft},0 ${-bufferLeft},${-arrowHeight}, ${charWidth /
                        2},0 ${width},0 ${width},${height +
                        bufferBottom} ${-bufferLeft},${height +
                        bufferBottom} ${-bufferLeft},0`}
                      fill="none"
                      stroke="black"
                      strokeWidth="2px"
                    />
                  </svg>
                </Sequence>
              );
            });
          })}
          <DeletionLayers
            deletionLayerClicked={deletionLayerClicked}
            deletionLayerRightClicked={deletionLayerRightClicked}
            deletionLayers={deletionLayers}
            {...annotationCommonProps}
          />

          {showYellowAxis && (
            <svg width="100%" height="6px">
              <rect
                x="0"
                y="0"
                width="100%"
                height="6px"
                fill="#FFFFB3"
                stroke="grey"
                strokeWidth="1"
              />
            </svg>
          )}
          {showAxis && (
            <Axis tickSpacing={tickSpacing} {...annotationCommonProps} />
          )}
          {caretPosition > -1 &&
            showCaret && (
              <Caret
                caretPosition={caretPosition}
                shouldBlink
                {...annotationCommonProps}
              />
            )}
        </div>
        {rowBottomComp && rowBottomComp}
      </div>
    );
  }
}

// module.exports = pure(RowItem);
export default RowItem;
