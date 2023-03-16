import { Icon } from "@blueprintjs/core";
import React from "react";
import ToolbarItem from "./ToolbarItem";

export default ({ ed, toolbarItemProps }) => {
  return (
    <ToolbarItem
      {...{
        disabled: ed.disableSetReadOnly,
        Icon: <Icon icon={ed.readOnly ? "lock" : "unlock"} />,
        onIconClick: ed.toggleReadOnlyMode,
        tooltip: ed.readOnly ? (
          <span>Switch to edit mode</span>
        ) : (
          <span>Switch to read only mode</span>
        ),
        ...toolbarItemProps
      }}
    />
  );
};
