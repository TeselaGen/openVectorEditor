import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    readOnly: editorState.readOnly
  };
})(({ toolbarItemProps, readOnly, toggleReadOnlyMode }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon={readOnly ? "lock" : "unlock"} />,
        onIconClick: toggleReadOnlyMode,
        tooltip: readOnly ? (
          <span>
            Switch to edit mode{" "}
            <span style={{ fontSize: 10 }}>(Cmd/Ctrl+E)</span>
          </span>
        ) : (
          <span>
            Switch to read only mode{" "}
            <span style={{ fontSize: 10 }}>(Cmd/Ctrl+E)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
});
