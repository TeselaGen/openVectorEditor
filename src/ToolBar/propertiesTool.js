import { Icon, IconClasses } from "@blueprintjs/core";
import React from "react";
// import show_primers from "./veToolbarIcons/show_primers.png";

export default ({
  /* editorName, dispatch,  */ propertiesViewToggle,
  propertiesTool = {}
}) => {
  const { propertiesSideBarOpen } = propertiesTool;
  return {
    Icon: <Icon iconName={IconClasses.PROPERTIES} />,
    onIconClick: propertiesViewToggle,
    // function() {
    //   dispatch({
    //     type: "TG_SHOW_MODAL",
    //     name: "PropertiesDialog",
    //     props: {
    //       editorName
    //     }
    //   });
    // },
    toggled: propertiesSideBarOpen,
    tooltip: "Show Properties",
    tooltipToggled: "Hide Properties",
    id: "propertiesTool"
  };
};
