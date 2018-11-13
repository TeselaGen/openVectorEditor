import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor, handleSave } from "../withEditorProps";
import { withHandlers } from "recompose";
import { compose } from "redux";

export default compose(
  connectToEditor(({ readOnly, sequenceData, lastSavedId }) => {
    return {
      readOnly: readOnly,
      sequenceData: sequenceData,
      hasBeenSaved:
        sequenceData.stateTrackingId === "initialLoadId" ||
        sequenceData.stateTrackingId === lastSavedId
    };
  }),
  withHandlers({ handleSave })
)(({ toolbarItemProps, handleSave, readOnly, hasBeenSaved, onSave }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,
        Icon: <Icon icon="floppy-disk" />,
        onIconClick: handleSave,
        disabled: !onSave || hasBeenSaved || readOnly,
        tooltip: (
          <span>
            Save <span style={{ fontSize: 10 }}>(Cmd/Ctrl+S)</span>
          </span>
        )
      }}
    />
  );
});
