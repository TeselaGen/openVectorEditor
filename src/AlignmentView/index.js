import React from "react";
import { connect } from "react-redux";
import { Slider } from "@blueprintjs/core";
import { Loading } from "teselagen-react-components";
import { LinearView } from "../LinearView";
import Minimap from "./Minimap";
import { compose, branch, renderComponent } from "recompose";
import AlignmentVisibilityTool from "./AlignmentVisibilityTool";
import "./style.css";

import RowItem from "../RowItem";
import ab1ParsedGFPuv54 from "../ToolBar/ab1ParsedGFPuv54.json";

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
    return Math.min(
      Math.max(width - nameDivWidth - 5, 1) / this.getSequenceLength(),
      10
    );
  };

  getSequenceLength = () => {
    const { alignmentTracks: [template] = [] } = this.props;
    return template.alignmentData.sequence.length;
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
    alignmentTracks.forEach(track => {
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
        track.alignmentData.sequence.replace("-", "").length
      ) {
        console.error(
          "sequence data length does not match alignment data w/o gaps",
          this.props
        );
        return "sequence data length does not match alignment data w/o gaps";
      }
    });

    return (
      <div
        style={{
          height,
          display: "flex",
          flexDirection: "column"
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
                    // borderBottom: "1px solid black",
                    // marginBottom: 5,
                    height: alignmentHeights[i] || 10
                  }}
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
                  selectionLayer,
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
                      // marginBottom: 5,
                      // paddingTop: 10,
                      // borderBottom: "1px solid black"
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
                    {/* <RowItem
                      {...{
                        chromatogramData: ab1ParsedGFPuv54,
                        row: {
                          rowNumber: 0,
                          // start: 10,
                          // end: 30,
                          // sequence: "GCGAATTCGAGCTCGGTACC",
                          start: 0,
                          end: ab1ParsedGFPuv54.qualNums.length,
                          sequence:
                          "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------cagaaagcgtcacaaaagatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacag-tttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgttttgccgtggagcaatgagaacgagccattgagatcatacttacctttgcatgtcactcaaaattttgcctcaaaactgggtgagctgaatttttgcagtaggcatcgtgtaagtttttctagtcggaatgatgatagatcgtaagttatggatggttggcatttgtccagttcatgttatctggggtgttcgtcagtcggtcagcagatccacatagtggttcatctagatcacac"
                        }
                      }}
                    /> */}
                    <LinearView
                      {...{
                        linearViewAnnotationVisibilityOverrides:
                          alignmentVisibilityToolOptions.alignmentAnnotationVisibility,
                        linearViewAnnotationLabelVisibilityOverrides:
                          alignmentVisibilityToolOptions.alignmentAnnotationLabelVisibility,
                        marginWith: 0,
                        hideName: true,
                        sequenceData,
                        alignmentData,
                        chromatogramData,
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
          </div>
        </div>
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
              renderLabel={false}
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
      </div>
    );
  }
}

export default compose(
  connect((state, ownProps) => {
    const { id: alignmentId, alignments = {}, upsertAlignmentRun } = ownProps;
    const alignment = { ...alignments[alignmentId], id: alignmentId };
    const {
      alignmentTracks,
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
    if (!alignmentTracks)
      return {
        noTracks: true
      };

    return {
      alignmentTracks,
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
