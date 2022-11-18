import React from "react";
import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import {
  ReactSelectField,
  getTagsAndTagOptions,
  CheckboxField,
  InfoHelper
} from "teselagen-react-components";
import { getFeatureTypes } from "ve-sequence-utils";
import { get } from "lodash";

const renderTypes = ({ readOnly }) => (
  <ReactSelectField
    inlineLabel
    tooltipError
    disabled={readOnly}
    defaultValue="misc_feature"
    options={getFeatureTypes().map((type) => {
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
        //         // background: getFeatureToColorMap()[type], add back in if we want colors. import from vesequtils
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
    label="Type"
  />
);
const renderAdvancedOptions = ({ readOnly }) => (
  <CheckboxField
    inlineLabel
    tooltipError
    disabled={readOnly}
    name="overlapsSelf"
    label={
      <div style={{ display: "flex", alignItems: "center" }}>
        Part Overlaps Self
        <InfoHelper
          style={{ paddingLeft: 10, paddingTop: 9 }}
          isInline
          content="If checked, this part will span the entire sequence and wrap back around on itself. (Useful for USER cloning and other instances where the part needs to span the entire sequence and then some)"
        ></InfoHelper>
      </div>
    }
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
      label="Tags"
    />
  );
};
export default AddOrEditAnnotationDialog({
  formName: "AddOrEditPartDialog",
  dialogProps: {
    width: 450
  },
  getProps: (props) => ({
    upsertAnnotation: props.upsertPart,
    advancedDefaultOpen: get(props, "initialValues.overlapsSelf"),
    advancedOptions: props.allowPartsToOverlapSelf
      ? renderAdvancedOptions({ readOnly: props.readOnly })
      : undefined,
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
