import shortid from "shortid";

import { cloneDeep, startCase } from "lodash";
import { convertRangeTo1Based } from "ve-range-utils";
import AddOrEditPartDialog from "./helperComponents/AddOrEditPartDialog";
import AddOrEditFeatureDialog from "./helperComponents/AddOrEditFeatureDialog";
import AddOrEditPrimerDialog from "./helperComponents/AddOrEditPrimerDialog";

export const dialogHolder = {};
//if an overrideName is passed, then that dialog can be overridden if an overriding dialog is passed as a prop to the <Editor/>
export function showDialog({
  ModalComponent,
  dialogType,
  props,
  overrideName
}) {
  dialogHolder.dialogType = dialogType;
  if (!dialogHolder.dialogType && ModalComponent) {
    dialogHolder.dialogType = "TGCustomModal";
  }
  dialogHolder.CustomModalComponent = ModalComponent;
  dialogHolder.props = props;
  dialogHolder.overrideName = overrideName;
  dialogHolder.setUniqKey(shortid());
}
export function hideDialog() {
  delete dialogHolder.dialogType;
  delete dialogHolder.CustomModalComponent;
  delete dialogHolder.props;
  delete dialogHolder.overrideName;
  dialogHolder.setUniqKey();
}

const typeToDialogType = {
  part: "AddOrEditPartDialog",
  feature: "AddOrEditFeatureDialog",
  primer: "AddOrEditPrimerDialog"
};
const typeToDialog = {
  part: AddOrEditPartDialog,
  feature: AddOrEditFeatureDialog,
  primer: AddOrEditPrimerDialog
};

export function showAddOrEditAnnotationDialog({
  type,
  annotation: _annotation
}) {
  // AddOrEditPartDialog
  // AddOrEditFeatureDialog
  // AddOrEditPrimerDialog
  const dialogType = typeToDialogType[type];
  const dialog = typeToDialog[type];
  if (Object.values(typeToDialogType).includes(dialogHolder.dialogType)) {
    return;
  }
  const nameUpper = startCase(type);
  const annotation = cloneDeep(_annotation);
  if (_annotation.isWrappedAddon) {
    delete annotation.isWrappedAddon;
    delete annotation.rangeTypeOverride;
    annotation.start = _annotation.end + 1;
    annotation.end = _annotation.start - 1;
  }
  showDialog({
    overrideName: `AddOrEdit${nameUpper}DialogOverride`,
    dialogType,
    ModalComponent: dialog,
    props: {
      dialogProps: {
        title:
          annotation && annotation.id ? `Edit ${nameUpper}` : `New ${nameUpper}`
      },
      initialValues: {
        ...(annotation
          ? {
              ...convertRangeTo1Based(annotation),
              ...(annotation.locations && {
                locations: annotation.locations.map(convertRangeTo1Based)
              })
            }
          : {})
      }
    }
  });
}
