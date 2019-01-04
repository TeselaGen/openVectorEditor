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
  togglableAlignmentAnnotationSettings = {},
  alignmentAnnotationVisibilityToggle,
  // alignmentAnnotationLabelVisibility = {},
  // alignmentAnnotationLabelVisibilityToggle
  annotationsWithCounts
}) {
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
              {annotationName in annotationsWithCounts ? (
                <Tag round style={{ marginLeft: 7 }}>
                  {annotationsWithCounts[annotationName]}
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
