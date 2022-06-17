import React from "react";
import {
  InputField,
  BPSelect,
  TextareaField
} from "teselagen-react-components";
import { reduxForm } from "redux-form";
import withEditorProps from "../../withEditorProps";
import { compose } from "recompose";

class GeneralProperties extends React.Component {
  updateSeqDesc = (val) => {
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
      sequenceData,
      updateReadOnlyMode,
      onSave,
      showAvailability,
      sequenceNameUpdate
    } = this.props;
    const {
      description,
      name,
      isOligo,
      isRna,
      sequence = "",
      proteinSequence = "",
      circular,
      materiallyAvailable
    } = sequenceData || {};
    return (
      <React.Fragment>
        <div className="ve-flex-row">
          <div className="ve-column-left bp3-label">Name</div>{" "}
          <div className="ve-column-right">
            <InputField
              disabled={readOnly}
              onFieldSubmit={(val) => {
                sequenceNameUpdate(val);
              }}
              name="name"
              enableReinitialize
              defaultValue={name}
            />{" "}
          </div>
        </div>
        {!isProtein && !isOligo && !isRna && (
          <div className="ve-flex-row circularLinearSelect">
            <div className="ve-column-left bp3-label">Circular/Linear</div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={readOnly}
                onChange={(val) => {
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
            <div className="ve-column-left bp3-label">
              Material Availability
            </div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={readOnly}
                onChange={(val) => {
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
          <div className="ve-column-left bp3-label">Length</div>{" "}
          <div className="ve-column-right">
            {" "}
            {isProtein ? proteinSequence.length : sequence.length}
          </div>
        </div>
        {showReadOnly && (
          <div className="ve-flex-row">
            <div className="ve-column-left bp3-label">Is Editable</div>{" "}
            <div className="ve-column-right">
              {" "}
              <BPSelect
                disabled={!onSave || disableSetReadOnly}
                onChange={(val) => {
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
        <div>Description</div>
        <TextareaField
          clickToEdit
          name="description"
          onFieldSubmit={this.updateSeqDesc}
          defaultValue={description}
          disabled={readOnly}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withEditorProps,
  reduxForm({
    form: "GeneralProperties"
  })
)(GeneralProperties);
