import createSimpleDialog from "./createSimpleDialog";

export default createSimpleDialog({
  formName: "renameSequenceDialog",
  fields: [{ name: "newName" }],
  dialogProps: { title: "Rename Sequence", height: 180 }
});
