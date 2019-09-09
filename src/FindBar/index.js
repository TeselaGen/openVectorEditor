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
import { MAX_MATCHES_DISPLAYED } from "../constants/findToolConstants";
import "./style.css";
import { InfoHelper } from "teselagen-react-components";
import { searchableTypes } from "../selectors/annotationSearchSelector";
import { getSingular } from "../utils/annotationTypes";
import { featureColors } from "ve-sequence-utils";

const opts = [
  { label: "DNA", value: "DNA" },
  { label: "Amino Acids", value: "AA" }
];
export class FindBar extends React.Component {
  componentDidMount() {
    if (this.inputEl) {
      this.inputEl.select();
    }
  }
  render() {
    const {
      toggleFindTool,
      toggleHighlightAll,
      // highlightAll,
      updateSearchText,
      annotationVisibilityShow,
      updateAmbiguousOrLiteral,
      updateDnaOrAA,
      updateMatchNumber,
      isInline,
      selectionLayerUpdate,
      annotationSearchMatches,
      findTool = {}
    } = this.props;

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
                <div>*: any</div>
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
        checked={highlightAll}
        onChange={toggleHighlightAll}
        disabled={matchesTotal > MAX_MATCHES_DISPLAYED}
      >
        Highlight All{" "}
        {matchesTotal > MAX_MATCHES_DISPLAYED && (
          <div>
            (Disabled because there are >{MAX_MATCHES_DISPLAYED} matches)
          </div>
        )}
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
        className="veFindBar"
      >
        <Button onClick={toggleFindTool} icon="cross" />
        <Popover
          target={
            <InputGroup
              autoFocus
              inputRef={n => {
                if (n) this.inputEl = n;
              }}
              onKeyDown={e => {
                e.persist();
                if (e.metaKey && e.keyCode === 70) {
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
              }}
              rightElement={
                <span>
                  {isInline && (
                    <Popover
                      autoFocus={false}
                      position={Position.BOTTOM}
                      target={
                        <Button
                          data-test="veFindBarOptionsToggle"
                          minimal
                          icon="wrench"
                        />
                      }
                      content={
                        <div
                          className="ve-find-options-popover"
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
                    data-test="veFindPreviousMatchButton"
                    minimal
                    disabled={matchesTotal <= 0}
                    onClick={() => {
                      updateMatchNumber(
                        matchesTotal <= 0
                          ? 0
                          : mod(matchNumber - 1, matchesTotal)
                      );
                    }}
                    icon="caret-up"
                  />
                  <Button
                    data-test="veFindNextMatchButton"
                    minimal
                    disabled={matchesTotal <= 0}
                    onClick={() => {
                      updateMatchNumber(
                        matchesTotal <= 0
                          ? 0
                          : mod(matchNumber + 1, matchesTotal)
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
          }
          position="bottom"
          minimal
          isOpen={
            annotationSearchMatches &&
            annotationSearchMatches.filter(m => m.length).length
          }
          content={
            <AnnotationSearchMatchComp
              annotationVisibilityShow={annotationVisibilityShow}
              toggleFindTool={toggleFindTool}
              selectionLayerUpdate={selectionLayerUpdate}
              annotationSearchMatches={annotationSearchMatches}
            />
          }
        />

        {!isInline && findOptionsEls}
      </div>
    );
  }
}

const wrapped = onlyUpdateForKeysDeep(["findTool", "annotationSearchMatches"])(
  FindBar
);
export default withEditorProps(wrapped);

function mod(n, m) {
  return ((n % m) + m) % m;
}

function AnnotationSearchMatchComp({
  annotationSearchMatches,
  selectionLayerUpdate,
  annotationVisibilityShow,
  toggleFindTool
}) {
  let toReturn = (
    <div className="veAnnotationFindMatches">
      {searchableTypes.map((type, i) => {
        const annotationsFound = annotationSearchMatches[i];
        if (!annotationsFound) return null;
        return annotationsFound.length ? (
          <div>
            <div className="veAnnotationFoundType">
              {annotationsFound.length} {getSingular(type)} match
              {annotationsFound.length > 1 ? "es" : null}
              {annotationsFound.length <= 10 ? null : ` (only showing 10)`}:
            </div>
            <div>
              {annotationsFound.slice(0, 10).map((ann, i) => {
                return (
                  <div
                    onClick={() => {
                      annotationVisibilityShow(type);
                      selectionLayerUpdate(ann);
                      toggleFindTool();
                    }}
                    className="veAnnotationFoundResult"
                    key={i}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          background:
                            type === "parts"
                              ? "purple"
                              : ann.color || featureColors[ann.type],
                          height: 15,
                          width: 15,
                          marginRight: 3
                        }}
                      />
                      {ann.name}
                    </div>
                    <div className="veAnnotationFoundResultRange">
                      {ann.start + 1}-{ann.end + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
  return toReturn;
}
