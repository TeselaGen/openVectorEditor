import React from "react";
import { EuiKeyPadMenu, EuiKeyPadMenuItem, EuiIcon } from "@elastic/eui";
import { Icon } from "@blueprintjs/core";

const tabs = [
  {
    id: "view",
    name: "View",
    prepend: <Icon size={14} icon="eye-open" />,
    content: [
      {
        label: "Show All",
        icon: "dashboardApp",
        cmd: "showAll"
      },
      {
        label: "Hide All",
        icon: "dashboardApp",
        cmd: "hideAll"
      },
      {
        label: "Features",
        icon: "dashboardApp",
        cmd: "toggleFeatures"
      },
      {
        label: "Parts",
        icon: "dashboardApp",
        cmd: "togglePartsWithSubmenu"
      },
      {
        label: "ORFs",
        icon: "dashboardApp",
        cmd: "toggleOrfs"
      },
      {
        label: "Translations",
        icon: "dashboardApp",
        cmd: "toggleTranslations"
      },
      {
        label: "Cut Sites",
        icon: "dashboardApp",
        cmd: "toggleCutsites"
      },
      {
        label: "Primers",
        icon: "dashboardApp",
        cmd: "togglePrimers"
      }
    ]
  },
  {
    id: "edit",
    name: "Edit",
    prepend: <Icon size={14} icon="annotation" />,
    content: [
      {
        label: "Create...",
        icon: "dashboardApp",
        // TODO: create action needed
        cmd: "togglePrimers"
      },
      {
        label: "Cut",
        icon: "dashboardApp",
        cmd: "cut"
      },
      {
        label: "Copy",
        icon: "dashboardApp",
        cmd: "copy"
      },
      {
        label: "Copy...",
        // TODO: create copy option action needed
        icon: "dashboardApp",
        cmd: "togglePrimers"
      },
      {
        label: "Paste",
        icon: "dashboardApp",
        cmd: "paste"
      },
      {
        label: "Find",
        icon: "dashboardApp",
        cmd: "find"
      },
      {
        label: "Go to...",
        icon: "dashboardApp",
        cmd: "goTo"
      },
      {
        label: "Undo",
        icon: "dashboardApp",
        cmd: "undo"
      },
      {
        label: "Redo",
        icon: "dashboardApp",
        cmd: "redo"
      },
      {
        label: "Component Selection",
        icon: "dashboardApp",
        cmd: "complementSelection"
      },
      {
        label: "Complement Entire Sequence",
        icon: "dashboardApp",
        cmd: "complementEntireSequence"
      },
      {
        label: "Reverse Complement Selection",
        icon: "dashboardApp",
        cmd: "reverseComplementSelection"
      },
      {
        label: "Reverse Complement Entire Sequence",
        icon: "dashboardApp",
        cmd: "reverseComplementEntireSequence"
      },
      {
        label: "Rotate to Caret Position",
        icon: "dashboardApp",
        cmd: "rotateToCaretPosition"
      },
      {
        label: "Change Circular/Linear",
        icon: "dashboardApp",
        // TODO: toggleCircular / toggleLinear
        cmd: "toggleCircular"
      },
      {
        label: "Change Case",
        icon: "dashboardApp",
        cmd: "changeCaseCmd"
      }
    ]
  },
  {
    id: "select",
    name: "Select",
    prepend: <Icon size={14} icon="select" />,
    content: [
      {
        label: "Select",
        icon: "dashboardApp",
        cmd: "select"
      },
      {
        label: "Select All",
        icon: "dashboardApp",
        cmd: "selectAll"
      },
      {
        label: "Select Inverse",
        icon: "dashboardApp",
        cmd: "selectInverse"
      }
    ]
  },
  {
    id: "tools",
    name: "Tools",
    prepend: <Icon size={14} icon="build" />,
    content: [
      {
        label: "Filter Cut Sites",
        icon: "dashboardApp",
        cmd: "select"
      },
      {
        label: "Manage Enzymes",
        icon: "dashboardApp",
        cmd: "selectAll"
      },
      {
        label: "Create Custom Enzymes",
        icon: "dashboardApp",
        cmd: "selectInverse"
      },
      {
        label: "Simulate Digestion",
        icon: "dashboardApp",
        cmd: "selectAll"
      },
      {
        label: "Remove Duplicates",
        icon: "dashboardApp",
        cmd: "selectInverse"
      }
    ]
  },
  {
    id: "cutsites",
    name: "Cut Sites",
    prepend: <Icon size={14} icon="cut" />
  },
  {
    id: "labels",
    name: "Labels",
    prepend: <Icon size={14} icon="tag" />
  }
];

const buildTabItems = (content, commands) =>
  content !== undefined ? (
    <>
      <EuiKeyPadMenu className="veTabItems">
        {content.map((menuItem, index) => (
          <EuiKeyPadMenuItem
            key={index}
            label={menuItem.label}
            onClick={commands[menuItem.cmd].execute}
          >
            <EuiIcon type={menuItem.icon} size="l" />
          </EuiKeyPadMenuItem>
        ))}
      </EuiKeyPadMenu>
    </>
  ) : (
    content
  );

const buildTabs = (commands) =>
  tabs.map((tab) => ({
    id: tab.id,
    name: tab.name,
    prepend: tab.prepend,
    content: buildTabItems(tab.content, commands)
  }));

export default buildTabs;
