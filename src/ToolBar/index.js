import React from "react";
import { pick } from "lodash";
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
      displayMenuBarAboveTools,
      isProtein,
      openHotkeyDialog,
      onSave,
      userDefinedHandlersAndOpts,
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
          toolName = toolNameOrOverrides.name;
        }

        const Tool = toolOverride
          ? allTools[toolOverride.name]
          : allTools[toolName];
        if (!Tool) {
          console.error(
            "You're trying to load a tool that doesn't appear to exist: " +
              toolName
          );
          return false;
        }
        if (isProtein) {
          if (
            toolName === "cutsiteTool" ||
            toolName === "orfTool" ||
            toolName === "alignmentTool"
          ) {
            return false;
          }
        }
        if (toolName === "saveTool" && !onSave) {
          return false;
        } //don't show the option to save if no onSave handler is passed
        return (
          <Tool
            {...rest}
            onSave={onSave}
            toolbarItemProps={{ index, toolName, editorName, ...toolOverride }}
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
        <div
          style={{
            ...(displayMenuBarAboveTools && showMenuBar
              ? {
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "flex-start"
                }
              : {
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap"
                })
          }}
          className="veToolbar"
        >
          {showMenuBar && (
            <MenuBar
              openHotkeyDialog={openHotkeyDialog}
              {...pick(this.props, userDefinedHandlersAndOpts)}
              onSave={onSave} //needs to be passed so that editor commands will have it
              style={{ marginLeft: 0 }}
              editorName={editorName}
            />
          )}
          {displayMenuBarAboveTools && showMenuBar ? (
            <div
              className="veTools-displayMenuBarAboveTools"
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: 15,
                flexWrap: "wrap"
                // width: "100%"
              }}
            >
              {items}
            </div>
          ) : (
            items
          )}
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

