import React from "react";

import { reduxForm } from "redux-form";

import {
  SelectField,
  NumericInputField,
  withDialog
} from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import withEditorProps from "../../withEditorProps";
import pamSites from "../../constants/pamSites";

export class FindGuideDialog extends React.Component {
  render() {
    const {
      // editorName,
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      updateGuides,
      findGuides,
      createGuideToolTab,
      partId
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    const partName = sequenceData.parts[partId].name;
    return (
      <div
        className={classNames(
          Classes.DIALOG_BODY,
          "tg-min-width-dialog",
          "tg-upsert-Primer"
        )}
      >
        <NumericInputField
          inlineLabel
          defaultValue={20}
          min={1}
          max={sequenceLength}
          name={"guideLength"}
          label={"Guide Length:"}
        />
        <SelectField
          inlineLabel
          defaultValue={"NGG"}
          name={"pamSite"}
          label={"PAM site"}
          options={pamSites}
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
            onClick={handleSubmit(async data => {
              const guides = await findGuides({
                data: [
                  {
                    sequence: sequenceData.sequence,
                    start: data.start - 1,
                    end: data.end - 1,
                    partId: partId
                  }
                ],
                options: {
                  guideLength: data.guideLength,
                  pamSite: data.pamSite,
                  // we set this so that off target score is not calculated for all gRNAs
                  // TODO: user should select gRNAs that they want the off-target score to be calculated for
                  mode: "single-gene"
                }
              });
              if (guides && guides.length) {
                createGuideToolTab();
                guides.forEach(function(g) {
                  g.target = partName;
                });
                updateGuides(guides);
              }
              hideModal();
            })}
            intent={Intent.PRIMARY}
            disabled={!findGuides}
          >
            Search
          </Button>
        </div>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.guideLength) {
    errors.guideLength = "Required";
  }
  if (!values.pamSite) {
    errors.pamSite = "Required";
  }
  return errors;
};

export default compose(
  withDialog({
    isDraggable: true,
    height: 360,
    width: 400
  }),
  withEditorProps,
  reduxForm({
    form: "FindGuideDialog",
    validate
  })
)(FindGuideDialog);
