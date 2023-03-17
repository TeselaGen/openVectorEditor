import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";

export default ({ toolbarItemProps, ed }) => {
  const disabled = !ed.sequenceDataHistory.future.length;
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon data-test="veRedoTool" icon="redo" />,
        disabled,
        onIconClick: ed.redo,
        tooltip: (
          <span>
            Redo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Shift+Z)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
}
