import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";

export default ({ toolbarItemProps,  ed }) => {
  const isHidden = ed.isProtein;
  const toggled = ed.annotationVisibility.primers;
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon icon="swap-horizontal" />,
        onIconClick: function () {
          ed.annotationVisibility.annotationVisibilityToggle("primers");
        },
        isHidden,
        toggled,
        tooltip: "Show Primers",
        tooltipToggled: "Hide Primers",
        ...toolbarItemProps
      }}
    />
  );
}
