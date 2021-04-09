/* eslint-disable react/jsx-no-bind */
import React, { useState } from "react";
import { TgSelect } from "teselagen-react-components";

import "./Ladder.css";
import { Tooltip } from "@blueprintjs/core";

export default function Ladder({
  // gelDigestEnzymes = [],
  boxHeight = 550,
  lanes = [],
  digestLaneRightClicked,
  selectedFragment,
  ladders = [
    {
      value: "geneRuler1KB",
      label: "GeneRuler 1kb + DNA 75-20,000 bp",
      markings: [
        20000,
        10000,
        7000,
        5000,
        4000,
        3000,
        2000,
        1500,
        1000,
        700,
        500,
        400,
        300,
        200,
        75
      ]
    },
    {
      value: "geneRuler100BP",
      label: "GeneRuler 100bp + DNA 100-3000 bp",
      markings: [
        3000,
        2000,
        1500,
        1200,
        1000,
        900,
        800,
        700,
        600,
        500,
        400,
        300,
        200,
        100
      ]
    },
    {
      value: "invitrogen1KbPlus",
      label: "Invitrogen 1kb + DNA 100-15,000 bp",
      markings: [
        15000,
        10000,
        8000,
        7000,
        6000,
        5000,
        4000,
        3000,
        2000,
        1500,
        1000,
        850,
        650,
        500,
        400,
        300,
        200
      ]
    }
  ]
}) {
  const [highlightedFragment, setHighlightedFragment] = useState();
  const [selectedLadder, setSelectedLadder] = useState(ladders[0].value);
  let ladderInfo;
  ladders.forEach((ladder) => {
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

  const upperBoundary = ladderInfo.markings[0];
  return (
    <div>
      Ladder:
      <TgSelect
        value={selectedLadder}
        onChange={(val) => setSelectedLadder(val.value)}
        options={ladders}
      />
      <br />
      <div
        style={{ width: "fit-content", color: "white", background: "black" }}
      >
        <div style={{ padding: 3, paddingLeft: 7, width: 290 }}>
          Highlighted Fragment:{" "}
          {highlightedFragment ? highlightedFragment.size : "--"}{" "}
        </div>
        <div style={{ height: boxHeight }} className="ve-digest-container">
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
