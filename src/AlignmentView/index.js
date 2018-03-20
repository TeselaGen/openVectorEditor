import React from "react";
import { connect } from "react-redux";
import { Slider } from "@blueprintjs/core";
import { Loading } from "teselagen-react-components";
import LinearView from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import withEditorProps from "../withEditorProps";
import "./style.css";

const nameDivWidth = 140;
const charWidthInLinearViewDefault = 12;
export class AlignmentView extends React.Component {
  state = {
    charWidthInLinearView: charWidthInLinearViewDefault,
    percentScrolled: 0,
    alignmentHeights: {}
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
    const { charWidthInLinearView, percentScrolled } = this.state;
    const {
      alignmentTracks = [],
      dimensions: { width },
      dimensions,
      height,
      hideBottomBar,
      linearViewOptions,
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
    // debugger
    let alignmentTrackLength = alignmentTracks[0].alignmentData.sequence.length;
    const returnEarlyMessage = alignmentTracks.some(track => {
      if (track.alignmentData.sequence.length !== alignmentTrackLength) {
        console.error("incorrect length", this.props);
        return "incorrect length";
      }
      if (
        track.chromatogramData &&
        track.sequenceData.sequence.length !==
          track.chromatogramData.baseCalls.length
      ) {
        console.error("incorrect chromatogram length", this.props);
        return "incorrect chromatogram length";
      }
      if (
        track.sequenceData.sequence.length !==
        track.alignmentData.sequence.replace(/-/g, "").length
      ) {
        console.error(
          "sequence data length does not match alignment data w/o gaps"
        );
        console.error(
          "track.sequenceData.sequence:",
          track.sequenceData.sequence
        );
        console.error(
          "track.sequenceData.sequence.length:",
          track.sequenceData.sequence.length
        );
        console.error(
          "track.alignmentData.sequence:",
          track.alignmentData.sequence
        );
        console.error(
          'track.alignmentData.sequence.replace(/-/g,""):',
          track.alignmentData.sequence.replace(/-/g, "")
        );
        console.error(
          'track.alignmentData.sequence.replace(/-/g,"").length:',
          track.alignmentData.sequence.replace(/-/g, "").length
        );
        return "sequence data length does not match alignment data w/o gaps";
      }
      return false;
    });
    if (returnEarlyMessage) {
      return <div>Error: Data is corrupted!</div>;
    }

    return (
      <div
        style={{
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
        className="alignmentView"
      >
        <div
          className={"alignmentTracks"}
          style={{ overflowY: "auto", display: "flex" }}
        >
          <div
            className={"alignmentTrackNames"}
            style={{ width: nameDivWidth, flex: 1 }}
          >
            {alignmentTracks.map((track, i) => {
              const { alignmentHeights } = this.state;
              const { sequenceData } = track;
              return (
                <div
                  style={{
                    height: alignmentHeights[i] || 10
                  }}
                  key={i}
                >
                  {sequenceData.name || sequenceData.id}
                </div>
              );
            })}
          </div>
          <div className={"alignmentTrackDetails"} style={{ flex: 1 }}>
            <div
              style={{
                overflowX: "auto",
                width: width - nameDivWidth || 400
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
                    style={{
                      position: "relative"
                    }}
                    key={i}
                  >
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
                        linearViewOptions,
                        additionalSelectionLayers,
                        dimensions: {
                          width:
                            (alignmentData || sequenceData).sequence.length *
                            charWidthInLinearView
                        },
                        width:
                          (alignmentData || sequenceData).sequence.length *
                          charWidthInLinearView
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
            style={{
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
      const alignmentTracks = pairwiseAlignments[0];
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
            isFullyZoomedOut: true,
            hideBottomBar: true,
            handleSelectTrack: trackIndex => {
              //set currentPairwiseAlignmentIndex
            }
          }}
        />
      );
    }
  }
}
