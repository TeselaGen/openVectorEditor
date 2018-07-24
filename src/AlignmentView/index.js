/* eslint-disable react/no-deprecated */

import React from "react";
import { connect } from "react-redux";
import { Button, Slider, Tooltip, Intent, Position } from "@blueprintjs/core";
import { Loading } from "teselagen-react-components";
import { store } from "react-easy-state";
import { LinearView } from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import * as alignmentActions from "../redux/alignments";
import Mismatches from "./Mismatches";

// import withEditorProps from "../withEditorProps";
// import withEditorInteractions from "../withEditorInteractions";
import "./style.css";
import { isFunction } from "util";
import {
  editorDragged,
  editorClicked,
  editorDragStarted,
  updateSelectionOrCaret,
  editorDragStopped
} from "../withEditorInteractions/clickAndDragUtils";

const nameDivWidth = 140;
const charWidthInLinearViewDefault = 12;

class AlignmentView extends React.Component {
  state = {
    charWidthInLinearView: charWidthInLinearViewDefault
  };
  easyStore = store({ percentScrolled: 0 });

  getMinCharWidth = () => {
    const {
      dimensions: { width }
    } = this.props;

    const toReturn = Math.min(
      Math.max(width - nameDivWidth - 5, 1) / this.getSequenceLength(),
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
      this.updateToScrollPercentage(this.props.scrollPercentageToJumpTo);
    }
  }
  componentDidMount() {
    reset();
  }
  componentWillMount() {
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
    // console.log('clicking')
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
    // console.log('highlighting')
    let {
      selectionLayer = { start: -1, end: -1 },
      ignoreGapsOnHighlight,
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

  getNumBpsShownInLinearView = () => {
    const { charWidthInLinearView } = this.state;
    const {
      dimensions: { width }
    } = this.props;
    const toReturn = (width - nameDivWidth) / charWidthInLinearView;
    return toReturn || 0;
  };
  handleScroll = () => {
    if (this.blockScroll) {
      //we have to block the scroll sometimes because when adjusting the minimap
      return;
    }
    const scrollPercentage =
      this.alignmentHolder.scrollLeft /
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    this.easyStore.percentScrolled = scrollPercentage || 0;
  };
  onMinimapSizeAdjust = newSliderSize => {
    const { dimensions } = this.props;
    const percentageOfSpace = newSliderSize / (dimensions.width - nameDivWidth);
    const seqLength = this.getSequenceLength();
    const numBpsInView = seqLength * percentageOfSpace;
    const newCharWidth = (dimensions.width - nameDivWidth) / numBpsInView;
    this.blockScroll = true;
    setTimeout(() => {
      this.blockScroll = false;
    }, 0);
    this.setState({ charWidthInLinearView: newCharWidth });
  };

  updateToScrollPercentage = scrollPercentage => {
    this.alignmentHolder.scrollLeft =
      Math.min(Math.max(scrollPercentage, 0), 1) *
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
  };
  render() {
    // console.log('this.props in alignment view:',this.props)
    let { charWidthInLinearView } = this.state;
    const {
      alignmentTracks = [],
      dimensions: { width },
      dimensions,
      noClickDragHandlers,
      height,
      minimapLaneHeight,
      minimapLaneSpacing,
      hideBottomBar,
      isFullyZoomedOut,
      handleSelectTrack,
      hasTemplate,
      noVisibilityOptions,
      linearViewOptions,
      handleBackButtonClicked,
      alignmentVisibilityToolOptions,
      ...rest
    } = this.props;

    if (isFullyZoomedOut) {
      charWidthInLinearView = this.getMinCharWidth();
    }

    if (
      !alignmentTracks ||
      !alignmentTracks[0] ||
      !alignmentTracks[0].alignmentData
    ) {
      console.error("corrupted data!", this.props);
      return "corrupted data!";
    }

    const trackWidth = width - nameDivWidth || 400;

    const getTrackVis = (alignmentTracks, isTemplate) => {
      return (
        // {alignmentTracks.map((track, i) => {
        //   const {
        //     // sequenceData,
        //     alignmentData,
        //     mismatches
        //   } = track;
        //   return (
        //     <div
        //       className={"alignmentMismatches"}
        //       style={{
        //         position: "absolute",
        //         right: 0,
        //         zIndex: 10,
        //         boxShadow:
        //           `0px -3px 0px -2px inset, 3px -3px 0px -2px inset, -3px -3px 0px -2px inset`,
        //         width: 230,
        //         height: 0.723 * height,
        //         padding: 2,
        //         // minWidth: nameDivWidth,
        //         background: "rgb(243, 243, 243)",
        //         textOverflow: "ellipsis",
        //         overflowY: "auto",
        //         whiteSpace: "nowrap"
        //       }}
        //       title={"mismatches " + i}
        //       key={"mismatches key " + i}
        //     >
        //       <Mismatches
        //       {...{
        //         ...rest,
        //         // sequenceData,
        //         // allowSeqDataOverride: true, //override the sequence data stored in redux so we can track the caret position/selection layer in redux but not have to update the redux editor
        //         // editorName: `${
        //         //   isTemplate ? "template_" : ""
        //         // }alignmentView${i}`,
        //         alignmentData,
        //         mismatches,
        //         // chromatogramData,
        //         // height: 0.75 * height,
        //         // height: "100%",
        //         charWidth: charWidthInLinearView
        //       }}
        //       />
        //     </div>
        //   )
        // })}

        <div
          className={"alignmentTracks "}
          style={{ overflowY: "auto", display: "flex" }}
        >
          <div
            style={{
              overflowX: "auto",
              // width: trackWidth
              width: dimensions.width
            }}
            ref={ref => {
              this[isTemplate ? "alignmentHolderTop" : "alignmentHolder"] = ref;
            }}
            dataname="scrollGroup"
            className="alignmentHolder syncscroll"
            onScroll={isTemplate ? noop : this.handleScroll}
          >
            {alignmentTracks.map((track, i) => {
              const {
                sequenceData,
                additionalSelectionLayers,
                alignmentData,
                chromatogramData
                // mismatches
              } = track;
              const linearViewWidth =
                (alignmentData || sequenceData).sequence.length *
                charWidthInLinearView;
              const name = sequenceData.name || sequenceData.id;
              return (
                <div
                  className={"alignmentViewTrackContainer"}
                  style={{
                    boxShadow: isTemplate
                      ? "red 0px -1px 0px 0px inset, red 0px 1px 0px 0px inset"
                      : "0px -1px 0px 0px inset",
                    display: "flex",
                    position: "relative"
                  }}
                  key={i}
                >
                  {/* <div
                  className={"alignmentMismatches"}
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                    boxShadow: 
                      `0px -3px 0px -2px inset, 3px -3px 0px -2px inset`,
                    width: 130,
                    padding: 2,
                    background: "rgb(225, 225, 225)",
                    textOverflow: "ellipsis",
                    maxHeight: 180.8,
                    overflowY: "scroll",
                    whiteSpace: "nowrap"
                  }}
                  title={"mismatches" + i}
                  key={"mismatchesKey" + i}
                >
                  <Mismatches
                  {...{
                    ...rest,
                    alignmentData,
                    mismatches,
                    charWidth: charWidthInLinearView
                  }}
                  />
                </div> */}
                  <div
                    className={"alignmentTrackName"}
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
                      className={"alignmentTrackNameDiv"}
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
                  {handleSelectTrack &&
                    !isTemplate && (
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
                          // left: "50%",
                          // transform: "translateX(-50%)"
                        }}
                        className={
                          "alignmentViewSelectTrackPopover veWhiteBackground"
                        }
                      >
                        Inspect track
                      </div>
                    )}
                  <LinearView
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
                      linearViewAnnotationVisibilityOverrides:
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
                      allowSeqDataOverride: true, //override the sequence data stored in redux so we can track the caret position/selection layer in redux but not have to update the redux editor
                      editorName: `${
                        isTemplate ? "template_" : ""
                      }alignmentView${i}`,
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
            })}
          </div>
        </div>
      );
    };
    const [firstTrack, ...otherTracks] = alignmentTracks;
    const totalWidthOfMinimap = dimensions.width - nameDivWidth;
    const totalWidthInAlignmentView = 14 * this.getSequenceLength();
    const minSliderSize = Math.min(
      totalWidthOfMinimap * (totalWidthOfMinimap / totalWidthInAlignmentView),
      totalWidthOfMinimap
    );

    return (
      <div
        style={{
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative"
        }}
        className="alignmentView"
      >
        {hasTemplate ? (
          <React.Fragment>
            <div className={"alignmentTrackFixedToTop"}>
              {getTrackVis([firstTrack], true)}
            </div>
            {getTrackVis(otherTracks)}
          </React.Fragment>
        ) : (
          getTrackVis(alignmentTracks)
        )}
        {!hideBottomBar && (
          <div
            className={"alignmentViewBottomBar"}
            style={{
              // flexGrow: 1,
              minHeight: "-webkit-min-content", //https://stackoverflow.com/questions/28029736/how-to-prevent-a-flex-item-from-shrinking-smaller-than-its-content
              marginTop: 4,
              paddingTop: 4,
              borderTop: "1px solid lightgrey",
              display: "flex"
            }}
          >
            <div
              style={{
                padding: "4px 10px",
                maxWidth: nameDivWidth,
                width: nameDivWidth
              }}
            >
              <h6 style={{ marginRight: 10 }}>Zoom: </h6>
              <UncontrolledSlider
                onRelease={val => {
                  this.setState({ charWidthInLinearView: val });
                  this.updateToScrollPercentage(this.easyStore.percentScrolled);
                }}
                className={"alignment-zoom-slider"}
                labelRenderer={false}
                stepSize={0.01}
                initialValue={charWidthInLinearView}
                max={14}
                min={this.getMinCharWidth()}
              />
              {handleBackButtonClicked && (
                <Tooltip
                  position={Position.TOP}
                  content="Back to pairwise alignment overview"
                >
                  <Button
                    icon="arrow-left"
                    onClick={() => {
                      this.setState({
                        charWidthInLinearView: charWidthInLinearViewDefault
                      });
                      handleBackButtonClicked();
                      this.caretPositionUpdate(-1);
                    }}
                    intent={Intent.PRIMARY}
                    // minimal
                    style={{ marginRight: 10 }}
                    className={"alignmentViewBackButton"}
                  />
                </Tooltip>
              )}
              {!noVisibilityOptions && (
                <AlignmentVisibilityTool {...alignmentVisibilityToolOptions} />
              )}
            </div>
            <Minimap
              {...{
                alignmentTracks,
                dimensions: {
                  width: Math.max(dimensions.width - nameDivWidth, 10) || 10
                },
                onSizeAdjust: this.onMinimapSizeAdjust,
                minSliderSize,
                laneHeight: minimapLaneHeight,
                laneSpacing: minimapLaneSpacing,
                easyStore: this.easyStore,
                numBpsShownInLinearView: this.getNumBpsShownInLinearView()
              }}
              onMinimapScroll={this.updateToScrollPercentage}
            />
          </div>
        )}
      </div>
    );
  }
}

// export const AlignmentView = withEditorInteractions(_AlignmentView);

export default compose(
  // export const AlignmentView = withEditorInteractions(_AlignmentView);
  // withEditorProps,
  connect(
    (state, ownProps) => {
      // const {id}
      const {
        VectorEditor: { alignments }
      } = state;
      const { id: alignmentId, upsertAlignmentRun } = ownProps;
      const alignment = { ...alignments[alignmentId], id: alignmentId };
      const {
        alignmentTracks,
        pairwiseAlignments,
        scrollPercentageToJumpTo,
        pairwiseOverviewAlignmentTracks,
        loading,
        alignmentAnnotationVisibility,
        alignmentAnnotationLabelVisibility,
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 }
      } =
        alignment || {};
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
        alignmentTracks,
        scrollPercentageToJumpTo,
        pairwiseOverviewAlignmentTracks,
        //manipulate the props coming in so we can pass a single clean prop to the visibility options tool
        alignmentVisibilityToolOptions: {
          alignmentAnnotationVisibility,
          alignmentAnnotationLabelVisibility,
          alignmentAnnotationVisibilityToggle: name => {
            upsertAlignmentRun({
              ...alignment,
              alignmentAnnotationVisibility: {
                ...alignment.alignmentAnnotationVisibility,
                [name]: !alignment.alignmentAnnotationVisibility[name]
              }
            });
          },
          alignmentAnnotationLabelVisibilityToggle: name => {
            upsertAlignmentRun({
              ...alignment,
              alignmentAnnotationLabelVisibility: {
                ...alignment.alignmentAnnotationLabelVisibility,
                [name]: !alignment.alignmentAnnotationLabelVisibility[name]
              }
            });
          }
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
      return "No Tracks Found";
    })
  ),
  branch(
    ({ pairwiseAlignments }) => pairwiseAlignments,
    renderComponent(props => {
      return <PairwiseAlignmentView {...props} />;
    })
  )
)(AlignmentView);

class UncontrolledSlider extends React.Component {
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
    const { initialValue, ...rest } = this.props;

    return (
      <Slider
        {...{ ...rest, value }}
        onChange={value => {
          this.setState({ value });
        }}
      />
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
            hasTemplate: true,
            alignmentTracks,
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
            hasTemplate: true,
            alignmentTracks: pairwiseOverviewAlignmentTracks,
            linearViewOptions: getPairwiseOverviewLinearViewOptions,
            noClickDragHandlers: true,
            isFullyZoomedOut: true,
            hideBottomBar: true,
            handleSelectTrack: trackIndex => {
              //set currentPairwiseAlignmentIndex
              this.setState({ currentPairwiseAlignmentIndex: trackIndex });
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
      linearViewAnnotationVisibilityOverrides: {
        features: false,
        yellowAxis: false,
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
        lineageLines: false,
        axisNumbers: false
      }
    };
  } else {
    return {
      // linearViewAnnotationVisibilityOverrides: {
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
      //   lineageLines: false,
      //   axisNumbers: false
      // }
    };
  }
} // this is code from https://github.com/asvd/syncscroll

/* eslint-disable*/ var Width = "Width";
var Height = "Height";
var Top = "Top";
var Left = "Left";
var scroll = "scroll";
var client = "client";
var EventListener = "EventListener";
var addEventListener = "add" + EventListener;
var length = "length";
var Math_round = Math.round;

var names = {};

var reset = function() {
  var elems = document.getElementsByClassName("sync" + scroll);

  // clearing existing listeners
  var i, j, el, found, name;
  for (name in names) {
    if (names.hasOwnProperty(name)) {
      for (i = 0; i < names[name][length]; i++) {
        names[name][i]["remove" + EventListener](scroll, names[name][i].syn, 0);
      }
    }
  }

  // setting-up the new listeners
  for (i = 0; i < elems[length]; ) {
    found = j = 0;
    el = elems[i++];
    if (!(name = el.getAttribute("dataname"))) {
      // name attribute is not set
      continue;
    }

    el = el[scroll + "er"] || el; // needed for intence

    // searching for existing entry in array of names;
    // searching for the element in that entry
    for (; j < (names[name] = names[name] || [])[length]; ) {
      found |= names[name][j++] == el;
    }

    if (!found) {
      names[name].push(el);
    }

    el.eX = el.eY = 0;

    (function(el, name) {
      el[addEventListener](
        scroll,
        (el.syn = function() {
          var elems = names[name];

          var scrollX = el[scroll + Left];
          var scrollY = el[scroll + Top];

          var xRate = scrollX / (el[scroll + Width] - el[client + Width]);
          var yRate = scrollY / (el[scroll + Height] - el[client + Height]);

          var updateX = scrollX != el.eX;
          var updateY = scrollY != el.eY;

          var otherEl,
            i = 0;

          el.eX = scrollX;
          el.eY = scrollY;

          for (; i < elems[length]; ) {
            otherEl = elems[i++];
            if (otherEl != el) {
              if (
                updateX &&
                Math_round(
                  otherEl[scroll + Left] -
                    (scrollX = otherEl.eX = Math_round(
                      xRate *
                        (otherEl[scroll + Width] - otherEl[client + Width])
                    ))
                )
              ) {
                otherEl[scroll + Left] = scrollX;
              }

              if (
                updateY &&
                Math_round(
                  otherEl[scroll + Top] -
                    (scrollY = otherEl.eY = Math_round(
                      yRate *
                        (otherEl[scroll + Height] - otherEl[client + Height])
                    ))
                )
              ) {
                otherEl[scroll + Top] = scrollY;
              }
            }
          }
        }),
        0
      );
    })(el, name);
  }
};
/* eslint-enable */
function noop() {}
