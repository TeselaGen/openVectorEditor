import React from "react";
import { connect } from "react-redux";
import { Button, Slider, Tooltip } from "@blueprintjs/core";
import { Loading } from "teselagen-react-components";
import { store } from "react-easy-state";
import LinearView from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import withEditorProps from "../withEditorProps";
import "./style.css";
import { isFunction } from "util";

const nameDivWidth = 140;
const charWidthInLinearViewDefault = 12;
export class AlignmentView extends React.Component {
  state = {
    charWidthInLinearView: charWidthInLinearViewDefault
  };
  easyStore = store({ percentScrolled: 0 });

  getMinCharWidth = () => {
    const { dimensions: { width } } = this.props;

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
  componentDidMount() {
    reset();
  }

  getNumBpsShownInLinearView = () => {
    const { charWidthInLinearView } = this.state;
    const { dimensions: { width } } = this.props;
    const toReturn = (width - nameDivWidth) / charWidthInLinearView;
    return toReturn || 0;
  };
  // debouncedSetPercentScroll = debounce((scrollPercentage) => {
  //   console.log('scrollPercentage:',scrollPercentage)
  //   this.setState({ percentScrolled: scrollPercentage });
  // }, 1000)
  handleScroll = () => {
    // console.log('this.alignmentHolder.scrollLeft:',this.alignmentHolder.scrollLeft)
    // this.alignmentHolderTop.scrollLeft = this.alignmentHolder.scrollLeft;

    const scrollPercentage =
      this.alignmentHolder.scrollLeft /
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    this.easyStore.percentScrolled = scrollPercentage;

    // this.props.updateMinimapScrollPercentage(scrollPercentage);
    // this.setState({ percentScrolled: scrollPercentage })
    // this.debouncedSetPercentScroll(scrollPercentage)
  };
  onMinimapScroll = scrollPercentage => {
    this.alignmentHolder.scrollLeft =
      scrollPercentage *
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
  };
  render() {
    let { charWidthInLinearView } = this.state;
    const {
      alignmentTracks = [],
      dimensions: { width },
      dimensions,
      height,
      minimapLaneHeight,
      minimapLaneSpacing,
      hideBottomBar,
      isFullyZoomedOut,
      handleSelectTrack,
      hasTemplate = true,
      linearViewOptions,
      handleBackButtonClicked,
      alignmentVisibilityToolOptions
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
              } = track;
              const name = sequenceData.name || sequenceData.id;
              return (
                <div
                  className={"alignmentViewTrackContainer"}
                  style={{
                    boxShadow: isTemplate
                      ? "red 0px -1px 0px 0px inset, red 0px 1px 0px 0px inset"
                      : "0px -1px 0px 0px inset",
                    display: "flex",
                    width: "fit-content",
                    position: "relative"
                  }}
                  key={i}
                >
                  <div
                    className={"alignmentTrackName"}
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 10,
                      boxShadow: isTemplate
                        ? "0px 0px 0px 1px red inset"
                        : `0px -3px 0px -2px inset, 3px -3px 0px -2px inset, -3px -3px 0px -2px inset`,
                      width: nameDivWidth,
                      padding: 2,
                      minWidth: nameDivWidth,
                      background: "rgb(243, 243, 243)",
                      textOverflow: "ellipsis",
                      overflowY: "auto",
                      whiteSpace: "nowrap"
                    }}
                    title={name}
                    key={i}
                  >
                    {name}
                  </div>
                  {handleSelectTrack &&
                    !isTemplate && (
                      <div
                        onClick={() => {
                          handleSelectTrack(i);
                        }}
                        style={{
                          position: "absolute",
                          background: "white",
                          opacity: 0,
                          height: "100%",
                          width: "100%",
                          fontWeight: "bolder",
                          cursor: "pointer",
                          padding: 5,
                          textAlign: "center",
                          zIndex: 400
                          // left: "50%",
                          // transform: "translateX(-50%)"
                        }}
                        className={"alignmentViewSelectTrackPopover"}
                      >
                        Inspect track
                      </div>
                    )}
                  <LinearView
                    {...{
                      linearViewAnnotationVisibilityOverrides:
                        alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                      linearViewAnnotationLabelVisibilityOverrides:
                        alignmentVisibilityToolOptions.alignmentAnnotationLabelVisibility,
                      marginWith: 0,
                      hideName: true,
                      sequenceData,
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
                      //   console.log('vals:',vals)
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
                        width:
                          (alignmentData || sequenceData).sequence.length *
                          charWidthInLinearView
                      },
                      width:
                        (alignmentData || sequenceData).sequence.length *
                        charWidthInLinearView
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
        {handleBackButtonClicked && (
          <div
            style={{
              position: "absolute",
              background: "white",
              opacity: 0.8,
              top: 10,
              left: 10
            }}
          >
            <Tooltip content="Back to pairwise alignment overview">
              <Button
                icon="arrow-left"
                onClick={handleBackButtonClicked}
                className={"alignmentViewBackButton"}
              />
            </Tooltip>
          </div>
        )}
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
                }}
                className={"alignment-zoom-slider"}
                labelRenderer={false}
                stepSize={0.01}
                initialValue={10}
                max={14}
                min={this.getMinCharWidth()}
              />
              <AlignmentVisibilityTool {...alignmentVisibilityToolOptions} />
            </div>
            <Minimap
              {...{
                alignmentTracks,
                dimensions: {
                  width: Math.max(dimensions.width - nameDivWidth, 10) || 10
                },
                laneHeight: minimapLaneHeight,
                laneSpacing: minimapLaneSpacing,
                easyStore: this.easyStore,
                numBpsShownInLinearView: this.getNumBpsShownInLinearView()
              }}
              onMinimapScroll={this.onMinimapScroll}
            />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  withEditorProps,
  connect((state, ownProps) => {
    const { id: alignmentId, alignments = {}, upsertAlignmentRun } = ownProps;
    const alignment = { ...alignments[alignmentId], id: alignmentId };
    const {
      alignmentTracks,
      pairwiseAlignments,
      pairwiseOverviewAlignmentTracks,
      loading,
      alignmentAnnotationVisibility,
      alignmentAnnotationLabelVisibility
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

    return {
      pairwiseAlignments,
      alignmentTracks,
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
  }),
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
  componentWillMount() {
    const { initialValue } = this.props;
    this.setState({
      value: initialValue
    });
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
      return (
        <AlignmentView
          {...{
            ...this.props,
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
            alignmentTracks: pairwiseOverviewAlignmentTracks,
            linearViewOptions: getPairwiseOverviewLinearViewOptions,
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
