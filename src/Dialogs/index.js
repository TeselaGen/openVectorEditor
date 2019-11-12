import React from "react";
import { connect } from "react-redux";

import AddOrEditPrimerDialogDefault from "../helperComponents/AddOrEditPrimerDialog";
import AddOrEditFeatureDialogDefault from "../helperComponents/AddOrEditFeatureDialog";
import AddOrEditPartDialogDefault from "../helperComponents/AddOrEditPartDialog";

import MergeFeaturesDialog from "../helperComponents/MergeFeaturesDialog";
import RenameSequenceDialog from "../helperComponents/RenameSequenceDialog";
import GoToDialog from "../helperComponents/GoToDialog";
import SelectDialog from "../helperComponents/SelectDialog";
import _AddAdditionalEnzymes from "../AddAdditionalEnzymes";
import { withDialog } from "teselagen-react-components";
import { addAdditionalEnzymesClose } from "../redux/addAdditionalEnzymes";
import { AlignmentToolInner } from "../ToolBar/alignmentTool";
import PrintDialog from "../helperComponents/PrintDialog";
import RemoveDuplicatesDialog from "../helperComponents/RemoveDuplicates";

const AddAdditionalEnzymes = withDialog({
  title: "Add Additional Enzymes"
})(_AddAdditionalEnzymes);

const CreateAlignmentDialog = withDialog({
  title: "Create New Alignment"
})(AlignmentToolInner);

export const dialogOverrides = [
  "AddOrEditFeatureDialogOverride",
  "AddOrEditPartDialogOverride",
  "AddOrEditPrimerDialogOverride"
];

export default connect(
  state => {
    return {
      addAdditionalEnzymesOpen:
        state.VectorEditor.__allEditorsOptions.addAdditionalEnzymes.isOpen
    };
  },
  {
    addAdditionalEnzymesClose
  }
)(
  ({
    editorName,
    addAdditionalEnzymesOpen,
    addAdditionalEnzymesClose,
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
        <AddAdditionalEnzymes
          noTarget
          dialogProps={{
            isOpen: addAdditionalEnzymesOpen,
            onClose: addAdditionalEnzymesClose
          }}
        />
        <CreateAlignmentDialog
          editorName={editorName}
          dialogName="CreateAlignmentDialog"
          noTarget
        />
        <PrintDialog
          editorName={editorName}
          dialogName="PrintDialog"
          noTarget
        />
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
  }
);
