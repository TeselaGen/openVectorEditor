import React from "react";
import { Icon } from "@blueprintjs/core";
import Dropzone from "react-dropzone";
import ToolbarItem from "./ToolbarItem";
import { observer } from "mobx-react";

export default observer(({ toolbarItemProps, ed }) => {
  return (
    <ToolbarItem
      {...{ed,
        Icon: <Icon data-test="veImportTool" icon="export" />,
        IconWrapper: Dropzone,
        IconWrapperProps: {
          multiple: false,
          style: {},
          onDrop: (files) => ed.importSequenceFromFile(files[0])
        },
        tooltip: "Click or drag to import and view files (.fasta .gb .dna)",
        ...toolbarItemProps
      }}
    />
  );
});
