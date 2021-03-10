import shortid from "shortid";

import { startCase } from "lodash";
import { convertRangeTo1Based } from "ve-range-utils";

export const dialogHolder = {};

//if an overrideName is passed, then that dialog can be overridden if an overriding dialog is passed as a prop to the <Editor/>
export function showDialog({ dialogType, props, overrideName }) {
  dialogHolder.dialogType = dialogType;
  dialogHolder.props = props;
  dialogHolder.overrideName = overrideName;
  dialogHolder.setUniqKey(shortid());
}
export function hideDialog() {
  delete dialogHolder.dialogType;
  delete dialogHolder.props;
  delete dialogHolder.overrideName;
  dialogHolder.setUniqKey(shortid());
}

export function showAddOrEditAnnotationDialog({ type, annotation }) {
  const typeToDialogType = {
    part: "AddOrEditPartDialog",
    feature: "AddOrEditFeatureDialog",
    primer: "AddOrEditPrimerDialog"
  };
  const dialogType = typeToDialogType[type];
  const nameUpper = startCase(type);
  showDialog({
    overrideName: `AddOrEdit${nameUpper}DialogOverride`,
    dialogType,
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
