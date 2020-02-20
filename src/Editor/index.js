import { debounce, get } from "lodash";
// import sizeMe from "react-sizeme";
import { showContextMenu } from "teselagen-react-components";
import {
  Button,
  ButtonGroup,
  Intent,
  Icon,
  Tooltip,
  ContextMenu
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import Dialogs, { dialogOverrides } from "../Dialogs";
import VersionHistoryView from "../VersionHistoryView";
import { importSequenceFromFile } from "../withEditorProps";
import "tg-react-reflex/styles.css";
import React from "react";
// import DrawChromatogram from "./DrawChromatogram";
import AlignmentView from "../AlignmentView";
// import * as customIcons from "teselagen-react-components";
// import { Button } from "@blueprintjs/core";
import { compose } from "redux";
//tnr: this can be removed once https://github.com/leefsmp/Re-Flex/pull/30 is merged and deployed
/* eslint-disable */
import { connectToEditor, handleSave } from "../withEditorProps";
import { withHandlers } from "recompose";

import CommandHotkeyHandler from "./CommandHotkeyHandler";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "../Reflex";
/* eslint-enable */

import { flatMap, map, filter, pick, camelCase } from "lodash";

import ToolBar from "../ToolBar";
import CircularView from "../CircularView";
import LinearView from "../LinearView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import DropHandler from "./DropHandler";
import Properties from "../helperComponents/PropertiesDialog";
import "./style.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DigestTool from "../DigestTool/DigestTool";
import { insertItem, removeItem } from "../utils/arrayUtils";
import Mismatches from "../AlignmentView/Mismatches";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const userDefinedHandlersAndOpts = [
  "readOnly",
  "shouldAutosave",
  "hideSingleImport",
  "disableSetReadOnly",
  "showReadOnly",
  "showCircularity",
  "showAvailability",
  "showGCContent",
  "GCDecimalDigits",
  "fullscreenMode",
  "onNew",
  "onImport",
  "onSave",
  "onSaveAs",
  "alwaysAllowSave",
  "onRename",
  "getVersionList",
  "getSequenceAtVersion",
  "onDuplicate",
  "onSelectionOrCaretChanged",
  "beforeSequenceInsertOrDelete",
  "onDelete",
  "onCopy",
  "onCreateNewFromSubsequence",
  "onPaste",
  "menuFilter"
];

const _panelMap = {
  circular: CircularView,
  sequence: RowView,
  rail: LinearView,
  // alignmentTool: AlignmentTool,
  alignment: AlignmentView,
  digestTool: DigestTool,
  properties: {
    comp: Properties,
    panelSpecificPropsToSpread: ["PropertiesProps"]
  },
  mismatches: Mismatches
};

// fake data generator
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const tabHeight = 34;

const getListStyle = (isDraggingOver /* isDragging */) => {
  return {
    display: "flex",
    alignItems: "flex-end",
    flex: "0 0 auto",
    flexDirection: "row",
    overflowX: "auto", //can't be overflowX: "scroll" because firefox has issues with hiding the scroll bar https://github.com/TeselaGen/openVectorEditor/issues/352
    borderBottom: "1px solid lightgray",
    borderTop: "1px solid lightgray",
    paddingTop: 3,
    paddingBottom: 3,
    // ...(isDragging && { opacity: 0.7, zIndex: 10000, background: "lightgrey" }),
    ...(isDraggingOver && { background: "#e5f3ff" })
  };
};

const getSplitScreenListStyle = (isDraggingOver, isDragging) => {
  return {
    position: "absolute",
    // top: "-20px",
    height: "100%",
    // background: "lightgreen",
    width: "50%",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    wordWrap: "normal",
    opacity: 0,
    ...(isDragging && { opacity: 0.7, zIndex: 10000, background: "lightgrey" }),
    ...(isDraggingOver && { background: "lightblue" }),
    left: "50%"
  };
};

export class Editor extends React.Component {
  state = {
    isHotkeyDialogOpen: false,
    tabDragging: false,
    previewModeFullscreen: false
  };

  getExtraPanel = (/*panelOptions */) => {
    return [];
  };

  getChildContext() {
    //tnrtodo this will need to be updated once blueprint uses the react 16 api
    return { blueprintPortalClassName: "ove-portal" };
  }
  componentDidUpdate(prevProps) {
    //autosave if necessary!
    if (
      this.props.shouldAutosave &&
      prevProps.sequenceData &&
      prevProps.sequenceData.stateTrackingId &&
      this.props.sequenceData.stateTrackingId !==
        prevProps.sequenceData.stateTrackingId
    ) {
      this.props.handleSave();
    }
  }
  updateDimensions = debounce(() => {
    // (this.hasFullscreenPanel || this.fitHeight) &&
    this.setState({ randomRerenderTrigger: Math.random() });
  }, 100);

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.forceUpdate(); //we need to do this to get an accurate height measurement on first render
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  onTabDragStart = () => {
    this.setState({ tabDragging: true });
  };

  onTabDragEnd = result => {
    this.setState({ tabDragging: false });
    const { panelsShownUpdate, panelsShown } = this.props;
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let newPanelsShown;
    if (result.destination.droppableId !== result.source.droppableId) {
      //we're moving a tab from one group to another group
      newPanelsShown = map(
        [...panelsShown, ...(panelsShown.length === 1 && [[]])],
        (panelGroup, groupIndex) => {
          const panelToMove =
            panelsShown[
              Number(result.source.droppableId.replace("droppable-id-", ""))
            ][result.source.index];
          if (
            Number(groupIndex) ===
            Number(result.destination.droppableId.replace("droppable-id-", ""))
          ) {
            //we're adding to this group
            return insertItem(
              panelGroup.map(tabPanel => ({ ...tabPanel, active: false })),
              { ...panelToMove, active: true },
              result.destination.index
            );
          } else if (
            Number(groupIndex) ===
            Number(result.source.droppableId.replace("droppable-id-", ""))
          ) {
            // we're removing from this group
            return removeItem(panelGroup, result.source.index).map(
              (tabPanel, index) => {
                return {
                  ...tabPanel,
                  ...(panelToMove.active && index === 0 && { active: true })
                };
              }
            );
          } else {
            return panelGroup;
          }
        }
      );
    } else {
      //we're moving tabs within the same group
      newPanelsShown = map(panelsShown, (panelGroup, groupIndex) => {
        if (
          Number(groupIndex) ===
          Number(result.destination.droppableId.replace("droppable-id-", ""))
        ) {
          //we'removing a tab around in this group
          return reorder(
            panelGroup.map((tabPanel, i) => {
              return {
                ...tabPanel,
                active: result.source.index === i
              };
            }),
            result.source.index,
            result.destination.index
          );
        }
        return panelGroup;
      });
    }
    filter(newPanelsShown, panelGroup => {
      return panelGroup.length;
    });
    panelsShownUpdate(newPanelsShown);
  };

  getPanelsToShow = () => {
    const { panelsShown } = this.props;
    return map(panelsShown);
  };

  onPreviewModeButtonContextMenu = e => {
    const { previewModeButtonMenu } = this.props;
    e.preventDefault();
    if (previewModeButtonMenu) {
      ContextMenu.show(previewModeButtonMenu, {
        left: e.clientX,
        top: e.clientY
      });
    }
  };

  closeHotkeyDialog = () => {
    this.setState({ isHotkeyDialogOpen: false });
  };
  openHotkeyDialog = () => {
    this.setState({ isHotkeyDialogOpen: true });
  };

  togglePreviewFullscreen = () => {
    const { togglePreviewFullscreen } = this.props;
    if (togglePreviewFullscreen) togglePreviewFullscreen();
    else {
      this.setState({
        previewModeFullscreen: !this.state.previewModeFullscreen
      });
    }
  };

  render() {
    const {
      previewModeFullscreen: uncontrolledPreviewModeFullscreen
    } = this.state;
    const {
      ToolBarProps = {},
      StatusBarProps = {},
      extraRightSidePanel,
      editorName,
      height: _height,
      showCircularity,
      hideSingleImport,
      minHeight = 400,
      showMenuBar,
      displayMenuBarAboveTools = true,
      updateSequenceData,
      readOnly,
      setPanelAsActive,
      style = {},
      maxAnnotationsToDisplay = {},
      togglePanelFullScreen,
      collapseSplitScreen,
      expandTabToSplitScreen,
      closePanel,
      onSave,
      caretPositionUpdate,
      getVersionList,
      getSequenceAtVersion,
      VersionHistoryViewProps,
      sequenceData = {},
      fullScreenOffsets,
      withPreviewMode,
      isFullscreen,
      handleFullscreenClose,
      previewModeFullscreen: controlledPreviewModeFullscreen,
      previewModeButtonMenu
    } = this.props;

    if (
      !this.props.noVersionHistory &&
      this.props.versionHistory &&
      this.props.versionHistory.viewVersionHistory
    ) {
      return (
        <VersionHistoryView
          {...{
            onSave, //we need to pass this user defined handler
            updateSequenceData,
            caretPositionUpdate,
            editorName,
            sequenceData,
            getVersionList,
            getSequenceAtVersion,
            ...VersionHistoryViewProps
          }}
        />
      );
    }
    const previewModeFullscreen = !!(
      uncontrolledPreviewModeFullscreen ||
      controlledPreviewModeFullscreen ||
      isFullscreen
    );
    const editorNode =
      document.querySelector(".veEditor") ||
      document.querySelector(".preview-mode-container");

    let height = Math.max(
      minHeight,
      (editorNode &&
        editorNode.parentNode &&
        editorNode.parentNode.clientHeight) ||
        0
    );

    if (_height) height = Math.max(minHeight, _height);

    let editorDimensions = {
      height,
      dimensions: {
        height
      }
    };

    if (withPreviewMode && !previewModeFullscreen) {
      return (
        <div style={{ ...style }} className="preview-mode-container">
          <div style={{ position: "relative" }}>
            <div className="preview-mode-buttons">
              <ButtonGroup className="preview-mode-view-fullscreen">
                <Button
                  text="Open Editor"
                  intent={Intent.PRIMARY}
                  onClick={this.togglePreviewFullscreen}
                />
                {previewModeButtonMenu && (
                  <Button
                    icon="caret-down"
                    intent={Intent.PRIMARY}
                    onClick={this.onPreviewModeButtonContextMenu}
                  />
                )}
              </ButtonGroup>
            </div>
            <div
              style={{ padding: 40 }}
              className="preview-mode-simple-sequence-view"
            >
              <SimpleCircularOrLinearView
                sequenceData={sequenceData}
                tabHeight={tabHeight}
                editorName={editorName}
                height={null}
                isProtein={sequenceData.isProtein}
                annotationLabelVisibility={{
                  features: false,
                  parts: false,
                  cutsites: false,
                  primers: false
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    const { tabDragging } = this.state;
    let xOffset = 0;
    let yOffset = 0;
    if (fullScreenOffsets) {
      xOffset = fullScreenOffsets.xOffset || 0;
      yOffset = fullScreenOffsets.yOffset || 0;
    }
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    const windowDimensions = {
      width: x - xOffset,
      height: Math.max(y, minHeight) - yOffset
      //  document.body.getBoundingClientRect().height
    };
    const reflexElementProps = {
      propagateDimensions: true,
      // resizeHeight: true,
      renderOnResizeRate: 50,
      renderOnResize: true,
      className: "ve-panel"
    };

    const panelsToShow = this.getPanelsToShow();
    this.hasFullscreenPanel = false;
    map(panelsToShow, panelGroup => {
      panelGroup.forEach(({ fullScreen }) => {
        if (fullScreen) this.hasFullscreenPanel = true;
      });
    });
    const pickedUserDefinedHandlersAndOpts = pick(
      this.props,
      userDefinedHandlersAndOpts
    );
    const panels = flatMap(panelsToShow, (panelGroup, index) => {
      // let activePanelId
      let activePanelId;
      let activePanelType;
      let isFullScreen;
      let panelPropsToSpread = {};
      panelGroup.forEach(panelProps => {
        const { type, id, active, fullScreen } = panelProps;
        if (fullScreen) isFullScreen = true;
        if (active) {
          activePanelType = type || id;
          activePanelId = id;
          panelPropsToSpread = panelProps;
        }
      });
      if (this.hasFullscreenPanel && !isFullScreen) {
        return;
      }

      if (isFullScreen) {
        editorDimensions = {
          ...editorDimensions,
          ...windowDimensions,
          dimensions: windowDimensions
        };
      }
      const panelMap = {
        ..._panelMap,
        ...this.props.panelMap
      };

      const Panel =
        (panelMap[activePanelType] && panelMap[activePanelType].comp) ||
        panelMap[activePanelType];
      const panelSpecificProps =
        panelMap[activePanelType] &&
        panelMap[activePanelType].panelSpecificProps;
      const panelSpecificPropsToSpread =
        panelMap[activePanelType] &&
        panelMap[activePanelType].panelSpecificPropsToSpread;
      let panel = Panel ? (
        <Panel
          {...pickedUserDefinedHandlersAndOpts}
          {...(panelSpecificProps && pick(this.props, panelSpecificProps))}
          {...(panelSpecificPropsToSpread &&
            panelSpecificPropsToSpread.reduce((acc, key) => {
              acc = { ...acc, ...get(this.props, key) };
              return acc;
            }, {}))}
          maxAnnotationsToDisplay={maxAnnotationsToDisplay}
          key={activePanelId}
          rightClickOverrides={this.props.rightClickOverrides}
          clickOverrides={this.props.clickOverrides}
          {...panelPropsToSpread}
          editorName={editorName}
          isProtein={sequenceData.isProtein}
          tabHeight={tabHeight}
          {...editorDimensions}
          isInsideEditor //pass this prop to let the sub components know they're being rendered as an editor tab
        />
      ) : (
        <div> No Panel Found!</div>
      );

      const showTabRightClickContextMenu = (e, id) => {
        const tabIdToUse = id || activePanelId;
        showContextMenu(
          [
            {
              onClick: () => {
                panelsToShow.length > 1
                  ? collapseSplitScreen(tabIdToUse)
                  : expandTabToSplitScreen(tabIdToUse);
              },
              text:
                panelsToShow.length > 1
                  ? "Collapse Split Screen"
                  : "View in Split Screen"
            },
            {
              onClick: () => {
                togglePanelFullScreen(tabIdToUse);
              },
              text: "View in Fullscreen"
            }
          ],
          undefined,
          e
        );
        e.preventDefault();
        e.stopPropagation();
      };

      const toReturn = [];
      if (index > 0) {
        toReturn.push(
          <ReflexSplitter
            key={activePanelId + "splitter"}
            style={{
              // height: height + 38,
              zIndex: 1
            }}
            propagate
          />
        );
      }
      toReturn.push(
        <ReflexElement
          key={activePanelId}
          activePanelId={activePanelId}
          minSize="200"
          {...reflexElementProps}
        >
          {[
            <Droppable //the tab holder
              key={"droppable-id-" + index.toString()}
              direction="horizontal"
              droppableId={"droppable-id-" + index.toString()}
            >
              {(provided, snapshot) => (
                <div
                  className="ve-draggable-tabs"
                  data-test={"ve-draggable-tabs" + index}
                  ref={provided.innerRef}
                  style={{
                    height: tabHeight,
                    paddingLeft: 3,
                    ...getListStyle(snapshot.isDraggingOver /* , tabDragging */)
                  }}
                >
                  {panelGroup.map(({ id, name, canClose }, index) => {
                    return (
                      <Draggable key={id} index={index} draggableId={id}>
                        {(provided, snapshot) => (
                          <div
                            style={{
                              wordWrap: "normal",
                              flex: "0 0 auto",
                              maxWidth: "100%",
                              fontSize: "14px"
                            }}
                            onClick={() => {
                              setPanelAsActive(id);
                            }}
                          >
                            <div
                              onContextMenu={e => {
                                showTabRightClickContextMenu(e, id);
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                // some basic styles to make the items look a bit nicer
                                userSelect: "none",
                                // change background colour if dragging
                                background: snapshot.isDragging
                                  ? "lightgreen"
                                  : "none",
                                cursor: "move",
                                flex: "0 0 auto",
                                ...provided.draggableProps.style
                              }}
                            >
                              <div
                                style={{
                                  padding: 3,
                                  borderBottom:
                                    id === activePanelId
                                      ? "2px solid #106ba3"
                                      : "none",
                                  color:
                                    id === activePanelId
                                      ? "#106ba3"
                                      : "undefined",
                                  marginLeft: 13,
                                  marginRight: 13
                                }}
                                className={
                                  (id === activePanelId ? "veTabActive " : "") +
                                  camelCase("veTab-" + (name || id))
                                }
                              >
                                {isFullScreen && (
                                  <div //we need this div to wrap the tooltip to help the tooltip stay in the correct position https://github.com/TeselaGen/openVectorEditor/issues/436
                                    style={{
                                      zIndex: 15002,
                                      position: "fixed",
                                      top: 15,
                                      right: 25
                                    }}
                                  >
                                    <Tooltip
                                      position="left"
                                      content="Minimize Tab"
                                    >
                                      <Button
                                        minimal
                                        icon="minimize"
                                        onClick={() => {
                                          togglePanelFullScreen(activePanelId);
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                )}
                                {name || id}
                                {canClose && (
                                  <Icon
                                    icon="small-cross"
                                    onClick={() => {
                                      closePanel(id);
                                    }}
                                    style={{ paddingLeft: 5 }}
                                    className="ve-clickable"
                                  />
                                )}
                              </div>
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>,
            ...(panelsToShow.length === 1
              ? [
                  <Droppable //extra add tab box (only shown when there is 1 tab being shown)!
                    key="extra-drop-box"
                    direction="horizontal"
                    droppableId={"droppable-id-" + (index + 1).toString()}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getSplitScreenListStyle(
                          snapshot.isDraggingOver,
                          tabDragging
                        )}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: "45%",
                            top: "45%",
                            fontSize: 26
                          }}
                        >
                          {" "}
                          + Add Tab
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ]
              : []),
            isFullScreen ? (
              <div
                key="veWhiteBackground"
                className="veWhiteBackground"
                style={{
                  zIndex: 15000,
                  position: "fixed",
                  top: 0,
                  left: 0,
                  ...windowDimensions
                }}
              >
                {panel}
              </div>
            ) : (
              panel
            )
          ]}
        </ReflexElement>
      );
      return toReturn;
    });
    if (extraRightSidePanel) {
      panels.push(
        <ReflexSplitter
          key="extraRightSidePanelSplitter"
          style={{
            zIndex: 1
          }}
          propagate
        />
      );

      panels.push(
        <ReflexElement
          key="extraRightSidePanel"
          minSize="350"
          maxSize="350"
          {...reflexElementProps}
        >
          {extraRightSidePanel}
        </ReflexElement>
      );
    }

    return (
      <DropHandler
        key="dropHandler"
        importSequenceFromFile={this.props.importSequenceFromFile}
        disabled={readOnly || hideSingleImport}
        style={{
          width: "100%",
          maxWidth: "100%",
          // ...(fitHeight && {
          // height: "100%",
          //  }),
          position: "relative",
          // height: "100%",
          // ...(fitHeight && {
          height,
          minHeight,
          display: "flex",
          flexDirection: "column",
          ...(previewModeFullscreen && {
            background: "white",
            zIndex: 15000,
            position: "fixed",
            // paddingTop: 20,
            top: yOffset || 0,
            left: xOffset || 0,
            ...windowDimensions
          }),
          ...style
        }}
        className="veEditor"
      >
        <Dialogs
          editorName={editorName}
          {...pick(this.props, dialogOverrides)}
        />
        <ToolBar
          {...pickedUserDefinedHandlersAndOpts}
          openHotkeyDialog={this.openHotkeyDialog}
          key="toolbar"
          showMenuBar={showMenuBar}
          displayMenuBarAboveTools={displayMenuBarAboveTools}
          handleFullscreenClose={
            handleFullscreenClose || this.togglePreviewFullscreen
          }
          isProtein={sequenceData.isProtein}
          userDefinedHandlersAndOpts={userDefinedHandlersAndOpts}
          closeFullscreen={
            !!(isFullscreen ? handleFullscreenClose : previewModeFullscreen)
          }
          {...{
            modifyTools: this.props.modifyTools,
            contentLeft: this.props.contentLeft,
            editorName,
            toolList: this.props.toolList
          }}
          withDigestTool
          {...ToolBarProps}
        />

        <CommandHotkeyHandler
          menuSearchHotkey={this.props.menuSearchHotkey}
          hotkeyDialogProps={{
            isOpen: this.state.isHotkeyDialogOpen,
            onClose: this.closeHotkeyDialog
          }}
          {...pickedUserDefinedHandlersAndOpts}
          editorName={editorName}
        />

        <div
          style={{
            position: "relative",
            flexGrow: "1",
            minHeight: 0,
            display: "flex"
          }}
          className="tg-editor-container"
          id="section-to-print"
        >
          <DragDropContext
            onDragStart={this.onTabDragStart}
            onDragEnd={this.onTabDragEnd}
          >
            <ReflexContainer
              onPanelCollapse={({ activePanelId }) => {
                this.props.collapsePanel(activePanelId);
              }}
              /* style={{}} */ orientation="vertical"
            >
              {panels}
            </ReflexContainer>
          </DragDropContext>
        </div>

        <StatusBar
          {...pickedUserDefinedHandlersAndOpts}
          isProtein={sequenceData.isProtein}
          showCircularity={showCircularity && !sequenceData.isProtein}
          editorName={editorName}
          {...StatusBarProps}
        />
      </DropHandler>
    );
  }
}

Editor.childContextTypes = {
  blueprintPortalClassName: PropTypes.string
};

export default compose(
  connectToEditor(({ panelsShown, versionHistory, sequenceData = {} }) => {
    return {
      panelsShown,
      versionHistory,
      sequenceData
    };
  }),
  withHandlers({ handleSave, importSequenceFromFile })
)(Editor);
