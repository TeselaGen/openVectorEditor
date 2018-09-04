import { getInsertBetweenVals } from "ve-sequence-utils";
import { getRangeLength, invertRange, normalizeRange } from "ve-range-utils";
import React from "react";
import { Button, Classes } from "@blueprintjs/core";
import { BPSelect } from "teselagen-react-components";
import withEditorProps from "../withEditorProps";
import "./style.css";

export function StatusBar({
  selectionLayer = { start: -1, end: -1 },
  caretPosition = -1,
  sequenceLength = 0,
  readOnly,
  sequenceData: { circular, materiallyAvailable } = {},
  onSave,
  disableSetReadOnly,
  updateCircular,
  updateAvailability,
  updateReadOnlyMode,
  selectionLayerUpdate,
  caretPositionUpdate,
  showCircularity = true,
  showReadOnly = true,
  showAvailability = false
}) {
  let length = getRangeLength(selectionLayer, sequenceLength);
  let insertBetween = getInsertBetweenVals(
    caretPosition,
    selectionLayer,
    sequenceLength
  );
  let isSelecting = selectionLayer.start > -1;
  const statusBarItems = [
    showReadOnly &&
      (onSave ? (
        <BPSelect
          options={[
            { label: "Read Only", value: "readOnly" },
            { label: "Editable", value: "editable" }
          ]}
          disabled={disableSetReadOnly || !onSave} //the !onSave here is redundant
          className={Classes.MINIMAL}
          value={readOnly ? "readOnly" : "editable"}
          onChange={value => {
            updateReadOnlyMode(value === "readOnly");
          }}
        />
      ) : readOnly ? (
        "Read Only"
      ) : (
        "Editable"
      )),

    showCircularity &&
      (readOnly ? (
        circular ? (
          "Circular"
        ) : (
          "Linear"
        )
      ) : (
        <BPSelect
          onChange={val => {
            updateCircular(val === "circular");
          }}
          className={Classes.MINIMAL}
          value={circular ? "circular" : "linear"}
          options={[
            { label: "Circular", value: "circular" },
            { label: "Linear", value: "linear" }
          ]}
        />
      )),
    showAvailability &&
      (readOnly ? (
        materiallyAvailable ? (
          "available"
        ) : (
          "unavailable"
        )
      ) : (
        <BPSelect
          onChange={val => {
            updateAvailability(val === "available");
          }}
          className={Classes.MINIMAL}
          value={materiallyAvailable ? "available" : "unavailable"}
          options={[
            { label: "Available", value: "available" },
            { label: "Unavailable", value: "unavailable" }
          ]}
        />
      )),
    // !readOnly &&
    //   `Insert between bases ${insertBetween[0]} and ${insertBetween[1]}`,
    <React.Fragment key="selectionstatus">
      {isSelecting
        ? `Selecting ${length} bps from ${selectionLayer.start +
            1} to ${selectionLayer.end + 1}`
        : caretPosition > -1
          ? `Caret Between Bases ${insertBetween[0]} and ${insertBetween[1]}`
          : "No Selection"}
      <Button
        minimal
        disabled={sequenceLength <= 0}
        onClick={() => {
          if (sequenceLength <= 0) {
            return false;
          }
          if (selectionLayer.start > -1) {
            if (
              getRangeLength(selectionLayer, sequenceLength) === sequenceLength
            ) {
              caretPositionUpdate(selectionLayer.start);
            } else {
              selectionLayerUpdate(invertRange(selectionLayer, sequenceLength));
            }
          } else {
            if (caretPosition > -1) {
              selectionLayerUpdate(
                normalizeRange(
                  {
                    start: caretPosition,
                    end: caretPosition - 1
                  },
                  sequenceLength
                )
              );
            } else {
              selectionLayerUpdate({
                start: 0,
                end: sequenceLength - 1
              });
            }
          }
        }}
        style={{ marginLeft: 5, color: "#48AFF0" }}
        small
      >
        Select Inverse
      </Button>
    </React.Fragment>,
    `Length: ${sequenceLength}`
  ].filter(i => !!i);
  return (
    <div className={"veStatusBar"}>
      {statusBarItems.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <StatusBarItem>{item}</StatusBarItem>
            {i !== statusBarItems.length - 1 && (
              <div className={"veStatusBarSpacer"} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StatusBarItem({ children }) {
  return <div className={"veStatusBarItem"}>{children}</div>;
}

export default withEditorProps(StatusBar);
