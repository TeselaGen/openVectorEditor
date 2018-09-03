export default [
  // { cmd: "mapCaret" },
  { cmd: "toggleFeatures", shouldDismissPopover: false },
  // {
  //   // TODO preprocess this as needed
  //   cmd: "featureTypes",
  //   itemId: "featureTypes",
  //   //submenu of checklist of all feature types here
  //   submenu: [{ text: "TO DO...", disabled: true }]
  // },
  { cmd: "toggleParts", shouldDismissPopover: false },
  { cmd: "toggleCutsites", shouldDismissPopover: false },
  // TODO translations, cds feature translations?
  {
    cmd: "toggleOrfs",
    text: "ORFs",
    submenu: [
      {
        cmd: "toggleOrfs"
      },
      {
        cmd: "toggleOrfTranslations"
      },
      {
        cmd: "toggleCdsFeatureTranslations"
      }
    ]
  },
  // { cmd: "complementary" },
  // { cmd: "spaces" },
  { divider: "" },
  {
    text: "Sequence Case (Upper/Lower)",
    submenu: [
      {
        cmd: "toggleSequenceMapFontUpper",
        text: "Upper Case",
        shouldDismissPopover: false
      },
      {
        cmd: "toggleSequenceMapFontLower",
        text: "Lower Case",
        shouldDismissPopover: false
      },
      {
        cmd: "toggleSequenceMapFontNoPreference",
        text: "No Preference",
        shouldDismissPopover: false
      }
    ]
  },
  { divider: "" },
  {
    text: "Full Sequence Translation",
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
      },
      {
        cmd: "sequenceAAReverse_allFrames",
        text: "All Reverse Frames"
        // frameNumber: "all" // TODO ?
      },
      {
        cmd: "sequenceAAReverse_frame1",
        text: "Frame -1"
        // frameNumber: 1 // TODO ?
      },
      {
        cmd: "sequenceAAReverse_frame2",
        text: "Frame -2"
        // frameNumber: 2 // TODO ?
      },
      {
        cmd: "sequenceAAReverse_frame3",
        text: "Frame -3"
        // frameNumber: 3 // TODO ?
      }
    ]
  },
  { divider: "" },

  { cmd: "toggleAxis", shouldDismissPopover: false },
  { cmd: "toggleAxisNumbers", shouldDismissPopover: false },
  { cmd: "toggleReverseSequence", shouldDismissPopover: false },
  { cmd: "toggleDnaColors", shouldDismissPopover: false },
  { cmd: "toggleLineageLines", shouldDismissPopover: false },

  { divider: "" },

  { cmd: "toggleFeatureLabels", shouldDismissPopover: false },
  { cmd: "togglePartLabels", shouldDismissPopover: false },
  { cmd: "toggleCutsiteLabels", shouldDismissPopover: false }
];
