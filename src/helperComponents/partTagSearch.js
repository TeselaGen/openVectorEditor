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
  ed,
  allPartTags,
  annotationVisibilityShow,
  editTagsLink,
  dontAutoOpen
}) {
  if (!ed.sequenceLength || !ed.parts.length) return <div>No Parts Present</div>;
  const keyedTags = getKeyedTagsAndTagOptions(allPartTags);

  // this is what keyedTags looks like:
  // keyedTags = {
  //   '12:4': {label,value,id},
  //   '12:1': {label,value,id},
  //   '44': {label,value,id},
  // }

  const tags = uniqBy(
    flatMap(ed.parts, ({ tags }) => {
      return flatMap(tags, (t) => {
        const tag = keyedTags[t];
        if (!tag) return [];
        return tag;
      });
    }),
    "value"
  );
  return (
    <div style={{ width: "100%" }}>
      <div>Search Parts By Tag: </div>
      <div style={{ display: "flex" }}>
        <TgSelect
          value={ed.selectedPartTags}
          onChange={(...args) => {
            annotationVisibilityShow("parts");
            ed.updateSelectedPartTags(...args);
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
          autoOpen={!dontAutoOpen}
        ></TgSelect>
        {editTagsLink || null}
      </div>
    </div>
  );
}
