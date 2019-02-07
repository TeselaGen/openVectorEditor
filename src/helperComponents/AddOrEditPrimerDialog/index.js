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

export class AddOrEditPrimerDialog extends React.Component {
  render() {
    const {
      // editorName,
      hideModal,
      sequenceLength = 100,
      handleSubmit,
      upsertPrimer
    } = this.props;
    return (
      <div
        className={classNames(
          Classes.DIALOG_BODY,
          "tg-min-width-dialog",
          "tg-upsert-Primer"
        )}
      >
        <InputField
          autoFocus
          inlineLabel
          validate={required}
          name="name"
          label="Name:"
        />
        <RadioGroupField
          defaultValue
          inlineLabel
          options={[
            { label: "Positive", value: "true" },
            { label: "Negative", value: "false" }
          ]}
          normalize={value => value === "true" || false}
          format={value => (value ? "true" : "false")}
          name="forward"
          label="Strand:"
        />

        <NumericInputField
          inlineLabel
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name="start"
          label="Start:"
        />
        <NumericInputField
          inlineLabel
          defaultValue={1}
          min={1}
          max={sequenceLength}
          name="end"
          label="End:"
        />
        <TextareaField
          inlineLabel
          tooltipError
          name="notes"
          label="Notes:"
          format={v => {
            let toReturn = v;
            if (typeof v !== "string" && v) {
              toReturn = "";
              Object.keys(v).forEach(key => {
                let stringVal;
                try {
                  stringVal = JSON.stringify(v[key]);
                } catch (e) {
                  stringVal = v[key];
                }
                toReturn += `- ${key}: ${stringVal} \n`;
              });
            }
            return toReturn;
          }}
          placeholder="Enter notes here.."
        />
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className="width100"
        >
          <Button
            style={{ marginRight: 15 }}
            onMouseDown={e => {
              //use onMouseDown to prevent issues with redux form errors popping in and stopping the dialog from closing
              e.preventDefault();
              e.stopPropagation();
              hideModal();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(data => {
              let updatedData;
              if (data.forward === true && data.strand !== 1) {
                updatedData = { ...data, strand: 1 };
              } else if (data.forward === false && data.strand !== -1) {
                updatedData = { ...data, strand: -1 };
              } else {
                updatedData = data;
              }
              upsertPrimer(convertRangeTo0Based(updatedData));
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
    width: 350
  }),
  withEditorProps,
  reduxForm({
    form: "AddOrEditPrimerDialog"
  })
)(AddOrEditPrimerDialog);
