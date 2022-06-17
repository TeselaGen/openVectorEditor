import { formName } from "./constants";
const {
  startCase,
  compose,
  hideDialog,
  typeField,
  pluralize,
  React,
  useEffect,
  DataTable,
  DialogFooter,
  withSelectedEntities,
  withSelectTableRecords,
  tidyUpAnnotation
} = window.addOnGlobals;

const schemaFeatures = ["name", typeField, "start", "end", "strand"];
const schemaOther = ["name", "start", "end", "strand"];
export default compose(
  withSelectedEntities(formName),
  withSelectTableRecords(formName)
)(function CreateAnnotationsPage(props) {
  const {
    newAnnotations,
    annotationType,
    annotationVisibilityShow,
    beforeAnnotationCreate,
    handleSubmit,
    selectTableRecords,
    sequenceData
  } = props;
  const ents = props[`${formName}SelectedEntities`];
  useEffect(() => {
    selectTableRecords(newAnnotations);
  }, [newAnnotations, selectTableRecords]);
  return (
    <div className="bp3-dialog-body">
      <div>
        The following {annotationType}
        {newAnnotations.length > 1 ? "s" : ""} will be added:
        <DataTable
          isInfinite
          formName={formName}
          entities={newAnnotations.map((e) => ({
            ...e,
            start: e.start + 1,
            end: e.end + 1
          }))}
          withCheckboxes
          schema={annotationType === "feature" ? schemaFeatures : schemaOther}
        ></DataTable>
      </div>
      <DialogFooter
        hideModal={hideDialog}
        onClick={handleSubmit(async () => {
          const annotationTypePlural = pluralize(annotationType);

          ents.forEach((newAnnotation, i) => {
            beforeAnnotationCreate &&
              beforeAnnotationCreate({
                annotationTypePlural,
                annotation: newAnnotation,
                props: props
              });

            let conditionals = {};
            if (ents.length > 1) {
              if (i === 0) {
                conditionals = {
                  batchUndoStart: true
                };
              } else if (i === ents.length - 1) {
                conditionals = {
                  batchUndoEnd: true
                };
              } else {
                conditionals = {
                  batchUndoMiddle: true
                };
              }
            }
            props[`upsert${startCase(annotationType)}`](
              tidyUpAnnotation(newAnnotation, {
                sequenceData,
                annotationType: annotationTypePlural
              }),
              conditionals
            );
            annotationVisibilityShow(annotationTypePlural);
          });

          hideDialog();
        })}
        text="Add"
      ></DialogFooter>
    </div>
  );
});
