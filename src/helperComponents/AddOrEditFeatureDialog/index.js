import React from "react";
import { getFeatureToColorMap, getFeatureTypes } from "ve-sequence-utils";

import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import { ReactSelectField } from "teselagen-react-components";

const renderTypes = ({ readOnly }) => (
  <ReactSelectField
    inlineLabel
    tooltipError
    disabled={readOnly}
    defaultValue="misc_feature"
    options={getFeatureTypes().map((type) => {
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
                background: getFeatureToColorMap({ includeHidden: true })[type],
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
    label="Type"
  />
);

export default AddOrEditAnnotationDialog({
  formName: "AddOrEditFeatureDialog",
  dialogProps: {
    // height: 500,
    width: 400
  },
  getProps: (props) => ({
    upsertAnnotation: props.upsertFeature,
    renderLocations: !props.sequenceData.isProtein,
    renderTypes: renderTypes({ readOnly: props.readOnly }),
    annotationTypePlural: "features"
  })
});
