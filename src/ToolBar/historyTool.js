import React from "react";
import { Icon } from "@blueprintjs/core";

export default {
  updateKeys: ["toggleViewVersionHistory", "lastEdit", "hasBeenSaved"],
  itemProps: ({ lastEdit, toggleViewVersionHistory = () => {} }) => {
    return {
      Icon: <Icon icon="history" />,
      onIconClick: toggleViewVersionHistory,
      // disabled: hasBeenSaved || lastEdit,
      tooltip: (
        <span>
          View Version History (Last Edited: {lastEdit})
        </span>
      )
    };
  }
};
