import React, { useState } from "react";

import { dialogHolder, hideDialog } from "./GlobalDialogUtils";

import RenameSequenceDialog from "./helperComponents/RenameSequenceDialog";
import PrintDialog from "./helperComponents/PrintDialog";
import RemoveDuplicates from "./helperComponents/RemoveDuplicates";
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
import AddOrEditPartDialog from "./helperComponents/AddOrEditPartDialog";
import AddOrEditFeatureDialog from "./helperComponents/AddOrEditFeatureDialog";
import AddOrEditPrimerDialog from "./helperComponents/AddOrEditPrimerDialog";

const Dialogs = {
  RenameSequenceDialog,
  PrintDialog,
  RemoveDuplicates,
  GoToDialog,
  SelectDialog,
  EnzymesDialog,
  CreateCustomEnzyme,
  AdditionalCutsiteInfoDialog,
  CompareEnzymeGroupsDialog,
  AlignmentToolDialog,
  MergeFeaturesDialog,
  AddOrEditPartDialog,
  AddOrEditFeatureDialog,
  AddOrEditPrimerDialog
};

export function GlobalDialog(props) {
  const [uniqKey, setUniqKey] = useState();
  dialogHolder.setUniqKey = setUniqKey;
  const Comp =
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
