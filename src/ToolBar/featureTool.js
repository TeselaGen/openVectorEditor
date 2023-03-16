import { Icon } from "@blueprintjs/core";
import React from "react";
import { featureIcon } from "teselagen-react-components";
import ToolbarItem from "./ToolbarItem";

export default ({ ed, toolbarItemProps }) => {
  const isOpen = ed.openToolbarItem === "featureTool";
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon={featureIcon} />,
        onIconClick: function () {
          ed.annotationVisibility.annotationVisibilityToggle("features");
        },
        toggled: ed.annotationVisibility.features,
        tooltip: "Show features",
        tooltipToggled: "Hide features",
        // Dropdown: ConnectedFeatureToolDropdown,
        dropdowntooltip: (!isOpen ? "Show" : "Hide") + " Feature Options",
        ...toolbarItemProps
      }}
    />
  );
};
