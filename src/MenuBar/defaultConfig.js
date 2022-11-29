//only things specific to this menu should be included here
//things that are shared between multiple menus, or that are command specific should be
//defined in the commands/index.js file

import viewSubmenu from "./viewSubmenu";
export const copyOptionsMenu = {
  text: "Copy Options",
  showInSearchMenu: true,
  submenu: [
    { cmd: "toggleCopyFeatures", shouldDismissPopover: false },
    { cmd: "toggleCopyPartialFeatures", shouldDismissPopover: false },
    { cmd: "toggleCopyParts", shouldDismissPopover: false },
    { cmd: "toggleCopyPartialParts", shouldDismissPopover: false }
  ]
};
export const createNewAnnotationMenu = {
  text: "Create",
  cmd: "createMenuHolder",
  showInSearchMenu: true
};
export default [
  {
    text: "File",
    "data-test": "file",
    submenu: [
      {
        cmd: "newSequence",
        "data-test": "newSequence"
      },
      "renameSequence",
      "saveSequence",
      "saveSequenceAs",
      "deleteSequence",
      "duplicateSequence",
      "--",
      { cmd: "toggleReadOnlyMode", shouldDismissPopover: false },
      "--",
      "importSequence",
      {
        text: "Export Sequence",
        showInSearchMenu: true,
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
      createNewAnnotationMenu,
      "--",
      "cut",
      "copy",
      copyOptionsMenu,
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
      {
        text: "Change Case",
        cmd: "changeCaseCmd",
        submenu: [
          "flipCaseSequence",
          "upperCaseSequence",
          "lowerCaseSequence",
          "upperCaseSelection",
          "lowerCaseSelection"
        ]
      },
      {
        text: "Change Circular/Linear",
        cmd: "changeCircularityCmd",
        submenu: ["toggleCircular", "toggleLinear"]
      },
      // {
      //   text: "Change Sequence Case For Selection",
      //   submenu: [
      //   ]
      // },
      "--",
      "complementSelection",
      "complementEntireSequence",
      "reverseComplementSelection",
      "reverseComplementEntireSequence",
      "rotateToCaretPosition"
    ]
  },
  {
    text: "View",
    submenu: viewSubmenu
  },
  {
    text: "Tools",
    cmd: "toolsCmd",
    submenu: [
      "openFilterCutsites",
      "restrictionEnzymesManager",
      "openCreateCustomEnzyme",
      "simulateDigestion",
      "simulatePCR",
      {
        text: "Remove Duplicates",
        submenu: [
          "showRemoveDuplicatesDialogFeatures",
          "showRemoveDuplicatesDialogParts",
          "showRemoveDuplicatesDialogPrimers"
        ]
      },
      {
        text: "Auto Annotate",
        cmd: "autoAnnotateHolder",
        submenu: [
          "autoAnnotateFeatures",
          "autoAnnotateParts",
          "autoAnnotatePrimers"
        ]
      }
    ]
  },
  // { isMenuSearch: true }
  {
    text: "Help",
    submenu: [
      { isMenuSearch: true },
      "--",
      "about",
      { cmd: "versionNumber", shouldDismissPopover: false },
      "hotkeyDialog"
    ]
  }
];
