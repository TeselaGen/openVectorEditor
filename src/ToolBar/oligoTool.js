import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    isHidden: editorState.sequenceData && editorState.sequenceData.isProtein,

    toggled:
      editorState.annotationVisibility &&
      editorState.annotationVisibility.primers
  };
})(({ toolbarItemProps, isHidden, toggled, annotationVisibilityToggle }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon="swap-horizontal" />,
        onIconClick: function() {
          annotationVisibilityToggle("primers");
        },
        isHidden,
        toggled,
        tooltip: "Show Primers",
        tooltipToggled: "Hide Primers",
        ...toolbarItemProps
      }}
    />
  );
});
