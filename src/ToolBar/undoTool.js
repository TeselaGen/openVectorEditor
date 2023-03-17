import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";

export default ({ toolbarItemProps, ed }) => {
  const disabled = !ed.sequenceDataHistory.past.length;
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon data-test="veUndoTool" icon="undo" />,
        disabled,
        onIconClick: ed.undo,
        tooltip: (
          <span>
            Undo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Z)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
};
