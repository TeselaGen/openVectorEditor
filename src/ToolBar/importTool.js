import React from "react";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";

export default {
  updateKeys: ["updateSequenceData"],
  itemProps: ({ importSequenceFromFile }) => {
    return {
      Icon: <Icon icon="export" />,
      IconWrapper: Dropzone,
      IconWrapperProps: {
        multiple: false,
        style: {},
        onDrop: files => importSequenceFromFile(files[0])
      },
      // Icon: (
      //   <Dropzone

      //   >
      //     <Icon icon="" />
      //   </Dropzone>
      // ),
      tooltip: "Click or drag to import and view .fasta or .gb files"
    };
  }
};
