//only things specific to this menu should be included here
//things that are shared between multiple menus, or that are command specific should be
//defined in the commands/index.js file
import { createCommandBarMenu } from "../utils/__temp_menuUtils.js";
import viewSubmenu from "./viewSubmenu";

const defaultConfig = [
  {
    text: "File",
    submenu: [
      "newSequence",
      "renameSequence",
      "saveSequence",
      "deleteSequence",
      "duplicateSequence",

      { divider: "" },

      { cmd: "toggleReadOnlyMode" },

      { divider: "" },

      { cmd: "importSequence", icon: "import" },
      {
        text: "Export Sequence",
        submenu: [
          { cmd: "exportSequenceAsGenbank" },
          { cmd: "exportSequenceAsFasta" }
        ]
      },

      { divider: "" },

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
      { cmd: "cut" },
      { cmd: "copy" },
      {
        cmd: "copyOptions",
        submenu: [
          { cmd: "toggleCopyFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialFeatures", shouldDismissPopover: false },
          { cmd: "toggleCopyParts", shouldDismissPopover: false },
          { cmd: "toggleCopyPartialParts", shouldDismissPopover: false }
        ]
      },
      { cmd: "paste", icon: "clipboard" },
      { cmd: "undo" },
      { cmd: "redo" },

      { divider: "" },

      { cmd: "find", icon: "search" },
      { cmd: "goTo" },

      { divider: "" },

      { cmd: "select" },
      { cmd: "selectAll" },
      { cmd: "selectInverse" },

      { divider: "" },

      { cmd: "complementSelection" },
      { cmd: "complementEntireSequence" },
      { cmd: "reverseComplementSelection" },
      { cmd: "reverseComplementEntireSequence" },
      { cmd: "rotateToCaretPosition" },

      { divider: "" },

      { cmd: "newFeature" },
      { cmd: "newPart" }
    ]
  },
  {
    text: "View",
    submenu: viewSubmenu
  },
  {
    text: "Tools",
    submenu: [
      { cmd: "restrictionEnzymesManager" },
      { cmd: "simulateDigestion" }
    ]
  }
];

export default commands => {
  return createCommandBarMenu(defaultConfig, commands, {
    useTicks: true,
    omitIcons: true
  });
};
