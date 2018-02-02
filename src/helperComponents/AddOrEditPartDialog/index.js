import React from "react";

import { reduxForm } from "redux-form";

import {
  InputField,
  RadioGroupField,
  NumericInputField,
  TextareaField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";

import withEditorProps from "../../withEditorProps";

export class AddOrEditPartDialog extends React.Component {
  render() {
    const {
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      upsertPart
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    return (
      <div style={{ padding: 20 }} className={"tg-upsert-part"}>
        <InputField validate={required} name={"name"} label={"Name:"} />
        <RadioGroupField
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          name={"forward"}
          label={"Strand:"}
          defaultValue={"true"}
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
              upsertPart(
                convertRangeTo0Based({
                  ...data,
                  forward: data.forward !== "false"
                })
              );

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
    form: "AddOrEditPartDialog"
  })
)(AddOrEditPartDialog);
