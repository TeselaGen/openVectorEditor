import React from "react";
import { onlyUpdateForKeys, withProps } from "recompose";
import { compose } from "redux";

// import withEditorProps from "../withEditorProps";
import ToolbarItem from "./ToolbarItem";
import withEditorProps from "../withEditorProps";
import "./style.css";

import downloadTool from "./downloadTool";
import importTool from "./importTool";
import cutsiteTool from "./cutsiteTool";
import featureTool from "./featureTool";
import oligoTool from "./oligoTool";
import orfTool from "./orfTool";
import viewTool from "./viewTool";
import editTool from "./editTool";
import findTool from "./findTool";
import saveTool from "./saveTool";
import visibilityTool from "./visibilityTool";
import propertiesTool from "./propertiesTool";
import undoTool from "./undoTool";
import redoTool from "./redoTool";

const allTools = {
  downloadTool,
  importTool,
  cutsiteTool,
  featureTool,
  oligoTool,
  orfTool,
  viewTool,
  editTool,
  findTool,
  saveTool,
  visibilityTool,
  propertiesTool,
  undoTool,
  redoTool
};

// import get from 'lodash/get'

export class ToolBar extends React.Component {
  state = {
    openItem: -1
  };

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
    const { modifyTools, toolList = [], editorName } = this.props;

    let items = toolList
      .map(toolName => {
        const tool = allTools[toolName];
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
          editorName,
          isOpen: index === this.state.openItem,
          toggleOpen: this.toggleOpen,
          toggleDropdown: () => {
            this.toggleOpen(index);
          },
          index
        }),
        withEditorProps,
        onlyUpdateForKeys([
          ...updateKeys,
          "isOpen",
          "toggleOpen",
          "toggleDropdown",
          "editorName"
        ]),
        withProps(itemProps)
      )(ToolbarItem);
      return <WrappedItem key={index} />;
    });

    return <div className={"veToolbar"}>{content}</div>;
  }
}

export default withEditorProps(
  onlyUpdateForKeys("modifyTools", "toolList")(ToolBar)
);
// export default withEditorProps(ToolBar);
