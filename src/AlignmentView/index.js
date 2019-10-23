import Clipboard from "clipboard";
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Icon,
  Slider,
  Intent,
  Popover,
  InputGroup,
  Menu,
  MenuItem,
  Tooltip
} from "@blueprintjs/core";
import { Loading, showContextMenu } from "teselagen-react-components";
import { store } from "react-easy-state";
import { throttle, cloneDeep, map } from "lodash";
import PropTypes from "prop-types";
import { getSequenceDataBetweenRange } from "ve-sequence-utils";
import ReactList from "@teselagen/react-list";
import { NonReduxEnhancedLinearView } from "../LinearView";
import Minimap from "./Minimap";
import { getContext, compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import * as alignmentActions from "../redux/alignments";
import estimateRowHeight from "../RowView/estimateRowHeight";
import prepareRowData from "../utils/prepareRowData";
import withEditorProps from "../withEditorProps";

import "./style.css";
import { isFunction } from "util";
import {
  editorDragged,
  editorClicked,
  editorDragStarted,
  updateSelectionOrCaret,
  editorDragStopped
} from "../withEditorInteractions/clickAndDragUtils";
import { ResizeSensor } from "@blueprintjs/core";

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
// @HotkeysTarget
class AlignmentView extends React.Component {
  constructor(props) {
    super(props);
    this.onShortcutCopy = document.addEventListener(
      "keydown",
      this.handleAlignmentCopy
    );
  }

  componentWillUnmount() {
    this.onShortcutCopy &&
      document.removeEventListener("keydown", this.handleAlignmentCopy);
  }
  handleAlignmentCopy = event => {
    if (
      event.key === "c" &&
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
    let seqDataOfAllTracksToCopy = [];
    alignmentTracks.forEach(track => {
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
    percentScrolled: 0,
    verticalVisibleRange: { start: 0, end: 0 }
  });

  getMinCharWidth = () => {
    const toReturn = Math.min(
      Math.max(this.state.width - nameDivWidth - 5, 1) /
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
      this.updateXScrollPercentage(this.props.scrollPercentageToJumpTo);
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setVerticalScrollRange();
    }, 500);

    // const userAlignmentViewPercentageHeight =
    //   this.alignmentHolder.clientHeight / this.alignmentHolder.scrollHeight;
    // this.setState({ userAlignmentViewPercentageHeight });
  }
  UNSAFE_componentWillMount() {
    this.editorDragged = editorDragged.bind(this);
    this.editorClicked = editorClicked.bind(this);
    this.editorDragStarted = editorDragStarted.bind(this);
    this.editorDragStopped = editorDragStopped.bind(this);
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

  updateSelectionOrCaret = (shiftHeld, newRangeOrCaret) => {
    const {
      selectionLayer,
      caretPosition
      // sequenceData = { sequence: "" }
    } = this.props;
    const sequenceLength = this.getSequenceLength();
    updateSelectionOrCaret({
      shiftHeld,
      sequenceLength,
      newRangeOrCaret,
      caretPosition,
      selectionLayer,
      selectionLayerUpdate: this.selectionLayerUpdate,
      caretPositionUpdate: this.caretPositionUpdate
    });
  };

  caretPositionUpdate = position => {
    let { caretPosition = -1, alignmentId, alignmentRunUpdate } = this.props;
    if (caretPosition === position) {
      return;
    }
    alignmentRunUpdate({
      alignmentId,
      selectionLayer: { start: -1, end: -1 },
      caretPosition: position
    });
  };

  selectionLayerUpdate = newSelection => {
    let {
      selectionLayer = { start: -1, end: -1 },
      // ignoreGapsOnHighlight,
      alignmentId,
      alignmentRunUpdate
    } = this.props;
    if (!newSelection) return;
    const { start, end } = newSelection;
    if (selectionLayer.start === start && selectionLayer.end === end) {
      return;
    }
    alignmentRunUpdate({
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
      const [start, end] = this.InfiniteScroller.getFractionalVisibleRange();
      if (
        this.easyStore.verticalVisibleRange.start !== start ||
        this.easyStore.verticalVisibleRange.end !== end
      )
        this.easyStore.verticalVisibleRange = { start, end };
    }
  }, 100);
  handleScroll = () => {
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
      this.updateXScrollPercentage(newPercent);
      this.blockScroll = false;
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
  updateXScrollPercentage = scrollPercentage => {
    this.easyStore.percentScrolled = scrollPercentage;
    this.alignmentHolder.scrollLeft =
      Math.min(Math.max(scrollPercentage, 0), 1) *
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    if (this.alignmentHolderTop) {
      this.alignmentHolderTop.scrollLeft =
        Math.min(Math.max(scrollPercentage, 0), 1) *
        (this.alignmentHolderTop.scrollWidth -
          this.alignmentHolderTop.clientWidth);
    }
  };
  scrollYToTrack = trackIndex => {
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

  renderItem = (_i, key, isTemplate) => {
    let charWidthInLinearView = this.getCharWidthInLinearView();

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
      sequence.split("").forEach(char => {
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
        let refSeqCdsFeaturesBpPos = [];
        alignmentTracks[0].sequenceData.features.forEach(feature => {
          if (feature.type === "CDS") {
            let editedFeature = cloneDeep(feature);
            // in seq reads, ref seq's CDS feature translations need to show up at the bp pos of alignment, not the original bp pos
            // actual position in the track
            const absoluteFeatureStart =
              getGaps(feature.start, alignmentTracks[0].alignmentData.sequence)
                .gapsBefore + feature.start;
            const gapsBeforeSeqRead = getGaps(0, alignmentData.sequence)
              .gapsBefore;
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
              let arrayOfCodonStartPos = [];
              for (
                let i = absoluteFeatureStart;
                i < absoluteSeqReadStart + 6;
                i += 3
              ) {
                arrayOfCodonStartPos.push(i);
              }
              // want to start translation at the codon start pos closest to seq read start
              const absoluteTranslationStartInFrame = arrayOfCodonStartPos.reduce(
                (prev, curr) =>
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
              const seqReadStartToFeatureStartIncludingGaps = alignmentData.sequence
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
          sequenceDataWithRefSeqCdsFeatures.sequence = alignmentData.sequence.replace(
            /-/g,
            ""
          );
        }
      }
    }

    return (
      <div
        className="alignmentViewTrackContainer"
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
            boxShadow: isTemplate
              ? "0px 0px 0px 1px red inset"
              : `0px -3px 0px -2px inset, 3px -3px 0px -2px inset, -3px -3px 0px -2px inset`,
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
            ...(noClickDragHandlers
              ? {
                  caretPosition: -1,
                  selectionLayer: { start: -1, end: -1 }
                }
              : {
                  editorDragged: this.editorDragged,
                  editorClicked: this.editorClicked,
                  editorDragStarted: this.editorDragStarted,
                  editorDragStopped: this.editorDragStopped
                }),
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
            selectionLayerRightClicked: ({ event }) => {
              showContextMenu(
                [
                  {
                    text: "Copy Selection of All Alignments as Fasta",
                    className: "copyAllAlignmentsFastaClipboardHelper",
                    hotkey: "cmd+c",
                    willUnmount: () => {
                      this.copyAllAlignmentsFastaClipboardHelper &&
                        this.copyAllAlignmentsFastaClipboardHelper.destroy();
                    },
                    didMount: () => {
                      this.copyAllAlignmentsFastaClipboardHelper = new Clipboard(
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
                    className: "copySpecificAlignmentFastaClipboardHelper",
                    willUnmount: () => {
                      this.copySpecificAlignmentFastaClipboardHelper &&
                        this.copySpecificAlignmentFastaClipboardHelper.destroy();
                    },
                    didMount: () => {
                      this.copySpecificAlignmentFastaClipboardHelper = new Clipboard(
                        `.copySpecificAlignmentFastaClipboardHelper`,
                        {
                          action: "copySpecificAlignmentFasta",
                          text: () => {
                            const { selectionLayer } =
                              this.props.store.getState().VectorEditor
                                .__allEditorsOptions.alignments[
                                this.props.id
                              ] || {};
                            const seqDataToCopy = getSequenceDataBetweenRange(
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
                      window.toastr.success("Selection Copied");
                    }
                  }
                ],
                undefined,
                event
              );
            },
            hideName: true,
            sequenceData,
            sequenceDataWithRefSeqCdsFeatures,
            tickSpacing: Math.ceil(120 / charWidthInLinearView),
            allowSeqDataOverride: true, //override the sequence data stored in redux so we can track the caret position/selection layer in redux but not have to update the redux editor
            editorName: `${isTemplate ? "template_" : ""}alignmentView${i}`,
            alignmentData,
            chromatogramData,
            height: "100%",
            vectorInteractionWrapperStyle: {
              overflowY: "hidden"
            },

            charWidth: charWidthInLinearView,
            ignoreGapsOnHighlight: true,
            // editorDragged: (vals) => {
            // },
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
            width: linearViewWidth
            // scrollData: {
            //   viewportWidth: trackWidth,
            //   fractionScrolled: this.easyStore
            // }
          }}
        />
      </div>
    );
  };
  handleResize = throttle(([e]) => {
    this.setState({ width: e.contentRect.width });
  }, 200);

  render() {
    let charWidthInLinearView = this.getCharWidthInLinearView();
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
      alignmentVisibilityToolOptions
    } = this.props;

    if (
      !alignmentTracks ||
      !alignmentTracks[0] ||
      !alignmentTracks[0].alignmentData
    ) {
      console.error("corrupted data!", this.props);
      return "corrupted data!";
    }

    // const trackWidth = width - nameDivWidth || 400;

    const getTrackVis = (alignmentTracks, isTemplate) => {
      return (
        <div
          className="alignmentTracks "
          style={{ overflowY: "auto", display: "flex", zIndex: 10 }}
        >
          <div
            style={{
              overflowX: "auto",
              // maxHeight: 500,
              // width: trackWidth
              width: this.state.width
            }}
            ref={ref => {
              this[isTemplate ? "alignmentHolderTop" : "alignmentHolder"] = ref;
            }}
            dataname="scrollGroup"
            className="alignmentHolder"
            onScroll={isTemplate ? this.handleTopScroll : this.handleScroll}
          >
            {isTemplate ? (
              this.renderItem(0, 0, isTemplate)
            ) : (
              <ReactList
                ref={c => {
                  this.InfiniteScroller = c;
                }}
                type="variable"
                itemSizeEstimator={this.estimateRowHeight}
                // itemSizeGetter={itemSizeGetter}
                itemRenderer={this.renderItem}
                length={alignmentTracks.length}
              />
            )}
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
                // maxHeight: "32px",
                // height: "32px",
                width: "100%",
                // overflowX: "scroll",
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
              {!isInPairwiseOverviewView && (
                <UncontrolledSliderWithPlusMinusBtns
                  onRelease={val => {
                    this.setCharWidthInLinearView({
                      charWidthInLinearView: val
                    });
                    this.blockScroll = true; //we block the scroll to prevent jumpiness and then manually update to the desired scroll percentage
                    const percentScrollage = this.easyStore.percentScrolled;
                    setTimeout(() => {
                      this.blockScroll = false;
                      this.updateXScrollPercentage(percentScrollage);
                    });
                  }}
                  title="Adjust Zoom Level"
                  style={{ paddingTop: "4px", width: 100 }}
                  className="alignment-zoom-slider"
                  labelRenderer={false}
                  stepSize={0.01}
                  initialValue={charWidthInLinearView}
                  max={14}
                  min={this.getMinCharWidth()}
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
                minHeight: "-webkit-min-content", //https://stackoverflow.com/questions/28029736/how-to-prevent-a-flex-item-from-shrinking-smaller-than-its-content
                marginTop: 4,
                paddingTop: 4,
                borderTop: "1px solid lightgrey",
                display: "flex"
              }}
            >
              <Minimap
                {...{
                  alignmentTracks,
                  dimensions: {
                    width: Math.max(this.state.width, 10) || 10
                  },
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
                onMinimapScrollX={this.updateXScrollPercentage}
              />
            </div>
          )}
        </div>
      </ResizeSensor>
    );
  }
}

// export const AlignmentView = withEditorInteractions(_AlignmentView);

export default compose(
  // export const AlignmentView = withEditorInteractions(_AlignmentView);
  getContext({
    store: PropTypes.object
  }),
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
      const templateLength = (pairwiseAlignments
        ? pairwiseAlignments[0][0]
        : alignmentTracks[0]
      ).alignmentData.sequence.length;

      const alignmentAnnotationsToToggle = [
        "features",
        "parts",
        "sequence",
        "reverseSequence",
        "axis",
        "axisNumbers",
        "translations",
        "cdsFeatureTranslations",
        "chromatogram",
        "dnaColors"
      ];
      let togglableAlignmentAnnotationSettings = {};
      map(alignmentAnnotationsToToggle, annotation => {
        if (annotation in alignmentAnnotationVisibility) {
          togglableAlignmentAnnotationSettings[annotation] =
            alignmentAnnotationVisibility[annotation];
        }
      });

      let annotationsWithCounts = [];
      if (alignmentTracks) {
        let totalNumOfFeatures = 0;
        let totalNumOfParts = 0;
        alignmentTracks.forEach(seq => {
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
        pairwiseAlignments.forEach(pairwise => {
          let totalNumOfFeatures = 0;
          let totalNumOfParts = 0;
          pairwise.forEach(seq => {
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
          alignmentAnnotationVisibilityToggle: name => {
            updateAlignmentViewVisibility({
              ...alignment,
              alignmentAnnotationVisibility: {
                ...alignment.alignmentAnnotationVisibility,
                [name]: !alignment.alignmentAnnotationVisibility[name]
              }
            });
          },
          alignmentAnnotationLabelVisibilityToggle: name => {
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
    renderComponent(props => {
      return <PairwiseAlignmentView {...props} />;
    })
  )
)(AlignmentView);

class UncontrolledSliderWithPlusMinusBtns extends React.Component {
  state = { value: 0 };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.oldInitialValue !== nextProps.initialValue) {
      return {
        value: nextProps.initialValue, //set the state value if a new initial value comes in!
        oldInitialValue: nextProps.initialValue
      };
    } else {
      return null;
    }
  }

  render() {
    const { value } = this.state;
    const { title, initialValue, style, ...rest } = this.props;

    return (
      <div
        title={title}
        style={{ ...style, display: "flex", marginLeft: 15, marginRight: 20 }}
      >
        <Icon
          onClick={() => {
            const newVal = Math.max(
              this.state.value - (this.props.max - this.props.min) / 10,
              this.props.min
            );
            this.setState({
              value: newVal
            });
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginRight: 5 }}
          intent={Intent.PRIMARY}
          icon="minus"
        />
        <Slider
          {...{ ...rest, value }}
          onChange={value => {
            this.setState({ value });
          }}
        />
        <Icon
          onClick={() => {
            const newVal = Math.min(
              this.state.value + (this.props.max - this.props.min) / 10,
              this.props.max
            );
            this.setState({
              value: newVal
            });
            this.props.onRelease(newVal);
          }}
          style={{ cursor: "pointer", marginLeft: 5 }}
          intent={Intent.PRIMARY}
          icon="plus"
        />
      </div>
    );
  }
}

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
            handleSelectTrack: trackIndex => {
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
