import React from "react";
import {
  Button,
  InputGroup,
  Switch,
  Popover,
  Position,
  HTMLSelect,
  TextArea,
  Tooltip
} from "@blueprintjs/core";
import withEditorProps from "../withEditorProps";
import onlyUpdateForKeysDeep from "../utils/onlyUpdateForKeysDeep";
import { MAX_MATCHES_DISPLAYED } from "../constants/findToolConstants";
import "./style.css";
import { InfoHelper } from "teselagen-react-components";
import { searchableTypes } from "../selectors/annotationSearchSelector";
import { getSingular } from "../utils/annotationTypes";
import { getFeatureToColorMap } from "ve-sequence-utils";
import { getReverseComplementSequenceString } from "ve-sequence-utils";
import isMobile from "is-mobile";

const opts = [
  { label: "DNA", value: "DNA" },
  { label: "Amino Acids", value: "AA" }
];
export class FindBar extends React.Component {
  componentDidMount() {
    this.possiblyNormalizeMatchNumber();
    if (this.inputEl) {
      this.inputEl.select();
    }
  }
  possiblyNormalizeMatchNumber = () => {
    const { findTool, updateMatchNumber } = this.props;
    if (
      findTool.matchNumber !== 0 &&
      findTool.matchNumber >= findTool.matchesTotal
    ) {
      updateMatchNumber(0);
    }
  };
  componentDidUpdate() {
    this.possiblyNormalizeMatchNumber();
  }
  render() {
    const {
      toggleFindTool,
      toggleHighlightAll,
      toggleIsInline,
      updateSearchText,
      annotationVisibilityShow,
      updateAmbiguousOrLiteral,
      updateDnaOrAA,
      updateMatchNumber: _updateMatchNumber,
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
      matchNumber = 0,
      isInline
    } = findTool;
    const updateMatchNumber = (...args) => {
      if (
        matchesTotal > 1 &&
        !(
          getReverseComplementSequenceString(searchText) === searchText &&
          matchesTotal === 2
        )
      ) {
        _updateMatchNumber(...args);
      } else {
        _updateMatchNumber(null);
        setTimeout(() => {
          _updateMatchNumber(...args);
        });
      }
    };
    const findOptionsEls = [
      <HTMLSelect
        key="dnaoraa"
        options={opts}
        name="dnaOrAA"
        value={dnaOrAA}
        onChange={(e) => {
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
          onChange={(e) => {
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
        <Tooltip
          disabled={matchesTotal <= MAX_MATCHES_DISPLAYED}
          content="Disabled because there are >{MAX_MATCHES_DISPLAYED} matches"
        >
          Highlight All
        </Tooltip>
      </Switch>,
      ...(isMobile()
        ? []
        : [
            <Switch
              key="isInline"
              checked={!isInline}
              onChange={toggleIsInline}
            >
              Expanded
            </Switch>
          ])
    ];
    const InputToUse = !isInline ? TextArea : InputGroup;
    const rightEl = (
      <span>
        {isInline && (
          <Popover
            autoFocus={false}
            enforceFocus={false}
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
          small
          disabled={matchesTotal <= 0}
          onClick={() => {
            updateMatchNumber(
              matchesTotal <= 0 ? 0 : mod(matchNumber - 1, matchesTotal)
            );
          }}
          icon="caret-up"
        />
        <Button
          data-test="veFindNextMatchButton"
          minimal
          small
          disabled={matchesTotal <= 0}
          onClick={() => {
            updateMatchNumber(
              matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
            );
          }}
          icon="caret-down"
        />
        {isInline && (
          <Button minimal small onClick={toggleFindTool} icon="small-cross" />
        )}
      </span>
    );

    return (
      <div
        style={
          isInline
            ? {
                display: "flex",
                minWidth: 300
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
        <Popover
          autoFocus={false}
          enforceFocus={false}
          target={
            <InputToUse
              autoFocus
              style={{
                resize: "vertical",
                ...(!isInline && { width: 350, minHeight: 70 })
              }}
              className="tg-find-tool-input"
              inputRef={(n) => {
                if (n) this.inputEl = n;
              }}
              onKeyDown={(e) => {
                e.persist();
                if (e.metaKey && e.keyCode === 70) {
                  //cmd-f
                  // toggleFindTool();
                  e.preventDefault();
                  e.stopPropagation();
                } else if (e.keyCode === 13) {
                  //enter key!
                  updateMatchNumber(
                    matchesTotal <= 0 ? 0 : mod(matchNumber + 1, matchesTotal)
                  );
                  e.stopPropagation();
                  e.preventDefault();
                } else if (e.keyCode === 27) {
                  //esc key!
                  toggleFindTool();
                }
              }}
              rightElement={rightEl}
              onChange={(e) => {
                return updateSearchText(e.target.value.replace(/\s/g, ""));
              }}
              value={searchText}
              leftIcon="search"
            />
          }
          position="bottom"
          minimal
          isOpen={
            annotationSearchMatches &&
            annotationSearchMatches.filter((m) => m.length).length
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

        {!isInline && (
          <div
            style={{
              display: "flex",
              maxWidth: "400px",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "stretch",
              height: "76px"
            }}
          >
            {rightEl}
            {findOptionsEls}
          </div>
        )}
        {!isInline && (
          <Button
            minimal
            style={{ position: "absolute", bottom: 0, right: -10 }}
            onClick={toggleFindTool}
            icon="cross"
          />
        )}
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
  const toReturn = (
    <div className="veAnnotationFindMatches">
      {searchableTypes.map((type, i) => {
        const annotationsFound = annotationSearchMatches[i];
        if (!annotationsFound) return null;
        return annotationsFound.length ? (
          <div key={i}>
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
                              ? "#ac68cc"
                              : ann.color ||
                                getFeatureToColorMap({ includeHidden: true })[
                                  ann.type
                                ],
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
