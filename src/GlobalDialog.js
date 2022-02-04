import React, { useState, useEffect } from "react";

import { dialogHolder, hideDialog } from "./GlobalDialogUtils";

import RenameSequenceDialog from "./helperComponents/RenameSequenceDialog";
import PrintDialog from "./helperComponents/PrintDialog";
import RemoveDuplicates from "./helperComponents/RemoveDuplicates";
import { MultipleSeqsDetectedOnImportDialog } from "./helperComponents/MultipleSeqsDetectedOnImportDialog";
import GoToDialog from "./helperComponents/GoToDialog";
import SelectDialog from "./helperComponents/SelectDialog";
import EnzymesDialog from "./helperComponents/EnzymesDialog";
import CreateCustomEnzyme from "./CreateCustomEnzyme";
import {
  AdditionalCutsiteInfoDialog,
  CompareEnzymeGroupsDialog
} from "./CutsiteFilter/AdditionalCutsiteInfoDialog";
import { AlignmentToolDialog } from "./ToolBar/alignmentTool";
import MergeFeaturesDialog from "./helperComponents/MergeFeaturesDialog";

const Dialogs = {
  RenameSequenceDialog,
  PrintDialog,
  MultipleSeqsDetectedOnImportDialog,
  RemoveDuplicates,
  GoToDialog,
  SelectDialog,
  EnzymesDialog,
  CreateCustomEnzyme,
  AdditionalCutsiteInfoDialog,
  CompareEnzymeGroupsDialog,
  AlignmentToolDialog,
  MergeFeaturesDialog
};

export function GlobalDialog(props) {
  const [uniqKey, setUniqKey] = useState();
  useEffect(() => {
    //on unmount, clear the global dialog state..
    return () => {
      hideDialog();
    };
  }, []);
  dialogHolder.setUniqKey = setUniqKey;
  const Comp =
    dialogHolder.CustomModalComponent ||
    props.dialogOverrides[dialogHolder.overrideName] ||
    Dialogs[dialogHolder.dialogType];
  if (!Comp) return null;

  return (
    <Comp
      key={uniqKey}
      hideDialog={hideDialog}
      hideModal={hideDialog}
      {...props}
      {...dialogHolder.props}
    ></Comp>
  );
}
