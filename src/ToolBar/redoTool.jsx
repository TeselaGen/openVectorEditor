import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    disabled: !(
      editorState.sequenceDataHistory &&
      editorState.sequenceDataHistory.future &&
      editorState.sequenceDataHistory.future.length
    )
  };
})(({ toolbarItemProps, redo, disabled }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="veRedoTool" icon="redo" />,
        disabled,
        onIconClick: redo,
        tooltip: (
          <span>
            Redo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Shift+Z)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
});
