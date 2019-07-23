import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";

export default AddOrEditAnnotationDialog({
  formName: "AddOrEditPrimerDialog",
  getProps: props => ({
    upsertAnnotation: props.upsertPrimer,
    annotationTypePlural: "primers"
  })
});
