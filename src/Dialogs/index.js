import React from "react";
import { connect } from "react-redux";
import AddOrEditPrimerDialog from "../helperComponents/AddOrEditPrimerDialog";
import FindGuideDialog from "../helperComponents/FindGuideDialog";
import MergeFeaturesDialog from "../helperComponents/MergeFeaturesDialog";
import AddOrEditFeatureDialog from "../helperComponents/AddOrEditFeatureDialog";
import AddOrEditPartDialog from "../helperComponents/AddOrEditPartDialog";
import RenameSequenceDialog from "../helperComponents/RenameSequenceDialog";
import GoToDialog from "../helperComponents/GoToDialog";
import SelectDialog from "../helperComponents/SelectDialog";
import _AddAdditionalEnzymes from "../AddAdditionalEnzymes";
import { withDialog } from "teselagen-react-components";
import { addYourOwnEnzymeClose } from "../redux/addYourOwnEnzyme";
import { AlignmentToolInner } from "../ToolBar/alignmentTool";

const AddAdditionalEnzymes = withDialog({
  title: "Add Additional Enzymes"
})(_AddAdditionalEnzymes);

const CreateAlignmentDialog = withDialog({
  title: "Create New Alignment"
})(AlignmentToolInner);

export default connect(
  state => {
    return {
      addYourOwnEnzymeIsOpen: state.VectorEditor.addYourOwnEnzyme.isOpen
    };
  },
  {
    addYourOwnEnzymeClose
  }
)(({ editorName, addYourOwnEnzymeIsOpen, addYourOwnEnzymeClose, ...rest }) => {
  return (
    <div>
      <AddAdditionalEnzymes
        noTarget
        dialogProps={{
          isOpen: addYourOwnEnzymeIsOpen,
          onClose: addYourOwnEnzymeClose
        }}
      />
      <CreateAlignmentDialog
        editorName={editorName}
        dialogName="CreateAlignmentDialog"
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
      <FindGuideDialog
        {...rest}
        editorName={editorName}
        dialogName="FindGuideDialog"
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
});
