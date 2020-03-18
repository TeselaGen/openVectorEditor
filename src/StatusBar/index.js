import React from "react";
import { Button, Classes, HTMLSelect } from "@blueprintjs/core";
import {
  connectToEditor,
  updateCircular,
  handleInverse
} from "../withEditorProps";
import "./style.css";
import { withHandlers, compose } from "recompose";
import { divideBy3 } from "../utils/proteinUtils";
import { getSelectionMessage } from "../utils/editorUtils";

const EditReadOnlyItem = connectToEditor(({ readOnly }) => ({
  readOnly
}))(
  ({
    onSave,
    readOnly,
    showReadOnly,
    disableSetReadOnly,
    updateReadOnlyMode
  }) => {
    return showReadOnly ? (
      <StatusBarItem dataTest="veStatusBar-readOnly">
        {onSave ? (
          <HTMLSelect
            options={[
              { label: "Read Only", value: "readOnly" },
              { label: "Editable", value: "editable" }
            ]}
            disabled={disableSetReadOnly || !onSave} //the !onSave here is redundant
            className={Classes.MINIMAL}
            value={readOnly ? "readOnly" : "editable"}
            onChange={({ target: { value } }) => {
              updateReadOnlyMode(value === "readOnly");
            }}
          />
        ) : readOnly ? (
          "Read Only"
        ) : (
          "Editable"
        )}
      </StatusBarItem>
    ) : null;
  }
);

const ShowSelectionItem = compose(
  connectToEditor(
    ({ selectionLayer, caretPosition, sequenceData = { sequence: "" } }) => ({
      selectionLayer,
      isProtein: sequenceData.isProtein,
      caretPosition,
      sequenceLength: sequenceData.sequence.length,
      sequenceData
    })
  ),
  withHandlers({ handleInverse })
)(
  ({
    selectionLayer = { start: -1, end: -1 },
    caretPosition = -1,
    sequenceLength = 0,
    isProtein,
    sequenceData = { sequence: "" },
    showGCContent,
    GCDecimalDigits,
    handleInverse
  }) => {
    return (
      <React.Fragment>
        <StatusBarItem dataTest="veStatusBar-selection">
          {getSelectionMessage({
            caretPosition,
            selectionLayer,
            sequenceLength,
            sequenceData,
            showGCContent,
            GCDecimalDigits,
            isProtein
          })}

          <Button
            minimal
            disabled={sequenceLength <= 0}
            onClick={handleInverse}
            style={{ marginLeft: 5, color: "#48AFF0" }}
            small
          >
            Select Inverse
          </Button>
        </StatusBarItem>
      </React.Fragment>
    );
  }
);

const ShowLengthItem = connectToEditor(
  ({ sequenceData = { sequence: "" } }) => ({
    sequenceLength: sequenceData.sequence.length
  })
)(({ isProtein, sequenceLength = 0 }) => (
  <StatusBarItem dataTest="veStatusBar-length">{`Length: ${divideBy3(
    sequenceLength,
    isProtein
  )} ${isProtein ? "AAs" : "bps"}`}</StatusBarItem>
));

const EditCircularityItem = compose(
  connectToEditor(
    ({
      readOnly,
      sequenceData,
      sequenceData: { circular /* materiallyAvailable */ } = {}
    }) => ({
      readOnly,
      sequenceData,
      circular
    })
  ),
  withHandlers({ updateCircular })
)(({ readOnly, showCircularity, circular, updateCircular }) => {
  return showCircularity ? (
    <StatusBarItem dataTest="veStatusBar-circularity">
      {readOnly ? (
        circular ? (
          "Circular"
        ) : (
          "Linear"
        )
      ) : (
        <HTMLSelect
          onChange={({ target: { value } }) => {
            updateCircular(value === "circular");
          }}
          className={Classes.MINIMAL}
          value={circular ? "circular" : "linear"}
          options={[
            { label: "Circular", value: "circular" },
            { label: "Linear", value: "linear" }
          ]}
        />
      )}
    </StatusBarItem>
  ) : null;
});
const EditAvailabilityItem = connectToEditor(
  ({ readOnly, sequenceData: { materiallyAvailable } = {} }) => ({
    readOnly,
    materiallyAvailable
  })
)(({ readOnly, showAvailability, materiallyAvailable, updateAvailability }) => {
  return showAvailability ? (
    <StatusBarItem>
      {readOnly ? (
        materiallyAvailable ? (
          "Available"
        ) : (
          "Unavailable"
        )
      ) : (
        <HTMLSelect
          onChange={({ target: { value } }) => {
            updateAvailability(value === "available");
          }}
          className={Classes.MINIMAL}
          value={materiallyAvailable ? "available" : "unavailable"}
          options={[
            { label: "Available", value: "available" },
            { label: "Unavailable", value: "unavailable" }
          ]}
        />
      )}
    </StatusBarItem>
  ) : null;
});

export function StatusBar({
  disableSetReadOnly,
  onSave,
  editorName,
  showCircularity = true,
  showReadOnly = true,
  showAvailability = false,
  showGCContent = false,
  onSelectionOrCaretChanged,
  GCDecimalDigits = 1,
  isProtein
}) {
  return (
    <div className="veStatusBar">
      <EditReadOnlyItem
        editorName={editorName}
        {...{
          onSave,
          disableSetReadOnly,
          showReadOnly
        }}
      />
      <EditCircularityItem
        editorName={editorName}
        showCircularity={showCircularity}
      />
      <EditAvailabilityItem
        editorName={editorName}
        showAvailability={showAvailability}
      />
      <ShowSelectionItem
        editorName={editorName}
        isProtein={isProtein}
        showGCContent={showGCContent}
        onSelectionOrCaretChanged={onSelectionOrCaretChanged}
        GCDecimalDigits={GCDecimalDigits}
      />
      <ShowLengthItem isProtein={isProtein} editorName={editorName} />
    </div>
  );
}

function StatusBarItem({ children, dataTest }) {
  return (
    <React.Fragment>
      <div data-test={dataTest} className="veStatusBarItem">
        {children}
      </div>
      <div className="veStatusBarSpacer" />
    </React.Fragment>
  );
}

export default StatusBar;
