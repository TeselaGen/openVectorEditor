import { startCase } from "lodash";
import pluralize from "pluralize";
import React, { useEffect } from "react";
import { compose } from "recompose";
import {
  DataTable,
  DialogFooter,
  withSelectedEntities,
  withSelectTableRecords
} from "teselagen-react-components";
import { hideDialog } from "../../../src/GlobalDialogUtils";
import { typeField } from "../../../src/helperComponents/PropertiesDialog/typeField";
import { formName } from "./constants";

const schema = ["name", typeField, "start", "end", "strand"];
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
    selectTableRecords
  } = props;
  const ents = props[`${formName}SelectedEntities`];
  useEffect(() => {
    selectTableRecords(newAnnotations);
  }, [newAnnotations, selectTableRecords]);
  return (
    <div className={"bp3-dialog-body"}>
      <div>
        The following {annotationType}
        {newAnnotations.length > 1 ? "s" : ""} will be added:
        <DataTable
          isInfinite
          formName={formName}
          entities={newAnnotations}
          withCheckboxes
          schema={schema}
        ></DataTable>
      </div>
      <DialogFooter
        onClick={handleSubmit(async () => {
          const annotationTypePlural = pluralize(annotationType);

          ents.forEach((newAnnotation) => {
            beforeAnnotationCreate &&
              beforeAnnotationCreate({
                annotationTypePlural,
                annotation: newAnnotation,
                props: props
              });

            props[`upsert${startCase(annotationType)}`](newAnnotation);
            annotationVisibilityShow(annotationTypePlural);
          });

          hideDialog();
        })}
        text="Add"
      ></DialogFooter>
    </div>
  );
});
