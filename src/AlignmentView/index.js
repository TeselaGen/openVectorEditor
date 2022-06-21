import Clipboard from "clipboard";
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Intent,
  Popover,
  InputGroup,
  Menu,
  MenuItem,
  Tooltip
} from "@blueprintjs/core";
import {
  InfoHelper,
  Loading,
  showContextMenu,
  withStore
} from "teselagen-react-components";
import { store } from "@risingstack/react-easy-state";
import { throttle, cloneDeep, map, some, forEach, isFunction } from "lodash";
import { getSequenceDataBetweenRange } from "ve-sequence-utils";
import ReactList from "@teselagen/react-list";

import { NonReduxEnhancedLinearView } from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import * as alignmentActions from "../redux/alignments";
import estimateRowHeight from "../RowView/estimateRowHeight";
import prepareRowData from "../utils/prepareRowData";
import withEditorProps from "../withEditorProps";
import SelectionLayer from "../RowItem/SelectionLayer";

import "./style.css";
import {
  editorDragged,
  editorClicked,
  editorDragStarted,
  updateSelectionOrCaret,
  editorDragStopped
} from "../withEditorInteractions/clickAndDragUtils";
import { ResizeSensor } from "@blueprintjs/core";
import Draggable from "react-draggable";
import draggableClassnames from "../constants/draggableClassnames";
import Caret from "../RowItem/Caret";
import { debounce } from "lodash";
import { view } from "@risingstack/react-easy-state";
import { noop } from "lodash";
import { massageTickSpacing } from "../utils/massageTickSpacing";
import { getClientX, getClientY } from "../utils/editorUtils";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import { updateLabelsForInViewFeatures } from "../utils/updateLabelsForInViewFeatures";

const nameDivWidth = 140;
let charWidthInLinearViewDefault = 12;
try {
  const newVal = JSON.parse(
    window.localStorage.getItem("charWidthInLinearViewDefault")
  );
  if (newVal) charWidthInLinearViewDefault = newVal;
} catch (e) {
  console.error(
    "error setting charWidthInLinearViewDefault from local storage:",
    e
  );
}

class AlignmentView extends React.Component {
  bindOutsideChangeHelper = {};
  constructor(props) {
    super(props);
    window.scrollAlignmentToPercent = this.scrollAlignmentToPercent;
    if (window.Cypress)
      window.Cypress.scrollAlignmentToPercent = this.scrollAlignmentToPercent;
    this.onShortcutCopy = document.addEventListener(
      "keydown",
      this.handleAlignmentCopy
    );
  }
  getMaxLength = () => {
    const { alignmentTracks } = this.props;
    const { sequenceData = { sequence: "" }, alignmentData } =
      alignmentTracks[0];
    const data = alignmentData || sequenceData;
    return data.noSequence ? data.size : data.sequence.length;
  };

  getNearestCursorPositionToMouseEvent(rowData, event, callback) {
    this.charWidth = this.getCharWidthInLinearView();
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    const rowDomNode = this.veTracksAndAlignmentHolder;
    const boundingRowRect = rowDomNode.getBoundingClientRect();
    const maxEnd = this.getMaxLength();
    if (getClientX(event) - boundingRowRect.left - 140 < 0) {
      nearestCaretPos = 0;
    } else {
      const clickXPositionRelativeToRowContainer =
        getClientX(event) - boundingRowRect.left - 140;
      const numberOfBPsInFromRowStart = Math.floor(
        (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
          this.charWidth
      );
      nearestCaretPos = numberOfBPsInFromRowStart + 0;
      if (nearestCaretPos > maxEnd + 1) {
        nearestCaretPos = maxEnd + 1;
      }
    }
    if (this.props.sequenceData && this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    if (this.props.sequenceLength === 0) nearestCaretPos = 0;
    const callbackVals = {
      event,
      doNotWrapOrigin: true,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      caretGrabbed: event.target.className === "cursor",
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
        draggableClassnames.selectionEnd
      )
    };
    callback(callbackVals);
  }

  componentWillUnmount() {
    if (window.Cypress) {
      delete window.scrollAlignmentToPercent;
      delete window.Cypress.scrollAlignmentToPercent;
      delete window.updateAlignmentSelection;
      delete window.Cypress.updateAlignmentSelection;
    }
    this.onShortcutCopy &&
      document.removeEventListener("keydown", this.handleAlignmentCopy);
  }
  handleAlignmentCopy = (event) => {
    if (
      event.key === "c" &&
      !event.shiftKey &&
      (event.metaKey === true || event.ctrlKey === true)
    ) {
      const input = document.createElement("textarea");
      document.body.appendChild(input);
      const seqDataToCopy = this.getAllAlignmentsFastaText();
      input.value = seqDataToCopy;
      input.select();
      const copySuccess = document.execCommand("copy");
      if (!copySuccess) {
        window.toastr.error("Selection Not Copied");
      } else {
        window.toastr.success("Selection Copied");
      }
      document.body.removeChild(input);
      event.preventDefault();
    }
  };
  getAllAlignmentsFastaText = () => {
    const selectionLayer =
      this.props.store.getState().VectorEditor.__allEditorsOptions.alignments[
        this.props.id
      ].selectionLayer || {};
    const { alignmentTracks } = this.props;
    const seqDataOfAllTracksToCopy = [];
    alignmentTracks.forEach((track) => {
      const seqDataToCopy = getSequenceDataBetweenRange(
        track.alignmentData,
        selectionLayer
      ).sequence;
      seqDataOfAllTracksToCopy.push(
        `>${track.alignmentData.name}\r\n${seqDataToCopy}\r\n`
      );
    });
    return seqDataOfAllTracksToCopy.join("");
  };
  state = {
    charWidthInLinearView: charWidthInLinearViewDefault,
    scrollAlignmentView: false,
    width: 0
  };
  easyStore = store({
    selectionLayer: { start: -1, end: -1 },
    caretPosition: -1,
    percentScrolled: 0,
    viewportWidth: 400,
    verticalVisibleRange: { start: 0, end: 0 }
  });

  getMinCharWidth = (noNameDiv) => {
    const toReturn = Math.min(
      Math.max(this.state.width - (noNameDiv ? 0 : nameDivWidth) - 5, 1) /
        this.getSequenceLength(),
      10
    );
    if (isNaN(toReturn)) return 10;
    return toReturn;
  };

  getSequenceLength = () => {
    const { alignmentTracks: [template] = [] } = this.props;
    return template.alignmentData.sequence.length || 1;
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.scrollPercentageToJumpTo !==
        this.props.scrollPercentageToJumpTo &&
      this.props.scrollPercentageToJumpTo !== undefined
    ) {
      this.scrollAlignmentToPercent(this.props.scrollPercentageToJumpTo);
    }
  }
  componentDidMount() {
    const updateAlignmentSelection = (newRangeOrCaret) => {
      this.updateSelectionOrCaret(false, newRangeOrCaret, {
        forceReduxUpdate: true
      });
    };
    window.updateAlignmentSelection = updateAlignmentSelection;
    if (window.Cypress)
      window.Cypress.updateAlignmentSelection = updateAlignmentSelection;
    this.editorDragged = editorDragged.bind(this);
    this.editorClicked = editorClicked.bind(this);
    this.editorDragStarted = editorDragStarted.bind(this);
    this.editorDragStopped = editorDragStopped.bind(this);
    setTimeout(() => {
      updateLabelsForInViewFeatures({ rectElement: ".alignmentHolder" });
    }, 0);
    setTimeout(() => {
      this.setVerticalScrollRange();
    }, 500);
  }

  annotationClicked = ({
    event,
    annotation,
    gapsBefore = 0,
    gapsInside = 0
  }) => {
    event.preventDefault && event.preventDefault();
    event.stopPropagation && event.stopPropagation();
    this.updateSelectionOrCaret(event.shiftKey, {
      ...annotation,
      start: annotation.start + gapsBefore,
      end: annotation.end + gapsBefore + gapsInside
    });
  };

  updateSelectionOrCaret = (
    shiftHeld,
    newRangeOrCaret,
    { forceReduxUpdate } = {}
  ) => {
    const sequenceLength = this.getSequenceLength();

    updateSelectionOrCaret({
      doNotWrapOrigin: true,
      shiftHeld,
      sequenceLength,
      newRangeOrCaret,
      caretPosition: this.easyStore.caretPosition,
      selectionLayer: this.easyStore.selectionLayer,
      selectionLayerUpdate: forceReduxUpdate
        ? this.forceReduxSelectionLayerUpdate
        : this.selectionLayerUpdate,
      caretPositionUpdate: this.caretPositionUpdate
    });
  };

  caretPositionUpdate = (position) => {
    const { caretPosition = -1, alignmentId } = this.props;
    if (caretPosition === position) {
      return;
    }
    this.easyStore.caretPosition = position;
    this.easyStore.selectionLayer = { start: -1, end: -1 };
    this.debouncedAlignmentRunUpdate({
      alignmentId,
      selectionLayer: { start: -1, end: -1 },
      caretPosition: position
    });
  };

  debouncedAlignmentRunUpdate = debounce(this.props.alignmentRunUpdate, 1000);

  forceReduxSelectionLayerUpdate = (newSelection) => {
    this.selectionLayerUpdate(newSelection, { forceReduxUpdate: true });
  };

  selectionLayerUpdate = (newSelection, { forceReduxUpdate } = {}) => {
    const { selectionLayer = { start: -1, end: -1 }, alignmentId } = this.props;
    if (!newSelection) return;
    const { start, end } = newSelection;

    if (selectionLayer.start === start && selectionLayer.end === end) {
      return;
    }
    this.easyStore.caretPosition = -1;
    this.easyStore.selectionLayer = newSelection;

    (forceReduxUpdate
      ? this.props.alignmentRunUpdate
      : this.debouncedAlignmentRunUpdate)({
      alignmentId,
      selectionLayer: newSelection,
      caretPosition: -1
    });
  };

  getCharWidthInLinearView = () => {
    if (this.props.isFullyZoomedOut) {
      return this.getMinCharWidth();
    } else {
      return Math.max(this.getMinCharWidth(), this.state.charWidthInLinearView);
    }
  };
  getNumBpsShownInLinearView = () => {
    const toReturn =
      (this.state.width - nameDivWidth) / this.getCharWidthInLinearView();
    return toReturn || 0;
  };
  setVerticalScrollRange = throttle(() => {
    if (
      this &&
      this.InfiniteScroller &&
      this.InfiniteScroller.getFractionalVisibleRange &&
      this.easyStore
    ) {
      let [start, end] = this.InfiniteScroller.getFractionalVisibleRange();
      if (this.props.hasTemplate) {
        end = end + 1;
      }
      if (
        this.easyStore.verticalVisibleRange.start !== start ||
        this.easyStore.verticalVisibleRange.end !== end
      )
        this.easyStore.verticalVisibleRange = { start, end };
    }
  }, 100);
  handleScroll = () => {
    // tnr: maybe add this in at some point
    // this.updateMinimapHighlightForScroll(
    //   this.oldMinimapScrollTracker || this.alignmentHolder.scrollTop,
    //   this.alignmentHolder.scrollTop
    // );
    // this.oldMinimapScrollTracker = this.alignmentHolder.scrollTop;
    // if (this.alignmentHolder.scrollTop !== this.oldMinimapScrollTracker) {
    // }
    if (this.alignmentHolder.scrollTop !== this.oldAlignmentHolderScrollTop) {
      setTimeout(() => {
        this.setVerticalScrollRange();
        this.oldAlignmentHolderScrollTop = this.alignmentHolder.scrollTop;
      }, 100);
    }
    if (this.blockScroll) {
      //we have to block the scroll sometimes when adjusting the minimap so things aren't too jumpy
      return;
    }

    const scrollPercentage =
      this.alignmentHolder.scrollLeft /
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    this.easyStore.percentScrolled = scrollPercentage || 0;
    if (this.alignmentHolderTop) {
      this.alignmentHolderTop.scrollLeft = this.alignmentHolder.scrollLeft;
    }
    updateLabelsForInViewFeatures({ rectElement: ".alignmentHolder" });
  };
  handleTopScroll = () => {
    this.alignmentHolder.scrollLeft = this.alignmentHolderTop.scrollLeft;
  };
  onMinimapSizeAdjust = (newSliderSize, newPercent) => {
    const percentageOfSpace = newSliderSize / (this.state.width - nameDivWidth);
    const seqLength = this.getSequenceLength();
    const numBpsInView = seqLength * percentageOfSpace;
    const newCharWidth = (this.state.width - nameDivWidth) / numBpsInView;
    this.blockScroll = true;
    this.setCharWidthInLinearView({ charWidthInLinearView: newCharWidth });
    setTimeout(() => {
      this.scrollAlignmentToPercent(newPercent);
      this.blockScroll = false;
      updateLabelsForInViewFeatures({ rectElement: ".alignmentHolder" });
    });
  };

  setCharWidthInLinearView = ({ charWidthInLinearView }) => {
    window.localStorage.setItem(
      "charWidthInLinearViewDefault",
      charWidthInLinearView
    );
    this.setState({ charWidthInLinearView });
    charWidthInLinearViewDefault = JSON.parse(
      window.localStorage.getItem("charWidthInLinearViewDefault")
    );
  };

  scrollToCaret = () => {
    const el = window.document.querySelector(".veCaret"); //adding .veRowViewCaret breaks this for some reason
    if (!el) return;
    el.scrollIntoView({ inline: "center" });
  };

  scrollAlignmentToPercent = (scrollPercentage) => {
    const scrollPercentageToUse = Math.min(Math.max(scrollPercentage, 0), 1);

    this.easyStore.percentScrolled = scrollPercentageToUse;
    this.alignmentHolder.scrollLeft =
      scrollPercentageToUse *
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    if (this.alignmentHolderTop) {
      this.alignmentHolderTop.scrollLeft =
        scrollPercentageToUse *
        (this.alignmentHolderTop.scrollWidth -
          this.alignmentHolderTop.clientWidth);
    }
  };
  scrollYToTrack = (trackIndex) => {
    this.InfiniteScroller.scrollTo(trackIndex);
  };

  estimateRowHeight = (index, cache) => {
    const { alignmentVisibilityToolOptions, alignmentTracks } = this.props;
    const { sequenceData } = alignmentTracks[index];
    this.rowData = prepareRowData(sequenceData, sequenceData.sequence.length);
    return estimateRowHeight({
      index,
      cache,
      // clearCache: this.clearCache,
      row: this.rowData[index],
      annotationVisibility:
        alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
      annotationLabelVisibility:
        alignmentVisibilityToolOptions.alignmentAnnotationLabelVisibility
    });
  };

  getMaxLinearViewWidth = () => {
    let maxWidth = 0;
    const charWidthInLinearView = this.getCharWidthInLinearView();
    forEach(this.props.alignmentTracks, (t) => {
      const w = (t.alignmentData || t.sequenceData).sequence.length;
      if (w > maxWidth) maxWidth = w;
    });
    return maxWidth * charWidthInLinearView;
  };

  renderItem = (_i, key, isTemplate) => {
    const charWidthInLinearView = this.getCharWidthInLinearView();

    const {
      alignmentTracks = [],
      noClickDragHandlers,
      handleSelectTrack,
      linearViewOptions,
      alignmentVisibilityToolOptions,
      hasTemplate,
      ...rest
    } = this.props;

    let i;
    if (isTemplate) {
      i = _i;
    } else if (hasTemplate) {
      i = _i + 1;
    } else {
      i = _i;
    }

    const track = alignmentTracks[i];

    const {
      sequenceData,
      alignmentData,
      additionalSelectionLayers,
      chromatogramData
      // mismatches
    } = track;
    const linearViewWidth =
      (alignmentData || sequenceData).sequence.length * charWidthInLinearView;
    const name = sequenceData.name || sequenceData.id;

    function getGapMap(sequence) {
      const gapMap = [0]; //a map of position to how many gaps come before that position [0,0,0,5,5,5,5,17,17,17, ]
      sequence.split("").forEach((char) => {
        if (char === "-") {
          gapMap[Math.max(0, gapMap.length - 1)] =
            (gapMap[Math.max(0, gapMap.length - 1)] || 0) + 1;
        } else {
          gapMap.push(gapMap[gapMap.length - 1] || 0);
        }
      });
      return gapMap;
    }

    let getGaps = () => ({
      gapsBefore: 0,
      gapsInside: 0
    });
    //this function is used to calculate the number of spaces that come before or inside a range
    getGaps = (rangeOrCaretPosition, sequence) => {
      const gapMap = getGapMap(sequence);
      if (typeof rangeOrCaretPosition !== "object") {
        return {
          gapsBefore: gapMap[Math.min(rangeOrCaretPosition, gapMap.length - 1)]
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

    // for alignment of sanger seq reads to a ref seq, have translations show up at the bp pos of ref seq's CDS features across all seq reads
    let sequenceDataWithRefSeqCdsFeatures;
    if (this.props.alignmentType === "SANGER SEQUENCING") {
      if (i !== 0) {
        sequenceDataWithRefSeqCdsFeatures = cloneDeep(sequenceData);
        const refSeqCdsFeaturesBpPos = [];
        alignmentTracks[0].sequenceData.features.forEach((feature) => {
          if (feature.type === "CDS") {
            const editedFeature = cloneDeep(feature);
            // in seq reads, ref seq's CDS feature translations need to show up at the bp pos of alignment, not the original bp pos
            // actual position in the track
            const absoluteFeatureStart =
              getGaps(feature.start, alignmentTracks[0].alignmentData.sequence)
                .gapsBefore + feature.start;
            const gapsBeforeSeqRead = getGaps(
              0,
              alignmentData.sequence
            ).gapsBefore;
            const bpsFromSeqReadStartToFeatureStartIncludingGaps =
              absoluteFeatureStart - gapsBeforeSeqRead;
            const absoluteFeatureEnd =
              getGaps(feature.end, alignmentTracks[0].alignmentData.sequence)
                .gapsBefore + feature.end;
            // const gapsBeforeFeatureInSeqRead = getGaps(feature.start - gapsBeforeSeqRead, alignmentData.sequence).gapsBefore
            const gapsAfterSeqRead =
              alignmentData.sequence.length -
              cloneDeep(alignmentData.sequence).replace(/-+$/g, "").length;
            const seqReadLengthWithoutGapsBeforeAfter =
              alignmentData.sequence.length -
              gapsBeforeSeqRead -
              gapsAfterSeqRead;
            const absoluteSeqReadStart = gapsBeforeSeqRead;
            const absoluteSeqReadEnd =
              absoluteSeqReadStart + seqReadLengthWithoutGapsBeforeAfter;
            let featureStartInSeqRead;
            if (absoluteFeatureEnd < absoluteSeqReadStart) {
              // if the feature ends before the seq read starts, do nothing
            } else if (absoluteFeatureStart > absoluteSeqReadEnd) {
              // if the feature starts after the seq read ends, do nothing
            } else if (
              absoluteFeatureStart < absoluteSeqReadStart &&
              absoluteFeatureEnd > absoluteSeqReadStart
            ) {
              // if the feature starts before the seq read starts but doesn't end before the seq read starts
              const arrayOfCodonStartPos = [];
              for (
                let i = absoluteFeatureStart;
                i < absoluteSeqReadStart + 6;
                i += 3
              ) {
                arrayOfCodonStartPos.push(i);
              }
              // want to start translation at the codon start pos closest to seq read start
              const absoluteTranslationStartInFrame =
                arrayOfCodonStartPos.reduce((prev, curr) =>
                  Math.abs(curr - absoluteSeqReadStart) <
                    Math.abs(prev - absoluteSeqReadStart) &&
                  curr >= absoluteSeqReadStart
                    ? curr
                    : prev
                );
              const seqReadTranslationStartInFrame =
                absoluteTranslationStartInFrame - gapsBeforeSeqRead;
              editedFeature.start = seqReadTranslationStartInFrame;
              const shortenedFeatureLength =
                Math.abs(absoluteFeatureEnd - absoluteFeatureStart) -
                (absoluteTranslationStartInFrame - absoluteFeatureStart);
              editedFeature.end = editedFeature.start + shortenedFeatureLength;
              refSeqCdsFeaturesBpPos.push(editedFeature);
            } else {
              // if the feature is fully contained within the seq read start/end
              const seqReadStartToFeatureStartIncludingGaps =
                alignmentData.sequence
                  .replace(/^-+/g, "")
                  .replace(/-+$/g, "")
                  .slice(0, bpsFromSeqReadStartToFeatureStartIncludingGaps);
              const arrayOfGaps = seqReadStartToFeatureStartIncludingGaps.match(
                new RegExp("-", "g")
              );
              let numOfGapsFromSeqReadStartToFeatureStart = 0;
              if (arrayOfGaps !== null) {
                numOfGapsFromSeqReadStartToFeatureStart = arrayOfGaps.length;
              }
              featureStartInSeqRead =
                bpsFromSeqReadStartToFeatureStartIncludingGaps -
                numOfGapsFromSeqReadStartToFeatureStart;
              editedFeature.start = featureStartInSeqRead;
              const featureLength = Math.abs(feature.end - feature.start);
              editedFeature.end = editedFeature.start + featureLength;
              refSeqCdsFeaturesBpPos.push(editedFeature);
            }
          }
        });
        // add ref seq's CDS features to seq reads (not the actual sequenceData) to generate translations at those bp pos
        if (refSeqCdsFeaturesBpPos.length !== 0) {
          sequenceDataWithRefSeqCdsFeatures.features.push(
            ...refSeqCdsFeaturesBpPos
          );
          // use returned aligned sequence rather than original sequence because after bowtie2, may be reverse complement or have soft-clipped ends
          sequenceDataWithRefSeqCdsFeatures.sequence =
            alignmentData.sequence.replace(/-/g, "");
        }
      }
    }
    const tickSpacing = massageTickSpacing(
      Math.ceil(120 / charWidthInLinearView)
    );

    return (
      <div
        className="alignmentViewTrackContainer"
        data-alignment-track-index={i}
        style={{
          boxShadow: isTemplate
            ? "red 0px -1px 0px 0px inset, red 0px 1px 0px 0px inset"
            : "0px -1px 0px 0px inset",
          display: "flex",
          position: "relative"
        }}
        key={i}
      >
        <div
          className="alignmentTrackName"
          style={{
            position: "sticky",
            // left: 130,
            left: 0,
            zIndex: 10,
            // boxShadow: isTemplate
            //   ? "0px 0px 0px 1px red inset"
            //   : `0px -3px 0px -2px inset, 3px -3px 0px -2px inset, -3px -3px 0px -2px inset`,
            width: nameDivWidth,
            padding: 2,
            paddingBottom: 0,
            minWidth: nameDivWidth,
            // textOverflow: "ellipsis",
            overflowY: "auto",
            // overflowX: "visible",
            whiteSpace: "nowrap"
          }}
          title={name}
          key={i}
        >
          <div
            className="alignmentTrackNameDiv"
            style={{
              background: "blue",
              display: "inline-block",
              color: "white",
              borderRadius: 5,
              opacity: 0.7
            }}
          >
            {name}
          </div>
        </div>
        {handleSelectTrack && !isTemplate && (
          <div
            onClick={() => {
              handleSelectTrack(i);
            }}
            style={{
              position: "absolute",
              opacity: 0,
              height: "100%",
              left: nameDivWidth,
              width: linearViewWidth,
              fontWeight: "bolder",
              cursor: "pointer",
              padding: 5,
              textAlign: "center",
              zIndex: 400
            }}
            className="alignmentViewSelectTrackPopover veWhiteBackground"
          >
            Inspect track
          </div>
        )}
        <NonReduxEnhancedLinearView
          {...{
            ...rest,
            caretPosition: -1,
            selectionLayer: { start: -1, end: -1 },
            annotationVisibilityOverrides:
              alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
            linearViewAnnotationLabelVisibilityOverrides:
              alignmentVisibilityToolOptions.alignmentAnnotationLabelVisibility,
            marginWith: 0,
            orfClicked: this.annotationClicked,
            primerClicked: this.annotationClicked,
            translationClicked: this.annotationClicked,
            cutsiteClicked: this.annotationClicked,
            translationDoubleClicked: this.annotationClicked,
            deletionLayerClicked: this.annotationClicked,
            replacementLayerClicked: this.annotationClicked,
            featureClicked: this.annotationClicked,
            partClicked: this.annotationClicked,
            searchLayerClicked: this.annotationClicked,
            hideName: true,
            sequenceData,
            sequenceDataWithRefSeqCdsFeatures,
            tickSpacing,
            allowSeqDataOverride: true, //override the sequence data stored in redux so we can track the caret position/selection layer in redux but not have to update the redux editor
            editorName: `${isTemplate ? "template_" : ""}alignmentView${i}`,
            alignmentData,
            chromatogramData,
            height: "100%",
            vectorInteractionWrapperStyle: {
              overflowY: "hidden"
            },
            marginWidth: 0,
            linearViewCharWidth: charWidthInLinearView,
            ignoreGapsOnHighlight: true,
            ...(linearViewOptions &&
              (isFunction(linearViewOptions)
                ? linearViewOptions({
                    index: i,
                    isTemplate,
                    alignmentVisibilityToolOptions,
                    sequenceData,
                    alignmentData,
                    chromatogramData
                  })
                : linearViewOptions)),
            additionalSelectionLayers,
            dimensions: {
              width: linearViewWidth
            },
            width: linearViewWidth,
            paddingBottom: 5,
            scrollData: this.easyStore
          }}
        />
      </div>
    );
  };
  handleResize = throttle(([e]) => {
    this.easyStore.viewportWidth = e.contentRect.width - nameDivWidth || 400;
    this.setState({ width: e.contentRect.width });
  }, 200);

  // updateMinimapHighlightForScroll = (oldScroll, newScroll) => {
  //   if (!this.latestMouseY) this.latestMouseY = 0;
  //   console.log(`oldScroll:`,oldScroll)
  //   console.log(`newScroll:`,newScroll)
  //   this.latestMouseY += newScroll - oldScroll;
  //   console.log(`this.latestMouseY:`,this.latestMouseY)
  //   this.updateMinimapHighlight();
  // };
  removeMinimapHighlightForMouseLeave = () => {
    const minimapLaneEl = document.querySelector(`.minimapLane.lane-hovered`);
    if (!minimapLaneEl) return;
    minimapLaneEl.classList.remove("lane-hovered");
  };
  updateMinimapHighlightForMouseMove = (event) => {
    this.latestMouseY = getClientY(event); //we use this variable later
    this.updateMinimapHighlight();
  };
  updateMinimapHighlight = () => {
    const rows = document.querySelectorAll(`.alignmentViewTrackContainer`);
    const rowsLength = document.querySelectorAll(`.minimapLane`).length;
    if (rowsLength <= 4) {
      return; // no need to include this functionality here
    }
    some(rows, (rowDomNode) => {
      const boundingRowRect = rowDomNode.getBoundingClientRect();
      if (
        this.latestMouseY > boundingRowRect.top &&
        this.latestMouseY < boundingRowRect.top + boundingRowRect.height
      ) {
        const prevMinimapLaneEl = document.querySelector(
          `.minimapLane.lane-hovered`
        );
        if (prevMinimapLaneEl) {
          prevMinimapLaneEl.classList.remove("lane-hovered");
        }
        const i = Number(rowDomNode.getAttribute("data-alignment-track-index"));

        //then the click falls within this row
        const minimapLaneEl = document.querySelector(
          `.minimapLane:nth-child(${i + 1})`
        );
        if (!minimapLaneEl) return;
        minimapLaneEl.classList.add("lane-hovered");
        return true; //break the loop early because we found the row the click event landed in
      }
    });
  };

  render() {
    const charWidthInLinearView = this.getCharWidthInLinearView();
    const {
      alignmentTracks = [],
      height,
      minimapLaneHeight,
      minimapLaneSpacing,
      isInPairwiseOverviewView,
      isPairwise,
      currentPairwiseAlignmentIndex,
      hasTemplate,
      noVisibilityOptions,
      updateAlignmentSortOrder,
      alignmentSortOrder,
      handleBackButtonClicked,
      noClickDragHandlers,
      additionalSelectionLayerRightClickedOptions,
      selectionLayerRightClicked,
      additionalTopEl,
      alignmentVisibilityToolOptions
    } = this.props;
    const sequenceLength = this.getMaxLength();
    if (
      !alignmentTracks ||
      !alignmentTracks[0] ||
      !alignmentTracks[0].alignmentData
    ) {
      console.error("corrupted data!", this.props);
      return "corrupted data!";
    }

    const getTrackVis = (alignmentTracks, isTemplate) => {
      const rowData = {};
      return (
        <div
          className="alignmentTracks "
          style={{ overflowY: "auto", display: "flex", zIndex: 10 }}
        >
          <div
            style={{
              overflowX: "auto",
              width: this.state.width
            }}
            ref={(ref) => {
              this[isTemplate ? "alignmentHolderTop" : "alignmentHolder"] = ref;
            }}
            onMouseLeave={this.removeMinimapHighlightForMouseLeave}
            onMouseMove={this.updateMinimapHighlightForMouseMove}
            dataname="scrollGroup"
            className="alignmentHolder"
            onScroll={isTemplate ? this.handleTopScroll : this.handleScroll}
          >
            <Draggable
              bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
              onDrag={
                noClickDragHandlers
                  ? noop
                  : (event) => {
                      this.getNearestCursorPositionToMouseEvent(
                        rowData,
                        event,
                        this.editorDragged
                      );
                    }
              }
              onStart={
                noClickDragHandlers
                  ? noop
                  : (event) => {
                      this.getNearestCursorPositionToMouseEvent(
                        rowData,
                        event,
                        this.editorDragStarted
                      );
                    }
              }
              onStop={noClickDragHandlers ? noop : this.editorDragStopped}
            >
              <div
                ref={(ref) => (this.veTracksAndAlignmentHolder = ref)}
                className="veTracksAndAlignmentHolder"
                // onContextMenu={
                //tnrtodo add copy single track/all tracks logic here
                // (event) => {
                // this.getNearestCursorPositionToMouseEvent(
                //   rowData,
                //   event,
                //   () => {
                //   }
                // );
                // }
                // }
                onClick={
                  noClickDragHandlers
                    ? noop
                    : (event) => {
                        this.getNearestCursorPositionToMouseEvent(
                          rowData,
                          event,
                          this.editorClicked
                        );
                      }
                }
              >
                <PerformantSelectionLayer
                  leftMargin={140}
                  className="veAlignmentSelectionLayer"
                  isDraggable
                  selectionLayerRightClicked={
                    selectionLayerRightClicked
                      ? (...args) => {
                          selectionLayerRightClicked(...args, this.props);
                        }
                      : (...args) => {
                          const { event } = args[0];
                          const trackContainers = document.querySelectorAll(
                            ".alignmentViewTrackContainer"
                          );
                          let track;
                          trackContainers.forEach((t) => {
                            const mouseX =
                              getClientX(event) + document.body.scrollLeft;
                            const mouseY =
                              getClientY(event) + document.body.scrollTop;
                            if (
                              mouseX >= t.getBoundingClientRect().left &&
                              mouseX <=
                                t.getBoundingClientRect().left +
                                  t.getBoundingClientRect().width &&
                              mouseY >= t.getBoundingClientRect().top &&
                              mouseY <=
                                t.getBoundingClientRect().top +
                                  t.getBoundingClientRect().height
                            ) {
                              const index = t.getAttribute(
                                "data-alignment-track-index"
                              );
                              track = alignmentTracks[index];
                              return true;
                            }
                          });

                          const alignmentData = track.alignmentData;
                          const { name } = alignmentData;
                          showContextMenu(
                            [
                              ...(additionalSelectionLayerRightClickedOptions
                                ? additionalSelectionLayerRightClickedOptions(
                                    ...args,
                                    this.props
                                  )
                                : []),
                              {
                                text: "Copy Selection of All Alignments as Fasta",
                                className:
                                  "copyAllAlignmentsFastaClipboardHelper",
                                hotkey: "cmd+c",
                                willUnmount: () => {
                                  this.copyAllAlignmentsFastaClipboardHelper &&
                                    this.copyAllAlignmentsFastaClipboardHelper.destroy();
                                },
                                didMount: () => {
                                  this.copyAllAlignmentsFastaClipboardHelper =
                                    new Clipboard(
                                      `.copyAllAlignmentsFastaClipboardHelper`,
                                      {
                                        action: "copyAllAlignmentsFasta",
                                        text: () => {
                                          return this.getAllAlignmentsFastaText();
                                        }
                                      }
                                    );
                                },
                                onClick: () => {
                                  window.toastr.success("Selection Copied");
                                }
                              },
                              {
                                text: `Copy Selection of ${name} as Fasta`,
                                className:
                                  "copySpecificAlignmentFastaClipboardHelper",
                                willUnmount: () => {
                                  this
                                    .copySpecificAlignmentFastaClipboardHelper &&
                                    this.copySpecificAlignmentFastaClipboardHelper.destroy();
                                },
                                didMount: () => {
                                  this.copySpecificAlignmentFastaClipboardHelper =
                                    new Clipboard(
                                      `.copySpecificAlignmentFastaClipboardHelper`,
                                      {
                                        action: "copySpecificAlignmentFasta",
                                        text: () => {
                                          const { selectionLayer } =
                                            this.props.store.getState()
                                              .VectorEditor.__allEditorsOptions
                                              .alignments[this.props.id] || {};
                                          const seqDataToCopy =
                                            getSequenceDataBetweenRange(
                                              alignmentData,
                                              selectionLayer
                                            ).sequence;
                                          const seqDataToCopyAsFasta = `>${name}\r\n${seqDataToCopy}\r\n`;
                                          return seqDataToCopyAsFasta;
                                        }
                                      }
                                    );
                                },
                                onClick: () => {
                                  window.toastr.success(
                                    "Selection Copied As Fasta"
                                  );
                                }
                              },
                              {
                                text: `Copy Selection of ${name}`,
                                className:
                                  "copySpecificAlignmentAsPlainClipboardHelper",
                                willUnmount: () => {
                                  this
                                    .copySpecificAlignmentAsPlainClipboardHelper &&
                                    this.copySpecificAlignmentAsPlainClipboardHelper.destroy();
                                },
                                didMount: () => {
                                  this.copySpecificAlignmentAsPlainClipboardHelper =
                                    new Clipboard(
                                      `.copySpecificAlignmentAsPlainClipboardHelper`,
                                      {
                                        action: "copySpecificAlignmentFasta",
                                        text: () => {
                                          const { selectionLayer } =
                                            this.props.store.getState()
                                              .VectorEditor.__allEditorsOptions
                                              .alignments[this.props.id] || {};
                                          const seqDataToCopy =
                                            getSequenceDataBetweenRange(
                                              alignmentData,
                                              selectionLayer
                                            ).sequence;
                                          return seqDataToCopy;
                                        }
                                      }
                                    );
                                },
                                onClick: () => {
                                  window.toastr.success("Selection Copied");
                                }
                              }
                            ],
                            undefined,
                            event
                          );
                        }
                  }
                  easyStore={this.easyStore}
                  sequenceLength={sequenceLength}
                  charWidth={this.getCharWidthInLinearView()}
                  row={{ start: 0, end: sequenceLength - 1 }}
                ></PerformantSelectionLayer>
                <PerformantCaret
                  leftMargin={140}
                  className="veAlignmentSelectionLayer"
                  isDraggable
                  sequenceLength={sequenceLength}
                  charWidth={this.getCharWidthInLinearView()}
                  row={{ start: 0, end: sequenceLength - 1 }}
                  easyStore={this.easyStore}
                />

                {isTemplate ? (
                  this.renderItem(0, 0, isTemplate)
                ) : (
                  <ReactList
                    ref={(c) => {
                      this.InfiniteScroller = c;
                    }}
                    type="variable"
                    itemSizeEstimator={this.estimateRowHeight}
                    itemRenderer={this.renderItem}
                    length={alignmentTracks.length}
                  />
                )}
              </div>
              {/* </div> */}
            </Draggable>
          </div>
        </div>
      );
    };

    const [firstTrack, ...otherTracks] = alignmentTracks;
    const totalWidthOfMinimap = this.state.width - nameDivWidth;
    const totalWidthInAlignmentView = 14 * this.getSequenceLength();
    const minSliderSize = Math.min(
      totalWidthOfMinimap * (totalWidthOfMinimap / totalWidthInAlignmentView),
      totalWidthOfMinimap
    );
    const viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    return (
      <ResizeSensor onResize={this.handleResize}>
        <div
          style={{
            height: height || (isPairwise ? "auto" : viewportHeight * 0.88),
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflowY: "auto",
            ...this.props.style
            // borderTop: "1px solid black"
          }}
          className="alignmentView"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflowY: "auto"
            }}
            className="alignmentView-top-container"
          >
            <div
              style={{
                paddingTop: "3px",
                paddingBottom: "5px",
                borderBottom: "1px solid",
                display: "flex",
                minHeight: "32px",
                width: "100%",
                flexWrap: "nowrap",
                flexDirection: "row",
                flex: "0 0 auto"
              }}
              className="ve-alignment-top-bar"
            >
              {handleBackButtonClicked && (
                <Tooltip content="Back to Pairwise Alignment Overview">
                  <Button
                    icon="arrow-left"
                    onClick={() => {
                      // this.setState({
                      //   charWidthInLinearView: charWidthInLinearViewDefault
                      // });
                      handleBackButtonClicked();
                      this.caretPositionUpdate(-1);
                    }}
                    small
                    intent={Intent.PRIMARY}
                    minimal
                    style={{ marginRight: 10 }}
                    className="alignmentViewBackButton"
                  />
                </Tooltip>
              )}
              {this.props.handleAlignmentRename ? (
                <InputGroup
                  minimal
                  small
                  value={this.props.alignmentName}
                  placeholder="Untitled Alignment"
                />
              ) : (
                <div>
                  <span
                    style={{
                      paddingTop: "3px",
                      fontWeight: "bold",
                      fontSize: "14px",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                    title={this.props.alignmentName || "Untitled Alignment"}
                  >
                    {this.props.alignmentName || "Untitled Alignment"}
                  </span>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    style={{
                      paddingTop: "3px",
                      fontSize: "14px",
                      color: "grey",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                    title={this.props.alignmentType || "Unknown Alignment Type"}
                  >
                    {this.props.alignmentType || "Unknown Alignment Type"}
                  </span>
                </div>
              )}
              {this.props.handleAlignmentRename && (
                <Button small>Rename</Button>
              )}
              {this.props.unmappedSeqs && (
                <InfoHelper
                  size={20}
                  content={
                    <div>
                      This alignment had sequences that did not map to the
                      template sequence:
                      {this.props.unmappedSeqs.map(({ sequenceData }, i) => (
                        <div key={i}>{sequenceData.name}</div>
                      ))}
                    </div>
                  }
                  intent="warning"
                  icon="warning-sign"
                ></InfoHelper>
              )}
              {!isInPairwiseOverviewView && (
                <UncontrolledSliderWithPlusMinusBtns
                  noWraparound
                  bindOutsideChangeHelper={this.bindOutsideChangeHelper}
                  onClick={() => {
                    setTimeout(this.scrollToCaret, 0);
                  }}
                  minCharWidth={this.getMinCharWidth()}
                  onChange={async (zoomLvl) => {
                    // zoomLvl is in the range of 0 to 10
                    const minCharWidth = this.getMinCharWidth();
                    const scaleFactor = Math.pow(12 / minCharWidth, 1 / 10);
                    const newCharWidth =
                      minCharWidth * Math.pow(scaleFactor, zoomLvl);
                    await this.setCharWidthInLinearView({
                      charWidthInLinearView: newCharWidth
                    });
                    await this.scrollToCaret();
                    await updateLabelsForInViewFeatures({
                      rectElement: ".alignmentHolder"
                    });
                  }}
                  coerceInitialValue={coerceInitialValue}
                  title="Adjust Zoom Level"
                  style={{ paddingTop: "4px", width: 100 }}
                  className="ove-slider"
                  labelRenderer={false}
                  initialValue={charWidthInLinearView}
                  stepSize={0.05} //was 0.01
                  max={10}
                  min={0}
                  clickStepSize={0.5}
                />
              )}
              {!noVisibilityOptions && !isInPairwiseOverviewView && (
                <AlignmentVisibilityTool
                  currentPairwiseAlignmentIndex={currentPairwiseAlignmentIndex}
                  {...alignmentVisibilityToolOptions}
                />
              )}
              {updateAlignmentSortOrder && !isInPairwiseOverviewView && (
                <Popover
                  minimal
                  content={
                    <Menu>
                      <MenuItem
                        active={true || alignmentSortOrder}
                        onClick={() => {
                          updateAlignmentSortOrder("Position");
                        }}
                        text="Position"
                      />
                      <MenuItem
                        active={false || alignmentSortOrder}
                        onClick={() => {
                          updateAlignmentSortOrder("Alphabetical");
                        }}
                        text="Alphabetical"
                      />
                    </Menu>
                  }
                  target={
                    <Button
                      small
                      text="Sort Order"
                      rightIcon="caret-down"
                      icon="sort"
                    />
                  }
                />
              )}
              {additionalTopEl}
            </div>
            {hasTemplate ? (
              <React.Fragment>
                <div className="alignmentTrackFixedToTop">
                  {getTrackVis([firstTrack], true)}
                </div>
                {getTrackVis(otherTracks)}
              </React.Fragment>
            ) : (
              getTrackVis(alignmentTracks)
            )}
          </div>
          {!isInPairwiseOverviewView && (
            <div
              className="alignmentViewBottomBar"
              style={{
                // flexGrow: 1,
                // minHeight: "-webkit-min-content", //https://stackoverflow.com/questions/28029736/how-to-prevent-a-flex-item-from-shrinking-smaller-than-its-content
                maxHeight: 210,
                marginTop: 4,
                paddingTop: 4,
                borderTop: "1px solid lightgrey",
                display: "flex"
              }}
            >
              <Minimap
                {...{
                  selectionLayerComp: (
                    <React.Fragment>
                      <PerformantSelectionLayer
                        is
                        hideCarets
                        className="veAlignmentSelectionLayer veMinimapSelectionLayer"
                        easyStore={this.easyStore}
                        sequenceLength={sequenceLength}
                        charWidth={this.getMinCharWidth(true)}
                        row={{ start: 0, end: sequenceLength - 1 }}
                      ></PerformantSelectionLayer>
                      <PerformantCaret
                        style={{
                          opacity: 0.2
                        }}
                        className="veAlignmentSelectionLayer veMinimapSelectionLayer"
                        sequenceLength={sequenceLength}
                        charWidth={this.getMinCharWidth(true)}
                        row={{ start: 0, end: sequenceLength - 1 }}
                        easyStore={this.easyStore}
                      />
                    </React.Fragment>
                  ),
                  alignmentTracks,
                  dimensions: {
                    width: Math.max(this.state.width, 10) || 10
                  },
                  nameDivOffsetPercent:
                    nameDivWidth / this.getMaxLinearViewWidth(),
                  scrollYToTrack: this.scrollYToTrack,
                  onSizeAdjust: this.onMinimapSizeAdjust,
                  minSliderSize,
                  laneHeight:
                    minimapLaneHeight || (alignmentTracks.length > 5 ? 10 : 17),
                  laneSpacing:
                    minimapLaneSpacing || (alignmentTracks.length > 5 ? 2 : 1),
                  easyStore: this.easyStore,
                  numBpsShownInLinearView: this.getNumBpsShownInLinearView(),
                  scrollAlignmentView: this.state.scrollAlignmentView
                }}
                onMinimapScrollX={this.scrollAlignmentToPercent}
              />
            </div>
          )}
        </div>
      </ResizeSensor>
    );
  }
}

export default compose(
  withStore,
  withEditorProps,
  connect(
    (state, ownProps) => {
      // const {id}
      const {
        VectorEditor: {
          __allEditorsOptions: { alignments }
        }
      } = state;
      const { id: alignmentId, updateAlignmentViewVisibility } = ownProps;
      const alignment = { ...alignments[alignmentId], id: alignmentId };
      const {
        unmappedSeqs,
        alignmentTracks,
        pairwiseAlignments,
        alignmentType,
        scrollPercentageToJumpTo,
        pairwiseOverviewAlignmentTracks,
        loading,
        alignmentAnnotationVisibility,
        alignmentAnnotationLabelVisibility,
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 }
      } = alignment || {};
      if (loading) {
        return {
          loading: true
        };
      }
      if (!alignmentTracks && !pairwiseAlignments)
        return {
          noTracks: true
        };
      const templateLength = (
        pairwiseAlignments ? pairwiseAlignments[0][0] : alignmentTracks[0]
      ).alignmentData.sequence.length;

      const alignmentAnnotationsToToggle = [
        "features",
        "parts",
        "sequence",
        "reverseSequence",
        "axis",
        "translations",
        "cdsFeatureTranslations",
        "chromatogram",
        "dnaColors"
      ];
      const togglableAlignmentAnnotationSettings = {};
      map(alignmentAnnotationsToToggle, (annotation) => {
        if (annotation in alignmentAnnotationVisibility) {
          togglableAlignmentAnnotationSettings[annotation] =
            alignmentAnnotationVisibility[annotation];
        }
      });

      const annotationsWithCounts = [];
      if (alignmentTracks) {
        let totalNumOfFeatures = 0;
        let totalNumOfParts = 0;
        alignmentTracks.forEach((seq) => {
          if (seq.sequenceData.features) {
            totalNumOfFeatures += seq.sequenceData.features.length;
          }
          if (seq.sequenceData.parts) {
            totalNumOfParts += seq.sequenceData.parts.length;
          }
        });
        annotationsWithCounts.push({
          features: totalNumOfFeatures,
          parts: totalNumOfParts
        });
      } else if (pairwiseAlignments) {
        pairwiseAlignments.forEach((pairwise) => {
          let totalNumOfFeatures = 0;
          let totalNumOfParts = 0;
          pairwise.forEach((seq) => {
            if (seq.sequenceData.features) {
              totalNumOfFeatures += seq.sequenceData.features.length;
            }
            if (seq.sequenceData.parts) {
              totalNumOfParts += seq.sequenceData.parts.length;
            }
          });
          annotationsWithCounts.push({
            features: totalNumOfFeatures,
            parts: totalNumOfParts
          });
        });
      }

      return {
        isAlignment: true,
        selectionLayer,
        unmappedSeqs,
        caretPosition,
        alignmentId,
        sequenceData: {
          //pass fake seq data in so editor interactions work
          sequence: Array.from(templateLength)
            .map(() => "a")
            .join("")
        },
        pairwiseAlignments,
        alignmentType,
        alignmentTracks,
        scrollPercentageToJumpTo,
        pairwiseOverviewAlignmentTracks,
        //manipulate the props coming in so we can pass a single clean prop to the visibility options tool
        alignmentVisibilityToolOptions: {
          alignmentAnnotationVisibility,
          alignmentAnnotationLabelVisibility,
          alignmentAnnotationVisibilityToggle: (
            name,
            { useChecked, checked } = {}
          ) => {
            setTimeout(() => {
              updateLabelsForInViewFeatures({
                rectElement: ".alignmentHolder"
              });
            }, 0);
            updateAlignmentViewVisibility({
              ...alignment,
              alignmentAnnotationVisibility: {
                ...alignment.alignmentAnnotationVisibility,
                [name]: useChecked
                  ? checked
                  : !alignment.alignmentAnnotationVisibility[name]
              }
            });
          },
          alignmentAnnotationLabelVisibilityToggle: (name) => {
            updateAlignmentViewVisibility({
              ...alignment,
              alignmentAnnotationLabelVisibility: {
                ...alignment.alignmentAnnotationLabelVisibility,
                [name]: !alignment.alignmentAnnotationLabelVisibility[name]
              }
            });
          },
          togglableAlignmentAnnotationSettings,
          annotationsWithCounts
        }
      };
    },
    {
      ...alignmentActions
    }
  ),
  branch(
    ({ loading }) => loading,
    renderComponent(() => {
      return <Loading bounce />;
    })
  ),
  branch(
    ({ noTracks }) => noTracks,
    renderComponent(() => {
      return (
        <div style={{ minHeight: 30, minWidth: 150 }}>"No Tracks Found"</div>
      );
    })
  ),
  branch(
    ({ pairwiseAlignments }) => pairwiseAlignments,
    renderComponent((props) => {
      return <PairwiseAlignmentView {...props} />;
    })
  )
)(AlignmentView);

//this view is shown if we detect pairwise alignments
class PairwiseAlignmentView extends React.Component {
  state = {
    currentPairwiseAlignmentIndex: undefined
  };
  render() {
    const { pairwiseAlignments, pairwiseOverviewAlignmentTracks } = this.props;
    const { currentPairwiseAlignmentIndex } = this.state;
    if (currentPairwiseAlignmentIndex > -1) {
      //we can render the AlignmentView directly
      //get the alignmentTracks based on currentPairwiseAlignmentIndex
      const alignmentTracks = pairwiseAlignments[currentPairwiseAlignmentIndex];

      const templateLength = alignmentTracks[0].alignmentData.sequence.length;
      return (
        <AlignmentView
          {...{
            ...this.props,
            sequenceData: {
              //pass fake seq data in so editor interactions work
              sequence: Array.from(templateLength)
                .map(() => "a")
                .join("")
            },
            alignmentTracks,
            hasTemplate: true,
            isPairwise: true,
            currentPairwiseAlignmentIndex,
            handleBackButtonClicked: () => {
              this.setState({
                currentPairwiseAlignmentIndex: undefined
              });
            }
          }}
        />
      );
    } else {
      //we haven't yet selected an alignment to view
      // render the AlignmentView zoomed out for each track in pairwiseOverviewAlignmentTracks
      // when the view eye icon is hit (maybe next to the name?)
      return (
        <AlignmentView
          {...{
            ...this.props,
            alignmentTracks: pairwiseOverviewAlignmentTracks,
            hasTemplate: true,
            isPairwise: true,
            isInPairwiseOverviewView: true,
            isFullyZoomedOut: true,
            noClickDragHandlers: true,
            linearViewOptions: getPairwiseOverviewLinearViewOptions,
            handleSelectTrack: (trackIndex) => {
              //set currentPairwiseAlignmentIndex
              this.setState({ currentPairwiseAlignmentIndex: trackIndex - 1 });
            }
          }}
        />
      );
    }
  }
}

function getPairwiseOverviewLinearViewOptions({ isTemplate }) {
  if (!isTemplate) {
    return {
      annotationVisibilityOverrides: {
        features: false,
        translations: false,
        parts: false,
        orfs: false,
        orfTranslations: false,
        cdsFeatureTranslations: false,
        axis: false,
        cutsites: false,
        primers: false,
        chromatogram: false,
        sequence: false,
        dnaColors: false,
        reverseSequence: false,
        axisNumbers: false
      }
    };
  } else {
    return {
      // annotationVisibilityOverrides: {
      //   features: false,
      //   yellowAxis: false,
      //   translations: false,
      //   parts: false,
      //   orfs: false,
      //   orfTranslations: false,
      //   axis: true,
      //   cutsites: false,
      //   primers: false,
      //   reverseSequence: false,
      //   axisNumbers: false
      // }
    };
  }
}

const PerformantSelectionLayer = view(({ easyStore, ...rest }) => {
  return (
    <SelectionLayer
      regions={[{ ...easyStore.selectionLayer, ignoreGaps: true }]}
      {...rest}
    />
  );
});

const PerformantCaret = view(({ easyStore, ...rest }) => {
  return <Caret caretPosition={easyStore.caretPosition} {...rest} />;
});

function coerceInitialValue({ initialValue, minCharWidth }) {
  //char width 12 = 10
  //zoomLvl = 0 -> charWidth = minCharWidth
  //zoomLvl = 10 -> charWidth = 12

  // const scaleFactor = Math.pow(12 / initialCharWidth, 1 / 10);
  // newCharWidth = initialCharWidth * Math.pow(scaleFactor, zoomLvl)
  // 12 = initialCharWidth * Math.pow(scaleFactor, 10)
  // 12/initialCharWidth = Math.pow(scaleFactor, 10)
  // Math.pow(12/minCharWidth, 1/10) = scaleFactor

  // newCharWidth/minCharWidth =  * Math.pow(scaleFactor, zoomLvl)

  const scaleFactor = Math.pow(12 / minCharWidth, 1 / 10);

  const zoomLvl = Math.log(initialValue / minCharWidth) / Math.log(scaleFactor);

  return zoomLvl;
}
