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
        title: annotation && annotation.id ? "Edit Feature" : "Add Feature"
      },
      initialValues: annotation
        ? {
            ...convertRangeTo1Based(annotation)
          }
        : {}
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
        title: annotation && annotation.id ? "Edit Part" : "Add Part"
      },
      initialValues: annotation
        ? {
            ...convertRangeTo1Based(annotation)
          }
        : {}
    }
  };
}
export function showAddOrEditPrimerDialog(annotation, { editorName }) {
  return {
    type: "TG_SHOW_MODAL",
    name: "AddOrEditPrimerDialog", //you'll need to pass a unique dialogName prop to the compoennt
    props: {
      editorName: editorName,
      dialogProps: {
        title: annotation && annotation.id ? "Edit Primer" : "Add Primer"
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
      },
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
