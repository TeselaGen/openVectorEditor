import React from "react";

import { reduxForm } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  SelectField,
  TextareaField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent } from "@blueprintjs/core";
import { connect } from "react-redux";
import { convertRangeTo0Based } from "ve-range-utils";

import featureTypes from "../../constants/feature-types";
import { actions } from "../../redux";
const { upsertFeature } = actions;

export class AddOrEditFeatureDialog extends React.Component {
  render() {
    const {
      editorName,
      hideModal,
      sequenceLength = 100,
      handleSubmit,
      upsertFeature
    } = this.props;
    return (
      <div style={{ padding: 20 }} className={"tg-upsert-feature"}>
        <InputField validate={required} name={"name"} label={"Name:"} />
        <RadioGroupField
          defaultValue
          options={[
            { label: "Positive", value: true },
            { label: "Negative", value: false }
          ]}
          name={"forward"}
          label={"Strand:"}
        />
        <SelectField
          defaultValue={"misc_feature"}
          options={featureTypes}
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
              upsertFeature(convertRangeTo0Based(data), { editorName });
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
  connect(null, { upsertFeature }),
  reduxForm({
    form: "AddOrEditFeatureDialog"
  })
)(AddOrEditFeatureDialog);
