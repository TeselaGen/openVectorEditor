import React from "react";
import { Icon } from "@blueprintjs/core";

export default {
  updateKeys: ["sequenceDataHistory", "undo"],
  itemProps: ({ sequenceDataHistory = {}, undo }) => {
    const { past = [] } = sequenceDataHistory;
    return {
      Icon: <Icon icon="undo" />,
      disabled: !past.length,
      onIconClick: undo,
      tooltip: (
        <span>
          Undo <span style={{ fontSize: 10 }}>(Cmd/Ctrl+Z)</span>
        </span>
      )
    };
  }
};
