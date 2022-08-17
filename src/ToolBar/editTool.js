import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor((editorState) => {
  return {
    readOnly: editorState.readOnly
  };
})(({ toolbarItemProps, readOnly, toggleReadOnlyMode, disableSetReadOnly }) => {
  return (
    <ToolbarItem
      {...{
        disabled: disableSetReadOnly,
        Icon: <Icon icon={readOnly ? "lock" : "unlock"} />,
        onIconClick: toggleReadOnlyMode,
        tooltip: readOnly ? (
          <span>Switch to edit mode</span>
        ) : (
          <span>Switch to read only mode</span>
        ),
        ...toolbarItemProps
      }}
    />
  );
});
