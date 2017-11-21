import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";

export default {
  updateKeys: ["onSave", "readOnly"],
  itemProps: ({ readOnly, onSave = () => {} }) => {
    return {
      Icon: <Icon iconName={IconClasses.FLOPPY_DISK} />,
      onIconClick: onSave,
      disabled: readOnly,
      tooltip: (
        <span>
          Save <span style={{ fontSize: 10 }}>(Cmd/Ctrl+S)</span>
        </span>
      )
    };
  }
};
