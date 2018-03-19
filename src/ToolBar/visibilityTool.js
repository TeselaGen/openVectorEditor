import { Icon, Checkbox } from "@blueprintjs/core";
import React from "react";
import { map, startCase } from "lodash";

export default {
  updateKeys: ["isOpen", "toggleDropdown"],
  itemProps: ({ isOpen, toggleDropdown }) => {
    return {
      Icon: <Icon icon="eye-open" />,
      onIconClick: toggleDropdown,
      Dropdown: VisibilityOptions,
      noDropdownIcon: true,
      toggled: isOpen,
      tooltip: isOpen ? "Hide Visibility Options" : "Show Visibility Options"
    };
  }
};

function VisibilityOptions({
  annotationVisibility = {},
  typesToOmit = {},
  sequenceData,
  annotationVisibilityToggle,
  annotationLabelVisibility = {},
  annotationLabelVisibilityToggle
}) {
  return (
    <div>
      <h6>View:</h6>
      {map(annotationVisibility, (visible, annotationName) => {
        if (
          typesToOmit[annotationName] !== undefined &&
          !typesToOmit[annotationName]
        )
          return null;
        let count;
        let hasCount = false;
        if (sequenceData[annotationName]) {
          hasCount = true;
          count = Object.keys(sequenceData[annotationName]).length;
        }
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                annotationVisibilityToggle(annotationName);
              }}
              checked={visible}
              label={
                <div>
                  {startCase(annotationName)}{" "}
                  {hasCount && (
                    <div
                      style={{ marginLeft: 4 }}
                      className={"pt-tag pt-round"}
                    >
                      {" "}
                      {count}
                    </div>
                  )}
                </div>
              }
            />
          </div>
        );
      })}
      <h6>View Labels:</h6>
      {map(annotationLabelVisibility, (visible, annotationName) => {
        if (
          typesToOmit[annotationName] !== undefined &&
          !typesToOmit[annotationName]
        )
          return null;
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                annotationLabelVisibilityToggle(annotationName);
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
