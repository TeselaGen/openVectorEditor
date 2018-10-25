import { debounce } from "lodash";

import { showContextMenu } from "teselagen-react-components";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Dialogs from "../Dialogs";
import VersionHistoryView from "../VersionHistoryView";
import "tg-react-reflex/styles.css";
import React from "react";
// import DrawChromatogram from "./DrawChromatogram";
import AlignmentView from "../AlignmentView";
// import * as customIcons from "teselagen-react-components";
// import { Button } from "@blueprintjs/core";
import { compose } from "redux";
//tnr: this can be removed once https://github.com/leefsmp/Re-Flex/pull/30 is merged and deployed
/* eslint-disable */

import CommandHotkeyHandler from "./CommandHotkeyHandler";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "../Reflex";
/* eslint-enable */

import { Icon, Tooltip, ContextMenu } from "@blueprintjs/core";

import { flatMap, map, filter } from "lodash";

import ToolBar from "../ToolBar";
import CircularView, {
  CircularView as CircularViewUnconnected
} from "../CircularView";
import LinearView, { LinearView as LinearViewUnconnected } from "../LinearView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import withEditorProps from "../withEditorProps";
import DropHandler from "./DropHandler";
import Properties from "../helperComponents/PropertiesDialog";
import MenuBar from "../MenuBar";
import "./style.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DigestTool from "../DigestTool/DigestTool";
import { insertItem, removeItem } from "../utils/arrayUtils";
import Mismatches from "../AlignmentView/Mismatches";

const panelMap = {
  circular: CircularView,
  sequence: RowView,
  rail: LinearView,
  // alignmentTool: AlignmentTool,
  alignment: AlignmentView,
  digestTool: DigestTool,
  properties: Properties,
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

const getListStyle = (isDraggingOver, isDragging) => {
  return {
    display: "flex",
    alignItems: "flex-end",
    flex: "0 0 auto",
    flexDirection: "row",
    overflowX: "scroll",
    borderBottom: "1px solid lightgray",
    borderTop: "1px solid lightgray",
    paddingTop: 3,
    paddingBottom: 3,
    ...(isDragging && { opacity: 0.7, zIndex: 10000, background: "lightgrey" }),
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
    tabDragging: false,
    previewModeFullscreen: false
  };
  // componentWillMount(){
  //   // lastSavedId
  //   // window.onbeforeunload = function () {
  //   //     return "You may not want to leave the editor if you have any unsaved work.";
  //   // };
  // }

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
      this.props.sequenceData.stateTrackingId !==
        prevProps.sequenceData.stateTrackingId
    ) {
      this.props.handleSave();
    }
  }
  updateDimensions = debounce(() => {
    (this.hasFullscreenPanel || this.fitHeight) &&
      this.setState({ randomRerenderTrigger: Math.random() });
  }, 100);

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
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
            panelsShown[Number(result.source.droppableId)][result.source.index];
          if (Number(groupIndex) === Number(result.destination.droppableId)) {
            //we're adding to this group
            return insertItem(
              panelGroup.map(tabPanel => ({ ...tabPanel, active: false })),
              { ...panelToMove, active: true },
              result.destination.index
            );
          } else if (Number(groupIndex) === Number(result.source.droppableId)) {
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
        if (Number(groupIndex) === Number(result.destination.droppableId)) {
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
      doNotUseAbsolutePosition = false,
      ToolBarProps = {},
      StatusBarProps = {},
      // extraLeftSidePanel,
      extraRightSidePanel,
      // FindBarProps = {},
      editorName,
      // findTool = {},
      // containerWidth,
      height = 500,
      showMenuBar,
      updateSequenceData,
      setPanelAsActive,
      style = {},
      togglePanelFullScreen,
      collapseSplitScreen,
      expandTabToSplitScreen,
      closePanel,
      fitWidth,
      onSave,
      caretPositionUpdate,
      getVersionList,
      getSequenceAtVersion,
      VersionHistoryViewProps,
      fitHeight: _fitHeight, //use fitHeight: true to tell the editorto expand to fill to as much height as possible
      sequenceData = {},
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
            onSave,
            updateSequenceData,
            caretPositionUpdate,
            sequenceData,
            getVersionList,
            getSequenceAtVersion,
            ...VersionHistoryViewProps
          }}
        />
      );
    }
    const previewModeFullscreen =
      uncontrolledPreviewModeFullscreen ||
      controlledPreviewModeFullscreen ||
      isFullscreen;
    const fitHeight = _fitHeight || previewModeFullscreen;

    this.fitHeight = fitHeight;
    const sharedProps = {
      editorName,
      tabHeight,
      fitHeight: previewModeFullscreen,
      ...this.props
    };

    let editorDimensions = {
      height,
      dimensions: {
        height
      }
    };

    if (withPreviewMode && !previewModeFullscreen) {
      const Panel = sequenceData.circular
        ? CircularViewUnconnected
        : LinearViewUnconnected;
      return (
        <div className="preview-mode-container">
          <div style={{ position: "relative" }}>
            <Panel
              {...sharedProps}
              {...editorDimensions}
              annotationLabelVisibility={{
                features: false,
                parts: false,
                cutsites: false,
                primers: false
              }}
            />
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
        </div>
      );
    }

    const { tabDragging } = this.state;
    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    const windowDimensions = {
      width: x,
      height: y
      //  document.body.getBoundingClientRect().height
    };

    const panelsToShow = this.getPanelsToShow();
    this.hasFullscreenPanel = false;
    map(panelsToShow, panelGroup => {
      panelGroup.forEach(({ fullScreen }) => {
        if (fullScreen) this.hasFullscreenPanel = true;
      });
    });
    const panels = flatMap(panelsToShow, (panelGroup, index) => {
      // let activePanelId
      let activePanelId;
      let activePanelType;
      let isFullScreen;
      let propsToSpread = {};
      panelGroup.forEach(panelProps => {
        const { type, id, active, fullScreen } = panelProps;
        if (fullScreen) isFullScreen = true;
        if (active) {
          activePanelType = type || id;
          activePanelId = id;
          propsToSpread = panelProps;
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

      const Panel = panelMap[activePanelType];
      let panel = Panel ? (
        <Panel
          key={activePanelId}
          {...propsToSpread}
          {...sharedProps}
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
                  ? "Make Tab Primary"
                  : "View Side By Side"
            },
            {
              onClick: () => {
                togglePanelFullScreen(tabIdToUse);
              },
              text: "Make Tab Fullscreen"
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
          propagateDimensions={true}
          resizeWidth={fitWidth}
          resizeHeight={
            fitHeight || !!(withPreviewMode && previewModeFullscreen)
          } //use the !! to force a boolean
          renderOnResizeRate={50}
          renderOnResize={true}
          className="ve-panel"
        >
          {isFullScreen ? (
            <Tooltip position={"left"} content="Minimize Tab">
              <Button
                style={{
                  zIndex: 15002,
                  position: "fixed",
                  top: 15,
                  right: 25
                }}
                minimal
                icon="minimize"
                onClick={() => {
                  togglePanelFullScreen(activePanelId);
                }}
              />
            </Tooltip>
          ) : (
            <Icon
              className={"veRightClickTabMenu"}
              onClick={showTabRightClickContextMenu}
              icon="more"
              style={{
                top: "5px",
                transform: "rotate(90deg)",
                position: "absolute",
                cursor: "pointer",
                marginTop: "5px"
              }}
            />
          )}

          {[
            <Droppable
              key={"droppableKey"}
              direction="horizontal"
              droppableId={index.toString()}
            >
              {(provided, snapshot) => (
                <div
                  className={"ve-draggable-tabs"}
                  ref={provided.innerRef}
                  style={{
                    height: tabHeight,
                    paddingLeft: 3,
                    ...getListStyle(snapshot.isDraggingOver, tabDragging)
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
                              >
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
            ...(panelsToShow.length === 1 && [
              <Droppable
                key={"extra-drop-box"}
                direction="horizontal"
                droppableId={(index + 1).toString()}
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
            ]),
            isFullScreen ? (
              <div
                key={"veWhiteBackground"}
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
          key={"extraRightSidePanelSplitter"}
          style={{
            zIndex: 1
          }}
          propagate
        />
      );
      panels.push(
        <ReflexElement
          key={"extraRightSidePanel"}
          minSize="350"
          maxSize="350"
          propagateDimensions={true}
          resizeHeight={
            fitHeight || !!(withPreviewMode && previewModeFullscreen)
          }
          renderOnResizeRate={50}
          renderOnResize={true}
          className="ve-panel"
        >
          {extraRightSidePanel}
        </ReflexElement>
      );
    }

    return (
      <DropHandler
        updateSequenceData={updateSequenceData}
        style={{
          width: "100%",
          ...(fitHeight && { height: "100%" }),
          position: "relative",
          ...(previewModeFullscreen && {
            background: "white",
            zIndex: 15000,
            position: "fixed",
            // paddingTop: 20,
            top: 0,
            left: 0,
            ...windowDimensions
          }),
          ...style
        }}
        className="veEditor"
      >
        {/* <AlignmentToolInner /> */}
        {/* <Button icon={customIcons.flaskIcon} text="flask" /> */}
        {/* <DrawChromatogram /> */}

        <div
          className={"veEditorInner"}
          style={{
            width: "100%",
            height: "100%",
            ...(fitHeight && {
              display: "flex",
              flexDirection: "column"
            }),
            // display: "flex",
            // flexDirection: "column",
            ...(doNotUseAbsolutePosition || fitHeight
              ? {}
              : { position: "absolute" })
          }}
        >
          {/* <button
            onClick={() => {
              document.body.addEventListener("keydown", e => {
              });
              let keyboardEvent = document.createEvent("KeyboardEvent");
              let initMethod =
                typeof keyboardEvent.initKeyboardEvent !== "undefined"
                  ? "initKeyboardEvent"
                  : "initKeyEvent";

              keyboardEvent[initMethod](
                "keydown", // event type : keydown, keyup, keypress
                true, // bubbles
                true, // cancelable
                window, // viewArg: should be window
                false, // ctrlKeyArg
                false, // altKeyArg
                true, // shiftKeyArg
                false, // metaKeyArg
                191, // keyCodeArg : unsigned long the virtual key code, else 0
                0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
              );
              document.body.dispatchEvent(keyboardEvent);
            }}
          >
            {" "}
            show key dialog{" "}
          </button> */}
          <Dialogs editorName={editorName} />

          <ToolBar
            menuBar={
              showMenuBar && (
                <MenuBar
                  style={{ marginLeft: 0 }}
                  editorName={editorName}
                  {...sharedProps}
                  trackFocus={false}
                />
              )
            }
            closeFullscreen={
              (isFullscreen
                ? handleFullscreenClose
                : previewModeFullscreen) && ( //make sure we have a fullscreen close handler if we're going to show this option
                <Tooltip content="Close Fullscreen Mode">
                  <Button
                    minimal
                    style={{
                      marginTop: 2,
                      marginRight: 2
                      // height: 30,
                      // width: 30
                    }}
                    // title="Close Fullscreen Mode"
                    onClick={
                      handleFullscreenClose || this.togglePreviewFullscreen
                    }
                    icon="minimize"
                  />
                </Tooltip>
                // <div
                //   className={"ve-clickable ve-close-panel-button"}
                //   style={{
                //     zIndex: 15001,
                //     position: "fixed",
                //     display: "inherit",
                //     top: 15,
                //     right: 15
                //   }}
                // >

                // </div>
              )
            }
            {...sharedProps}
            withDigestTool
            {...ToolBarProps}
          />
          <CommandHotkeyHandler {...sharedProps} />

          <div
            style={{ position: "relative", flexGrow: "1" }}
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

          <StatusBar {...sharedProps} {...StatusBarProps} />
        </div>
      </DropHandler>
    );
  }
}

Editor.childContextTypes = {
  blueprintPortalClassName: PropTypes.string
};

export default compose(withEditorProps)(Editor);
