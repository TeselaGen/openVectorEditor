import React from "react";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import ToolbarItem from "./ToolbarItem";
import { compose, withHandlers } from "recompose";
import { importSequenceFromFile, connectToEditor } from "../withEditorProps";

export default compose(
  connectToEditor(),
  withHandlers({ importSequenceFromFile })
)(({ toolbarItemProps, importSequenceFromFile }) => {
  return (
    <ToolbarItem
      {...{
        Icon: <Icon data-test="veImportTool" icon="export" />,
        IconWrapper: Dropzone,
        IconWrapperProps: {
          multiple: false,
          style: {},
          onDrop: (files) => importSequenceFromFile(files[0])
        },
        tooltip: "Click or drag to import and view files (.fasta .gb .dna)",
        ...toolbarItemProps
      }}
    />
  );
});
