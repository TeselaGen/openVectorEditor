import { Icon, Checkbox } from "@blueprintjs/core";
import React from "react";
import { map, startCase } from "lodash";

export default ({ isOpen, toggleDropdown }) => {
  return {
    Icon: <Icon iconName={"eye-open"} />,
    onIconClick: toggleDropdown,
    Dropdown: VisibilityOptions,
    noDropdownIcon: true,
    toggled: isOpen,
    tooltip: isOpen ? "Hide Visibility Options" : "Show Visibility Options"
  };
};

function VisibilityOptions({
  annotationVisibility = {},
  annotationVisibilityToggle,
  annotationLabelVisibility = {},
  annotationLabelVisibilityToggle
}) {
  return (
    <div>
      <h6>View:</h6>
      {map(annotationVisibility, (visible, annotationName) => {
        return (
          <div key={annotationName}>
            <Checkbox
              onChange={() => {
                annotationVisibilityToggle(annotationName);
              }}
              checked={visible}
              label={startCase(annotationName)}
            />
          </div>
        );
      })}
      <h6>View Labels:</h6>
      {map(annotationLabelVisibility, (visible, annotationName) => {
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
