import React from "react";
import versionHistoryTool from "./versionHistoryTool";
// import {connectToEditor} from "../withEditorProps";
import MenuBar from "../MenuBar";
import "./style.css";
import { Button, Tooltip } from "@blueprintjs/core";

import downloadTool from "./downloadTool";
import importTool from "./importTool";
import cutsiteTool from "./cutsiteTool";
import featureTool from "./featureTool";
import oligoTool from "./oligoTool";
import orfTool from "./orfTool";
import editTool from "./editTool";
import findTool from "./findTool";
import inlineFindTool from "./inlineFindTool";
import alignmentTool from "./alignmentTool";
import saveTool from "./saveTool";
import visibilityTool from "./visibilityTool";
import undoTool from "./undoTool";
import redoTool from "./redoTool";
import { isString } from "util";

const allTools = {
  downloadTool,
  importTool,
  cutsiteTool,
  alignmentTool,
  featureTool,
  oligoTool,
  orfTool,
  editTool,
  findTool,
  inlineFindTool,
  versionHistoryTool,
  saveTool,
  visibilityTool,
  undoTool,
  redoTool
};

export class ToolBar extends React.PureComponent {
  render() {
    const {
      modifyTools,
      contentLeft,
      showMenuBar,
      editorName,
      handleFullscreenClose,
      closeFullscreen,
      toolList = [
        "saveTool",
        "downloadTool",
        "importTool",
        "undoTool",
        "redoTool",
        "cutsiteTool",
        "featureTool",
        "oligoTool",
        "orfTool",
        "alignmentTool",
        "editTool",
        "findTool",
        "visibilityTool"
      ],
      ...rest
    } = this.props;
    let items = toolList
      .map((toolNameOrOverrides, index) => {
        let toolName;
        let toolOverride;
        if (isString(toolNameOrOverrides)) {
          toolName = toolNameOrOverrides;
        } else {
          toolOverride = toolNameOrOverrides;
        }

        const Tool = toolOverride
          ? { ...allTools[toolOverride.name], overrides: toolOverride } //add any overrides here
          : allTools[toolName];
        if (!Tool) {
          console.error(
            "You're trying to load a tool that doesn't appear to exist: " +
              toolName
          );
          return false;
        }
        return (
          <Tool
            {...rest}
            toolbarItemProps={{ index, toolName, editorName }}
            editorName={editorName}
            key={toolName}
          />
        );
      })
      .filter(tool => !!tool);

    if (modifyTools) {
      items = modifyTools(items);
    }

    return (
      <div style={{ display: "flex" }}>
        {contentLeft}
        <div className="veToolbar">
          {showMenuBar && (
            <MenuBar
              style={{ marginLeft: 0 }}
              editorName={editorName}
              trackFocus={false}
            />
          )}

          {items}
        </div>
        {closeFullscreen && (
          <CloseFullscreenButton onClick={handleFullscreenClose} />
        )}
      </div>
    );
  }
}

export default ToolBar;
// export default connectToEditor()  ToolBar

const CloseFullscreenButton = props => {
  return (
    <Tooltip content="Close Fullscreen Mode">
      <Button
        minimal
        style={{
          marginTop: 2,
          marginRight: 2
        }}
        onClick={props.onClick}
        className="ve-close-fullscreen-button"
        icon="minimize"
      />
    </Tooltip>
  );
};
