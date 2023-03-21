import { getOverlapsOfPotentiallyCircularRanges } from "ve-range-utils";
import { map, camelCase, startCase, startsWith, flatMap, assign } from "lodash";
import { getComplementSequenceString } from "ve-sequence-utils";
import React, { useMemo } from "react";
import pluralize from "pluralize";
import SelectionLayer from "./SelectionLayer";
import Sequence from "./Sequence";
import Axis from "./Axis";
import Orfs from "./Orfs";
import Translations from "./Translations";
import Labels from "./Labels";
import Cutsites from "./Cutsites";
import Caret from "./Caret";
import StackedAnnotations from "./StackedAnnotations";
import "./style.css";
import Chromatogram from "./Chromatograms/Chromatogram";
import { rowHeights } from "../RowView/estimateRowHeight";
import { filter } from "lodash";
import { defaultCharWidth } from "../constants/rowviewContants";
import { CutsiteSelectionLayers } from "./CutsiteSelectionLayers";
import { EmptyText } from "../utils/editorUtils";
import { observer } from "mobx-react";

function noop() {}

function filterRanges(ranges, extraProps = {}) {
  if (!ranges) return ranges;
  if (extraProps.onlyForward) {
    ranges = filter(ranges, (a) => a.annotation.forward);
  }
  if (extraProps.onlyReverse) {
    ranges = filter(ranges, (a) => !a.annotation.forward);
  }
  return ranges;
}
function getPropsForType(props, type, pluralType, extraProps) {
  const upperPluralType = startCase(pluralType);
  const annotationRanges = filterRanges(props.row[pluralType], extraProps);

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
    annotationRanges,
    showLabels:
      props.annotationLabelVisibility &&
      props.annotationLabelVisibility[pluralType],
    onClick: props[type + "Clicked"],
    onRightClick: props[type + "RightClicked"],
    onDoubleClick: props[type + "DoubleClicked"]
  };

  return toRet;
}

export default observer(function RowItem(props) {
  let {
    ed,
    charWidth = defaultCharWidth,
    rowTopComp,
    rowBottomComp,
    tickSpacing,
    truncateLabelsThatDoNotFit = true,
    aminoAcidNumbersHeight = rowHeights.aminoAcidNumbers.height,
    cutsiteLabelHeight = rowHeights.cutsiteLabels.height,
    sequenceHeight = rowHeights.sequence.height,
    axisHeight = rowHeights.axis.height,
    primerHeight = rowHeights.primers.height,
    axisMarginTop = rowHeights.axis.marginTop,
    width,
    row,
    isRowView,
    alignmentType,
    alignmentData,
    chromatogramData,
    searchLayerClicked = noop,
    backgroundRightClicked = noop,
    selectionLayerRightClicked = noop,
    searchLayerRightClicked = noop,
    translationDoubleClicked = noop,
    minHeight = 22,
    rowContainerStyle,
    onScroll,
    scrollData,

    isLinearView,
    scalePct,
    setScalePct,
    extraAnnotationProps = {}
  } = props;
  const {
    sequence: fullSequence,
    onlyShowLabelsThatDoNotFit,
    deletionLayers,
    replacementLayers,
    findTool: { searchLayers },
    annotationLabelVisibility,
    caretPosition,
    sequenceLength
  } = ed;

  const { sequence = "", annotationVisibility, bpsPerRow } = row;
  const {
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

  const reverseSequence = getComplementSequenceString(
    (alignmentData && alignmentData.sequence) || sequence
  );
  const getGaps = useMemo(() => {
    if (alignmentData) {
      const gapMap = getGapMap(alignmentData.sequence);
      //this function is used to calculate the number of spaces that come before or inside a range
      return (rangeOrCaretPosition) => {
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
    } else {
      return getGapsDefault;
    }
  }, [alignmentData]);

  if (!row) {
    return null;
  }

  if (!width) {
    width = bpsPerRow * charWidth;
  }
  if (isLinearView) {
    width -= ((charWidth || 12) * bpsPerRow.toString().length) / 2;
  }
  charWidth = charWidth || width / Math.max(bpsPerRow, 1);

  const rowStyle = {
    position: "relative",
    minHeight,
    width: width + "px"
  };

  const annotationCommonProps = {
    ed,
    getGaps,
    isRowView,
    row
  };

  const drawLabels = (type, noDraw, { filterOpts, ...extraProps } = {}) => {
    if (noDraw) {
      return null;
    }
    const pluralType = pluralize(type);
    const ranges = filterRanges(
      annotationLabelVisibility[pluralType] && annotationVisibility[pluralType]
        ? map(row[pluralType], (a) =>
            assign(a, {
              onClick: props[type + "Clicked"],
              onRightClick: props[type + "RightClicked"],
              onDoubleClick: props[type + "DoubleClicked"]
            })
          )
        : [],
      filterOpts
    );
    if (!ranges.length) return null;
    return (
      <Labels
        {...annotationCommonProps}
        onlyShowLabelsThatDoNotFit={onlyShowLabelsThatDoNotFit}
        rangeMax={bpsPerRow}
        annotationRanges={ranges}
        annotationHeight={cutsiteLabelHeight}
        {...extraProps}
      />
    );
  };

  const drawAnnotations = (type, extraProps = {}) => {
    const {
      CompOverride,
      shouldShow,
      noPlural,
      alignmentType,
      onlyForward,
      onlyReverse,
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
        truncateLabelsThatDoNotFit={truncateLabelsThatDoNotFit}
        onlyShowLabelsThatDoNotFit={onlyShowLabelsThatDoNotFit}
        type={type}
        fullSequence={fullSequence}
        containerClassName={camelCase("veRowView-" + pluralType + "Container")}
        alignmentType={alignmentType}
        {...annotationCommonProps}
        {...getPropsForType(props, type, pluralType, extraProps)}
        {...otherExtraProps}
      />
    );
  };

  // a t g a t c a g g
  // 0 1 2 3 4 5 6 8 9
  //0 1 2 3 4 5 6 7 9

  const deletionLayersToDisplay = flatMap(
    { ...replacementLayers, ...deletionLayers },
    function (layer) {
      if (layer.caretPosition > -1) {
        return [];
      }
      const overlaps = getOverlapsOfPotentiallyCircularRanges(
        layer,
        row,
        sequenceLength
      );
      return overlaps;
    }
  );
  const deletionLayerStrikeThrough = deletionLayersToDisplay.length
    ? deletionLayersToDisplay.map(function (layer, index) {
        const left = (layer.start - row.start) * charWidth;
        const width = (layer.end - layer.start + 1) * charWidth;
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
    getExtraInnerCompProps: function (annotationRange) {
      const { annotation } = annotationRange;
      const { color } = annotation;
      const colorToUse = startsWith(color, "override_")
        ? color.replace("override_", "")
        : "#ac68cc";

      let extraProps = {};
      if (typeof extraAnnotationProps["part"] === "function") {
        extraProps = extraAnnotationProps["part"](annotation);
      }
      return {
        textColor: colorToUse,
        stroke: colorToUse,
        ...extraProps
      };
    },
    alignmentType
  };

  return (
    <div
      style={rowContainerStyle}
      onContextMenu={backgroundRightClicked}
      onScroll={onScroll}
      className="veRowItemWrapper"
    >
      {rowTopComp && rowTopComp}
      <div className="veRowItem" style={rowStyle}>
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
          regions={ed.allSelectionLayers}
        />
        {drawAnnotations("warning")}
        {drawAnnotations("assemblyPiece")}
        {drawAnnotations("lineageAnnotation")}
        {drawLabels("part")}
        {drawAnnotations("part", partProps)}
        {drawAnnotations("orf", {
          CompOverride: Orfs
        })}
        {charWidth > 4 &&
          drawAnnotations("translation", {
            ...translationCommonProps,
            onDoubleClick: translationDoubleClicked
          })}

        {showChromatogram && chromatogramData && (
          <Chromatogram
            chromatogramData={chromatogramData}
            alignmentData={alignmentData}
            scalePct={scalePct}
            setScalePct={setScalePct}
            {...annotationCommonProps}
          />
        )}

        {drawLabels("cutsite", !isRowView)}
        {drawLabels("primer", false, {
          filterOpts: { onlyForward: true }
        })}

        {drawAnnotations("primer", {
          sequence: fullSequence,
          isStriped: true,
          annotationHeight: primerHeight,
          onlyForward: true
        })}
        <div
          className="veRowItemSequenceContainer"
          style={{ position: "relative" }}
        >
          {showSequence && (
            <Sequence
              ed={ed}
              row={row}
              scrollData={scrollData}
              hideBps={charWidth < 7}
              height={sequenceHeight}
              {...annotationCommonProps}
            >
              {showCutsites && Object.keys(row.cutsites).length > 0 && (
                <Cutsites
                  ed={ed}
                  row={row}
                  topStrand
                  {...annotationCommonProps}
                />
              )}
              {deletionLayerStrikeThrough}
            </Sequence>
          )}
          <EmptyText ed={ed}></EmptyText>

          {showReverseSequence && (
            <Sequence
              ed={ed}
              row={row}
              isReverse
              hideBps={charWidth < 7}
              length={reverseSequence.length}
              sequence={reverseSequence}
              height={sequenceHeight}
            >
              {showCutsites && Object.keys(row.cutsites).length > 0 && (
                <Cutsites
                  topStrand={false}
                  annotationRanges={row.cutsites}
                  {...annotationCommonProps}
                />
              )}
              {deletionLayerStrikeThrough}
            </Sequence>
          )}
          {showCutsites && showCutsitesInSequence && (
            <CutsiteSelectionLayers
              {...{
                ed,
                cutsites: row.cutsites,
                annotationCommonProps,
                showReverseSequence,
                sequenceHeight,
                alignmentData,
                row
              }}
            ></CutsiteSelectionLayers>
          )}
        </div>

        {drawAnnotations("primer", {
          sequence: fullSequence,
          isStriped: true,
          annotationHeight: primerHeight,
          onlyReverse: true
        })}
        {drawLabels("primer", false, {
          filterOpts: { onlyReverse: true }
        })}
        {drawLabels("feature")}
        {drawAnnotations("feature")}
        {drawAnnotations("primaryProteinSequence", {
          ...translationCommonProps,
          noPlural: true
        })}
        {drawLabels("cutsite", isRowView)}
        {showAxis && (
          <Axis
            scrollData={scrollData}
            tickSpacing={tickSpacing}
            showAxisNumbers={showAxisNumbers}
            annotationHeight={axisHeight}
            marginTop={axisMarginTop}
            {...annotationCommonProps}
            isLinearView={isLinearView}
          />
        )}
        {caretPosition > -1 && (
          <Caret
            {...{ ...annotationCommonProps, ...{ getGaps: undefined } }}
            row={row}
            ed={ed}
          />
        )}
      </div>
      {rowBottomComp && rowBottomComp}
    </div>
  );
});

function getGapMap(sequence) {
  const gapMap = [0]; //a map of position to how many gaps come before that position [0,0,0,5,5,5,5,17,17,17, ]
  sequence.split("").forEach((char) => {
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
function getGapsDefault() {
  return {
    gapsBefore: 0,
    gapsInside: 0
  };
}
