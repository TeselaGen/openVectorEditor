import React from "react";
import uuid from "shortid";

import { reduxForm } from "redux-form";

import {
  InputField,
  ReactSelectField,
  wrapDialog,
  InfoHelper
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import { flatMap } from "lodash";
import classNames from "classnames";
import withEditorProps from "../../withEditorProps";
import { CheckboxField } from "teselagen-react-components";
import "./style.css";
import tgFormValues from "../../utils/tgFormValues";

class MergeFeaturesDialog extends React.Component {
  render() {
    const {
      // editorName,
      hideModal,
      handleSubmit,
      selectedAnnotations,
      sequenceData,
      selectionLayerUpdate,
      id1,
      upsertFeature,
      deleteFeature,
      id2,
      change
    } = this.props;
    const { features } = sequenceData;
    const feat1 = features[id1];
    const feat2 = features[id2];
    const [id1default, id2default] = flatMap(
      selectedAnnotations.idStack,
      (id) => {
        const ann = selectedAnnotations.idMap[id];
        if (ann.annotationTypePlural === "features") {
          return id;
        }
        return [];
      }
    );
    return (
      <form
        onSubmit={handleSubmit(
          ({ id1, id2, name, preserveFeatures, start, end }) => {
            if (!preserveFeatures) {
              deleteFeature([id1, id2], {
                batchUndoStart: true
              });
            }
            upsertFeature(
              {
                ...feat1,
                id: uuid(),
                start: start - 1,
                end: end - 1,
                name
              },
              {
                batchUndoEnd: true
              }
            );
            selectionLayerUpdate({
              start: start - 1,
              end: end - 1
            });
            hideModal();
          }
        )}
        className={classNames(
          Classes.DIALOG_BODY,
          "tg-min-width-dialog",
          "veMergeFeaturesDialog"
        )}
      >
        <InfoHelper displayToSide>
          <span style={{ fontStyle: "italic", fontSize: 11, marginTop: -8 }}>
            Choose features in the dropdown or shift click directly on the
            plasmid map
          </span>
        </InfoHelper>
        <br />
        <ReactSelectField
          inlineLabel
          required
          defaultValue={id1default}
          enableReinitialize
          name="id1"
          label={
            <div style={{ display: "flex", width: "100%", alignItems: "top" }}>
              <InfoHelper
                {...{
                  popoverProps: {
                    position: "top"
                  }
                }}
                onClick={() => {
                  feat1 && change("name", feat1.name);
                }}
                disabled={!feat1}
                icon="small-plus"
                isButton
              >
                Use Name
              </InfoHelper>
              <div style={{ padding: "10px 0px 0px 10px", minWidth: 80 }}>
                Feature 1:
              </div>
            </div>
          }
          options={flatMap(features, (feat) => {
            if (feat.id === (feat2 && feat2.id)) return []; //filter out other feature as an option
            return {
              value: feat.id,
              label: feat.name
            };
          })}
        />
        <div
          style={{
            marginTop: -8,
            marginBottom: 10,
            display: "flex",
            justifyContent: "center",
            width: " 100%"
          }}
        >
          <Button
            onClick={() => {
              const id1Holder = id1;
              change("id1", id2);
              change("id2", id1Holder);
            }}
            icon="swap-vertical"
          >
            {" "}
            Swap{" "}
          </Button>{" "}
          &nbsp;{" "}
        </div>
        <ReactSelectField
          inlineLabel
          required
          defaultValue={id2default}
          enableReinitialize
          name="id2"
          label={
            <div style={{ display: "flex", width: "100%", alignItems: "top" }}>
              <InfoHelper
                onClick={() => {
                  feat2 && change("name", feat2.name);
                }}
                disabled={!feat2}
                icon="small-plus"
                isButton
              >
                Use Name
              </InfoHelper>
              <div style={{ padding: "10px 0px 0px 10px", minWidth: 80 }}>
                Feature 2:
              </div>
            </div>
          }
          options={flatMap(features, (feat) => {
            if (feat.id === (feat1 && feat1.id)) return []; //filter out other feature as an option
            return {
              value: feat.id,
              label: feat.name
            };
          })}
        />
        <InputField
          autoFocus
          inlineLabel
          enableReinitialize
          defaultValue={feat1 && feat1.name}
          validate={required}
          name="name"
          label="New Name:"
        />
        <div style={{ display: "flex" }}>
          <InputField
            inlineLabel
            disabled
            enableReinitialize
            defaultValue={!feat1 ? "" : feat1.start + 1}
            validate={required}
            name="start"
            label="New Start:"
          />
          &nbsp; &nbsp; &nbsp;
          <InputField
            inlineLabel
            disabled
            enableReinitialize
            defaultValue={!feat2 ? "" : feat2.end + 1}
            validate={required}
            name="end"
            label="New End:"
          />
        </div>
        <CheckboxField
          name="preserveFeatures"
          defaultValue={false}
          label="Preserve features (by default they will be removed once merged)"
        />

        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className="width100"
        >
          <Button type="submit" intent={Intent.PRIMARY}>
            Create Merged Feature
          </Button>
        </div>
      </form>
    );
  }
}

function required(val) {
  if (!val) return "Required";
}

export default compose(
  wrapDialog({
    title: "Merge Features",
    isDraggable: true,
    width: 400
  }),
  withEditorProps,
  reduxForm({
    form: "MergeFeaturesDialog",
    validate: ({ id1, id2 }) => {
      const errors = {};
      if (!id1 || Array.isArray(id1)) {
        errors.id1 = "Please select a feature";
      }
      if (!id2 || Array.isArray(id2)) {
        errors.id2 = "Please select a feature";
      }
      return errors;
    }
  }),
  tgFormValues("id1", "id2")
)(MergeFeaturesDialog);
