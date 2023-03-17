import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { observer } from "mobx-react";

export default observer(({ toolbarItemProps, alwaysAllowSave, handleSave, ed }) => {
  const hasBeenSaved =
    ed.stateTrackingId === "initialLoadId" ||
    ed.stateTrackingId === ed.lastSavedId;
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon data-test="saveTool" icon="floppy-disk" />,
        onIconClick: handleSave,
        disabled: alwaysAllowSave
          ? false
          : !ed.onSave || hasBeenSaved || ed.readOnly,
        tooltip: (
          <span>
            Save <span style={{ fontSize: 10 }}>(Cmd/Ctrl+S)</span>
          </span>
        ),
        ...toolbarItemProps
      }}
    />
  );
});
