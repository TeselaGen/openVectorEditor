import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";

export default ({ toolbarItemProps, ed }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon icon="history" />,
        onIconClick: ed.toggleViewVersionHistory,
        // disabled: hasBeenSaved || lastEdit,
        tooltip: <span>View Version History</span>,
        ...toolbarItemProps
      }}
    />
  );
};
