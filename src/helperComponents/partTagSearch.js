import React from "react";
import withEditorProps from "../withEditorProps";
import {
  TgSelect,
  getKeyedTagsAndTagOptions
} from "teselagen-react-components";
import { flatMap } from "lodash";
import { uniqBy } from "lodash";

export const PartTagSearch = withEditorProps(PartToolDropdown);

function PartToolDropdown({
  sequenceData,
  updateSelectedPartTags,
  selectedPartTags,
  allPartTags,
  annotationVisibilityShow,
  editTagsLink
}) {
  if (!sequenceData) return <div>No Parts Present</div>;
  const keyedTags = getKeyedTagsAndTagOptions(allPartTags);

  const tags = uniqBy(
    flatMap(sequenceData.parts, ({ tags }) => {
      return flatMap(tags, (t) => {
        const tag = keyedTags[t];
        if (!tag) return [];
        return tag;
      });
    }),
    "value"
  );
  return (
    <div>
      <h6>Search Parts By Tag: </h6>
      <div style={{ display: "flex" }}>
        <TgSelect
          value={selectedPartTags.parts}
          onChange={(...args) => {
            annotationVisibilityShow("parts");
            updateSelectedPartTags(...args);
          }}
          isTagSelect
          multi
          popoverProps={{
            usePortal: false,
            modifiers: {
              preventOverflow: { enabled: false },
              hide: {
                enabled: false
              },
              flip: {
                boundariesElement: "viewport"
              }
            }
          }}
          options={tags}
          autoFocus
        ></TgSelect>
        {editTagsLink || null}
      </div>
    </div>
  );
}
