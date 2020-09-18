import { Icon } from "@blueprintjs/core";
// import { Checkbox, Button } from "@blueprintjs/core";
import React from "react";
// import { connect } from "react-redux";
// import { convertRangeTo1Based } from "ve-range-utils";
//import { partIcon } from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";
import { PartTagSearch } from "../helperComponents/partTagSearch";

export default connectToEditor(
  ({ annotationVisibility = {}, toolBar = {} }) => {
    return {
      toggled: annotationVisibility.parts,
      isOpen: toolBar.openItem === "partTool"
    };
  }
)(
  ({
    allPartTags,
    editTagsLink,
    toolbarItemProps,
    toggled,
    annotationVisibilityToggle,
    isOpen
  }) => {
    return (
      <ToolbarItem
        {...{
          Icon: <Icon icon="doughnut-chart" />,
          onIconClick: function () {
            annotationVisibilityToggle("parts");
          },
          toggled,
          editTagsLink,
          allPartTags,
          tooltip: "Show parts",
          tooltipToggled: "Hide parts",
          noDropdownIcon: !allPartTags,
          Dropdown: PartTagSearch,
          dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Part Options",
          ...toolbarItemProps
        }}
      />
    );
  }
);
