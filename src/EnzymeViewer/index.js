import { Icon } from "@blueprintjs/core";
import React from "react";
import copyToClipboard from "copy-to-clipboard";

import RowItem from "../RowItem";
import "./style.css";
import classNames from "classnames";

export default ({
  extraClasses = "",
  sequence = "nnnnn",
  paddingEnd = "-------",
  paddingStart = "-------",
  reverseSnipPosition,
  forwardSnipPosition,
  charWidth = 13,
  noCopy
}) => {
  const seqPlusPadding = paddingStart + sequence + paddingEnd;

  return (
    <div
      style={{ cursor: noCopy ? "" : "pointer", position: "relative" }}
      onClick={
        noCopy
          ? () => {}
          : () => {
              copyToClipboard(sequence);
              window.toastr.success("Recognition Site Copied");
            }
      }
      className={classNames("enzyme-rowitem", extraClasses, { noCopy })}
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
