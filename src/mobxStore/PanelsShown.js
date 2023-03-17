import { flatMap } from "lodash";
import { removeItem } from "../utils/arrayUtils";
import immer from "immer";
import { makeAutoObservable } from "mobx";
export default class PanelShown {
  constructor() {
    makeAutoObservable(this)
  }
  panels = [
    [
      {
        id: "circular",
        name: "Circular Map",
        active: true
        //   canClose: true
      },
      {
        id: "rail",
        name: "Linear Map",
        active: false
      }
    ],
    [
      {
        id: "sequence",
        name: "Sequence Map",
        active: true
      },
      {
        id: "properties",
        name: "Properties",
        active: false
      }
    ]
  ];

  flipActiveForGroup(group, setCircActive) {
    const activeTab = group.find(({ active }) => active);
    if (activeTab?.id === (setCircActive ? "rail" : "circular")) {
      //we're on the wrong tab type so check if the other tab is in
      const newTabToActivate = group.find(
        ({ id }) => id === (setCircActive ? "circular" : "rail")
      );
      if (newTabToActivate) {
        newTabToActivate.active = true;
        activeTab.active = false;
      }
    }
  }

  addPanelIfItDoesntAlreadyExist(panelToAdd) {
    if (
      !this.panels.some((panelGroup) => {
        return panelGroup.some(({ id }) => {
          return id === panelToAdd.id;
        });
      })
    ) {
      this.panels = this.panels.map((panelGroup, index) => {
        if (index === 0) return [panelToAdd, ...panelGroup];
        return panelGroup;
      });
    }
  }

  panelsShownUpdate(payload) {
    this.panels = payload.filter((group) => group.length);
  }

  flipActiveTabFromLinearOrCircularIfNecessary(setCircActive) {
    const newPanels = immer(this.panels, (s) => {
      s.forEach((g) => {
        this.flipActiveForGroup(g, setCircActive);
      });
    });
    this.panels = newPanels;
  }

  closePanels(idToClose) {
    const newPanels = this.panels.map((group) => {
      let indexToClose;
      group.forEach(({ id }, i) => {
        if (id === idToClose) indexToClose = i;
      });
      if (indexToClose > -1) {
        return removeItem(group, indexToClose).map((tab, i) => {
          if (i === 0) return { ...tab, active: true };
          else {
            return tab;
          }
        });
      }
      return group;
    });
    this.panels = newPanels.fitler((group) => group.length);
  }

  collapseSplitScreen(activePanelId) {
    this.panels = [flatMap(this.panel)];
    activePanelId && this.setPanelAsActive(activePanelId);
  }

  expandTabToSplitScreen(activePanelId) {
    let panelToMove;
    this.panels = [
      this.panels[0]
        .filter((panel) => {
          if (panel.id === activePanelId) {
            panelToMove = panel;
            return false;
          }
          return true;
        })
        .map((panel, i) => {
          return i === 0 ? { ...panel, active: true } : panel;
        })
    ];
  }

  setPanelAsActive(panelId) {
    this.panels = this.panels.map((panelGroup) => {
      const isPanelInGroup = panelGroup.some(({ id }) => {
        return panelId === id;
      });
      return panelGroup.map((panel) => {
        return {
          ...panel,
          active:
            panelId === panel.id ? true : isPanelInGroup ? false : panel.active
        };
      });
    });
  }

  togglePanelFullScreen(panelId) {
    this.panels = this.panels.map((panelGroup) => {
      const isPanelInGroup = panelGroup.some(({ id }) => {
        return panelId === id;
      });
      return panelGroup.map((panel) => {
        return {
          ...panel,
          active:
            panelId === panel.id ? true : isPanelInGroup ? false : panel.active,
          fullScreen:
            panelId === panel.id
              ? !panel.fullScreen
              : isPanelInGroup
              ? false
              : panel.fullScreen
        };
      });
    });
  }

  collapsePanel(panelToCloseId) {
    this.panels = flatMap(this.panels, (panelGroup) => {
      return panelGroup;
    }).map((panel) => {
      if (panel.id === panelToCloseId) {
        return {
          ...panel,
          active: false
        };
      }
      return panel;
    });
  }

  createNewDigest() {
    this.addPanelIfItDoesntAlreadyExist({
      id: "digestTool",
      name: "New Digest",
      active: true,
      canClose: true
    });
  }

  propertiesViewOpen() {
    this.setPanelAsActive("properties");
  }

  createNewPCR() {
    this.addPanelIfItDoesntAlreadyExist({
      id: "pcrTool",
      name: "New PCR",
      active: true,
      canClose: true
    });
  }

  createNewAlignment(payload) {
    this.addPanelIfItDoesntAlreadyExist({
      type: "alignment",
      name: "New Alignment",
      active: true,
      canClose: true,
      ...payload
    });
  }

  createNewMismatchesList(payload) {
    this.addPanelIfItDoesntAlreadyExist({
      type: "mismatches",
      name: "Mismatches",
      active: true,
      canClose: true,
      ...payload
    });
  }
}
