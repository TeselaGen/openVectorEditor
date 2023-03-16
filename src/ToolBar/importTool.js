import React from "react";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import ToolbarItem from "./ToolbarItem";
import { compose, withHandlers } from "recompose";
import { importSequenceFromFile } from "../withEditorProps";
import { observer } from "mobx-react";

export default compose(
  observer,
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
