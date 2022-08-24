import React from "react";
import { flatMap, isString, pick } from "lodash";
import versionHistoryTool from "./versionHistoryTool";
// import {connectToEditor} from "../withEditorProps";
import MenuBar from "../MenuBar";
import "./style.css";
import { Button, Tooltip } from "@blueprintjs/core";

import downloadTool from "./downloadTool";
import importTool from "./importTool";
import cutsiteTool from "./cutsiteTool";
import featureTool from "./featureTool";
import partTool from "./partTool";
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
import isMobile from "is-mobile";
import { useMemo } from "react";

const allTools = {
  downloadTool,
  importTool,
  cutsiteTool,
  alignmentTool,
  featureTool,
  partTool,
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

export function ToolBar(props) {
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
    annotationsToSupport,
    handleFullscreenClose,
    closeFullscreen,
    additionalTopRightToolbarButtons,
    toolList = defaultToolList,
    ...rest
  } = props;
  const userDefinedProps = {
    ...pick(props, userDefinedHandlersAndOpts)
  };

  const toolListToUse = useMemo(() => {
    return flatMap(toolList, (toolNameOrOverrides) => {
      let toolName;
      let toolOverride;
      if (isString(toolNameOrOverrides)) {
        toolName = toolNameOrOverrides;
      } else {
        toolOverride = toolNameOrOverrides;
        toolName = toolNameOrOverrides.name;
      }

      if (
        toolName === "oligoTool" &&
        annotationsToSupport &&
        annotationsToSupport.primers === false
      )
        return [];

      const Tool = toolOverride
        ? allTools[toolOverride.name]
        : allTools[toolName];
      if (!Tool) {
        console.error(
          "You're trying to load a tool that doesn't appear to exist: " +
            toolName
        );
        return [];
      }

      if (isProtein) {
        if (
          toolName === "cutsiteTool" ||
          toolName === "orfTool" ||
          toolName === "alignmentTool"
        ) {
          return [];
        }
      }
      if (toolName === "saveTool" && !onSave) {
        return [];
      } //don't show the option to save if no onSave handler is passed

      return { toolName, toolOverride, Tool };
    });
  }, [toolList, annotationsToSupport, isProtein, onSave]);

  let items = flatMap(
    toolListToUse,
    ({ toolName, toolOverride, Tool }, index) => {
      if (!Tool) return [];
      return (
        <Tool
          {...rest}
          {...userDefinedProps}
          toolbarItemProps={{
            ...userDefinedProps,
            index,
            toolName,
            editorName,
            ...toolOverride
          }}
          editorName={editorName}
          key={toolName}
        />
      );
    }
  );

  if (modifyTools) {
    items = modifyTools(items);
  }

  return (
    <div className="veToolbar-outer" style={{ display: "flex" }}>
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
            {...userDefinedProps}
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
              paddingLeft: 15,
              paddingRight: 15,
              flexWrap: "wrap",
              ...(isMobile() && {
                overflow: "auto",
                flexWrap: "nowrap",
                width: "100%"
              })
              // width: "100%"
            }}
          >
            {items}
          </div>
        ) : (
          items
        )}
      </div>
      {additionalTopRightToolbarButtons}
      {closeFullscreen && (
        <CloseFullscreenButton onClick={handleFullscreenClose} />
      )}
    </div>
  );
}
const CloseFullscreenButton = (props) => {
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

const defaultToolList = [
  "saveTool",
  "downloadTool",
  "importTool",
  "undoTool",
  "redoTool",
  "cutsiteTool",
  "featureTool",
  "partTool",
  "oligoTool",
  "orfTool",
  "alignmentTool",
  "editTool",
  "findTool",
  "visibilityTool"
];
