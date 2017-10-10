import React from "react";
import {Button, IconClasses, InputGroup} from '@blueprintjs/core';
import withEditorProps from '../withEditorProps';
import "./style.css";

export function FindBar({
  toggleFindTool,
  toggleHighlightAll,
  // highlightAll,
  updateSearchText,
  updateAmbiguousOrLiteral,
  updateDnaOrAA,
  findTool={}
}) {
  const {
    searchText,
    dnaOrAA,
    ambiguousOrLiteral,
  } = findTool
  return <div style={{position: "absolute", bottom: 0, left: 0, display: "flex", paddingBottom: 5, background: "white" }} className={'veFindBar'}>
    <Button onClick={toggleFindTool} className={IconClasses.CROSS}></Button>
    <InputGroup onChange={(e) => {
      return updateSearchText(e.target.value)
    }} value={searchText} leftIconName={IconClasses.SEARCH}>
    </InputGroup>
    <div className={'pt-select'}>
      <select onChange={updateAmbiguousOrLiteral} value={dnaOrAA}>{[{label: "DNA", value: "DNA"}, {label: "Amino Acids", value: "AA"}].map(({label, value}, index) => {
        return <option key={value} value={value}>{label}</option>
      })} </select>
    </div>
    <div className={'pt-select'}>
      <select onChange={updateDnaOrAA} value={ambiguousOrLiteral}>{[{label: "Literal", value: "LITERAL"}, {label: "Ambiguous", value: "AMBIGUOUS"}].map(({label, value}, index) => {
        return <option key={value} value={value}>{label}</option>
      })} </select>
    </div>
    <Button onClick={toggleHighlightAll}> Highlight All</Button>
  </div>;
}


export default withEditorProps(FindBar)