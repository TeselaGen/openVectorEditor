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
import { Button, Intent } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import { featureColors, FeatureTypes as featureTypes } from "ve-sequence-utils";

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
      <div style={{ padding: 20 }} className={"tg-upsert-feature"}>
        <InputField
          autoFocus
          placeholder="Untitled Sequence"
          validate={required}
          name={"name"}
          label={"Name:"}
        />
        <RadioGroupField
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
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"start"}
          label={"Start:"}
        />
        <NumericInputField
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"end"}
          label={"End:"}
        />
        <TextareaField name={"notes"} label={"Notes:"} />
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className={"width100"}
        >
          <Button
            onClick={handleSubmit(data => {
              upsertFeature(convertRangeTo0Based(data));
              hideModal();
            })}
            intent={Intent.PRIMARY}
          >
            Submit
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
  withDialog(),
  withEditorProps,
  reduxForm({
    form: "AddOrEditFeatureDialog"
  })
)(AddOrEditFeatureDialog);
