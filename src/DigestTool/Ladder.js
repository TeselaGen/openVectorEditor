/* eslint-disable react/jsx-no-bind */
import React from "react";
import { TgSelect } from "teselagen-react-components";

import "./Ladder.css";
import { Tooltip } from "@blueprintjs/core";

export default class Ladder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { highlightedFragment: undefined };
  }
  render() {
    let {
      // gelDigestEnzymes = [],
      boxHeight = 550,
      lanes = [],
      selectedFragment,
      selectedLadder = "geneRuler1KB",
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
          value: "geneRuler100LowRange",
          label: "GeneRuler 100bp + DNA 100-3000 bp"
        }
      ]
    } = this.props;
    const { highlightedFragment } = this.state;
    let ladderInfo;
    ladders.forEach(ladder => {
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
          onChange={this.handleChange}
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
                    <span style={{ color: "white", paddingRight: 4 }}>
                      {" "}
                      bp{" "}
                    </span>
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
                    onMouseOver: fragment => {
                      this.setState({
                        highlightedFragment: fragment
                      });
                    },
                    onMouseOut: () => {
                      this.setState({
                        highlightedFragment: undefined
                      });
                    },
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
}

function Lane({
  laneNumber,
  onMouseOver,
  onMouseOut,
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
        const { size, id } = fragment;
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
              content={
                <div>
                  {fragment.cut1.restrictionEnzyme.name} &nbsp; -- &nbsp;
                  {fragment.cut2.restrictionEnzyme.name} &nbsp; &nbsp;
                  {fragment.size} bps
                </div>
              }
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
