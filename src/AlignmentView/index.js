import { HorizontalPanelDragHandle } from "./HorizontalPanelDragHandle";
import {
  DragDropContext,
  Droppable,
  Draggable as DndDraggable
} from "@hello-pangea/dnd";
import Clipboard from "clipboard";
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Intent,
  Popover,
  Menu,
  MenuItem,
  Tooltip,
  Icon,
  Spinner,
  AnchorButton,
  EditableText
} from "@blueprintjs/core";
import {
  InfoHelper,
  Loading,
  showContextMenu,
  withStore
} from "teselagen-react-components";
import { store } from "@risingstack/react-easy-state";
import {
  throttle,
  // cloneDeep,
  map,
  some,
  forEach,
  isFunction,
  unset,
  omit
} from "lodash";
import { getSequenceDataBetweenRange } from "ve-sequence-utils";
import ReactList from "@teselagen/react-list";
import ReactDOM from "react-dom";

import { NonReduxEnhancedLinearView } from "../LinearView";
import Minimap, { getTrimmedRangesToDisplay } from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import * as alignmentActions from "../redux/alignments";
import estimateRowHeight from "../RowView/estimateRowHeight";
import prepareRowData from "../utils/prepareRowData";
import withEditorProps from "../withEditorProps";

import "./style.css";
import {
  editorDragged,
  editorClicked,
  editorDragStarted,
  updateSelectionOrCaret,
  editorDragStopped
} from "../withEditorInteractions/clickAndDragUtils";
import { ResizeSensor } from "@blueprintjs/core";
import ReactDraggable from "react-draggable";
import draggableClassnames from "../constants/draggableClassnames";
import Caret from "../RowItem/Caret";
import { debounce } from "lodash";
import { view } from "@risingstack/react-easy-state";
import { noop } from "lodash";
import { massageTickSpacing } from "../utils/massageTickSpacing";
import { getClientX, getClientY } from "../utils/editorUtils";

import UncontrolledSliderWithPlusMinusBtns from "../helperComponents/UncontrolledSliderWithPlusMinusBtns";
import { updateLabelsForInViewFeatures } from "../utils/updateLabelsForInViewFeatures";

import PinchHelper from "../helperComponents/PinchHelper/PinchHelper";
import { showDialog } from "../GlobalDialogUtils";
import { GlobalDialog } from "../GlobalDialog";
import { array_move } from "../ToolBar/array_move";
import classNames from "classnames";
import { getTrackFromEvent } from "./getTrackFromEvent";
import { PerformantSelectionLayer } from "./PerformantSelectionLayer";
import { PairwiseAlignmentView } from "./PairwiseAlignmentView";
import { updateTrackHelper } from "./updateTrackHelper";
// import { getGaps } from "./getGaps";
import { isTargetWithinEl } from "./isTargetWithinEl";
import { EditTrackNameDialog } from "./EditTrackNameDialog";
import { coerceInitialValue } from "./coerceInitialValue";

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

export class AlignmentView extends React.Component {
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
    if (
      getClientX(event) - boundingRowRect.left - this.state.nameDivWidth <
      0
    ) {
      nearestCaretPos = 0;
    } else {
      const clickXPositionRelativeToRowContainer =
        getClientX(event) - boundingRowRect.left - this.state.nameDivWidth;
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
      updateSelectionOrCaret: this.updateSelectionOrCaret,
      nearestCaretPos,
      sequenceLength: this.getSequenceLength(),
      caretPosition: this.easyStore.caretPosition,
      selectionLayer: this.easyStore.selectionLayer,
      easyStore: this.easyStore,
      caretPositionUpdate: this.caretPositionUpdate,
      selectionLayerUpdate: this.selectionLayerUpdate,
      event,
      doNotWrapOrigin: true,
      shiftHeld: event.shiftKey,
      // caretGrabbed: event.target.className === "cursor",
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
    const { removeAlignmentFromRedux, id } = this.props;
    removeAlignmentFromRedux({ id });
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
    alignmentName: this.props.alignmentName,
    isTrackDragging: false,
    charWidthInLinearView: charWidthInLinearViewDefault,
    scrollAlignmentView: false,
    width: 0,
    nameDivWidth: 140
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
      Math.max(
        this.state.width - (noNameDiv ? 0 : this.state.nameDivWidth) - 5,
        1
      ) / this.getSequenceLength(),
      10
    );
    if (isNaN(toReturn)) return 10;
    return toReturn;
  };

  getSequenceLength = () => {
    const { alignmentTracks: [template] = [] } = this.props;
    return template.alignmentData.sequence.length || 1;
  };
  async componentDidUpdate(prevProps) {
    if (
      prevProps.scrollPercentageToJumpTo !==
        this.props.scrollPercentageToJumpTo &&
      this.props.scrollPercentageToJumpTo !== undefined
    ) {
      this.scrollAlignmentToPercent(this.props.scrollPercentageToJumpTo);
    }
    //autosave if necessary!
    if (
      this.props.shouldAutosave &&
      prevProps &&
      prevProps.stateTrackingId &&
      this.props.stateTrackingId !== prevProps.stateTrackingId
    ) {
      this.setState({ saveMessage: "Alignment Saving.." });
      this.setState({ saveMessageLoading: true });

      let cleanedTracks;
      if (this.props.pairwiseAlignments) {
        cleanedTracks = this.props.pairwiseAlignments.map(cleanTracks);
      } else {
        cleanedTracks = cleanTracks(this.props.alignmentTracks);
      }

      await this.props.handleAlignmentSave(cleanedTracks, this.props);
      this.setState({ saveMessage: "Alignment Saved" });
      this.setState({ saveMessageLoading: false });
      setTimeout(() => {
        this.setState({ saveMessage: undefined });
        this.setState({ saveMessageLoading: false });
      }, 5000);
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
      (this.state.width - this.state.nameDivWidth) /
      this.getCharWidthInLinearView();
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
    if (!this.isZooming) {
      this.easyStore.percentScrolledPreZoom = this.easyStore.percentScrolled;
    }
    if (this.alignmentHolderTop) {
      this.alignmentHolderTop.scrollLeft = this.alignmentHolder.scrollLeft;
    }
    updateLabelsForInViewFeatures({ rectElement: ".alignmentHolder" });
  };
  handleTopScroll = () => {
    this.alignmentHolder.scrollLeft = this.alignmentHolderTop.scrollLeft;
  };
  /**
   * Responsible for handling resizing the highlighted region of the minimap
   * @param {*} newSliderSize
   * @param {*} newPercent
   */
  onMinimapSizeAdjust = (newSliderSize, newPercent) => {
    const percentageOfSpace = newSliderSize / this.state.width;
    const seqLength = this.getSequenceLength();
    const numBpsInView = seqLength * percentageOfSpace;
    const newCharWidth =
      (this.state.width - this.state.nameDivWidth) / numBpsInView;
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
    let el = window.document.querySelector(".veCaret:not(.zoomSelection)"); //adding .veRowViewCaret breaks this for some reason
    if (!el) {
      el = window.document.querySelector(".veCaret"); //adding .veRowViewCaret breaks this for some reason
    }
    if (!el) {
      return;
    }
    el.scrollIntoView({ inline: "center", block: "nearest" });
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
    const track = alignmentTracks[index];
    if (!track) return 100;
    const { sequenceData } = track;
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

  renderItem = (_i, key, isTemplate, cloneProps) => {
    const charWidthInLinearView = this.getCharWidthInLinearView();
    const {
      alignmentTrackIndex,
      pairwiseAlignments,
      currentPairwiseAlignmentIndex,
      pairwiseOverviewAlignmentTracks,
      alignmentTracks = [],
      upsertAlignmentRun,
      alignmentId,
      noClickDragHandlers,
      handleSelectTrack,
      allowTrackRearrange,
      isPairwise,
      linearViewOptions,
      alignmentVisibilityToolOptions,
      hasTemplate,
      allowTrackNameEdit,
      ...rest
    } = this.props;
    const isDragDisabled = !allowTrackRearrange || isPairwise;
    let i;
    if (isTemplate) {
      i = _i;
    } else if (hasTemplate) {
      i = _i + 1;
    } else {
      i = _i;
    }

    const track = alignmentTracks[i];
    if (!track) return null;
    const {
      sequenceData,
      alignmentData,
      isReversed,
      wasTrimmed,
      additionalSelectionLayers,
      chromatogramData
      // mismatches
    } = track;
    const seqLen = this.getMaxLength();

    const trimmedRangesToDisplay = getTrimmedRangesToDisplay({
      seqLen,
      trimmedRange: alignmentData?.trimmedRange
    });
    const linearViewWidth =
      (alignmentData || sequenceData).sequence.length * charWidthInLinearView;
    const name = sequenceData.name || sequenceData.id;

    //tnw: commenting this out for now since it can significantly slow down the alignment visualization
    /**
     * for alignment of sanger seq reads to a ref seq, have translations show up at the bp pos of ref seq's CDS features across all seq reads
     **/
    // let sequenceDataWithRefSeqCdsFeatures;
    // if (this.props.alignmentType === "SANGER SEQUENCING") {
    //   if (i !== 0) {
    //     sequenceDataWithRefSeqCdsFeatures = cloneDeep(sequenceData);
    //     const refSeqCdsFeaturesBpPos = [];
    //     alignmentTracks[0].sequenceData.features.forEach((feature) => {
    //       if (feature.type === "CDS") {
    //         const editedFeature = cloneDeep(feature);
    //         // in seq reads, ref seq's CDS feature translations need to show up at the bp pos of alignment, not the original bp pos
    //         // actual position in the track
    //         const absoluteFeatureStart =
    //           getGaps(feature.start, alignmentTracks[0].alignmentData.sequence)
    //             .gapsBefore + feature.start;
    //         const gapsBeforeSeqRead = getGaps(
    //           0,
    //           alignmentData.sequence
    //         ).gapsBefore;
    //         const bpsFromSeqReadStartToFeatureStartIncludingGaps =
    //           absoluteFeatureStart - gapsBeforeSeqRead;
    //         const absoluteFeatureEnd =
    //           getGaps(feature.end, alignmentTracks[0].alignmentData.sequence)
    //             .gapsBefore + feature.end;
    //         // const gapsBeforeFeatureInSeqRead = getGaps(feature.start - gapsBeforeSeqRead, alignmentData.sequence).gapsBefore
    //         const gapsAfterSeqRead =
    //           alignmentData.sequence.length -
    //           alignmentData.sequence.replace(/-+$/g, "").length;
    //         const seqReadLengthWithoutGapsBeforeAfter =
    //           alignmentData.sequence.length -
    //           gapsBeforeSeqRead -
    //           gapsAfterSeqRead;
    //         const absoluteSeqReadStart = gapsBeforeSeqRead;
    //         const absoluteSeqReadEnd =
    //           absoluteSeqReadStart + seqReadLengthWithoutGapsBeforeAfter;
    //         let featureStartInSeqRead;
    //         if (absoluteFeatureEnd < absoluteSeqReadStart) {
    //           // if the feature ends before the seq read starts, do nothing
    //         } else if (absoluteFeatureStart > absoluteSeqReadEnd) {
    //           // if the feature starts after the seq read ends, do nothing
    //         } else if (
    //           absoluteFeatureStart < absoluteSeqReadStart &&
    //           absoluteFeatureEnd > absoluteSeqReadStart
    //         ) {
    //           // if the feature starts before the seq read starts but doesn't end before the seq read starts
    //           const arrayOfCodonStartPos = [];
    //           for (
    //             let i = absoluteFeatureStart;
    //             i < absoluteSeqReadStart + 6;
    //             i += 3
    //           ) {
    //             arrayOfCodonStartPos.push(i);
    //           }
    //           // want to start translation at the codon start pos closest to seq read start
    //           const absoluteTranslationStartInFrame =
    //             arrayOfCodonStartPos.reduce((prev, curr) =>
    //               Math.abs(curr - absoluteSeqReadStart) <
    //                 Math.abs(prev - absoluteSeqReadStart) &&
    //               curr >= absoluteSeqReadStart
    //                 ? curr
    //                 : prev
    //             );
    //           const seqReadTranslationStartInFrame =
    //             absoluteTranslationStartInFrame - gapsBeforeSeqRead;
    //           editedFeature.start = seqReadTranslationStartInFrame;
    //           const shortenedFeatureLength =
    //             Math.abs(absoluteFeatureEnd - absoluteFeatureStart) -
    //             (absoluteTranslationStartInFrame - absoluteFeatureStart);
    //           editedFeature.end = editedFeature.start + shortenedFeatureLength;
    //           refSeqCdsFeaturesBpPos.push(editedFeature);
    //         } else {
    //           // if the feature is fully contained within the seq read start/end
    //           const seqReadStartToFeatureStartIncludingGaps =
    //             alignmentData.sequence
    //               .replace(/^-+/g, "")
    //               .replace(/-+$/g, "")
    //               .slice(0, bpsFromSeqReadStartToFeatureStartIncludingGaps);
    //           const arrayOfGaps = seqReadStartToFeatureStartIncludingGaps.match(
    //             new RegExp("-", "g")
    //           );
    //           let numOfGapsFromSeqReadStartToFeatureStart = 0;
    //           if (arrayOfGaps !== null) {
    //             numOfGapsFromSeqReadStartToFeatureStart = arrayOfGaps.length;
    //           }
    //           featureStartInSeqRead =
    //             bpsFromSeqReadStartToFeatureStartIncludingGaps -
    //             numOfGapsFromSeqReadStartToFeatureStart;
    //           editedFeature.start = featureStartInSeqRead;
    //           const featureLength = Math.abs(feature.end - feature.start);
    //           editedFeature.end = editedFeature.start + featureLength;
    //           refSeqCdsFeaturesBpPos.push(editedFeature);
    //         }
    //       }
    //     });
    //     // add ref seq's CDS features to seq reads (not the actual sequenceData) to generate translations at those bp pos
    //     if (refSeqCdsFeaturesBpPos.length !== 0) {
    //       sequenceDataWithRefSeqCdsFeatures.features.push(
    //         ...refSeqCdsFeaturesBpPos
    //       );
    //       // use returned aligned sequence rather than original sequence because after bowtie2, may be reverse complement or have soft-clipped ends
    //       sequenceDataWithRefSeqCdsFeatures.sequence =
    //         alignmentData.sequence.replace(/-/g, "");
    //     }
    //   }
    // }
    const tickSpacing = massageTickSpacing(
      Math.ceil(120 / charWidthInLinearView)
    );

    const { compactNames } =
      alignmentVisibilityToolOptions.alignmentAnnotationVisibility;
    const selectionLayer = [
      this.state[`tempTrimBefore${i}`] || trimmedRangesToDisplay[0],
      this.state[`tempTrimAfter${i}`] || trimmedRangesToDisplay[1]
    ]
      .filter((i) => i)
      .map((i) => ({
        ...i,
        hideCarets: true,
        ignoreGaps: true,
        className: "tg-trimmed-region",
        color: "gray"
      }));
    const innerRenderItem = (provided = {}, snapshot) => (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className={classNames("alignmentViewTrackContainer", {
          isDragDisabled
        })}
        data-alignment-track-index={i}
        style={{
          boxShadow: isTemplate
            ? "red 0px -1px 0px 0px inset, red 0px 1px 0px 0px inset"
            : "0px -1px 0px 0px inset",
          display: "flex",
          ...provided?.draggableProps?.style,
          ...(snapshot?.isDragging && { left: unset })
        }}
        key={i}
      >
        <div
          className="alignmentTrackName"
          style={{
            position: "sticky",
            left: 0,
            zIndex: 10,
            borderBottom: `1px solid ${isTemplate ? "red" : "lightgray"}`,
            borderRight: `1px solid ${isTemplate ? "red" : "lightgray"}`,
            width: this.state.nameDivWidth - 3,
            padding: 2,
            marginRight: 3,
            paddingBottom: 0,
            minWidth: this.state.nameDivWidth - 3,
            overflow: "hidden",
            scrollbarWidth: "none",
            whiteSpace: "nowrap"
          }}
          title={name}
          key={i}
        >
          <div
            {...provided?.dragHandleProps}
            style={{
              ...(compactNames && {
                display: "flex",
                alignItems: "flex-start"
              }),
              cursor:
                !isPairwise && allowTrackRearrange && !isTemplate ? "move" : ""
            }}
          >
            <div
              className="alignmentTrackNameDiv"
              style={{
                background: "#3FA6DA",
                display: "inline-block",
                color: "white",
                borderRadius: 5,
                paddingRight: 5,
                ...(compactNames && {
                  marginRight: 5
                })
              }}
            >
              {allowTrackNameEdit && (
                <Button
                  onClick={() => {
                    showDialog({
                      ModalComponent: EditTrackNameDialog,
                      props: {
                        initialValues: {
                          name
                        },
                        updateName: ({ newName }) => {
                          updateTrackHelper({
                            currentPairwiseAlignmentIndex,
                            pairwiseAlignments,
                            upsertAlignmentRun,
                            alignmentId,
                            alignmentTracks,
                            alignmentTrackIndex: i,
                            update: { name: newName }
                          });
                        }
                      }
                    });
                  }}
                  small
                  data-tip="Edit Track Name"
                  className="edit-track-name-btn"
                  icon={<Icon size={12} color="lightgrey" icon="edit"></Icon>}
                  minimal
                ></Button>
              )}
              {sequenceData.seqLink && (
                <AnchorButton
                  href={sequenceData.seqLink}
                  data-tip={sequenceData.seqLinkTooltip}
                  target="_blank"
                  small
                  icon={
                    <Icon size={12} color="white" icon="document-open"></Icon>
                  }
                  minimal
                ></AnchorButton>
              )}
              {name}
            </div>
            <div style={{ fontSize: 10, marginTop: 2, marginBottom: 2 }}>
              {/* <Icon //tnr: add this once we support forward/reverse for each track
                color="darkgrey"
                style={{ marginRight: 10 }}
                icon="arrow-right"
              ></Icon> */}
              {isReversed && (
                <span
                  style={{
                    backgroundColor: isReversed ? "#E76A6E" : "#4C90F0",
                    padding: 2,
                    paddingLeft: 4,
                    color: "white",
                    marginRight: 2,
                    borderRadius: "5px"
                  }}
                  data-tip={
                    isReversed
                      ? "The alignment algorithm matched the reverse complement of this input sequence"
                      : "The original sequence was NOT reversed complemented by the alignment algorithm"
                  }
                >
                  {isReversed ? "REV" : "FWD"}{" "}
                </span>
              )}
              {wasTrimmed && (
                <span
                  style={{
                    backgroundColor: "#13C9BA",
                    padding: 2,
                    paddingLeft: 4,
                    color: "white",
                    marginRight: 2,
                    borderRadius: "5px"
                  }}
                  data-tip="This sequence was trimmed and resubmitted for alignment"
                >
                  TRIMMED
                </span>
              )}
              {sequenceData.sequence.length} bps
            </div>
          </div>
          <HorizontalPanelDragHandle
            onDrag={({ dx }) => {
              this.setState({
                nameDivWidth: Math.min(
                  this.state.nameDivWidth - dx,
                  this.state.width - 20
                )
              });
            }}
          />
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
              left: this.state.nameDivWidth,
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
            caretPosition: this.state[`tempTrimmingCaret${i}`] || -1,
            selectionLayer,
            // : { start: -1, end: -1 },
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
            editorDragStarted: noop, //override these since we're defining the handlers above
            editorDragStopped: noop, //override these since we're defining the handlers above
            editorDragged: noop, //override these since we're defining the handlers above
            hideName: true,
            sequenceData,
            // sequenceDataWithRefSeqCdsFeatures,
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
    if (isTemplate) return innerRenderItem();
    if (cloneProps)
      return innerRenderItem(cloneProps.provided, cloneProps.snapshot);
    const idToUse = alignmentData.id || sequenceData.id || i + "_index_id";
    return (
      <DndDraggable
        key={idToUse.toString()}
        index={i}
        isDragDisabled={isDragDisabled}
        draggableId={idToUse.toString()}
      >
        {innerRenderItem}
      </DndDraggable>
    );
  };
  handleResize = throttle(([e]) => {
    this.easyStore.viewportWidth =
      e.contentRect.width - this.state.nameDivWidth || 400;
    this.setState({ width: e.contentRect.width });
  }, 200);

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
  onTrackDragStart = () => {
    this.setState({ isTrackDragging: true });
  };
  onTrackDragEnd = ({ destination, source }) => {
    this.setState({ isTrackDragging: false });
    if (!destination) {
      return;
    }
    const { upsertAlignmentRun, alignmentId, alignmentTracks } = this.props;
    upsertAlignmentRun({
      id: alignmentId,
      alignmentTracks: array_move(
        alignmentTracks,
        source.index,
        destination.index
      )
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
      upsertAlignmentRun,
      alignmentId,
      allowTrimming,
      additionalSelectionLayerRightClickedOptions,
      selectionLayerRightClicked,
      additionalTopEl,
      handleAlignmentRename,
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

    const getTrackVis = (alignmentTracks, isTemplate, allTracks) => {
      const rowData = {};
      const innerTrackVis = (drop_provided, drop_snapshot) => {
        return (
          <div
            className="alignmentTracks "
            style={{
              overflowY: "auto",
              display: "flex",
              zIndex: 10
            }}
          >
            <div
              style={{
                overflowX: "auto",
                width: this.state.width
              }}
              ref={(ref) => {
                this[isTemplate ? "alignmentHolderTop" : "alignmentHolder"] =
                  ref;
              }}
              onContextMenu={(e) => {
                if (
                  !allowTrimming ||
                  isTargetWithinEl(e, ".alignmentTrackName")
                ) {
                  return;
                }

                this.getTrackTrimmingOptions({
                  e,
                  allTracks,
                  upsertAlignmentRun,
                  alignmentId,
                  currentPairwiseAlignmentIndex
                });
              }}
              onMouseLeave={this.removeMinimapHighlightForMouseLeave}
              onMouseMove={this.updateMinimapHighlightForMouseMove}
              dataname="scrollGroup"
              className="alignmentHolder"
              onScroll={isTemplate ? this.handleTopScroll : this.handleScroll}
            >
              <ReactDraggable
                disabled={this.state.isTrackDragging}
                bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
                onDrag={
                  noClickDragHandlers
                    ? noop
                    : (event) => {
                        if (this.state.isTrackDragging) return;
                        this.getNearestCursorPositionToMouseEvent(
                          rowData,
                          event,
                          editorDragged
                        );
                      }
                }
                onStart={
                  noClickDragHandlers
                    ? noop
                    : (event) => {
                        if (isTargetWithinEl(event, ".alignmentTrackName")) {
                          return this.setState({ isTrackDragging: true });
                        }
                        if (this.state.isTrackDragging) return;
                        this.getNearestCursorPositionToMouseEvent(
                          rowData,
                          event,
                          editorDragStarted
                        );
                      }
                }
                onStop={
                  noClickDragHandlers
                    ? noop
                    : (...args) => {
                        setTimeout(() => {
                          this.setState({ isTrackDragging: false });
                        }, 0);
                        editorDragStopped(...args);
                      }
                }
              >
                <div
                  ref={(ref) => (this.veTracksAndAlignmentHolder = ref)}
                  className={classNames("veTracksAndAlignmentHolder", {
                    isTrackDragging: this.state.isTrackDragging
                  })}
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
                          if (this.state.isTrackDragging) return;
                          if (isTargetWithinEl(event, ".alignmentTrackName")) {
                            return;
                          }
                          this.getNearestCursorPositionToMouseEvent(
                            rowData,
                            event,
                            editorClicked
                          );
                        }
                  }
                >
                  <PerformantSelectionLayer
                    leftMargin={this.state.nameDivWidth}
                    className="veAlignmentSelectionLayer"
                    isDraggable
                    selectionLayerRightClicked={
                      selectionLayerRightClicked
                        ? (...args) => {
                            selectionLayerRightClicked(...args, this.props);
                          }
                        : (...args) => {
                            const { event } = args[0];
                            const track = getTrackFromEvent(event, allTracks);

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
                                    this
                                      .copyAllAlignmentsFastaClipboardHelper &&
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
                                                .VectorEditor
                                                .__allEditorsOptions.alignments[
                                                this.props.id
                                              ] || {};
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
                                                .VectorEditor
                                                .__allEditorsOptions.alignments[
                                                this.props.id
                                              ] || {};
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
                    leftMargin={this.state.nameDivWidth}
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
                        const domNode = ReactDOM.findDOMNode(c);
                        if (domNode instanceof HTMLElement) {
                          drop_provided.innerRef(domNode);
                        }
                      }}
                      type="variable"
                      itemSizeEstimator={this.estimateRowHeight}
                      itemRenderer={this.renderItem}
                      length={
                        alignmentTracks.length +
                        (drop_snapshot.isUsingPlaceholder ? 1 : 0)
                      }
                    />
                  )}
                </div>
              </ReactDraggable>
            </div>
          </div>
        );
      };
      if (isTemplate) return innerTrackVis();
      else
        return (
          <Droppable
            mode="virtual"
            renderClone={(provided, snapshot, { source: { index } }) => {
              return this.renderItem(index, index, false, {
                provided,
                snapshot
              });
            }}
            direction="vertical"
            droppableId={"droppable" + isTemplate ? "_no_drop" : ""}
          >
            {innerTrackVis}
          </Droppable>
        );
    };

    const [firstTrack, ...otherTracks] = alignmentTracks;
    const totalWidthOfMinimap = this.state.width;
    const totalWidthInAlignmentView = 14 * this.getSequenceLength();
    const minSliderSize = Math.min(
      totalWidthOfMinimap * (totalWidthOfMinimap / totalWidthInAlignmentView),
      totalWidthOfMinimap
    );
    const viewportHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    /**
     * Parameters to be passed to our Pinch Handler component
     * OnPinch is the method to be executed when the pinch gesture is registered
     * Pinch Handler for minimap
     */
    const pinchHandler = {
      onPinch: ({ delta: [d] }) => {
        this.bindOutsideChangeHelper.triggerChange(({ value, changeValue }) => {
          // changeValue(d);
          if (d > 0) {
            if (value > 8) {
              changeValue(value + 0.4);
            } else {
              changeValue(value + 0.2);
            }
          } else if (d < 0) {
            if (value > 8) {
              changeValue(value - 0.4);
            } else {
              changeValue(value - 0.2);
            }
          }
        });
        updateLabelsForInViewFeatures();
      }
    };

    return (
      <PinchHelper {...pinchHandler}>
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
            <DragDropContext
              onDragStart={this.onTrackDragStart}
              onDragEnd={this.onTrackDragEnd}
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

                  <div style={{ display: "flex" }}>
                    <EditableText
                      disabled={!handleAlignmentRename}
                      onChange={(v) => {
                        this.setState({
                          alignmentName: v
                        });
                      }}
                      maxLength={399} //stop the name from being tooo long
                      value={this.state.alignmentName}
                      onConfirm={async (v) => {
                        if (!v) {
                          this.setState({
                            alignmentName: this.props.alignmentName
                          });
                          return;
                        }
                        if (v === this.props.alignmentName) {
                          return; //already saved this name
                        }
                        this.setState({ saveMessage: "Alignment Renaming.." });
                        this.setState({ saveMessageLoading: true });
                        await handleAlignmentRename(v, this.props);
                        this.setState({ saveMessage: "Rename Successful" });
                        this.setState({ saveMessageLoading: false });
                        setTimeout(() => {
                          this.setState({ saveMessage: undefined });
                          this.setState({ saveMessageLoading: false });
                        }, 5000);
                      }}
                      selectAllOnFocus={true}
                      className="veAlignmentName"
                    ></EditableText>
                    &nbsp;&nbsp;&nbsp;
                    <div
                      className="veAlignmentType"
                      style={{
                        paddingTop: "3px",
                        fontSize: "14px",
                        color: "grey",
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={
                        this.props.alignmentType || "Unknown Alignment Type"
                      }
                    >
                      {this.props.alignmentType || "Unknown Alignment Type"}
                    </div>
                  </div>

                  {this.props.unmappedSeqs && (
                    <InfoHelper
                      size={20}
                      content={
                        <div>
                          This alignment had sequences that did not map to the
                          template sequence:
                          {this.props.unmappedSeqs.map(
                            ({ sequenceData }, i) => (
                              <div key={i}>{sequenceData.name}</div>
                            )
                          )}
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
                        this.isZooming = true;
                        setTimeout(() => {
                          this.isZooming = false;
                        }, 10);
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
                      className="veZoomAlignmentSlider ove-slider"
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
                      currentPairwiseAlignmentIndex={
                        currentPairwiseAlignmentIndex
                      }
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
                  {this.state.saveMessage && (
                    <div
                      className="ove-menu-toast"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: 10
                      }}
                    >
                      {this.state.saveMessageLoading ? (
                        <div>
                          <Spinner size={15}></Spinner>
                        </div>
                      ) : (
                        <Icon icon="tick-circle" intent="success"></Icon>
                      )}{" "}
                      &nbsp;
                      {this.state.saveMessage}
                    </div>
                  )}
                </div>
                {hasTemplate ? (
                  <React.Fragment>
                    <div className="alignmentTrackFixedToTop">
                      {getTrackVis([firstTrack], true, alignmentTracks)}
                    </div>
                    {getTrackVis(otherTracks, false, alignmentTracks)}
                  </React.Fragment>
                ) : (
                  getTrackVis(alignmentTracks, false, alignmentTracks)
                )}
              </div>
            </DragDropContext>
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
                    nameDivOffsetPercent: 0,
                    // this.state.nameDivWidth / this.getMaxLinearViewWidth(),
                    scrollYToTrack: this.scrollYToTrack,
                    onSizeAdjust: this.onMinimapSizeAdjust,
                    minSliderSize,
                    laneHeight:
                      minimapLaneHeight ||
                      (alignmentTracks.length > 5 ? 10 : 17),
                    laneSpacing:
                      minimapLaneSpacing ||
                      (alignmentTracks.length > 5 ? 2 : 1),
                    easyStore: this.easyStore,
                    numBpsShownInLinearView: this.getNumBpsShownInLinearView(),
                    scrollAlignmentView: this.state.scrollAlignmentView
                  }}
                  onMinimapScrollX={this.scrollAlignmentToPercent}
                />
              </div>
            )}
            <GlobalDialog
            // {...pickedUserDefinedHandlersAndOpts}
            // dialogOverrides={pick(this.props, [
            //   "AddOrEditFeatureDialogOverride",
            //   "AddOrEditPartDialogOverride",
            //   "AddOrEditPrimerDialogOverride"
            // ])}
            />
          </div>
        </ResizeSensor>
      </PinchHelper>
    );
  }

  getTrackTrimmingOptions({
    e,
    allTracks,
    upsertAlignmentRun,
    currentPairwiseAlignmentIndex,
    alignmentId
  }) {
    const track = getTrackFromEvent(e, allTracks);

    this.getNearestCursorPositionToMouseEvent(
      this.rowData,
      e,
      ({ nearestCaretPos }) => {
        this.setState({
          [`tempTrimmingCaret${track.index}`]: nearestCaretPos
        });
        const afterDisabled =
          nearestCaretPos <= track.alignmentData.trimmedRange?.start;
        const beforeDisabled =
          nearestCaretPos > track.alignmentData.trimmedRange?.end;
        showContextMenu(
          [
            {
              divider: (
                <div
                  style={{
                    color: "#137cbd",
                    fontSize: 13,
                    fontWeight: "bold"
                  }}
                >{`Trim ${
                  track.sequenceData.name || track.sequenceData.id
                }...`}</div>
              )
            },
            {
              text: "Ignore Before",
              disabled: beforeDisabled,
              icon: "drawer-left-filled",
              onMouseOver: () =>
                !beforeDisabled &&
                this.setState({
                  [`tempTrimBefore${track.index}`]: {
                    start: 0,
                    end: nearestCaretPos - 1
                  }
                }),
              onMouseLeave: () =>
                this.setState({
                  [`tempTrimBefore${track.index}`]: undefined
                }),
              onClick: () => {
                updateTrackHelper({
                  currentPairwiseAlignmentIndex,
                  upsertAlignmentRun,
                  alignmentId,
                  alignmentTracks: allTracks,
                  alignmentTrackIndex: track.index,
                  hasBeenTrimmed: true,
                  update: {
                    trimmedRange: {
                      start: nearestCaretPos,
                      end:
                        track.alignmentData.trimmedRange?.end ||
                        this.getMaxLength() - 1
                    }
                  }
                });
              }
            },
            {
              text: "Ignore After",
              disabled: afterDisabled,
              icon: "drawer-right-filled",
              onMouseOver: () =>
                !afterDisabled &&
                this.setState({
                  [`tempTrimAfter${track.index}`]: {
                    start: nearestCaretPos,
                    end: this.getMaxLength() - 1
                  }
                }),
              onMouseLeave: () =>
                this.setState({
                  [`tempTrimAfter${track.index}`]: undefined
                }),
              onClick: () => {
                updateTrackHelper({
                  currentPairwiseAlignmentIndex,
                  upsertAlignmentRun,
                  alignmentId,
                  alignmentTracks: allTracks,
                  alignmentTrackIndex: track.index,
                  hasBeenTrimmed: true,
                  update: {
                    trimmedRange: {
                      start: track.alignmentData.trimmedRange?.start || 0,
                      end: nearestCaretPos - 1
                    }
                  }
                });
              }
            },
            {
              divider: ""
            },
            {
              text: "Clear Trim(s)",
              disabled: !(track?.alignmentData?.trimmedRange?.start > -1),
              icon: "trash",
              onClick: () => {
                updateTrackHelper({
                  currentPairwiseAlignmentIndex,
                  upsertAlignmentRun,
                  alignmentId,
                  alignmentTracks: allTracks,
                  alignmentTrackIndex: track.index,
                  hasBeenTrimmed: false,
                  update: {
                    trimmedRange: undefined
                  }
                });
              }
            }
          ],
          undefined,
          e,
          () => {
            this.setState({
              [`tempTrimmingCaret${track.index}`]: undefined
            });
          }
        );
      }
    );
    e.preventDefault();
    e.stopPropagation();
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
        stateTrackingId,
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
        "dnaColors",
        "compactNames"
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
        stateTrackingId,
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
          alignmentAnnotationVisibilityToggle: (updates) => {
            setTimeout(() => {
              updateLabelsForInViewFeatures({
                rectElement: ".alignmentHolder"
              });
            }, 0);

            updateAlignmentViewVisibility({
              ...alignment,
              alignmentAnnotationVisibility: {
                ...alignment.alignmentAnnotationVisibility,
                ...updates
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

const PerformantCaret = view(({ easyStore, ...rest }) => {
  return <Caret caretPosition={easyStore.caretPosition} {...rest} />;
});

function cleanTracks(alignmentTracks) {
  return alignmentTracks.map((t) => {
    return omit(t, [
      "matchHighlightRanges",
      "additionalSelectionLayers",
      "mismatches"
    ]);
  });
}
