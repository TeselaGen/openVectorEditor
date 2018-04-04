import React from "react";
import { connect } from "react-redux";
import { Slider, Tooltip } from "@blueprintjs/core";
import { Loading } from "teselagen-react-components";
import LinearView from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import withEditorProps from "../withEditorProps";
import "./style.css";
import { isFunction } from "util";
import { Button } from "@blueprintjs/core";

const nameDivWidth = 140;
const charWidthInLinearViewDefault = 12;
export class AlignmentView extends React.Component {
  state = {
    charWidthInLinearView: charWidthInLinearViewDefault,
    percentScrolled: 0,
    alignmentHeights: {}
    // scalePct: 0.05
  };

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

  getNumBpsShownInLinearView = () => {
    const { charWidthInLinearView } = this.state;
    const { dimensions: { width } } = this.props;
    const toReturn = (width - nameDivWidth) / charWidthInLinearView;
    return toReturn || 0;
  };
  handleScroll = () => {
    const scrollPercentage =
      this.alignmentHolder.scrollLeft /
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
    this.setState({ percentScrolled: scrollPercentage });
  };
  onMinimapScroll = scrollPercentage => {
    this.alignmentHolder.scrollLeft =
      scrollPercentage *
      (this.alignmentHolder.scrollWidth - this.alignmentHolder.clientWidth);
  };
  render() {
    let { charWidthInLinearView, percentScrolled } = this.state;
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
        <div
          className={"alignmentTracks"}
          style={{ overflowY: "auto", display: "flex" }}
        >
          <div
            className={"alignmentTrackNames"}
            style={{ width: nameDivWidth }}
          >
            {alignmentTracks.map((track, i) => {
              const { alignmentHeights } = this.state;
              const { sequenceData } = track;
              const name = sequenceData.name || sequenceData.id;
              return (
                <div className="side-bar" key={i}>
                  <div
                    style={{
                      height: alignmentHeights[i] || 10,
                      textOverflow: "ellipsis",
                      overflowY: "auto",
                      whiteSpace: "nowrap"
                    }}
                    title={name}
                  >
                    {name}
                  </div>

                  {/* if (track.chromatogramData) { */}
                  {/*   return ( */}
                  {/* <div className="chromatogram-y-zoom" style={{ alignItems: "right" }}>
                      <ButtonGroup className={"pt-minimal pt-vertical"}>
                        <Button
                          className="pt-minimal"
                          icon="caret-up"
                          onClick={this.setState({ scalePct: scalePct + 0.01 })}
                        />
                        <Button
                          className="pt-minimal"
                          icon="caret-down"
                          onClick={this.setState({ scalePct: scalePct - 0.01 })}
                        />
                      </ButtonGroup>
                    </div> */}
                  {/* ); */}
                  {/* } */}
                </div>
              );
            })}
          </div>

          <div className={"alignmentTrackDetails"} style={{ flex: 1 }}>
            <div
              style={{
                overflowX: "auto",
                width: trackWidth
              }}
              ref={ref => (this.alignmentHolder = ref)}
              className="alignmentHolder"
              onScroll={this.handleScroll}
            >
              {alignmentTracks.map((track, i) => {
                const {
                  sequenceData,
                  additionalSelectionLayers,
                  alignmentData,
                  chromatogramData
                } = track;
                return (
                  <div
                    ref={n => {
                      const { alignmentHeights } = this.state;
                      if (n && n.clientHeight) {
                        if (n.clientHeight !== alignmentHeights[i]) {
                          this.setState({
                            alignmentHeights: {
                              ...alignmentHeights,
                              [i]: n.clientHeight
                            }
                          });
                        }
                      }
                    }}
                    className={"alignmentViewTrackContainer"}
                    style={{
                      position: "relative"
                    }}
                    key={i}
                  >
                    {handleSelectTrack &&
                      i > 0 && (
                        <div
                          onClick={() => {
                            handleSelectTrack(i - 1);
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
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left:
                          (this.alignmentHolder &&
                            this.alignmentHolder.scrollLeft) ||
                          0
                      }}
                    />
                    <LinearView
                      {...{
                        linearViewAnnotationVisibilityOverrides:
                          alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                        linearViewAnnotationLabelVisibilityOverrides:
                          alignmentVisibilityToolOptions.alignmentAnnotationLabelVisibility,
                        marginWith: 0,
                        hideName: true,
                        sequenceData,
                        editorName: "alignmentView" + i,
                        alignmentData,
                        chromatogramData,
                        height: "100%",
                        charWidth: charWidthInLinearView,
                        ignoreGapsOnHighlight: true,
                        // editorDragged: (vals) => {
                        //   console.log('vals:',vals)
                        // },
                        ...(linearViewOptions &&
                          (isFunction(linearViewOptions)
                            ? linearViewOptions({
                                index: i,
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
                          charWidthInLinearView,
                        scrollData: {
                          viewportWidth: trackWidth,
                          fractionScrolled: percentScrolled
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
                percentScrolled,
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

function getPairwiseOverviewLinearViewOptions({ index }) {
  if (index > 0) {
    return {
      linearViewAnnotationVisibilityOverrides: {
        features: false,
        yellowAxis: false,
        translations: false,
        parts: false,
        orfs: false,
        orfTranslations: false,
        axis: true,
        cutsites: false,
        primers: false,
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
}
