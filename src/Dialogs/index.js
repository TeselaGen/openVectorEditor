import React from "react";
import AddOrEditPrimerDialogDefault from "../helperComponents/AddOrEditPrimerDialog";
import AddOrEditFeatureDialogDefault from "../helperComponents/AddOrEditFeatureDialog";
import AddOrEditPartDialogDefault from "../helperComponents/AddOrEditPartDialog";

import MergeFeaturesDialog from "../helperComponents/MergeFeaturesDialog";
import RenameSequenceDialog from "../helperComponents/RenameSequenceDialog";
import GoToDialog from "../helperComponents/GoToDialog";
import SelectDialog from "../helperComponents/SelectDialog";
// import _ManageEnzymes from "../ManageEnzymes";
import { withDialog } from "teselagen-react-components";
import { AlignmentToolInner } from "../ToolBar/alignmentTool";
import PrintDialog from "../helperComponents/PrintDialog";
import RemoveDuplicatesDialog from "../helperComponents/RemoveDuplicates";
import _EnzymesDialog from "../helperComponents/EnzymesDialog";

const EnzymesDialog = withDialog({
  title: "Manage Enzymes",
  // isOpen: true,
  isDraggable: true,
  height: 500,
  width: 500
})(_EnzymesDialog);

// const ManageEnzymes = withDialog({
//   title: "Manage Enzymes",

// })(_ManageEnzymes);

const CreateAlignmentDialog = withDialog({
  title: "Create New Alignment"
})(AlignmentToolInner);

export const dialogOverrides = [
  "AddOrEditFeatureDialogOverride",
  "AddOrEditPartDialogOverride",
  "AddOrEditPrimerDialogOverride"
];

export default ({
  editorName,
  AddOrEditFeatureDialogOverride,
  AddOrEditPartDialogOverride,
  AddOrEditPrimerDialogOverride
}) => {
  const AddOrEditFeatureDialog =
    AddOrEditFeatureDialogOverride || AddOrEditFeatureDialogDefault;
  const AddOrEditPartDialog =
    AddOrEditPartDialogOverride || AddOrEditPartDialogDefault;
  const AddOrEditPrimerDialog =
    AddOrEditPrimerDialogOverride || AddOrEditPrimerDialogDefault;
  return (
    <div>
      {/* <ManageEnzymes
          noTarget
          editorName={editorName}
          dialogName="ManageEnzymesDialog"
        /> */}
      <CreateAlignmentDialog
        editorName={editorName}
        dialogName="CreateAlignmentDialog"
        noTarget
      />
      <EnzymesDialog
        isOpen
        editorName={editorName}
        dialogName="ManageEnzymesDialog"
        noTarget
      />
      <PrintDialog editorName={editorName} dialogName="PrintDialog" noTarget />
      <RemoveDuplicatesDialog
        editorName={editorName}
        dialogName="RemoveDuplicatesDialog"
        noTarget
      />

      <AddOrEditFeatureDialog
        editorName={editorName}
        dialogName="AddOrEditFeatureDialog"
        noTarget
      />

      <AddOrEditPartDialog
        editorName={editorName}
        dialogName="AddOrEditPartDialog"
        noTarget
      />
      <AddOrEditPrimerDialog
        editorName={editorName}
        dialogName="AddOrEditPrimerDialog"
        noTarget
      />
      <MergeFeaturesDialog
        editorName={editorName}
        dialogName="MergeFeaturesDialog"
        noTarget
      />
      <RenameSequenceDialog
        editorName={editorName}
        dialogName="RenameSeqDialog"
        noTarget
      />
      <GoToDialog editorName={editorName} dialogName="GoToDialog" noTarget />
      <SelectDialog
        editorName={editorName}
        dialogName="SelectDialog"
        noTarget
      />
    </div>
  );
};
