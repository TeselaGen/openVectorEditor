import React from "react";

import { reduxForm } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  ReactSelectField,
  TextareaField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import {
  featureColors,
  FeatureTypes as featureTypes,
  tidyUpAnnotation
} from "ve-sequence-utils";
import classNames from "classnames";

import withEditorProps from "../../withEditorProps";

export class AddOrEditFeatureDialog extends React.Component {
  render() {
    const {
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      upsertFeature
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    return (
      <div className={classNames(Classes.DIALOG_BODY, "tg-upsert-feature")}>
        <InputField
          inlineLabel
          tooltipError
          autoFocus
          placeholder="Untitled Sequence"
          validate={required}
          name={"name"}
          label={"Name:"}
        />
        <RadioGroupField
          inlineLabel
          tooltipError
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          normalize={value => value === "true" || false}
          format={value => (value ? "true" : "false")}
          name={"forward"}
          label={"Strand:"}
          defaultValue={true}
        />
        <ReactSelectField
          inlineLabel
          tooltipError
          defaultValue={"misc_feature"}
          options={featureTypes.map(type => {
            return {
              label: (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 10
                  }}
                >
                  <div
                    style={{
                      background: featureColors[type],
                      height: 15,
                      width: 15,
                      marginRight: 5
                    }}
                  />
                  {type}
                </div>
              ),
              value: type
            };
          })}
          name={"type"}
          label={"Type:"}
        />
        <NumericInputField
          inlineLabel
          tooltipError
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"start"}
          label={"Start:"}
        />
        <NumericInputField
          inlineLabel
          tooltipError
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"end"}
          label={"End:"}
        />
        <TextareaField
          inlineLabel
          tooltipError
          name={"notes"}
          label={"Notes:"}
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className={"width100"}
        >
          <Button style={{ marginRight: 15 }} onClick={hideModal}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(data => {
              const newFeat = tidyUpAnnotation(
                convertRangeTo0Based({
                  ...data
                }),
                {
                  sequenceData,
                  annotationType: "features"
                }
              );
              upsertFeature(newFeat);
              hideModal();
            })}
            intent={Intent.PRIMARY}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

function required(val) {
  if (!val) return "Required";
}

export default compose(
  withDialog({
    isDraggable: true,
    height: 440,
    width: 400
  }),
  withEditorProps,
  reduxForm({
    form: "AddOrEditFeatureDialog"
  })
)(AddOrEditFeatureDialog);
