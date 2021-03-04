import { startCase } from "lodash";
import { convertRangeTo1Based } from "ve-range-utils";
import { showDialog } from "../GlobalDialog";

export function showAddOrEditAnnotationDialog({ type, annotation }) {
  const typeToDialog = {
    part: require("../helperComponents/AddOrEditPartDialog").default,
    feature: require("../helperComponents/AddOrEditFeatureDialog").default,
    primer: require("../helperComponents/AddOrEditPrimerDialog").default
  };
  const Component = typeToDialog[type];
  const nameUpper = startCase(type);
  showDialog({
    overrideName: `AddOrEdit${nameUpper}DialogOverride`,
    Component,
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
