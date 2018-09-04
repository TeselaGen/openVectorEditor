//only things specific to this menu should be included here
//things that are shared between multiple menus, or that are command specific should be
//defined in the commands/index.js file

import viewSubmenu from "./viewSubmenu";

export default [
  {
    text: "File",
    submenu: [
      "newSequence",
      "renameSequence",
      "saveSequence",
      "deleteSequence",
      "duplicateSequence",
      "--",
      "toggleReadOnlyMode",
      "--",
      "importSequence",
      {
        text: "Export Sequence",
        submenu: [
          { cmd: "exportSequenceAsGenbank" },
          { cmd: "exportSequenceAsFasta" }
        ]
      },
      "--",
      {
        disabled: true,
        text: "Print",
        submenu: [{ cmd: "circularView" }, { cmd: "linearView" }]
      },
      { cmd: "viewRevisionHistory", disabled: true },
      { cmd: "viewProperties", icon: "properties" }
    ]
  },
  {
    text: "Edit",
    submenu: [
      "cut",
      "copy",
      {
        cmd: "copyOptions",
        submenu: [
          { cmd: "toggleCopyFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyParts", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialParts", shouldDismissPopover: false }
        ]
      },
      "paste",
      "undo",
      "redo",
      "--",
      "find",
      "goTo",
      "--",
      "select",
      "selectAll",
      "selectInverse",
      "--",
      "complementSelection",
      "complementEntireSequence",
      "reverseComplementSelection",
      "reverseComplementEntireSequence",
      "rotateToCaretPosition",
      "--",
      "newFeature",
      "newPart"
    ]
  },
  {
    text: "View",
    submenu: viewSubmenu
  },
  {
    text: "Tools",
    submenu: ["restrictionEnzymesManager", "simulateDigestion"]
  }
];
