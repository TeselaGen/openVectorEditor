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
      { cmd: "toggleReadOnlyMode", shouldDismissPopover: false },
      "--",
      "importSequence",
      {
        text: "Export Sequence",
        submenu: [
          { cmd: "exportSequenceAsGenbank" },
          { cmd: "exportSequenceAsFasta" },
          { cmd: "exportSequenceAsTeselagenJson" }
        ]
      },
      "--",
      {
        text: "Print",
        cmd: "print"
        // submenu: [{ cmd: "printCircularView" }, { cmd: "printLinearView" }]
      },
      { cmd: "viewRevisionHistory", text: "Revision History" },
      { cmd: "viewProperties", text: "Properties", icon: "properties" }
    ]
  },
  {
    text: "Edit",
    submenu: [
      "cut",
      "copy",
      {
        text: "Copy Options",
        submenu: [
          { cmd: "toggleCopyFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyParts", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialParts", shouldDismissPopover: false }
        ]
      },
      "paste",
      "--",
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
