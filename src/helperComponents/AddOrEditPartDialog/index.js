import React from "react";
import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import {
  ReactSelectField,
  getTagsAndTagOptions
} from "teselagen-react-components";
import { FeatureTypes as featureTypes } from "ve-sequence-utils";

const renderTypes = ({ readOnly }) => (
  <ReactSelectField
    inlineLabel
    tooltipError
    disabled={readOnly}
    defaultValue="misc_feature"
    options={featureTypes.map((type) => {
      return {
        label: type,
        // label: (
        //   <div
        //     style={{
        //       display: "flex",
        //       alignItems: "center",
        //       marginRight: 10
        //     }}
        //   >
        //     <div
        //       style={{
        //         // background: featureColors[type], add back in if we want colors. import from vesequtils
        //         height: 15,
        //         width: 15,
        //         marginRight: 5
        //       }}
        //     />
        //     {type}
        //   </div>
        // ),
        value: type
      };
    })}
    name="type"
    label="Type:"
  />
);
const getRenderTags = ({ readOnly, editTagsLink, tags }) => {
  return (
    <ReactSelectField
      disabled={readOnly}
      inlineLabel
      rightEl={editTagsLink}
      isTagSelect
      multi
      tooltipError
      options={tags}
      name="tags"
      label="Tags:"
    />
  );
};
export default AddOrEditAnnotationDialog({
  formName: "AddOrEditPartDialog",
  dialogProps: {
    height: 550,
    width: 450
  },
  getProps: (props) => ({
    upsertAnnotation: props.upsertPart,
    renderTypes: renderTypes({ readOnly: props.readOnly }),
    renderTags:
      props.allPartTags &&
      getRenderTags({
        readOnly: props.readOnly,
        editTagsLink: props.editTagsLink,
        tags: getTagsAndTagOptions(props.allPartTags)
      }),
    annotationTypePlural: "parts"
  })
});
