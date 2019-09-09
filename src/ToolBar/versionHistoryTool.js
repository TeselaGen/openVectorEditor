import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor } from "../withEditorProps";

export default connectToEditor()(
  ({ toolbarItemProps, toggleViewVersionHistory }) => {
    return (
      <ToolbarItem
        {...{
          Icon: <Icon icon="history" />,
          onIconClick: toggleViewVersionHistory,
          // disabled: hasBeenSaved || lastEdit,
          tooltip: <span>View Version History</span>,
          ...toolbarItemProps
        }}
      />
    );
  }
);
