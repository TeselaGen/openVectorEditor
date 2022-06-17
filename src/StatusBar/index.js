import React from "react";
import { Button, Classes, HTMLSelect } from "@blueprintjs/core";

import {
  connectToEditor,
  updateCircular,
  handleInverse,
  getShowGCContent
} from "../withEditorProps";
import "./style.css";
import { withHandlers, compose } from "recompose";
import { divideBy3 } from "../utils/proteinUtils";
import { getSelectionMessage } from "../utils/editorUtils";
import { getSequenceDataBetweenRange } from "ve-sequence-utils";
import useMeltingTemp from "../utils/useMeltingTemp";
import MeltingTemp from "./MeltingTemp";

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
    (
      { selectionLayer, caretPosition, sequenceData = { sequence: "" } },
      ownProps,
      ...rest
    ) => {
      return {
        showGCContent: getShowGCContent(rest[rest.length - 1], ownProps),
        selectionLayer,
        isProtein: sequenceData.isProtein,
        caretPosition,
        sequenceLength: sequenceData.sequence.length,
        sequenceData
      };
    }
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
    const [showMeltingTemp] = useMeltingTemp();

    const sequence = getSequenceDataBetweenRange(
      sequenceData,
      selectionLayer
    ).sequence;

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
        {showMeltingTemp && (
          <MeltingTemp
            WrapperToUse={StatusBarItem}
            sequence={sequence}
          ></MeltingTemp>
        )}
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

const ShowTypeItem = connectToEditor(({ sequenceData }) => ({
  isProtein: sequenceData.isProtein,
  isOligo: sequenceData.isOligo,
  isRna: sequenceData.isRna,
  isMixedRnaAndDna: sequenceData.isMixedRnaAndDna
}))(({ isProtein, isOligo, isRna, isMixedRnaAndDna }) => {
  let type = "DNA";
  if (isProtein) type = "Protein";
  if (isRna) type = "RNA";
  if (isOligo) type = "Oligo";
  if (isMixedRnaAndDna) type = "Mixed RNA/DNA";
  return <StatusBarItem dataTest="veStatusBar-type">{type}</StatusBarItem>;
});

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
  showMoleculeType = true,
  showReadOnly = true,
  showAvailability = false,
  showGCContentByDefault,
  onSelectionOrCaretChanged,
  GCDecimalDigits = 1,
  isProtein
}) {
  return (
    <div className="veStatusBar">
      {showMoleculeType && (
        <ShowTypeItem editorName={editorName}></ShowTypeItem>
      )}
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
        showGCContentByDefault={showGCContentByDefault}
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
