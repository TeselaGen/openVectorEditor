import React from "react";

import { reduxForm } from "redux-form";

import {
  InputField,
  NumericInputField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import { convertRangeTo0Based } from "ve-range-utils";
import classNames from "classnames";
import withEditorProps from "../../withEditorProps";

export class FindGuideDialog extends React.Component {

  findGuides = (data) => {
    const { updateGuides, sequenceData } = this.props;
    data.sequence = sequenceData.sequence
    fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(
      function(response){
      return response.json();
    })
    .then(function(guides){
      console.log(guides);
      guides ? 
      guides.map(guide => updateGuides(guide)) :
      window.toastr.error("No guides found")
    })
    .catch(function(e) {
      console.error(e)
    });
  }

  render() {
    const {
      // editorName,
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    return (
      <div className={classNames(Classes.DIALOG_BODY, "tg-min-width-dialog", "tg-upsert-Primer")}>
        <NumericInputField
          inlineLabel
          defaultValue={20}
          min={1}
          max={sequenceLength}
          name={"guideLength"}
          label={"Guide Length:"}
        />
        <InputField
          inlineLabel
          defaultValue={"NGG"}
          name={"pamSite"}
          label={"PAM site:"}
        />
        <InputField
          autoFocus
          inlineLabel
          name={"genome"}
          label={"Genome:"}
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
        <div
          style={{ display: "flex", justifyContent: "flex-end" }}
          className={"width100"}
        >
          <Button style={{ marginRight: 15 }} onMouseDown={e => {
              //use onMouseDown to prevent issues with redux form errors popping in and stopping the dialog from closing
              e.preventDefault(); 
              e.stopPropagation();
              hideModal();
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(data => {
              this.findGuides(data)
              // this.props.createGuideToolTab()
              // hideModal();
            })}
            intent={Intent.PRIMARY}
          >
            Search
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
    height: 380,
    width: 400
  }),
  withEditorProps,
  reduxForm({
    form: "FindGuideDialog"
  })
)(FindGuideDialog);
