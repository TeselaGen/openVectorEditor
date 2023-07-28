import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor((editorState) => {
  return {
    readOnly: editorState.readOnly
  };
})(({ toolbarItemProps, readOnly, toggleReadOnlyMode, disableSetReadOnly }) => {
  const readOnlyTooltip = ({ readOnly, disableSetReadOnly }) => {
    if (disableSetReadOnly) {
      return "You do not have permission to edit locks on this sequence";
    }
    return readOnly ? "Click to enable editing" : "Click to disable editing";
  };
  return (
    <ToolbarItem
      {...{
        disabled: disableSetReadOnly,
        Icon: <Icon icon={readOnly ? "lock" : "unlock"} />,
        onIconClick: toggleReadOnlyMode,
        tooltip: readOnlyTooltip({ readOnly, disableSetReadOnly }),
        ...toolbarItemProps
      }}
    />
  );
});
