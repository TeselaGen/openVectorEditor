import {
  applyCommandsToMenu,
  addMenuTexts,
  addMenuTicks
} from "../utils/__temp_menuUtils.js";

const defaultConfig = [
  {
    text: "File",
    submenu: [
      { cmd: "newSequence", icon: "plus" },
      { cmd: "renameSequence", icon: "edit" },
      { cmd: "saveSequence", icon: "floppy-disk" },
      { cmd: "deleteSequence", icon: "trash" },
      { cmd: "duplicateSequence", icon: "duplicate" },

      { divider: "" },

      { cmd: "toggleReadOnlyMode" },

      { divider: "" },

      { cmd: "importSequence", icon: "import" },
      {
        text: "Export Sequence",
        submenu: [
          { cmd: "exportSequenceAsGenbank" },
          { cmd: "exportSequenceAsFasta" },
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
          { cmd: "toggleCopyFeatures" },
          { cmd: "toggleCopyPartialFeatures" },
          { cmd: "toggleCopyParts" },
          { cmd: "toggleCopyPartialParts"  }
        ]
      },
      { cmd: "paste", icon: "clipboard" },
      { cmd: "undo" },
      { cmd: "redo" },

      { divider: "" },

      { cmd: "find", icon: "search" },
      { cmd: "goTo"  },

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
    submenu: [
      // TODO maybe these two shouldn't be "view" commands, as it seems they can
      // affect actual data, not just the way it's displayed
      { cmd: "circular" },
      { cmd: "linear" },

      { divider: "" },
      // { cmd: "mapCaret" },
      { cmd: "toggleFeatures" },
      // {
      //   // TODO preprocess this as needed
      //   cmd: "featureTypes",
      //   itemId: "featureTypes",
      //   //submenu of checklist of all feature types here
      //   submenu: [{ text: "TO DO...", disabled: true }]
      // },
      { cmd: "toggleParts" },
      { cmd: "toggleCutsites" },
      // TODO translations, cds feature translations?
      // {
      //   cmd: "ORFs",
      //   text: "ORFs",
      //   submenu: [
      //     {
      //       cmd: "ORFs_allFrames",
      //       text: "All Frames",
      //       // frameNumber: "all"
      //     },
      //     {
      //       cmd: "ORFs_frame1",
      //       text: "Frame 1"
      //       // frameNumber: 1 // TODO ?
      //     },
      //     {
      //       cmd: "ORFs_frame2",
      //       text: "Frame 2"
      //       // frameNumber: 2 // TODO ?
      //     },
      //     {
      //       cmd: "ORFs_frame3",
      //       text: "Frame 3"
      //       // frameNumber: 3 // TODO ?
      //     }
      //   ]
      // },
      // { cmd: "complementary" },
      // { cmd: "spaces" },
      // {
      //   cmd: "sequenceAA",
      //   submenu: [
      //     {
      //       cmd: "sequenceAA_allFrames",
      //       text: "All Frames"
      //       // frameNumber: "all" // TODO ?
      //     },
      //     {
      //       cmd: "sequenceAA_frame1",
      //       text: "Frame 1"
      //       // frameNumber: 1 // TODO ?
      //     },
      //     {
      //       cmd: "sequenceAA_frame2",
      //       text: "Frame 2"
      //       // frameNumber: 2 // TODO ?
      //     },
      //     {
      //       cmd: "sequenceAA_frame3",
      //       text: "Frame 3"
      //       // frameNumber: 3 // TODO ?
      //     }
      //   ]
      // },
      // {
      //   cmd: "revcomAA",
      //   submenu: [
      //     {
      //       cmd: "revcomAA_allFrames",
      //       text: "All Frames"
      //       // frameNumber: "all" // TODO ?
      //     },
      //     {
      //       cmd: "revcomAA_frame1",
      //       text: "Frame 1"
      //       // frameNumber: 1 // TODO ?
      //     },
      //     {
      //       cmd: "revcomAA_frame2",
      //       text: "Frame 2"
      //       // frameNumber: 2 // TODO ?
      //     },
      //     {
      //       cmd: "revcomAA_frame3",
      //       text: "Frame 3"
      //       // frameNumber: 3 // TODO ?
      //     }
      //   ]
      // },
      { divider: "" },

      { cmd: "toggleAxis" },
      { cmd: "toggleAxisNumbers" },
      { cmd: "toggleReverseSequence" },
      { cmd: "toggleDnaColors" },
      { cmd: "toggleLineageLines" },

      { divider: "" },

      { cmd: "toggleFeatureLabels" },
      { cmd: "togglePartLabels" },
      { cmd: "toggleCutsiteLabels" },
    ]
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
  let menu = applyCommandsToMenu(
    defaultConfig,
    commands,
    { useTicks: true, omitIcons: true }
  );
  menu = addMenuTexts(menu);
  return addMenuTicks(menu);
}
