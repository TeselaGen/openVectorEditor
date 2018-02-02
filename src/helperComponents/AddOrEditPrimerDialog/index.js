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
import { connect } from "react-redux";
import { convertRangeTo0Based } from "ve-range-utils";

import { actions } from "../../redux";
const { upsertPrimer } = actions;

export class AddOrEditPrimerDialog extends React.Component {
  render() {
    const {
      editorName,
      hideModal,
      sequenceLength = 100,
      handleSubmit,
      upsertPrimer
    } = this.props;
    return (
      <div style={{ padding: 20 }} className={"tg-upsert-Primer"}>
        <InputField validate={required} name={"name"} label={"Name:"} />
        <RadioGroupField
          defaultValue
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          name={"forward"}
          label={"Strand:"}
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
              upsertPrimer(
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
  connect(null, { upsertPrimer }),
  reduxForm({
    form: "AddOrEditPrimerDialog"
  })
)(AddOrEditPrimerDialog);
