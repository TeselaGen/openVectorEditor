import React from "react";

// import { NumericInputField } from "teselagen-react-components";
// import { Button } from "@blueprintjs/core";

import { featureColors, FeatureTypes as featureTypes } from "ve-sequence-utils";

import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import { ReactSelectField } from "teselagen-react-components";

const renderTypes = (
  <ReactSelectField
    inlineLabel
    tooltipError
    defaultValue="misc_feature"
    options={featureTypes.map(type => {
      return {
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: 10
            }}
          >
            <div
              style={{
                background: featureColors[type],
                height: 15,
                width: 15,
                marginRight: 5
              }}
            />
            {type}
          </div>
        ),
        value: type
      };
    })}
    name="type"
    label="Type:"
  />
);

export default AddOrEditAnnotationDialog({
  formName: "AddOrEditFeatureDialog",
  dialogProps: {
    height: 570,
    width: 400
  },
  getProps: props => ({
    upsertAnnotation: props.upsertFeature,
    renderLocations: true,
    renderTypes
  })
});
