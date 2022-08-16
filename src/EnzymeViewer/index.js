import { Icon } from "@blueprintjs/core";
import React from "react";
import copyToClipboard from "copy-to-clipboard";

import RowItem from "../RowItem";
import "./style.css";

export default ({
  extraClasses = "",
  sequence = "nnnnn",
  paddingEnd = "-------",
  paddingStart = "-------",
  reverseSnipPosition,
  forwardSnipPosition,
  charWidth = 13,
  startOffset = 0,
  annotationVisibility,
  ...rest
}) => {
  const seqPlusPadding = paddingStart + sequence + paddingEnd;

  return (
    <div
      style={{ cursor: "pointer", position: "relative" }}
      onClick={() => {
        copyToClipboard(sequence);
        window.toastr.success("Recognition Site Copied");
      }}
      className={"enzyme-rowitem " + extraClasses}
    >
      <Icon
        className="tg-icon-duplicate-inner"
        style={{ display: "none", position: "absolute", top: 3, left: 3 }}
        icon="duplicate"
      ></Icon>
      <RowItem
        {...{
          charWidth,
          tickSpacing: 1,
          annotationVisibility: {
            cutsites: true,
            cutsiteLabels: false,
            axis: false,
            reverseSequence: true,
            sequence: true,
            ...annotationVisibility
          },
          annotationLabelVisibility: {
            cutsites: false
          },
          sequenceLength: seqPlusPadding.length,
          bpsPerRow: seqPlusPadding.length,
          row: {
            sequence: seqPlusPadding,
            start: 0 + startOffset,
            end: seqPlusPadding.length - 1 + startOffset,
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
          },
          ...rest
        }}
      />
    </div>
  );
};
