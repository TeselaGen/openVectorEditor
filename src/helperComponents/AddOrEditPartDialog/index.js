import React from "react";
import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import { ReactSelectField } from "teselagen-react-components";
import { FeatureTypes as featureTypes } from "ve-sequence-utils";

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
                // background: featureColors[type], add back in if we want colors. import from vesequtils
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
  formName: "AddOrEditPartDialog",
  getProps: props => ({
    upsertAnnotation: props.upsertPart,
    renderTypes,
    annotationTypePlural: "parts"
  })
});
