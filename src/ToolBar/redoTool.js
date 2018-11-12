import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    disabled: !editorState.sequenceDataHistory.future.length
  };
})(({ toolbarItemProps, redo, disabled }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,
        Icon: <Icon icon="redo" />,
        disabled,
        onIconClick: redo,
        tooltip: (
          <span>
            Redo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Shift+Z)</span>
          </span>
        )
      }}
    />
  );
});
