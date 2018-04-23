import { getInsertBetweenVals } from "ve-sequence-utils";
import { getRangeLength, invertRange, normalizeRange } from "ve-range-utils";
import React from "react";
import { Button } from "@blueprintjs/core";
import { BPSelect } from "teselagen-react-components";
import withEditorProps from "../withEditorProps";
import "./style.css";

export function StatusBar({
  selectionLayer = { start: -1, end: -1 },
  caretPosition = -1,
  sequenceLength = 0,
  readOnly,
  sequenceData: { circular } = {},
  onSave,
  updateCircular,
  updateReadOnlyMode,
  selectionLayerUpdate,
  caretPositionUpdate,
  showCircularity = true,
  showReadOnly = true
}) {
  let length = getRangeLength(selectionLayer, sequenceLength);
  let insertBetween = getInsertBetweenVals(
    caretPosition,
    selectionLayer,
    sequenceLength
  );
  let isSelecting = selectionLayer.start > -1;
  return (
    <div className={"veStatusBar"}>
      {showReadOnly && (
        <StatusBarItem>
          {onSave ? (
            <BPSelect
              options={[
                { label: "Read Only", value: "readOnly" },
                { label: "Editable", value: "editable" }
              ]}
              className="pt-minimal"
              value={readOnly ? "readOnly" : "editable"}
              onChange={value => {
                updateReadOnlyMode(value === "readOnly");
              }}
            />
          ) : readOnly ? (
            "Read Only"
          ) : (
            "Editable"
          )}
        </StatusBarItem>
      )}
      <div className={"spacer"} />
      {showCircularity && (
        <StatusBarItem>
          {readOnly ? (
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
              className="pt-minimal"
              value={circular ? "circular" : "linear"}
              options={[
                { label: "Circular", value: "circular" },
                { label: "Linear", value: "linear" }
              ]}
            />
          )}
        </StatusBarItem>
      )}
      <div className={"spacer"} />
      {!readOnly && (
        <StatusBarItem>
          {`Insert between bases ${insertBetween[0]} and ${insertBetween[1]}`}
        </StatusBarItem>
      )}
      <div className={"spacer"} />
      {
        <StatusBarItem>
          {isSelecting
            ? `Selecting ${length} bps from ${selectionLayer.start +
                1} to ${selectionLayer.end + 1}`
            : caretPosition > -1
              ? `Caret Between Bases ${insertBetween[0]} and ${
                  insertBetween[1]
                }`
              : "No Selection"}
          <Button
            disabled={sequenceLength <= 0}
            onClick={() => {
              if (sequenceLength <= 0) {
                return false;
              }
              if (selectionLayer.start > -1) {
                if (getRangeLength(selectionLayer) === sequenceLength) {
                  caretPositionUpdate(selectionLayer.start);
                } else {
                  selectionLayerUpdate(invertRange(selectionLayer));
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
            style={{ marginLeft: 5 }}
            className={"pt-small"}
          >
            {" "}
            Select Inverse
          </Button>
        </StatusBarItem>
      }
      <div className={"spacer"} />
      {<StatusBarItem>Length: {sequenceLength}</StatusBarItem>}
    </div>
  );
}

function StatusBarItem({ children }) {
  return <div className={"item"}>{children}</div>;
}

export default withEditorProps(StatusBar);
