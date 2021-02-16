import React from "react";
import {
  Button,
  Classes,
  HTMLSelect,
  Icon,
  Popover,
  RadioGroup
} from "@blueprintjs/core";
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
import getSequenceDataBetweenRange from "ve-sequence-utils/lib/getSequenceDataBetweenRange";
import { calculateTm, calculateNebTm } from "ve-sequence-utils/lib";
import useMeltingTemp from "../utils/useMeltingTemp";
import useLocalStorageState from "use-local-storage-state";
import { isString } from "lodash";

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

    const sequence = getSequenceDataBetweenRange(sequenceData, selectionLayer)
      .sequence;

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
        {showMeltingTemp && <MeltingTemp sequence={sequence}></MeltingTemp>}
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
  showGCContentByDefault,
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

function MeltingTemp({ sequence }) {
  const [tmType, setTmType] = useLocalStorageState("tmType", "default");
  const tm = (
    {
      default: calculateTm,
      neb_tm: calculateNebTm
    }[tmType] || calculateTm
  )(sequence);
  const hasWarning = isString(tm) && tm.length > 7 && tm;
  return (
    <StatusBarItem dataTest="veStatusBar-selection-tm">
      <Popover
        content={
          <div style={{ maxWidth: 300, padding: 20 }}>
            Using Tm calculations based on these{" "}
            <a href="https://github.com/TeselaGen/ve-sequence-utils">
              algorithms
            </a>
            <br></br>
            <br></br>
            <RadioGroup
              label="Choose Tm Type:"
              options={[
                { value: "default", label: "Default Tm" },
                { value: "neb_tm", label: "NEB Tm" }
              ]}
              onChange={(e) => setTmType(e.target.value)}
              selectedValue={tmType}
            ></RadioGroup>
            {hasWarning && (
              <div>
                <Icon
                  style={{ marginLeft: 5, marginRight: 5 }}
                  size={10}
                  icon="warning-sign"
                ></Icon>
                {hasWarning}
                <br></br>
                <br></br>
                Try using the Default Tm
              </div>
            )}
          </div>
        }
      >
        <Button minimal small>
          Melting Temp: {Number(tm) || 0}{" "}
          {hasWarning && (
            <Icon
              style={{ marginLeft: 5, marginRight: 5 }}
              size={10}
              icon="warning-sign"
            ></Icon>
          )}
        </Button>
      </Popover>
    </StatusBarItem>
  );
}
