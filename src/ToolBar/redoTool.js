import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default {
  updateKeys: ["sequenceDataHistory", "redo"],
  itemProps: ({ sequenceDataHistory = {}, redo }) => {
    const { future = [] } = sequenceDataHistory;
    return {
      Icon: <Icon iconName={IconClasses.REDO} />,
      disabled: !future.length,
      onIconClick: redo,
      tooltip: (
        <span>
          Redo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Shift+Z)</span>
        </span>
      )
    };
  }
};
