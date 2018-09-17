import { Button, Checkbox, Popover } from "@blueprintjs/core";
import React from "react";
import { map, startCase } from "lodash";
import pureNoFunc from "../utils/pureNoFunc";

export default pureNoFunc(function AlignmentVisibilityTool(props) {
  return (
    <Popover
      minimal
      content={<VisibilityOptions {...props} />}
      target={
        <Button
          small
          text={"Visibility"}
          rightIcon="caret-down"
          icon={"eye-open"}
        />
      }
    />
  );
});

function VisibilityOptions({
  alignmentAnnotationVisibility = {},
  typesToOmit = {},
  alignmentAnnotationVisibilityToggle,
  alignmentAnnotationLabelVisibility = {},
  alignmentAnnotationLabelVisibilityToggle
}) {
  return (
    <div
      style={{ padding: 10 }}
      className={"alignmentAnnotationVisibilityToolInner"}
    >
      <h6>View:</h6>
      {map(alignmentAnnotationVisibility, (visible, annotationName) => {
        if (
          typesToOmit[annotationName] !== undefined &&
          !typesToOmit[annotationName]
        )
          return null;
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                alignmentAnnotationVisibilityToggle(annotationName);
              }}
              checked={visible}
              label={startCase(annotationName)}
            />
          </div>
        );
      })}
      <h6>View Labels:</h6>
      {map(alignmentAnnotationLabelVisibility, (visible, annotationName) => {
        if (
          typesToOmit[annotationName] !== undefined &&
          !typesToOmit[annotationName]
        )
          return null;
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                alignmentAnnotationLabelVisibilityToggle(annotationName);
              }}
              checked={visible}
              label={startCase(annotationName)}
            />
          </div>
        );
      })}
    </div>
  );
}
