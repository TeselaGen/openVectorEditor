import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";

export default AddOrEditAnnotationDialog({
  formName: "AddOrEditPartDialog",
  getProps: props => ({
    upsertAnnotation: props.upsertPart
  })
});
