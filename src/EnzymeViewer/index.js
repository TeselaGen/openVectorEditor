import React from "react";
import RowItem from "../RowItem";

export default ({
  extraClasses = "",
  sequence = "nnnnn",
  paddingEnd = "-------",
  paddingStart = "-------",
  reverseSnipPosition,
  forwardSnipPosition
}) => {
  const seqPlusPadding = paddingStart + sequence + paddingEnd;

  return (
    <div className={"enzyme-rowitem " + extraClasses}>
      <RowItem
        {...{
          tickSpacing: 1,
          annotationVisibility: {
            cutsites: true,
            cutsiteLabels: false,
            axis: false,
            reverseSequence: true,
            sequence: true
          },
          annotationLabelVisibility: {
            cutsites: false
          },
          sequenceLength: seqPlusPadding.length,
          bpsPerRow: seqPlusPadding.length,
          row: {
            sequence: seqPlusPadding,
            start: 0,
            end: seqPlusPadding.length - 1,
            cutsites: {
              fake1: {
                annotation: {
                  recognitionSiteRange: {
                    start: paddingStart.length,
                    end: paddingStart.length + sequence.length - 1
                  },
                  topSnipBeforeBottom:
                    forwardSnipPosition < reverseSnipPosition,
                  bottomSnipPosition: paddingStart.length + reverseSnipPosition,
                  topSnipPosition: paddingStart.length + forwardSnipPosition,
                  id: "fake1",
                  restrictionEnzyme: {}
                }
              }
            }
          }
        }}
      />
    </div>
  );
};
