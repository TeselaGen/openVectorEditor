import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    toggled: editorState.annotationVisibility.primers,
  };
})(({ toolbarItemProps, toggled, annotationVisibilityToggle }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,
        Icon: <Icon icon="swap-horizontal" />,
        onIconClick: function() {
          annotationVisibilityToggle("primers");
        },
        toggled,
        tooltip: "Show Primers",
        tooltipToggled: "Hide Primers"
      }}
    />
  );
});
