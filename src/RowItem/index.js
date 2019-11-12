import {
  normalizePositionByRangeLength,
  getSequenceWithinRange,
  getOverlapsOfPotentiallyCircularRanges
} from "ve-range-utils";
import { map, camelCase, startCase, startsWith } from "lodash";
import flatMap from "lodash/flatMap";
import { getComplementSequenceString } from "ve-sequence-utils";
import React from "react";
import pluralize from "pluralize";
import SelectionLayer from "./SelectionLayer";
import Sequence from "./Sequence";
import Axis from "./Axis";
import Orfs from "./Orfs";
import Translations from "./Translations";

import CutsiteLabels from "./CutsiteLabels";
import Cutsites from "./Cutsites";
import Caret from "./Caret";
import StackedAnnotations from "./StackedAnnotations";
import "./style.css";
import Chromatogram from "./Chromatograms/Chromatogram";
import { rowHeights } from "../RowView/estimateRowHeight";

function noop() {}

function getPropsForType(props, type, pluralType) {
  const upperPluralType = startCase(pluralType);
  const toRet = {
    annotationColor: props[pluralType + "Color"],
    annotationHeight:
      props[pluralType + "Height"] || rowHeights[pluralType].height,
    spaceBetweenAnnotations:
      props["spaceBetweenAnnotations" + upperPluralType] ||
      rowHeights[pluralType].spaceBetweenAnnotations,
    marginTop:
      props[pluralType + "MarginTop"] || rowHeights[pluralType].marginTop,
    marginBottom:
      props[pluralType + "MarginBottom"] || rowHeights[pluralType].marginBottom,
    annotationRanges: props.row[pluralType],
    showLabels:
      props.annotationLabelVisibility &&
      props.annotationLabelVisibility[pluralType],
    onClick: props[type + "Clicked"],
    onRightClick: props[type + "RightClicked"]
  };

  return toRet;
}

export class RowItem extends React.PureComponent {
  render() {
    let {
      charWidth = 12,
      selectionLayer = { start: -1, end: -1 },
      deletionLayers = {},
      replacementLayers = {},
      searchLayers = [],
      rowTopComp,
      rowBottomComp,
      isProtein,
      tickSpacing,
      aminoAcidNumbersHeight = rowHeights.aminoAcidNumbers.height,
      cutsiteLabelHeight = rowHeights.cutsiteLabels.height,
      sequenceHeight = rowHeights.sequence.height,
      axisHeight = rowHeights.axis.height,
      axisMarginTop = rowHeights.axis.marginTop,
      width,
      annotationVisibility = {},
      annotationLabelVisibility = {},
      additionalSelectionLayers = [],
      caretPosition = -1,
      row = {
        sequence: "",
        start: 0,
        end: 0,
        rowNumber: 0
      },
      emptyText,
      alignmentType,
      alignmentData,
      sequenceLength = row.sequence.length,
      chromatogramData,
      fullSequence = "",
      replacementLayerClicked = noop,
      replacementLayerRightClicked = noop,
      searchLayerClicked = noop,
      backgroundRightClicked = noop,
      selectionLayerRightClicked = noop,
      searchLayerRightClicked = noop,
      translationDoubleClicked = noop,
      cutsiteClicked = noop,
      cutsiteRightClicked = noop,
      minHeight = 22,
      bpsPerRow = sequenceLength,
      editorName
    } = this.props;

    let {
      chromatogram: showChromatogram,
      // orfLabels: showOrfLabel,
      cutsites: showCutsites,
      cutsitesInSequence: showCutsitesInSequence,
      axis: showAxis,
      axisNumbers: showAxisNumbers,
      // yellowAxis: showYellowAxis,
      aminoAcidNumbers: showAminoAcidNumbers,
      dnaColors: showDnaColors,
      reverseSequence: showReverseSequence,
      sequence: showSequence
    } = annotationVisibility;
    let { cutsites: showCutsiteLabels = true } = annotationLabelVisibility;
    let { sequence = "", cutsites = [] } = row;

    let reverseSequence = getComplementSequenceString(
      (alignmentData && alignmentData.sequence) || sequence
    );
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
      charWidth = width / Math.max(bpsPerRow, 1);
    }
    let rowContainerStyle = {
      position: "relative",
      minHeight,
      width: width + "px"
    };
    let getGaps = () => ({
      gapsBefore: 0,
      gapsInside: 0
    });
    if (alignmentData) {
      const gapMap = getGapMap(alignmentData.sequence);
      //this function is used to calculate the number of spaces that come before or inside a range
      getGaps = rangeOrCaretPosition => {
        if (typeof rangeOrCaretPosition !== "object") {
          return {
            gapsBefore:
              gapMap[Math.min(rangeOrCaretPosition, gapMap.length - 1)]
          };
        }
        //otherwise it is a range!
        const { start, end } = rangeOrCaretPosition;
        const toReturn = {
          gapsBefore: gapMap[start],
          gapsInside:
            gapMap[Math.min(end, gapMap.length - 1)] -
            gapMap[Math.min(start, gapMap.length - 1)]
        };

        return toReturn;
      };
    }
    let annotationCommonProps = {
      editorName,
      charWidth,
      bpsPerRow,
      getGaps,
      isProtein,
      sequenceLength,
      row: { start: row.start, end: row.end }
    };

    const drawAnnotations = (type, extraProps = {}) => {
      const {
        CompOverride,
        shouldShow,
        noPlural,
        alignmentType,
        ...otherExtraProps
      } = extraProps;
      const pluralType = noPlural ? type : pluralize(type);
      if (
        shouldShow !== undefined
          ? !shouldShow
          : !annotationVisibility[pluralType] ||
            Object.keys(row[pluralType] || {}).length <= 0
      ) {
        return null;
      }
      const CompToUse = CompOverride || StackedAnnotations;
      return (
        <CompToUse
          type={type}
          containerClassName={camelCase(
            "veRowView-" + pluralType + "Container"
          )}
          alignmentType={alignmentType}
          {...annotationCommonProps}
          {...getPropsForType(this.props, type, pluralType)}
          {...otherExtraProps}
        />
      );
    };

    // a t g a t c a g g
    // 0 1 2 3 4 5 6 8 9
    //0 1 2 3 4 5 6 7 9

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
              className="ve_sequence_strikethrough"
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

    const translationCommonProps = {
      CompOverride: Translations,
      showAminoAcidNumbers: showAminoAcidNumbers,
      sequenceLength,
      aminoAcidNumbersHeight
    };
    const partProps = {
      getExtraInnerCompProps: function(annotationRange) {
        const { annotation } = annotationRange;
        const { color } = annotation;
        const colorToUse = startsWith(color, "override_")
          ? color.replace("override_", "")
          : "purple";
        return {
          fill: "white",
          textColor: "black",
          stroke: colorToUse,
          color: colorToUse
        };
      },
      alignmentType
    };
    return (
      <div onContextMenu={backgroundRightClicked} className="veRowItemWrapper">
        {rowTopComp && rowTopComp}
        <div
          className="veRowItem"
          style={rowContainerStyle}
          // onMouseMove={this.onMouseMove}
          // onMouseUp={this.onMouseUp}
          // onMouseDown={this.onMouseDown}
        >
          {/* <div className="vespacer" /> */}

          <SelectionLayer
            className="veSearchLayerContainer"
            customTitleStart="Search match"
            // color="yellow"
            // hideCarets
            regions={searchLayers}
            {...annotationCommonProps}
            selectionLayerRightClicked={searchLayerRightClicked}
            row={
              alignmentData
                ? { start: 0, end: alignmentData.sequence.length - 1 }
                : row
            }
            onClick={searchLayerClicked}
          />
          <SelectionLayer
            isDraggable
            selectionLayerRightClicked={selectionLayerRightClicked}
            {...annotationCommonProps}
            row={
              alignmentData
                ? { start: 0, end: alignmentData.sequence.length - 1 }
                : row
            }
            regions={selectionLayers}
          />
          {drawAnnotations("warning", {
            getExtraInnerCompProps: () => ({
              pointiness: 0,
              rangeType: "middle"
            })
          })}
          {drawAnnotations("assemblyPiece")}
          {drawAnnotations("lineageAnnotation")}
          {drawAnnotations("part", partProps)}
          {drawAnnotations("primer", {
            sequence: fullSequence
          })}
          {drawAnnotations("orf", {
            CompOverride: Orfs
          })}
          {drawAnnotations("translation", {
            ...translationCommonProps,
            onDoubleClick: translationDoubleClicked
          })}

          {showCutsiteLabels &&
            showCutsites &&
            Object.keys(cutsites).length > 0 && (
              <CutsiteLabels
                {...annotationCommonProps}
                onClick={cutsiteClicked}
                onRightClick={cutsiteRightClicked}
                annotationRanges={cutsites}
                annotationHeight={cutsiteLabelHeight}
              />
            )}

          {showChromatogram && chromatogramData && (
            <Chromatogram
              chromatogramData={chromatogramData}
              alignmentData={alignmentData}
              {...annotationCommonProps}
            />
          )}

          <div
            className="veRowItemSequenceContainer"
            style={{ position: "relative" }}
          >
            {showSequence && (
              <Sequence
                cutsites={cutsites} //pass this in order to get children cutsites to re-render
                showDnaColors={showDnaColors}
                hideBps={charWidth < 7}
                sequence={alignmentData ? alignmentData.sequence : row.sequence} //from alignment data and has "-"" chars in it
                height={sequenceHeight}
                showCutsites={showCutsites}
                length={
                  alignmentData
                    ? alignmentData.sequence.length
                    : row.sequence.length
                }
                charWidth={charWidth}
                alignmentData={alignmentData}
                {...annotationCommonProps}
              >
                {showCutsites && Object.keys(cutsites).length > 0 && (
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
            {emptyText}

            {showReverseSequence && (
              <Sequence
                isReverse
                cutsites={cutsites} //pass this in order to get children cutsites to re-render
                showDnaColors={showDnaColors}
                hideBps={charWidth < 7}
                length={reverseSequence.length}
                showCutsites={showCutsites}
                sequence={reverseSequence}
                height={sequenceHeight}
                charWidth={charWidth}
              >
                {showCutsites && Object.keys(cutsites).length > 0 && (
                  <Cutsites
                    topStrand={false}
                    annotationRanges={cutsites}
                    {...annotationCommonProps}
                  />
                )}
                {deletionLayerStrikeThrough}
              </Sequence>
            )}
            {/* 
              cutsiteLabelSelectionLayer.map(function() {
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
            })
             */}
            {showCutsites &&
              showCutsitesInSequence &&
              Object.keys(cutsites).map(function(id, index) {
                let cutsite = cutsites[id];
                let layer = cutsite.annotation.recognitionSiteRange;
                return (
                  layer.start > -1 && (
                    <SelectionLayer
                      hideTitle
                      {...annotationCommonProps}
                      {...{
                        key: "restrictionSiteRange" + index,
                        height: showReverseSequence
                          ? sequenceHeight * 2
                          : sequenceHeight,
                        hideCarets: true,
                        opacity: 0.3,
                        className: "cutsiteLabelSelectionLayer",
                        border: `2px solid ${"lightblue"}`,
                        // background: 'none',
                        background: "lightblue",
                        regions: [layer],
                        row: alignmentData
                          ? { start: 0, end: alignmentData.sequence.length - 1 }
                          : row
                      }}
                    />
                  )
                );
              })}
          </div>
          {drawAnnotations("feature")}

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
                  showDnaColors={showDnaColors}
                  key={index}
                  sequence={seqInRow}
                  startOffset={startOffset}
                  height={height}
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
                    width={Math.max(0, Number(width))}
                    height={Math.max(0, Number(height))}
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
          {/* <DeletionLayers
            deletionLayerClicked={deletionLayerClicked}
            deletionLayerRightClicked={deletionLayerRightClicked}
            deletionLayers={deletionLayers}
            {...annotationCommonProps}
          /> */}

          {drawAnnotations("primaryProteinSequence", {
            ...translationCommonProps,

            noPlural: true
          })}
          {showAxis && (
            <Axis
              tickSpacing={tickSpacing}
              showAxisNumbers={showAxisNumbers}
              annotationHeight={axisHeight}
              marginTop={axisMarginTop}
              {...annotationCommonProps}
            />
          )}
          {caretPosition > -1 && (
            <Caret
              caretPosition={caretPosition}
              shouldBlink
              {...{ ...annotationCommonProps, ...{ getGaps: undefined } }}
              row={
                alignmentData
                  ? { start: 0, end: alignmentData.sequence.length - 1 }
                  : row
              }
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

function getGapMap(sequence) {
  const gapMap = [0]; //a map of position to how many gaps come before that position [0,0,0,5,5,5,5,17,17,17, ]
  sequence.split("").forEach(char => {
    if (char === "-") {
      gapMap[Math.max(0, gapMap.length - 1)] =
        (gapMap[Math.max(0, gapMap.length - 1)] || 0) + 1;
    } else {
      gapMap.push(gapMap[gapMap.length - 1] || 0);
      // gapMap[gapMap.length] =
    }
  });
  return gapMap;
}
// var a = getGapMap("---tagccc---tagasdfw--gg")
