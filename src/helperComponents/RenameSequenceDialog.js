import createSimpleDialog from "./createSimpleDialog";

export default createSimpleDialog({
  formName: "renameSequenceDialog",
  fields: [{ name: "newName", isRequired: true }],
  dialogProps: { title: "Rename Sequence", height: 190 }
});
