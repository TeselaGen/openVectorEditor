/* eslint-disable */

const defaultConfig = [
  {
    text: "File",
    menu: [
      {
        text: "New Sequence"
      },
      {
        text: "Rename Sequence"
      },
      {
        text: "Save Sequence",
        hotKey: "modKey" + "+S"
      },
      {
        text: "Delete Sequence"
      },
      {
        text: "Set Read Only",
        disabled: true
      },
      {
        text: "Duplicate"
      },
      {
        text: "Import Sequence(s)"
      },
      {
        text: "Export to File"
      },
      {
        text: "Print",
        hotKey: "modKey" + "+P",
        menu: [
          {
            text: "Circular View"
          },
          {
            text: "Linear View"
          }
        ]
      },
      {
        text: "View revision history"
      },
      {
        text: "Properties"
      }
    ]
  },
  {
    text: "Edit",
    menu: [
      { text: "Cut" },
      { text: "Copy" },
      {
        text: "Copy Options",
        menu: [
          {
            text: "Include Features",
            checked: true
          },
          {
            text: "Include Partial Features",
            checked: false
          },
          {
            text: "Include Parts",
            checked: true
          },
          {
            text: "Include Partial Parts",
            checked: false
          }
        ]
      },
      {
        text: "Paste",
        hotKey: "modKey" + "+V"
      },
      {
        disabled: true,
        text: "Undo",
        hotKey: "modKey" + "+Z"
      },
      {
        disabled: true,
        text: "Redo",
        hotKey: "modKey" + "+Shift+Z"
      },
      {
        text: "Find...",
        hotKey: "modKey" + "+F"
      },
      {
        text: "Go to...",
        hotKey: ""
      },
      {
        text: "Select..."
      },
      {
        text: "Select All",
        hotKey: "modKey" + "+A"
      },
      {
        text: "Select Inverse",
        hotKey: "modKey" + "+I"
      },
      {
        text: "Complement Selection"
      },
      {
        text: "Complement Entire Sequence"
      },
      {
        text: "Reverse Complement Selection",
        hotKey: "modKey" + "+E"
      },
      {
        text: "Reverse Complement Entire Sequence",
        hotKey: "modKey" + "+Shift+E"
      },
      {
        text: "Rotate to Caret Position",
        hotKey: "modKey" + "+B"
      },
      {
        text: "New Feature",
        hotKey: "modKey" + "+K"
      },
      {
        text: "New Part",
        hotKey: "modKey" + "+L"
      }
    ]
  },
  {
    text: "View",
    menu: [
      {
        text: "Circular",
        checked: true
      },
      {
        text: "Linear",
        checked: false
      },
      {
        text: "Map Caret",
        checked: true
      },
      {
        text: "Features",
        checked: true
      },
      {
        text: "Feature Types",
        itemId: "featureTypes"
        //submenu of checklist of all feature types here
      },
      {
        text: "Parts",
        checked: true
      },
      {
        text: "Cut Sites"
      },
      {
        text: "ORFs",
        menu: [
          {
            text: "All Frames",
            frameNumber: "all"
          },
          {
            text: "Frame 1",
            frameNumber: 1
          },
          {
            text: "Frame 2",
            frameNumber: 2
          },
          {
            text: "Frame 3",
            frameNumber: 3
          }
        ]
      },
      {
        text: "Complementary",
        checked: true
      },
      {
        text: "Spaces",
        checked: true
      },
      {
        text: "Sequence AA",
        menu: [
          {
            text: "All Frames",
            frameNumber: "all"
          },
          {
            text: "Frame 1",
            frameNumber: 1
          },
          {
            text: "Frame 2",
            frameNumber: 2
          },
          {
            text: "Frame 3",
            frameNumber: 3
          }
        ]
      },
      {
        text: "Revcom AA",
        menu: [
          {
            text: "All Frames",
            frameNumber: "all"
          },
          {
            text: "Frame 1",
            frameNumber: 1
          },
          {
            text: "Frame 2",
            frameNumber: 2
          },
          {
            text: "Frame 3",
            frameNumber: 3
          }
        ]
      },
      {
        text: "Feature Labels",
        checked: true
      },
      {
        text: "Part Labels",
        checked: true
      },
      {
        text: "Cut Site Labels",
        checked: true
      },
      {
        hideOnClick: false,
        text: "Zoom In",
        hotKey: "+"
      },
      {
        hideOnClick: false,
        text: "Zoom Out",
        hotKey: "-"
      }
    ]
  },
  {
    text: "Tools",
    menu: [
      {
        text: "Restriction Enzymes Manager"
      },
      {
        text: "Simulate Digestion"
      }
    ]
  }
];

export default defaultConfig;
