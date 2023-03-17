import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { PartTagSearch } from "../helperComponents/partTagSearch";

export default ({ allPartTags, editTagsLink, toolbarItemProps, ed }) => {
  const toggled = ed.annotationVisibility.parts;
  const isOpen = ed.openToolbarItem === "partTool";
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon icon="doughnut-chart" />,
        onIconClick: function () {
          ed.annotationVisibility.annotationVisibilityToggle("parts");
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
};
