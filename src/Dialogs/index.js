import React from "react";
import AddOrEditPrimerDialogDefault from "../helperComponents/AddOrEditPrimerDialog";
import AddOrEditFeatureDialogDefault from "../helperComponents/AddOrEditFeatureDialog";
import AddOrEditPartDialogDefault from "../helperComponents/AddOrEditPartDialog";

import MergeFeaturesDialog from "../helperComponents/MergeFeaturesDialog";
import RenameSequenceDialog from "../helperComponents/RenameSequenceDialog";
import GoToDialog from "../helperComponents/GoToDialog";
import SelectDialog from "../helperComponents/SelectDialog";
import { withDialog } from "teselagen-react-components";
import { AlignmentToolInner } from "../ToolBar/alignmentTool";
import PrintDialog from "../helperComponents/PrintDialog";
import RemoveDuplicatesDialog from "../helperComponents/RemoveDuplicates";
import { userDefinedHandlersAndOpts } from "../Editor/userDefinedHandlersAndOpts";
import { pick } from "lodash";
import _EnzymesDialog from "../helperComponents/EnzymesDialog";
import CreateCustomEnzyme from "../CreateCustomEnzyme";

const EnzymesDialog = withDialog({
  title: "Manage Enzymes"
  // isOpen: true,
  // isDraggable: true,
  // height: 500,
  // width: 500
})(_EnzymesDialog);

const CreateCustomEnzymeDialog = withDialog({
  title: "Create Custom Enzyme"
  // isOpen: true,
})(CreateCustomEnzyme);

const CreateAlignmentDialog = withDialog({
  title: "Create New Alignment"
})(AlignmentToolInner);

export const dialogOverrides = [
  "AddOrEditFeatureDialogOverride",
  "AddOrEditPartDialogOverride",
  "AddOrEditPrimerDialogOverride"
];

export default (props) => {
  const {
    editorName,
    AddOrEditFeatureDialogOverride,
    AddOrEditPartDialogOverride,
    AddOrEditPrimerDialogOverride
  } = props;

  const pickedUserDefinedHandlersAndOpts = pick(
    props,
    userDefinedHandlersAndOpts
  );

  const AddOrEditFeatureDialog =
    AddOrEditFeatureDialogOverride || AddOrEditFeatureDialogDefault;
  const AddOrEditPartDialog =
    AddOrEditPartDialogOverride || AddOrEditPartDialogDefault;
  const AddOrEditPrimerDialog =
    AddOrEditPrimerDialogOverride || AddOrEditPrimerDialogDefault;
  return (
    <div>
      {/* <AddAdditionalEnzymes
        noTarget
        dialogProps={{
          isOpen: addAdditionalEnzymesOpen,
          onClose: addAdditionalEnzymesClose
        }}
      /> */}
      <CreateAlignmentDialog
        editorName={editorName}
        dialogName="CreateAlignmentDialog"
        noTarget
      />
      <PrintDialog editorName={editorName} dialogName="PrintDialog" noTarget />
      <RemoveDuplicatesDialog
        editorName={editorName}
        dialogName="RemoveDuplicatesDialog"
        noTarget
      />
      <EnzymesDialog
        isOpen
        editorName={editorName}
        dialogName="ManageEnzymesDialog"
        noTarget
        {...pickedUserDefinedHandlersAndOpts}
      />
      <CreateCustomEnzymeDialog
        isOpen
        editorName={editorName}
        dialogName="CreateCustomEnzymeDialog"
        noTarget
        {...pickedUserDefinedHandlersAndOpts}
      />

      <AddOrEditFeatureDialog
        {...pickedUserDefinedHandlersAndOpts}
        editorName={editorName}
        dialogName="AddOrEditFeatureDialog"
        noTarget
      />

      <AddOrEditPartDialog
        {...pickedUserDefinedHandlersAndOpts}
        editorName={editorName}
        dialogName="AddOrEditPartDialog"
        noTarget
      />
      <AddOrEditPrimerDialog
        {...pickedUserDefinedHandlersAndOpts}
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
