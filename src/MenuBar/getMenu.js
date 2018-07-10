/* eslint-disable */
import { addMenuHotkeys, addMenuHandlers } from "teselagen-react-components";
import hotkeys from "./menuHotkeys";
import handlers from "./handlers";

// TODO wrap this in a function and update dynamic stuff, e.g. checked, disabled,
// etc. as needed
const defaultConfig = [
  {
    text: "File",
    submenu: [
      { cmd: "newSequence" },
      { cmd: "renameSequence" },
      { cmd: "saveSequence" },
      { cmd: "deleteSequence" },
      { cmd: "setReadOnly", disabled: true },
      { cmd: "duplicate" },

      { divider: "" },

      { cmd: "importSequences", text: "Import Sequences" },
      { cmd: "exportToFile" },

      { divider: "" },

      {
        cmd: "print",
        submenu: [{ cmd: "circularView" }, { cmd: "linearView" }]
      },
      { cmd: "viewRevisionHistory" },
      { cmd: "properties" }
    ]
  },
  {
    text: "Edit",
    submenu: [
      { cmd: "cut", icon: "cut" },
      { cmd: "copy", icon: "duplicate" },
      {
        cmd: "copyOptions",
        submenu: [
          {
            cmd: "includeFeatures",
            checked: true
          },
          {
            cmd: "includePartialFeatures",
            checked: false
          },
          {
            cmd: "includeParts",
            checked: true
          },
          {
            cmd: "includePartialParts",
            checked: false
          }
        ]
      },
      { cmd: "paste", icon: "clipboard" },
      { cmd: "undo", disabled: true, icon: "undo" },
      { cmd: "redo", disabled: true, icon: "redo" },

      { divider: "" },

      { cmd: "find", icon: "search" },
      { cmd: "goTo", icon: "locate", text: "Go To..." },

      { divider: "" },

      { cmd: "select" },
      { cmd: "selectAll" },
      { cmd: "selectInverse" },
      { cmd: "complementSelection" },
      { cmd: "complementEntireSequence" },
      { cmd: "reverseComplementSelection" },
      { cmd: "reverseComplementEntireSequence" },
      { cmd: "rotatetoCaretPosition" },

      { divider: "" },

      { cmd: "newFeature" },
      { cmd: "newPart" }
    ]
  },
  {
    text: "View",
    submenu: [
      { cmd: "circular", checked: true },
      { cmd: "linear", checked: false },
      { cmd: "mapCaret", checked: true },
      { cmd: "features", checked: true },
      {
        // TODO preprocess this as needed
        cmd: "featureTypes",
        itemId: "featureTypes",
        //submenu of checklist of all feature types here
        submenu: [{ text: "TO DO...", disabled: true }]
      },
      { cmd: "parts", checked: true },
      { cmd: "cutSites", checked: true },
      {
        cmd: "ORFs",
        text: "ORFs",
        submenu: [
          {
            cmd: "ORFs_allFrames",
            text: "All Frames",
            frameNumber: "all"
          },
          {
            cmd: "ORFs_frame1",
            text: "Frame 1"
            // frameNumber: 1 // TODO ?
          },
          {
            cmd: "ORFs_frame2",
            text: "Frame 2"
            // frameNumber: 2 // TODO ?
          },
          {
            cmd: "ORFs_frame3",
            text: "Frame 3"
            // frameNumber: 3 // TODO ?
          }
        ]
      },
      { cmd: "complementary", checked: true },
      { cmd: "spaces", checked: true },
      {
        cmd: "sequenceAA",
        submenu: [
          {
            cmd: "sequenceAA_allFrames",
            text: "All Frames"
            // frameNumber: "all" // TODO ?
          },
          {
            cmd: "sequenceAA_frame1",
            text: "Frame 1"
            // frameNumber: 1 // TODO ?
          },
          {
            cmd: "sequenceAA_frame2",
            text: "Frame 2"
            // frameNumber: 2 // TODO ?
          },
          {
            cmd: "sequenceAA_frame3",
            text: "Frame 3"
            // frameNumber: 3 // TODO ?
          }
        ]
      },
      {
        cmd: "revcomAA",
        submenu: [
          {
            cmd: "revcomAA_allFrames",
            text: "All Frames"
            // frameNumber: "all" // TODO ?
          },
          {
            cmd: "revcomAA_frame1",
            text: "Frame 1"
            // frameNumber: 1 // TODO ?
          },
          {
            cmd: "revcomAA_frame2",
            text: "Frame 2"
            // frameNumber: 2 // TODO ?
          },
          {
            cmd: "revcomAA_frame3",
            text: "Frame 3"
            // frameNumber: 3 // TODO ?
          }
        ]
      },
      {
        cmd: "featureLabels",
        checked: true
      },
      {
        cmd: "partLabels",
        checked: true
      },
      {
        cmd: "cutSiteLabels",
        checked: true
      },

      { divider: "" },

      {
        cmd: "zoomIn",
        shouldDismissPopover: false,
        icon: "zoom-in"
      },
      {
        cmd: "zoomOut",
        shouldDismissPopover: false,
        icon: "zoom-out"
      }
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

// TODO remove - copied from TRC
// Recursively walk the given menu and run each item through func
function walkMenu(menuDef, func) {
  if (menuDef instanceof Array) {
    return menuDef.map(item => walkMenu(item, func));
  }
  const out = func(menuDef);
  if (out.submenu) {
    out.submenu = out.submenu.map(item => walkMenu(item, func));
  }
  return out;
}

// TODO move into TRC's createMenu or a new menu util
const addMenuChecks = menu =>
  walkMenu(menu, item => {
    const out = { ...item };
    if (out.checked !== undefined) {
      out.icon = out.checked ? "small-tick" : "blank";
    }
    return out;
  });

let menu = addMenuChecks(defaultConfig);
menu = addMenuHotkeys(menu, hotkeys);
menu = addMenuHandlers(menu, handlers);

export default menu;
