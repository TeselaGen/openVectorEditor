import React, { useState } from "react";
import { flatMap, pick } from "lodash";
import versionHistoryTool from "./versionHistoryTool";
// import {connectToEditor} from "../withEditorProps";
// import MenuBar from "../MenuBar";
import "./style.css";
import { Button, Tooltip, Icon } from "@blueprintjs/core";
import {
  EuiTabbedContent,
  EuiKeyPadMenu,
  EuiKeyPadMenuItem,
  EuiIcon
} from "@elastic/eui";

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
import { isString } from "util";
import isMobile from "is-mobile";
import { useMemo, Fragment } from "react";

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

const tabs = [
  {
    id: "view",
    name: "View",
    prepend: <Icon size={14} icon="eye-open" />,
    content: (
      <>
        <EuiKeyPadMenu className="veTabItems">
          <EuiKeyPadMenuItem label="Show All">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Hide All">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Features">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Parts">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="ORFs">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Translations">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Cut Sites">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
          <EuiKeyPadMenuItem label="Primers">
            <EuiIcon type="dashboardApp" size="l" />
          </EuiKeyPadMenuItem>
        </EuiKeyPadMenu>
      </>
    )
  },
  {
    id: "edit",
    name: "Edit",
    prepend: <Icon size={14} icon="annotation" />,
    content: <div>test</div>
  },
  {
    id: "select",
    name: "Select",
    prepend: <Icon size={14} icon="select" />,
    content: <div>test</div>
  },
  {
    id: "tools",
    name: "Tools",
    prepend: <Icon size={14} icon="build" />,
    content: <div>test</div>
  },
  {
    id: "cutsites",
    name: "Cut Sites",
    prepend: <Icon size={14} icon="cut" />,
    content: <div>test</div>
  },
  {
    id: "labels",
    name: "Labels",
    prepend: <Icon size={14} icon="tag" />,
    content: <div>test</div>
  }
];

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
    toolList = defaultToolList,
    ...rest
  } = props;
  const userDefinedProps = {
    ...pick(props, userDefinedHandlersAndOpts)
  };

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

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

  const onSelectTabChanged = (id) => {
    setSelectedTab(id);
  };

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
                idth: "100%",
                justifyContent: "center",
                flexWrap: "wrap"
              })
        }}
        className="veToolbar"
      >
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
            <EuiTabbedContent
              tabs={tabs}
              selectedTab={selectedTab}
              onTabClick={onSelectTabChanged}
            />
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
