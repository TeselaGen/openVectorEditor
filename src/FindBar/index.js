import React from "react";
import {
  Button,
  InputGroup,
  Switch,
  Popover,
  Position
} from "@blueprintjs/core";
import { reduxForm } from "redux-form";
import withEditorProps from "../withEditorProps";
import "./style.css";
import { SelectField } from "teselagen-react-components";

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
    <SelectField
      options={[
        { label: "DNA", value: "DNA" },
        { label: "Amino Acids", value: "AA" }
      ]}
      defaultValue={dnaOrAA}
      onFieldSubmit={value => {
        updateDnaOrAA(value);
      }}
      key="dnaoraa"
    />,
    <SelectField
      options={[
        { label: "Literal", value: "LITERAL" },
        { label: "Ambiguous", value: "AMBIGUOUS" }
      ]}
      defaultValue={ambiguousOrLiteral}
      onFieldSubmit={value => {
        updateAmbiguousOrLiteral(value);
      }}
      key="ambiguousorliteral"
    />,
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
      <Button onClick={toggleFindTool} icon="cross" />
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
                target={<Button className={"pt-minimal"} icon={"edit"} />}
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
              icon="caret-up"
            />
            <Button
              className={"pt-minimal"}
              disabled={matchesTotal <= 0}
              onClick={() => {
                updateMatchNumber(
                  matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
                );
              }}
              icon="caret-down"
            />
          </span>
        }
        onChange={e => {
          return updateSearchText(e.target.value);
        }}
        value={searchText}
        leftIcon="search"
      />
      {!isInline && findOptionsEls}
    </div>
  );
}

export default reduxForm({ form: "findbar" })(withEditorProps(FindBar));

function mod(n, m) {
  return (n % m + m) % m;
}
