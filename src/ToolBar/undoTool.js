import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor(editorState => {
  return {
    disabled: !editorState.sequenceDataHistory.past.length
  };
})(({ toolbarItemProps, undo, disabled }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,

        Icon: <Icon icon="undo" />,
        disabled,
        onIconClick: undo,
        tooltip: (
          <span>
            Undo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Z)</span>
          </span>
        )
         }}
    />
  );
});
