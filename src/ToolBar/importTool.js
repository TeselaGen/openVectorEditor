import React from "react";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import ToolbarItem from "./ToolbarItem";
import { compose, withHandlers } from "recompose";
import { importSequenceFromFile } from "../withEditorProps";

export default compose(
  withHandlers({ importSequenceFromFile })
)(({ toolbarItemProps, importSequenceFromFile }) => {
  return (
    <ToolbarItem
      {...{
        ...toolbarItemProps,
        Icon: <Icon icon="export" />,
        IconWrapper: Dropzone,
        IconWrapperProps: {
          multiple: false,
          style: {},
          onDrop: files => importSequenceFromFile(files[0])
        },
        tooltip: "Click or drag to import and view .fasta or .gb files"
      }}
    />
  );
});
