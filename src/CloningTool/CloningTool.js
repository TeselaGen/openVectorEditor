import { compose, withProps } from "recompose";
import React from "react";

import withEditorInteractions from "../withEditorInteractions";
import {
  InputField,
  TextareaField,
  tgFormValues
} from "teselagen-react-components";
import { reduxForm } from "redux-form";
import { Button, Icon, Tab, Tabs, Tag, Tooltip } from "@blueprintjs/core";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
import simpleSequenceData from "../../demo/src/exampleData/simpleSequenceData";

import "./style.css";
import { removeItem } from "../utils/arrayUtils";
import EnzymeViewer from "../EnzymeViewer";

function CloningTool(props) {
  const {
    // sequenceData,
    dimensions: { height },
    change,
    handleSubmit,
    sequencesToDigest = [],
    bps,
    name,
    // editorName,
    isAdding
  } = props;

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
        2. Select Compatible Overhangs{" "}
      </div>
      <div className="cloningTool-step-explainer">
        {/* Cutsite -- Enzymes that cut here -- */}
        {/* (Enzyme(#Backbone sites, #Insert sites)) */}
      </div>

      {sequencesToDigest.length > 1 &&
        [1, 2, 3].map((n, index) => {
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
              <div style={{ marginRight: 10 }}>
                <Tag intent="primary">BamHI</Tag>
              </div>
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
          props.sequenceData,
          simpleSequenceData
        ]
      }
    };
  }),
  reduxForm({ form: "CloningTool" }),
  tgFormValues("name", "bps", "sequencesToDigest", "isAdding")
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
