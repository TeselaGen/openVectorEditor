import { Icon, IconClasses } from "@blueprintjs/core";
import React from "react";
// import show_primers from "./veToolbarIcons/show_primers.png";

export default ({ editorName, dispatch }) => {
  return {
    Icon: <Icon iconName={IconClasses.PROPERTIES} />,
    onIconClick: function() {
      dispatch({
        type: "TG_SHOW_MODAL",
        name: "PropertiesDialog",
        props: {
          editorName
        }
      });
    },
    // toggled: annotationVisibility.primers,
    tooltip: "Show Properties",
    tooltipToggled: "Hide Properties",
    id: "propertiesTool"
  };
};
