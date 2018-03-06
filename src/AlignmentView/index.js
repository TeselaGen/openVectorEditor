import React from "react";
import { connect } from "react-redux";
import { Slider } from "@blueprintjs/core";
import { LinearView } from "../LinearView";
import Minimap from "./Minimap";

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
    return (width - nameDivWidth) / this.getSequenceLength();
  };

  getSequenceLength = () => {
    const { alignmentTracks: [template] = [] } = this.props;
    return template.sequenceData.sequence.length;
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
      height
    } = this.props;
    return (
      <div style={{ height, overflowY: "auto" }} className="alignmentView">
        <div style={{ maxWidth: 160, display: "flex" }}>
          <h6 style={{ marginRight: 10 }}>Zoom: </h6>
          <UncontrolledSlider
            onRelease={val => {
              this.setState({ charWidthInLinearView: val });
            }}
            renderLabel={false}
            stepSize={0.01}
            initialValue={10}
            max={16}
            min={0}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: nameDivWidth, flex: 1 }}>
            {alignmentTracks.map((track, i) => {
              const { alignmentHeights } = this.state;
              const { sequenceData } = track;
              return (
                <div
                  style={{ marginBottom: 5, height: alignmentHeights[i] || 10 }}
                  key={i}
                >
                  Name: {sequenceData.name || sequenceData.id}
                </div>
              );
              // return <div key={i}>
              //   {seqData.sequence}
              // </div>
            })}
          </div>
          <div style={{ flex: 1 }}>
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
                const { sequenceData, selectionLayer, alignmentData } = track;
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
                      position: "relative",
                      marginBottom: 5,
                      paddingTop: 10
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
                        linearViewAnnotationVisibilityOverrides: {
                          axis: true,
                          yellowAxis: false,
                          reverseSequence: true,
                          // translations: charWidthInLinearView > 4.5,
                          features: false,
                          parts: true,
                          primers: false,
                          translations: true
                        },
                        marginWith: 0,
                        hideName: true,
                        sequenceData,
                        alignmentData,
                        // charWidth: charWidthInLinearView,
                        height: "100%",
                        selectionLayer,
                        width:
                          (alignmentData || sequenceData).sequence.length *
                          charWidthInLinearView
                        // dimensions: {
                        // }
                      }}
                    />
                  </div>
                );
                // return <div key={i}>
                //   {seqData.sequence}
                // </div>
              })}
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
        </div>
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  const { alignments: { alignmentTracks = [] } = {} } = ownProps;
  return {
    alignmentTracks
  };
})(AlignmentView);

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
