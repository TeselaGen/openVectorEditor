import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { handleSave } from "../withEditorProps";
import { withHandlers } from "recompose";
import { compose } from "redux";
import { observer } from "mobx-react";

export default compose(
  observer,
  withHandlers({ handleSave })
)(({ toolbarItemProps, alwaysAllowSave, handleSave, ed, onSave }) => {
  const hasBeenSaved =
    ed.stateTrackingId === "initialLoadId" ||
    ed.stateTrackingId === ed.lastSavedId;
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="saveTool" icon="floppy-disk" />,
        onIconClick: handleSave,
        disabled: alwaysAllowSave
          ? false
          : !onSave || hasBeenSaved || ed.readOnly,
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
