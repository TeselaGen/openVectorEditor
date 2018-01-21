import React from "react";
import { InputField, SelectField } from "teselagen-react-components";
import { reduxForm } from "redux-form";

// import { map } from "lodash";
// import { Button, Intent } from "@blueprintjs/core";

class GeneralProperties extends React.Component {
  render() {
    const {
      readOnly,
      sequenceData: { name, sequence, circular },
      toggleReadOnlyMode,
      sequenceNameUpdate
    } = this.props;

    return (
      <div
        style={{
          maxWidth: 500,
          flexGrow: 1,
          alignSelf: "center",
          width: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
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
        <div className="ve-flex-row">
          <div className="ve-column-left">Circular/Linear:</div>{" "}
          <div className="ve-column-right">
            {" "}
            <SelectField
              disabled={readOnly}
              name="circular"
              enableReinitialize
              defaultValue={circular ? "circular" : "linear"}
              options={[
                { label: "Circular", value: "circular" },
                { label: "Linear", value: "linear" }
              ]}
            />
          </div>
        </div>
        <div className="ve-flex-row">
          <div className="ve-column-left">Length:</div>{" "}
          <div className="ve-column-right"> {sequence.length}</div>
        </div>
        <div className="ve-flex-row">
          <div className="ve-column-left">Is Editable:</div>{" "}
          <div className="ve-column-right">
            {" "}
            <SelectField
              enableReinitialize
              onFieldSubmit={toggleReadOnlyMode}
              name="editable"
              value={readOnly ? "readOnly" : "editable"}
              options={[
                { label: "Read Only", value: "readOnly" },
                { label: "Editable", value: "editable" }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: "GeneralProperties"
})(GeneralProperties);
