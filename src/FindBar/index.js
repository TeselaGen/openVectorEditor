import React from "react";
import { Button, IconClasses, InputGroup } from "@blueprintjs/core";
import withEditorProps from "../withEditorProps";
import "./style.css";

export function FindBar({
  toggleFindTool,
  toggleHighlightAll,
  // highlightAll,
  updateSearchText,
  updateAmbiguousOrLiteral,
  updateDnaOrAA,
  updateMatchNumber,
  findTool = {}
}) {
  const {
    searchText,
    dnaOrAA,
    ambiguousOrLiteral,
    matchesTotal = 0,
    matchNumber = 0
  } = findTool;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        display: "flex",
        paddingBottom: 5,
        background: "white"
      }}
      className={"veFindBar"}
    >
      <Button onClick={toggleFindTool} className={IconClasses.CROSS} />
      <InputGroup
        rightElement={
          <span>
            <span style={{ marginRight: 3, color: "lightgrey" }}>
              {matchesTotal > 0 ? matchNumber + 1 : 0}/{matchesTotal}
            </span>
            <Button
              className={"pt-minimal"}
              disabled={matchesTotal <= 0}
              onClick={() => {
                updateMatchNumber(
                  matchesTotal <= 0 ? 0 : mod(matchNumber - 1, matchesTotal)
                );
              }}
              iconName={IconClasses.CARET_UP}
            />
            <Button
              className={"pt-minimal"}
              disabled={matchesTotal <= 0}
              onClick={() => {
                updateMatchNumber(
                  matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
                );
              }}
              iconName={IconClasses.CARET_DOWN}
            />
          </span>
        }
        onChange={e => {
          return updateSearchText(e.target.value);
        }}
        value={searchText}
        leftIconName={IconClasses.SEARCH}
      />
      <div className={"pt-select"}>
        <select
          onChange={e => {
            updateDnaOrAA(e.target.value);
          }}
          value={dnaOrAA}
        >
          {[
            { label: "DNA", value: "DNA" },
            { label: "Amino Acids", value: "AA" }
          ].map(({ label, value }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}{" "}
        </select>
      </div>
      <div className={"pt-select"}>
        <select
          onChange={e => {
            updateAmbiguousOrLiteral(e.target.value);
          }}
          value={ambiguousOrLiteral}
        >
          {[
            { label: "Literal", value: "LITERAL" },
            { label: "Ambiguous", value: "AMBIGUOUS" }
          ].map(({ label, value }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}{" "}
        </select>
      </div>
      <Button onClick={toggleHighlightAll}> Highlight All</Button>
    </div>
  );
}

export default withEditorProps(FindBar);

function mod(n, m) {
  return (n % m + m) % m;
}
