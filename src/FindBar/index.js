import React from "react";
import {
  Button,
  IconClasses,
  InputGroup,
  Switch,
  Icon,
  Popover,
  Position
} from "@blueprintjs/core";
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
  isInline,
  findTool = {}
}) {
  const {
    searchText,
    dnaOrAA,
    highlightAll,
    ambiguousOrLiteral,
    matchesTotal = 0,
    matchNumber = 0
  } = findTool;
  const findOptionsEls = [
    <div key="dnaoraa" className={"pt-select"}>
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
    </div>,
    <div key="ambiguousorliteral" className={"pt-select"}>
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
    </div>,
    <Switch
      key="highlightall"
      value={highlightAll}
      onChange={toggleHighlightAll}
    >
      Highlight All
    </Switch>
  ];

  return (
    <div
      style={
        isInline
          ? {
              display: "flex"
            }
          : {
              position: "fixed",
              top: 0,
              right: 25,
              padding: 10,
              display: "flex",
              alignItems: "center",
              paddingBottom: 5,
              background: "white",
              zIndex: "20000",
              borderBottom: "1px solid lightgrey",
              borderLeft: "1px solid lightgrey",
              borderRight: "1px solid lightgrey",
              borderBottomLeftRadius: "5px",
              borderBottomRightRadius: "5px"
            }
      }
      className={"veFindBar"}
    >
      <Button onClick={toggleFindTool} className={IconClasses.CROSS} />
      <InputGroup
        autoFocus
        onKeyDown={e => {
          e.persist();
          if (e.metaKey && e.keyCode === 70) {
            toggleFindTool();
            e.preventDefault();
            e.stopPropagation();
          } else if (e.keyCode === 13) {
            updateMatchNumber(
              matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
            );
          }
        }}
        rightElement={
          <span>
            {isInline && (
              <Popover
                position={Position.BOTTOM}
                target={
                  <Button
                    className={"pt-minimal"}
                    iconName={IconClasses.EDIT}
                  />
                }
                content={
                  <div
                    className={"ve-find-options-popover"}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: 20,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingRight: 20
                    }}
                  >
                    {findOptionsEls}
                  </div>
                }
              />
            )}
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
      {!isInline && findOptionsEls}
    </div>
  );
}

export default withEditorProps(FindBar);

function mod(n, m) {
  return (n % m + m) % m;
}
