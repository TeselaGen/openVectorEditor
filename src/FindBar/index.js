import React from "react";
import {
  Button,
  InputGroup,
  Switch,
  Popover,
  Position,
  HTMLSelect
} from "@blueprintjs/core";
import withEditorProps from "../withEditorProps";
import onlyUpdateForKeysDeep from "../utils/onlyUpdateForKeysDeep";
import "./style.css";
import { InfoHelper } from "teselagen-react-components";

const opts = [
  { label: "DNA", value: "DNA" },
  { label: "Amino Acids", value: "AA" }
];
export class FindBar extends React.Component {
  shouldComponentUpdate(nextProps, nextState){
    console.log('should update false')
    return false
 }
 
  componentDidUpdate(prevProps, prevState) {
    console.log('yep')
    Object.entries(this.props).forEach(([key, val]) =>
      prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    );
    // Object.entries(this.state).forEach(([key, val]) =>
    //   prevState[key] !== val && console.log(`State '${key}' changed`)
    // );
  }
  render() {
    const {
      toggleFindTool,
      toggleHighlightAll,
      // highlightAll,
      updateSearchText,
      updateAmbiguousOrLiteral,
      updateDnaOrAA,
      updateMatchNumber,
      isInline,
      findTool = {}
    } = this.props;
    // Object.entries(this.props).forEach(([key, val]) =>
    // (this.prevProps && this.prevProps[key]) !== val && console.log(`Prop '${key}' changed`)
    // );
    // this.prevProps = this.props
    console.log('renderin')

    const {
      searchText,
      dnaOrAA,
      highlightAll,
      ambiguousOrLiteral,
      matchesTotal = 0,
      matchNumber = 0
    } = findTool;
    const findOptionsEls = [
      <HTMLSelect
        key="dnaoraa"
        options={opts}
        name="dnaOrAA"
        value={dnaOrAA}
        onChange={e => {
          updateDnaOrAA(e.target.value);
        }}
      />,
      <div style={{ display: "flex" }} key="ambiguousorliteral">
        <HTMLSelect
          name="ambiguousOrLiteral"
          options={[
            { label: "Literal", value: "LITERAL" },
            { label: "Ambiguous", value: "AMBIGUOUS" }
          ]}
          value={ambiguousOrLiteral}
          onChange={e => {
            updateAmbiguousOrLiteral(e.target.value);
          }}
        />
        <InfoHelper style={{ marginLeft: 10 }}>
          <div>
            Ambiguous substitutions:
            <div style={{ display: "flex", fontSize: 12 }}>
              <div style={{ marginRight: 20 }}>
                <div style={{ fontSize: 14, marginBottom: 4, marginTop: 5 }}>
                  DNA:
                </div>
                <div>M: AC</div>
                <div>R: AG</div>
                <div>W: AT</div>
                <div>S: CG</div>
                <div>Y: CT</div>
                <div>K: GT</div>
                <div>V: ACG</div>
                <div>H: ACT</div>
                <div>D: AGT</div>
                <div>B: CGT</div>
                <div>X: GATC</div>
                <div>N: GATC</div>
              </div>
              <div>
                <div style={{ fontSize: 14, marginBottom: 4, marginTop: 5 }}>
                  AA:
                </div>
                <div>B: ND</div>
                <div>J: IL</div>
                <div>X: ACDEFGHIKLMNPQRSTVWY</div>
                <div>Z: QE</div>
                <div>*: any</div>
              </div>
            </div>
          </div>
        </InfoHelper>
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
        <Button onClick={toggleFindTool} icon="cross" />
        <InputGroup
          autoFocus
          onKeyDown={e => {
            e.persist();
            if (e.metaKey && e.keyCode === 86) {
              console.log("e.keyCode:", e.keyCode);
              // e.preventDefault();
              // e.stopPropagation();
            } else if (e.metaKey && e.keyCode === 70) {
              //cmd-f
              toggleFindTool();
              e.preventDefault();
              e.stopPropagation();
            } else if (e.keyCode === 13) {
              //enter key!
              updateMatchNumber(
                matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
              );
            } else if (e.keyCode === 27) {
              //esc key!
              toggleFindTool();
            }
            // e.preventDefault();
            // e.stopPropagation();
          }}
          rightElement={
            <span>
              {isInline && (
                <Popover
                  position={Position.BOTTOM}
                  target={<Button minimal icon={"wrench"} />}
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
                minimal
                disabled={matchesTotal <= 0}
                onClick={() => {
                  updateMatchNumber(
                    matchesTotal <= 0 ? 0 : mod(matchNumber - 1, matchesTotal)
                  );
                }}
                icon="caret-up"
              />
              <Button
                minimal
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
}

export default withEditorProps(/* onlyUpdateForKeysDeep(["findTool"]) */(FindBar));

function mod(n, m) {
  return ((n % m) + m) % m;
}
