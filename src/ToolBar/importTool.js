import { anyToJson } from "bio-parsers";
import React from "react";
import { Icon, IconClasses } from "@blueprintjs/core";
import Dropzone from "react-dropzone";

export default ({ updateSequenceData }) => {
  return {
    Icon: (
      <Dropzone
        multiple={false}
        style={{}}
        onDrop={files => {
          const file = files[0];
          let reader = new FileReader();
          reader.readAsText(file, "UTF-8");
          reader.onload = function(evt: Object) {
            const content: string = evt.target.result;
            anyToJson(content, result => {
              updateSequenceData(result[0].parsedSequence);
            });
          };
          reader.onerror = function() {
            window.toastr.error("Failure reading file.");
          };
        }}
      >
        <Icon iconName={IconClasses.EXPORT} />
      </Dropzone>
    ),
    tooltip: "Click or drag to upload and view .fasta or .gb files"
  };
};
