import React from "react";
import {
  InputField,
  BPSelect,
  TextareaField
} from "teselagen-react-components";
import { reduxForm } from "redux-form";
import { connectToEditor, updateCircular } from "../../withEditorProps";
import { compose, withHandlers } from "recompose";

// import { map } from "lodash";
// import { Button, Intent } from "@blueprintjs/core";

class GeneralProperties extends React.Component {
  updateSeqDesc = val => {
    return this.props.sequenceDescriptionUpdate(val);
  };
  render() {
    const {
      readOnly,
      showReadOnly = true,
      updateCircular,
      isProtein,
      disableSetReadOnly,
      updateAvailability,
      name,
      sequence,
      circular,
      materiallyAvailable,
      updateReadOnlyMode,
      onSave,
      description,
      showAvailability,
      sequenceNameUpdate
    } = this.props;
    return (
      <React.Fragment>
        <div className="ve-flex-row">
          <div className="ve-column-left">Name:</div>{" "}
          <div className="ve-column-right">
            <InputField
              disabled={readOnly}
              onFieldSubmit={val => {
                sequenceNameUpdate(val);
              }}
              name="name"
              enableReinitialize
              defaultValue={name}
            />{" "}
          </div>
        </div>
        {!isProtein && (
          <div className="ve-flex-row">
            <div className="ve-column-left">Circular/Linear:</div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={readOnly}
                onChange={val => {
                  updateCircular(val === "circular");
                }}
                value={circular ? "circular" : "linear"}
                options={[
                  { label: "Circular", value: "circular" },
                  { label: "Linear", value: "linear" }
                ]}
              />
            </div>
          </div>
        )}

        {showAvailability && (
          <div className="ve-flex-row">
            <div className="ve-column-left">Material Availability:</div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={readOnly}
                onChange={val => {
                  updateAvailability(val === "available");
                }}
                value={materiallyAvailable ? "available" : "unavailable"}
                options={[
                  { label: "Available", value: "available" },
                  { label: "Unavailable", value: "unavailable" }
                ]}
              />
            </div>
          </div>
        )}
        <div className="ve-flex-row">
          <div className="ve-column-left">Length:</div>{" "}
          <div className="ve-column-right"> {sequence.length}</div>
        </div>
        {showReadOnly && (
          <div className="ve-flex-row">
            <div className="ve-column-left">Is Editable:</div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={!onSave || disableSetReadOnly}
                onChange={val => {
                  updateReadOnlyMode(val === "readOnly");
                }}
                value={readOnly ? "readOnly" : "editable"}
                options={[
                  { label: "Read Only", value: "readOnly" },
                  { label: "Editable", value: "editable" }
                ]}
              />
            </div>
          </div>
        )}
        <div>Description:</div>
        <TextareaField
          clickToEdit
          name="description"
          onFieldSubmit={this.updateSeqDesc}
          defaultValue={description}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  connectToEditor(
    ({
      readOnly,
      sequenceData: {
        description,
        name,
        sequence,
        circular,
        materiallyAvailable
      } = {}
    }) => {
      return {
        readOnly,
        name,
        description,
        sequence,
        circular,
        materiallyAvailable
      };
    }
  ),
  withHandlers({ updateCircular }),
  reduxForm({
    form: "GeneralProperties"
  })
)(GeneralProperties);
