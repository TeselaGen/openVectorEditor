import { compose, withProps } from "recompose";
import React from "react";

import withEditorInteractions from "../withEditorInteractions";
import {
  InputField,
  TextareaField,
  tgFormValues,
  TgSelect
} from "teselagen-react-components";
import { reduxForm } from "redux-form";
import { Button, Icon, Tab, Tabs, Tag, Tooltip } from "@blueprintjs/core";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
// import simpleSequenceData from "../../demo/src/exampleData/simpleSequenceData";

import "./style.css";
import { removeItem } from "../utils/arrayUtils";
import EnzymeViewer from "../EnzymeViewer";
import { withRestrictionEnzymes } from "../CutsiteFilter/withRestrictionEnzymes";
import { forEach, map /* flatMap */ } from "lodash";
import { getCutsitesFromSequence } from "ve-sequence-utils";
// import { computeDigestFragments } from "../DigestTool/computeDigestFragments";

function CloningTool(props) {
  const {
    // sequenceData,
    dimensions: { height },
    change,
    handleSubmit,
    sequencesToDigest = [],
    bps,
    name,
    selectedOverhangs = {},
    selectedEnzymes = {},
    // allCutsites: { cutsitesByName },
    allRestrictionEnzymes,
    // editorName,

    isAdding
  } = props;

  const cutsitesPerSeq = [];
  const overhangMatchCounter = {};

  if (sequencesToDigest.length > 1) {
    sequencesToDigest.forEach((s, i) => {
      const h = {};
      h.seq = s;
      const cutsitesByName = getCutsitesFromSequence(
        s.sequence,
        s.circular,
        map(allRestrictionEnzymes)
      );
      h.overhangsToEnzymes = {};
      h.overhangsToCutsites = {};
      if (cutsitesByName) {
        // const cutsites = flatMap(cutsitesByName, (c) => {
        //   if (c.length > 2) return [];
        //   return c;
        // });
        // const { fragments } = computeDigestFragments({
        //   cutsites,
        //   sequenceLength: s.sequence.length
        // });
      }

      map(cutsitesByName, (cutsites) => {
        if (cutsites.length < 3) {
          const [{ overhangBps }] = cutsites;
          if (!overhangBps) return;
          overhangMatchCounter[overhangBps] =
            overhangMatchCounter[overhangBps] || [];
          const val =
            overhangMatchCounter[overhangBps][
              overhangMatchCounter[overhangBps].length - 1
            ];
          if (val !== i) overhangMatchCounter[overhangBps].push(i);
          h.overhangsToCutsites[overhangBps] = [
            ...(h.overhangsToCutsites[overhangBps] || []),
            ...cutsites
          ];
          h.overhangsToEnzymes[overhangBps] = [
            ...(h.overhangsToEnzymes[overhangBps] || []),
            cutsites[0].restrictionEnzyme
          ];
        }
      });
      cutsitesPerSeq.push(h);
    });
    forEach(overhangMatchCounter, (matchArr, overhangBps) => {
      if (matchArr.length < 2) {
        cutsitesPerSeq.forEach(({ overhangsToEnzymes }) => {
          delete overhangsToEnzymes[overhangBps];
        });
        delete overhangMatchCounter[overhangBps];
      }
    });
  }
  // const overhangsToEnzymes = {};
  return (
    <div
      className="cloningTool"
      style={{ padding: 15, overflowY: "auto", height }}
    >
      <h2>Digest Cloning Tool</h2>
      <div className="cloningTool-step-header">1. Select Sequences</div>
      <div className="cloningTool-step-explainer">
        (The Insert will be constructed by performing a restriction digest on
        the sequence selected/entered)
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sequencesToDigest.map((seqData, i) => {
          return (
            <div
              style={{
                marginRight: 10,
                padding: 5,
                border: "1px solid lightgray",
                borderRadius: 8
              }}
              key={i}
            >
              <SimpleCircularOrLinearView
                withChoosePreviewType
                annotationLabelVisibility={{
                  features: false,
                  parts: false,
                  cutsites: false,
                  primers: false
                }}
                additionalTopLeftEl={
                  <div
                    style={{
                      fontSize: 16,
                      marginTop: 5,
                      marginLeft: 10,
                      textAlign: "center"
                    }}
                  >
                    {`Sequence ${i + 1}`}{" "}
                  </div>
                }
                additionalTopEl={
                  <RemoveBtn
                    onClick={() => {
                      change(
                        "sequencesToDigest",
                        removeItem(sequencesToDigest, i)
                      );
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    {" "}
                  </RemoveBtn>
                }
                sequenceData={seqData}
              ></SimpleCircularOrLinearView>
              {/* <div className={"cloningTool-step-header"}>
              1 Insert Sequence Selected:
            </div>
            <div className={"cloningTool-addedSeq"}>
              <div style={{ marginLeft: 15 }}>
                {name}{" "}
                <span style={{ fontSize: 11, marginLeft: 10 }}>
                  ({sequence.length} bps)
                </span>
              </div>{" "}
            </div> */}
            </div>
          );
        })}
        {/* <div style={{height: 300, width: 300}}></div> */}
        {!isAdding && (
          <Button
            onClick={() => {
              change("isAdding", true);
            }}
            style={{ height: 300, width: 300, marginTop: 30 }}
            minimal
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 17 }}>Add Sequence</div>
              <Icon icon="plus" size={80}></Icon>
            </div>
          </Button>
        )}

        {isAdding && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginLeft: "auto" }}>
              <RemoveBtn onClick={() => change("isAdding", false)}></RemoveBtn>
            </div>
            <div
              className="cloningTool-step-explainer"
              style={{ fontWeight: "bold" }}
            >
              {" "}
              Add Insert{" "}
            </div>
            <Tabs selectedTabId="clipboard">
              <Tab id="library" title="From My Library"></Tab>
              <Tab
                id="clipboard"
                title="From Clipboard"
                panel={
                  <div>
                    <div>
                      <InputField
                        isRequired
                        label="Enter Sequence Name"
                        name="name"
                      ></InputField>
                      <TextareaField
                        isRequired
                        label="Enter Sequence In Plain Text Format"
                        name="bps"
                      ></TextareaField>
                      <Button
                        disabled={!bps || !name}
                        onClick={handleSubmit(() => {
                          change("sequencesToDigest", [
                            ...sequencesToDigest,
                            { name, sequence: bps }
                          ]);
                        })}
                      >
                        Add Sequence
                      </Button>
                    </div>
                  </div>
                }
              ></Tab>
            </Tabs>
          </div>
        )}
      </div>

      <br></br>
      <div className="cloningTool-step-header">
        2. Select Compatible Overhangs + Enzymes{" "}
      </div>
      <div className="cloningTool-step-explainer">
        {/* Cutsite -- Enzymes that cut here -- */}
        {/* (Enzyme(#Backbone sites, #Insert sites)) */}
      </div>
      <div style={{ maxWidth: 250, marginBottom: 10 }}>
        <TgSelect
          className="tg-ladder-selector"
          // value={selectedLadder}
          multi
          placeholder="Filter by Enzyme"
          // onChange={(val) => {}}
          options={["BsmbI"]}
        ></TgSelect>
      </div>

      <div style={{ maxHeight: 500, maxWidth: 600, overflowY: "auto" }}>
        {sequencesToDigest.length > 1 &&
          map(overhangMatchCounter, (indices, overhang, index) => {
            const isSelected = selectedOverhangs[overhang];
            const enzymesThatAreUniqueToOverhang = {};
            const enzymeCuts = indices.map((i, j) => {
              const { seq, overhangsToEnzymes } = cutsitesPerSeq[i];
              return (
                <div style={{ margin: 10 }} key={j}>
                  <div>{seq.name}</div>

                  {map(overhangsToEnzymes[overhang], ({ name }, i) => {
                    // isSelected
                    const isEnzymeSelected = selectedEnzymes[name];
                    if (map(overhangsToEnzymes[overhang]).length === 1) {
                      enzymesThatAreUniqueToOverhang[name] = true;
                    }
                    return (
                      <Tag
                        key={i}
                        intent={isEnzymeSelected ? "success" : "primary"}
                      >
                        {name} {isEnzymeSelected && <Icon icon="tick"></Icon>}
                      </Tag>
                    );
                  })}
                </div>
              );
            });
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: 5,
                  border: "1px solid lightgray",
                  borderRadius: 8,
                  marginBottom: 5
                }}
              >
                <Button
                  onClick={() => {
                    change("selectedOverhangs", {
                      ...selectedOverhangs,
                      [overhang]: !selectedOverhangs[overhang]
                    });
                    forEach(enzymesThatAreUniqueToOverhang, (a, name) => {
                      change("selectedEnzymes", {
                        ...selectedEnzymes,
                        [name]: !selectedOverhangs[overhang]
                      });
                    });
                  }}
                  style={{ height: 50, width: 50, marginTop: 30 }}
                  minimal
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    {/* <div style={{ fontSize: 17 }}>Add Sequence</div> */}
                    <Icon
                      color={isSelected ? "lightgreen" : undefined}
                      icon="tick"
                      size={40}
                    ></Icon>
                  </div>
                </Button>

                <div style={{ margin: 10 }}>{overhang}</div>
                <div style={{ marginRight: 10 }}>{enzymeCuts}</div>

                <EnzymeViewer
                  {...{
                    // startOffset: 500,
                    sequence: "agtgagcca",
                    reverseSnipPosition: 4,
                    forwardSnipPosition: 10,
                    paddingEnd: "tggacaa",
                    paddingStart: "gcgggc",
                    annotationVisibility: { axis: true },
                    tickSpacing: 5
                  }}
                />
              </div>
            );
          })}
      </div>

      <div className="cloningTool-step-header">3. Digestion Products:</div>
      <div className="cloningTool-step-explainer">
        (The Digest Reaction will result in the following sequences)
      </div>
    </div>
  );
}

export default compose(
  withEditorInteractions,
  withProps((props) => {
    return {
      initialValues: {
        sequencesToDigest: props.initialValues?.sequencesToDigest || [
          {
            sequence:
              "ggggggggggggggggggggggatccgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggatccggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
            circular: false
          },
          {
            sequence:
              "ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggatccggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggatccggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
            circular: false
          }
          // props.sequenceData,
          // // props.sequenceData,
          // simpleSequenceData
        ]
      }
    };
  }),
  withRestrictionEnzymes,
  reduxForm({ form: "CloningTool" }),
  tgFormValues(
    "name",
    "bps",
    "sequencesToDigest",
    "isAdding",
    "selectedOverhangs",
    "selectedEnzymes"
  )
)(CloningTool);

const RemoveBtn = ({ onClick }) => (
  <Tooltip content="Remove">
    <Button
      style={{ marginLeft: 10 }}
      minimal
      onClick={onClick}
      intent="danger"
      icon="trash"
    ></Button>
  </Tooltip>
);
