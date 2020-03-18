import { convertRangeTo1Based } from "ve-range-utils";

// ------------------------------------
// Actions
// ------------------------------------

export function showAddOrEditFeatureDialog(annotation, { editorName }) {
  return {
    type: "TG_SHOW_MODAL",
    name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props: {
      editorName: editorName,
      dialogProps: {
        title: annotation && annotation.id ? "Edit Feature" : "New Feature"
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
  };
}
export function showAddOrEditPartDialog(annotation, { editorName }) {
  return {
    type: "TG_SHOW_MODAL",
    name: "AddOrEditPartDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props: {
      editorName: editorName,
      dialogProps: {
        title: annotation && annotation.id ? "Edit Part" : "New Part"
      },
      initialValues: annotation
        ? {
            ...convertRangeTo1Based(annotation)
          }
        : {}
    }
  };
}
export function showPrintDialog() {
  return {
    type: "TG_SHOW_MODAL",
    name: "PrintDialog" //you'll need to pass a unique dialogName prop to the compoennt
  };
}
export function showRemoveDuplicatesDialog(props) {
  return {
    type: "TG_SHOW_MODAL",
    name: "RemoveDuplicatesDialog",
    props //you'll need to pass a unique dialogName prop to the compoennt
  };
}

export function showAddOrEditPrimerDialog(annotation, { editorName }) {
  return {
    type: "TG_SHOW_MODAL",
    name: "AddOrEditPrimerDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props: {
      editorName: editorName,
      dialogProps: {
        title: annotation && annotation.id ? "Edit Primer" : "New Primer"
      },
      initialValues: annotation
        ? {
            ...convertRangeTo1Based(annotation)
          }
        : {}
    }
  };
}
export function showMergeFeaturesDialog(annotation, { editorName }) {
  return {
    type: "TG_SHOW_MODAL",
    name: "MergeFeaturesDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props: {
      editorName: editorName,
      dialogProps: {
        title: "Merge Features"
      }
    }
  };
}

export function showCreateAlignmentDialog(props) {
  return {
    type: "TG_SHOW_MODAL",
    name: "CreateAlignmentDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props
  };
}

export function showRenameSequenceDialog(props) {
  return {
    type: "TG_SHOW_MODAL",
    name: "RenameSeqDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props
  };
}

export function showGoToDialog(props) {
  return {
    type: "TG_SHOW_MODAL",
    name: "GoToDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props
  };
}

export function showSelectDialog(props) {
  return {
    type: "TG_SHOW_MODAL",
    name: "SelectDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props
  };
}
