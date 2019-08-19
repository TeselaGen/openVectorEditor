import createSimpleDialog from "./createSimpleDialog";

export default createSimpleDialog({
  formName: "renameSequenceDialog",
  fields: [{ name: "newName", isRequired: true }],
  withDialogProps: { title: "Rename Sequence", height: 190 }
});
