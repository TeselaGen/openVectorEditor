import React from "react";
import { getPairwiseOverviewLinearViewOptions } from "./getPairwiseOverviewLinearViewOptions";
import { AlignmentView } from "./index";

//this view is shown if we detect pairwise alignments
export class PairwiseAlignmentView extends React.Component {
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
            allowTrackRearrange: false,
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
            allowTrackRearrange: false,
            allowTrimming: false,
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
