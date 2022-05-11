/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import { showConfirmationDialog, TgSelect } from "teselagen-react-components";
import html2canvas from "html2canvas";

import "./Ladder.css";
import { Button, Tooltip } from "@blueprintjs/core";
import { showDialog } from "../GlobalDialogUtils";
import { AddLaddersDialog } from "./AddLaddersDialog";
import { ladderDefaults } from "./ladderDefaults";
import useLadders from "../utils/useLadders";
import { map } from "lodash";
import { filter } from "lodash";

export default function Ladder({
  // gelDigestEnzymes = [],
  boxHeight = 550,
  lanes = [],
  digestLaneRightClicked,
  selectedFragment,
  ladders = ladderDefaults
}) {
  const [additionalLadders, setLadders] = useLadders();
  const laddersToUse = [
    ...ladders,
    ...map(additionalLadders, (l, i) => ({
      ...l,
      label: (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          {l.label}{" "}
          <Button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const confirm = await showConfirmationDialog({
                text: "Are you sure you want to delete this custom ladder? You cannot undo this action",
                intent: "danger",
                confirmButtonText: "Delete",
                cancelButtonText: "Cancel",
                canEscapeKeyCancel: true
              });
              if (!confirm) {
                return;
              }
              setSelectedLadder(ladders[0].value);
              setLadders(
                filter(additionalLadders, (lad) => lad.value !== l.value)
              );
            }}
            intent="danger"
            small
            minimal
            icon="trash"
          ></Button>
        </div>
      )
    }))
  ];
  const [highlightedFragment, setHighlightedFragment] = useState();
  const [selectedLadder, setSelectedLadder] = useState(ladders[0].value);
  let ladderInfo;
  laddersToUse.forEach((ladder) => {
    if (ladder.value === selectedLadder)
      ladderInfo = {
        ...ladder,
        markings: ladder.markings.sort((a, b) => {
          return b - a;
        })
      };
  });
  if (!ladderInfo) {
    return console.error("Uh oh there needs to be ladder info here!");
  }
  const sharedStyle = { color: "white", background: "black" }; //use a shared style to get the copy image to look nice
  const upperBoundary = ladderInfo.markings[0];
  return (
    <div>
      Ladder:
      <div style={{ display: "flex" }}>
        <TgSelect
          className="tg-ladder-selector"
          value={selectedLadder}
          onChange={(val) => setSelectedLadder(val.value)}
          options={laddersToUse}
        />
        <Button
          onClick={() => {
            showDialog({
              ModalComponent: AddLaddersDialog,
              props: {
                setSelectedLadder
              }
            });
          }}
          style={{ minWidth: 150 }}
          minimal
          small
          icon="plus"
          intent="primary"
        >
          Add Ladder
        </Button>
      </div>
      <br />
      <div
        className="ve-digest-outer-container"
        style={{
          position: "relative",
          width: "fit-content",
          ...sharedStyle
        }}
      >
        {navigator.clipboard && window.isSecureContext && (
          <Button
            icon="duplicate"
            minimal
            style={{ position: "absolute", top: 5, right: 5, color: "white" }}
            onClick={() => {
              try {
                html2canvas(
                  document.querySelector(".ve-digest-container")
                ).then((canvas) => {
                  canvas.toBlob((blob) =>
                    navigator.clipboard.write([
                      new window.ClipboardItem({ "image/png": blob })
                    ])
                  );
                  window.toastr.success("Image copied to clipboard!");
                });
              } catch (e) {
                window.toastr.error(
                  "Error copying the image, try just taking a screenshot instead ;)"
                );
              }
            }}
          ></Button>
        )}
        <div style={{ padding: 3, paddingLeft: 7, width: 290 }}>
          Highlighted Fragment:{" "}
          {highlightedFragment ? highlightedFragment.size : "--"}{" "}
        </div>
        <div
          style={{ height: boxHeight, ...sharedStyle }}
          className="ve-digest-container"
        >
          <div
            style={{ width: 100 }}
            className="ve-digest-column ve-digest-ladder"
          >
            <div className="ve-digest-header"> </div>
            {ladderInfo.markings.map((val, index) => {
              return (
                <div
                  key={index}
                  style={{
                    fontSize: 12,
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    bottom: calculateOffset(boxHeight, val, upperBoundary) - 3 //subtract 3 to get the labels to align better
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      paddingLeft: 6,
                      paddingRight: 4
                    }}
                  >
                    {val}{" "}
                  </span>
                  <span style={{ color: "white", paddingRight: 4 }}> bp </span>
                </div>
              );
            })}
          </div>
          <div className="ve-digest-column ve-digest-ladder">
            <div className="ve-digest-header">Ladder </div>
            {ladderInfo.markings.map((val, index) => {
              return (
                <div
                  key={index}
                  style={{
                    fontSize: 12,
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    height: "2px",
                    background: "white",
                    bottom: calculateOffset(boxHeight, val, upperBoundary)
                  }}
                />
              );
            })}
          </div>
          {lanes.map((fragments, index) => {
            return (
              <Lane
                key={index}
                {...{
                  onMouseOver: (fragment) => setHighlightedFragment(fragment),
                  onMouseOut: () => setHighlightedFragment(undefined),
                  digestLaneRightClicked,
                  laneNumber: index + 1,
                  fragments,
                  highlightedFragment,
                  selectedFragment,
                  boxHeight,
                  upperBoundary
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Lane({
  laneNumber,
  onMouseOver,
  onMouseOut,
  digestLaneRightClicked,
  fragments,
  highlightedFragment,
  selectedFragment,
  boxHeight,
  upperBoundary
}) {
  return (
    <div
      style={{ marginLeft: 20, marginRight: 20 }}
      className="ve-digest-column ve-digest-lane"
    >
      <div className="ve-digest-header">Lane {laneNumber} </div>
      {fragments.map((fragment, index) => {
        const { size, id, name } = fragment;
        const isHighlighted =
          (highlightedFragment && id === highlightedFragment.id) ||
          (selectedFragment && id === highlightedFragment.id);
        return (
          <div
            key={index}
            onMouseOver={() => {
              onMouseOver(fragment);
            }}
            onMouseOut={() => {
              onMouseOut(fragment);
            }}
            onClick={() => {
              fragment.onFragmentSelect();
            }}
            onContextMenu={(e) => {
              fragment.onFragmentSelect();
              digestLaneRightClicked(e);
            }}
            data-test={name}
            style={{
              fontSize: 12,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              color: isHighlighted ? "#fdffdd" : "white",
              width: "90%",
              height: isHighlighted ? "3px" : "2px",
              background: "white",
              bottom: calculateOffset(boxHeight, size, upperBoundary)
            }}
          >
            <Tooltip
              className="ve-digest-fragment-tooltip"
              content={<div>{name}</div>}
            >
              <div
                style={{
                  width: "100%",
                  height: isHighlighted ? "3px" : "2px"
                }}
              />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

function calculateOffset(boxHeight, size, upperBoundary) {
  return (boxHeight * Math.log(size)) / Math.log(upperBoundary) - 55;
}
