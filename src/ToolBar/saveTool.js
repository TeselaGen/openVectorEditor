import React from "react";
import { Icon } from "@blueprintjs/core";
import ToolbarItem from "./ToolbarItem";
import { connectToEditor, handleSave } from "../withEditorProps";
import { withHandlers } from "recompose";
import { compose } from "redux";

export default compose(
  connectToEditor(
    ({ readOnly, sequenceData = {}, lastSavedId = "134%!@#%!@#%!@%" }) => {
      return {
        readOnly: readOnly,
        sequenceData: sequenceData,
        hasBeenSaved:
          sequenceData.stateTrackingId === "initialLoadId" ||
          sequenceData.stateTrackingId === lastSavedId
      };
    }
  ),
  withHandlers({ handleSave })
)(
  ({
    toolbarItemProps,
    alwaysAllowSave,
    handleSave,
    readOnly,
    hasBeenSaved,
    onSave
  }) => {
    return (
      <ToolbarItem
        {...{
          Icon: <Icon data-test="saveTool" icon="floppy-disk" />,
          onIconClick: handleSave,
          disabled: alwaysAllowSave
            ? false
            : !onSave || hasBeenSaved || readOnly,
          tooltip: (
            <span>
              Save <span style={{ fontSize: 10 }}>(Cmd/Ctrl+S)</span>
            </span>
          ),
          ...toolbarItemProps
        }}
      />
    );
  }
);
