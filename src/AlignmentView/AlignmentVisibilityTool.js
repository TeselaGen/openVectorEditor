import {
  Button,
  Checkbox,
  Popover,
  Intent,
  Tooltip,
  Tag
} from "@blueprintjs/core";
import React from "react";
import { map, startCase } from "lodash";
import pureNoFunc from "../utils/pureNoFunc";

export default pureNoFunc(function AlignmentVisibilityTool(props) {
  return (
    <Popover
      minimal
      position="bottom"
      content={<VisibilityOptions {...props} />}
      target={
        <Tooltip content="Visibility Options">
          <Button
            small
            rightIcon="caret-down"
            intent={Intent.PRIMARY}
            minimal
            icon="eye-open"
          />
        </Tooltip>
      }
    />
  );
});

function VisibilityOptions({
  // alignmentAnnotationVisibility = {},
  alignmentAnnotationVisibilityToggle,
  togglableAlignmentAnnotationSettings = {},
  // alignmentAnnotationLabelVisibility = {},
  // alignmentAnnotationLabelVisibilityToggle
  annotationsWithCounts,
  currentPairwiseAlignmentIndex
}) {
  let annotationCountToUse = {};
  if (currentPairwiseAlignmentIndex) {
    annotationCountToUse = annotationsWithCounts[currentPairwiseAlignmentIndex];
  } else {
    annotationCountToUse = annotationsWithCounts[0];
  }
  return (
    <div
      style={{ padding: 10 }}
      className="alignmentAnnotationVisibilityToolInner"
    >
      {map(togglableAlignmentAnnotationSettings, (visible, annotationName) => {
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                alignmentAnnotationVisibilityToggle(annotationName);
              }}
              checked={visible}
              label={startCase(annotationName)}
            >
              {annotationName in annotationCountToUse ? (
                <Tag round style={{ marginLeft: 7 }}>
                  {annotationCountToUse[annotationName]}
                </Tag>
              ) : (
                ""
              )}
            </Checkbox>
          </div>
        );
      })}
    </div>
  );
}
