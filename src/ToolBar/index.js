import React from "react";
import { withProps, withHandlers } from "recompose";

import { compose } from "redux";

import ToolbarItem from "./ToolbarItem";
import withEditorProps from "../withEditorProps";
import versionHistoryTool from "./versionHistoryTool";

import withEditorInteractions from "../withEditorInteractions";
import onlyUpdateForKeys from "../utils/onlyUpdateForKeysDeep";
import shouldRerender from "../utils/shouldRerender";

import "./style.css";

import downloadTool from "./downloadTool";
import importTool from "./importTool";
import cutsiteTool from "./cutsiteTool";
import featureTool from "./featureTool";
import oligoTool from "./oligoTool";
import orfTool from "./orfTool";
// import viewTool from "./viewTool";
import editTool from "./editTool";
import findTool from "./findTool";
import inlineFindTool from "./inlineFindTool";
import alignmentTool from "./alignmentTool";
import saveTool from "./saveTool";
import visibilityTool from "./visibilityTool";
// import propertiesTool from "./propertiesTool";
import undoTool from "./undoTool";
import redoTool from "./redoTool";
import { isString } from "util";
// import fullScreenTool from "./fullScreenTool";

const allTools = {
  downloadTool,
  importTool,
  cutsiteTool,
  alignmentTool,
  featureTool,
  oligoTool,
  orfTool,
  // viewTool,
  editTool,
  findTool,
  inlineFindTool,
  versionHistoryTool,
  saveTool,
  visibilityTool,
  // propertiesTool,
  undoTool,
  redoTool
  // fullScreenTool
};

// import get from 'lodash/get'

export class ToolBar extends React.Component {
  state = {
    openItem: -1
  };

  componentWillUnmount() {
    console.log("ToolBar unmountin");
  }

  toggleOpen = index => {
    if (this.state.openItem === index) {
      this.setState({
        openItem: -1
      });
    } else {
      this.setState({
        openItem: index
      });
    }
  };

  render() {
    if (!shouldRerender(["modifyTools", "toolList"], ["openItem"], this)) {
      return this.cachedRender;
    }

    const {
      modifyTools,
      contentLeft,
      menuBar = null,
      closeFullscreen,
      toolList = [
        "saveTool",
        "downloadTool",
        "importTool",
        "undoTool",
        "redoTool",
        "cutsiteTool",
        "featureTool",
        // "oligoTool",
        "orfTool",
        "alignmentTool",
        // "viewTool",
        "editTool",
        // "findTool",
        "inlineFindTool",
        "visibilityTool"
        // "fullScreenTool"
        // "propertiesTool"
      ],
      ...rest
    } = this.props;

    let items = toolList
      .map(toolNameOrOverrides => {
        let toolName;
        let toolOverride;
        if (isString(toolNameOrOverrides)) {
          toolName = toolNameOrOverrides;
        } else {
          toolOverride = toolNameOrOverrides;
        }

        const tool = toolOverride
          ? { ...allTools[toolOverride.name], overrides: toolOverride } //add any overrides here
          : allTools[toolName];
        if (!tool) {
          console.error(
            "You're trying to load a tool that doesn't appear to exist: " +
              toolName
          );
          return false;
        }
        return tool;
      })
      .filter(tool => tool);

    if (modifyTools) {
      items = modifyTools(items);
    }

    let content = items.map((item, index) => {
      const updateKeys = item.updateKeys || [];
      const itemProps = item.itemProps || item;
      const WrappedItem = compose(
        withProps({
          ...rest,
          isOpen: index === this.state.openItem,
          toggleOpen: this.toggleOpen,
          index,
          overrides: item.overrides //spread any overrides here
        }),
        withHandlers({
          toggleDropdown: () => () => {
            this.toggleOpen(index);
          }
        }),
        withEditorInteractions,
        withProps(itemProps),
        onlyUpdateForKeys([...updateKeys, "isOpen", "toggleOpen", "editorName"])
      )(ToolbarItem);
      // WrappedItem.displayName = toolList[index];
      return <WrappedItem key={index} />;
    });
    this.cachedRender = ( //we're caching this so that we don't force all the toolbarItems to get recreated and unmount
      <div style={{ display: "flex" }}>
        {contentLeft}
        <div className={"veToolbar"}>
          {menuBar} {content}
        </div>
        {closeFullscreen}
      </div>
    );

    return this.cachedRender;
  }
}

export default withEditorProps(
  //only re-render the toolbar for these keys (important because we don't want to re-initialize all the toolbar items unecessarily):
  //also Toolbar must be a PureComponent so as not to re-render unecessarily
  ToolBar
);
