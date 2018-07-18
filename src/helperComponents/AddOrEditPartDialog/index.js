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
import { Button, Intent, Classes } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import classNames from "classnames";

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
      <div className={classNames(Classes.DIALOG_BODY, "tg-min-width-dialog", "tg-upsert-part")}>
        <InputField
          autoFocus
          inlineLabel
          validate={required}
          name={"name"}
          label={"Name:"}
        />
        <RadioGroupField
          inlineLabel
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          normalize={value => value === "true" || false}
          format={value => (value ? "true" : "false")}
          name={"forward"}
          label={"Strand:"}
          defaultValue={"true"}
        />

        <NumericInputField
          inlineLabel
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"start"}
          label={"Start:"}
        />
        <NumericInputField
          inlineLabel
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name={"end"}
          label={"End:"}
        />
        <TextareaField inlineLabel name={"notes"} label={"Notes:"} />
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className={"width100"}
        >
          <Button style={{ marginRight: 15 }} onClick={hideModal}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(data => {
              upsertPart(convertRangeTo0Based(data));

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
    height: 430,
    width: 400
  }),
  withEditorProps,
  reduxForm({
    form: "AddOrEditPartDialog"
  })
)(AddOrEditPartDialog);
