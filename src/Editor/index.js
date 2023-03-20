import { debounce, find, some, isArray } from "lodash";
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

// import VersionHistoryView from "../VersionHistoryView";
import { showAddOrEditAnnotationDialog } from "../GlobalDialogUtils";

import "../Reflex/reflex-styles.css";

import React from "react";
import AlignmentView from "../AlignmentView";
// import * as customIcons from "teselagen-react-components";
// import { Button } from "@blueprintjs/core";
//tnr: this can be removed once https://github.com/leefsmp/Re-Flex/pull/30 is merged and deployed
/* eslint-disable */

import CommandHotkeyHandler from "./CommandHotkeyHandler";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "../Reflex";
/* eslint-enable */

import { flatMap, map, filter, pick, camelCase } from "lodash";

import { ToolBar } from "../ToolBar";
import CircularView from "../CircularView";
import LinearView from "../LinearView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import DropHandler from "./DropHandler";
import Properties from "../helperComponents/PropertiesDialog";
import "./style.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DigestTool from "../DigestTool/DigestTool";
import { insertItem, removeItem } from "../utils/arrayUtils";
import Mismatches from "../AlignmentView/Mismatches";
import SimpleCircularOrLinearView from "../SimpleCircularOrLinearView";
import { userDefinedHandlersAndOpts } from "./userDefinedHandlersAndOpts";
import { GlobalDialog } from "../GlobalDialog";
import isMobile from "is-mobile";
import { getClientX, getClientY } from "../utils/editorUtils";
import PCRTool from "../PCRTool/PCRTool";
import classNames from "classnames";
import { observer } from "mobx-react";

// if (process.env.NODE_ENV !== 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

const _panelMap = {
  circular: {
    comp: CircularView,
    panelSpecificProps: ["extraAnnotationProps"]
  },
  sequence: {
    comp: RowView,
    panelSpecificProps: ["extraAnnotationProps"]
  },
  rail: { comp: LinearView, panelSpecificProps: ["extraAnnotationProps"] },
  // alignmentTool: AlignmentTool,
  alignment: AlignmentView,
  digestTool: DigestTool,
  pcrTool: PCRTool,
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
    previewModeFullscreen: false
  };
  getExtraPanel = (/*panelOptions */) => {
    return [];
  };

  getChildContext() {
    //tnrtodo this will need to be updated once blueprint uses the react 16 api
    return { blueprintPortalClassName: "ove-portal" };
  }
  // componentDidUpdate(prevProps) {
    
  //   //autosave if necessary!
  //   if (
  //     this.props.shouldAutosave &&
  //     prevProps.sequenceData &&
  //     prevProps.sequenceData.stateTrackingId &&
  //     this.props.sequenceData.stateTrackingId !==
  //       prevProps.sequenceData.stateTrackingId
  //   ) {
  //     this.props.handleSave();
  //   }
  // }
  updateDimensions = debounce(() => {
    // (this.hasFullscreenPanel || this.fitHeight) &&
    this.setState({ randomRerenderTrigger: Math.random() });
  }, 100);

  componentDidMount() {
    if (isMobile()) {
      let firstActivePanelId;
      some(this.getPanelsToShow()[0], (panel) => {
        if (panel.active) {
          firstActivePanelId = panel.id;
          return true;
        }
      });
      this.props.collapseSplitScreen(firstActivePanelId);
    }
    if (this.props.sequenceData?.id) {
      let hasSetSpecificFilter;
      try {
        try {
          const cutsiteFilterDefaultForThisSpecificSeq = JSON.parse(
            localStorage.getItem(
              `tgInitialCutsiteFilter-${this.props.sequenceData?.id}`
            )
          );
          if (
            cutsiteFilterDefaultForThisSpecificSeq &&
            isArray(cutsiteFilterDefaultForThisSpecificSeq)
          ) {
            hasSetSpecificFilter = true;
            this.props.filteredRestrictionEnzymesUpdate(
              cutsiteFilterDefaultForThisSpecificSeq
            );
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
        const cutsiteFilterDefaultForAllSeqs = JSON.parse(
          localStorage.getItem(`tgInitialCutsiteFilter`)
        );

        if (
          !hasSetSpecificFilter &&
          cutsiteFilterDefaultForAllSeqs &&
          isArray(cutsiteFilterDefaultForAllSeqs)
        ) {
          this.props.filteredRestrictionEnzymesUpdate(
            cutsiteFilterDefaultForAllSeqs
          );
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    window.addEventListener("resize", this.updateDimensions);
    this.forceUpdate(); //we need to do this to get an accurate height measurement on first render
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  onTabDragStart = () => {
    this.setState({ tabDragging: true });
  };

  onTabDragEnd = (result) => {
    this.setState({ tabDragging: false });
    const { ed } = this.props;
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let newPanelsShown;
    if (result.destination.droppableId !== result.source.droppableId) {
      //we're moving a tab from one group to another group
      const secondPanel = ed.panelsShown.panels.length === 1 ? [[]] : [];
      const panelsToMapOver = [...ed.panelsShown.panels, ...secondPanel];
      newPanelsShown = map(panelsToMapOver, (panelGroup, groupIndex) => {
        const panelToMove =
          ed.panelsShown.panels[
            Number(result.source.droppableId.replace("droppable-id-", ""))
          ][result.source.index];
        if (
          Number(groupIndex) ===
          Number(result.destination.droppableId.replace("droppable-id-", ""))
        ) {
          //we're adding to this group
          return insertItem(
            panelGroup.map((tabPanel) => ({ ...tabPanel, active: false })),
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
      });
    } else {
      //we're moving tabs within the same group
      newPanelsShown = map(ed.panelsShown.panels, (panelGroup, groupIndex) => {
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
    filter(newPanelsShown, (panelGroup) => {
      return panelGroup.length;
    });
    ed.panelsShown.panelsShownUpdate(newPanelsShown);
  };

  getPanelsToShow = () => {
    const { ed } = this.props;
    if (isMobile()) return [flatMap(ed.panelsShown.panels)];
    return map(ed.panelsShown.panels);
  };

  onPreviewModeButtonContextMenu = (event) => {
    const { previewModeButtonMenu } = this.props;
    event.preventDefault();
    if (previewModeButtonMenu) {
      ContextMenu.show(previewModeButtonMenu, {
        left: getClientX(event),
        top: getClientY(event)
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
    const {
      ed,
      onPreviewModeFullscreenClose,
      previewModeFullscreen: controlledPreviewModeFullscreen
    } = this.props;

    if (ed.togglePreviewFullscreen) ed.togglePreviewFullscreen();
    const previewModeFullscreen = this.state.previewModeFullscreen;
    if (
      controlledPreviewModeFullscreen === undefined
        ? previewModeFullscreen
        : controlledPreviewModeFullscreen
    ) {
      onPreviewModeFullscreenClose && onPreviewModeFullscreenClose();
    }
    this.setState({
      previewModeFullscreen: !previewModeFullscreen
    });
  };

  render() {
    const { previewModeFullscreen: uncontrolledPreviewModeFullscreen } =
      this.state;
    const {
      ed,
      ToolBarProps = {},
      StatusBarProps = {},
      extraRightSidePanel,
      height: _height,
      hideSingleImport,
      minHeight = 400,
      showMenuBar,
      displayMenuBarAboveTools = true,
      // updateSequenceData,      readOnly,
      style = {},
      hideStatusBar,
      // getVersionList,
      // getSequenceAtVersion,
      // VersionHistoryViewProps,
      fullScreenOffsets,
      withPreviewMode,
      isFullscreen,
      handleFullscreenClose,
      previewModeFullscreen: controlledPreviewModeFullscreen,
      previewModeButtonMenu,
      allowPanelTabDraggable = true
    } = this.props;
    const { annotationsToSupport, editorName } = ed;
    // if (
    //   !this.props.noVersionHistory &&
    //   this.props.versionHistory &&
    //   this.props.versionHistory.viewVersionHistory
    // ) {
    //   return (
    //     <VersionHistoryView
    //       {...{
    //         onSave, //we need to pass this user defined handler
    //         ed,
    //         getVersionList,
    //         getSequenceAtVersion,
    //         ...VersionHistoryViewProps
    //       }}
    //     />
    //   );
    // }
    const previewModeFullscreen = !!(
      (controlledPreviewModeFullscreen === undefined
        ? uncontrolledPreviewModeFullscreen
        : controlledPreviewModeFullscreen) || isFullscreen
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
    try {
      //tnr: fixes https://github.com/TeselaGen/openVectorEditor/issues/689
      if (previewModeFullscreen) {
        window.document.body.classList.add("tg-no-scroll-body");
      } else {
        window.document.body.classList.remove("tg-no-scroll-body");
      }
    } catch (e) {
      console.warn(`Error 3839458:`, e);
    }

    if (withPreviewMode && !previewModeFullscreen) {
      this.inPreviewMode = true;
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
                ed={ed}
                tabHeight={tabHeight}
                height={null}
              />
            </div>
          </div>
        </div>
      );
    } else {
      this.inPreviewMode = false;
    }

    const tabDraggable = allowPanelTabDraggable && !isMobile();
    const { tabDragging } = this.state;
    let xOffset = 0;
    let yOffset = 0;
    if (fullScreenOffsets && previewModeFullscreen) {
      xOffset = fullScreenOffsets.xOffset || 0;
      yOffset = fullScreenOffsets.yOffset || 0;
    }
    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    const windowDimensions = {
      width: x - xOffset,
      height: Math.max(y, minHeight) - yOffset
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
    map(panelsToShow, (panelGroup) => {
      panelGroup.forEach(({ fullScreen }) => {
        if (fullScreen) this.hasFullscreenPanel = true;
      });
    });
    const panels = flatMap(panelsToShow, (panelGroup, index) => {
      // let activePanelId
      let activePanelId;
      let activePanelType;
      let isFullScreen;
      let panelPropsToSpread = {};
      panelGroup.forEach((panelProps) => {
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
      console.log(`panelMap:`, panelMap);
      const Panel =
        (panelMap[activePanelType] && panelMap[activePanelType].comp) ||
        panelMap[activePanelType];
      const panel = Panel ? (
        <Panel
          ed={ed}
          key={activePanelId}
          rightClickOverrides={this.props.rightClickOverrides}
          clickOverrides={this.props.clickOverrides}
          tabHeight={tabHeight}
          nameFontSizeCircularView={this.props.nameFontSizeCircularView}
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
                  ? ed.panelsShown.collapseSplitScreen(tabIdToUse)
                  : ed.panelsShown.expandTabToSplitScreen(tabIdToUse);
              },
              text:
                panelsToShow.length > 1
                  ? "Collapse Split Screen"
                  : "View in Split Screen"
            },
            {
              onClick: () => {
                ed.panelsShown.togglePanelFullScreen(tabIdToUse);
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
              {(drop_provided, drop_snapshot) => (
                <div
                  className={classNames("ve-draggable-tabs", {
                    "is-dragging-over": drop_snapshot.isDraggingOver
                  })}
                  data-test={"ve-draggable-tabs" + index}
                  ref={drop_provided.innerRef}
                  style={{
                    height: tabHeight,
                    paddingLeft: 3
                  }}
                >
                  {panelGroup.map(({ id, name, canClose }, index) => {
                    let nameToShow = name || id;
                    if (isMobile()) {
                      nameToShow = nameToShow.replace("Map", "");
                    }
                    return (
                      <Draggable
                        isDragDisabled={!tabDraggable}
                        key={id}
                        index={index}
                        draggableId={id}
                      >
                        {(provided) => (
                          <div
                            style={{
                              wordWrap: "normal",
                              flex: "0 0 auto",
                              maxWidth: "100%",
                              fontSize: "14px"
                            }}
                            onClick={() => {
                              ed.panelsShown.setPanelAsActive(id);
                            }}
                          >
                            <div
                              onContextMenu={(e) => {
                                showTabRightClickContextMenu(e, id);
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                // some basic styles to make the items look a bit nicer
                                userSelect: "none",
                                cursor: tabDraggable ? "move" : "pointer",
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
                                  camelCase("veTab-" + nameToShow)
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          ed.panelsShown.togglePanelFullScreen(
                                            activePanelId
                                          );
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                )}
                                {nameToShow}
                                {canClose && (
                                  <Icon
                                    icon="small-cross"
                                    onClick={() => {
                                      ed.panelsShown.closePanel(id);
                                    }}
                                    style={{ paddingLeft: 5 }}
                                    className="ve-clickable"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {drop_provided.placeholder}
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
                    {(drop_provided, drop_snapshot) => (
                      <div
                        ref={drop_provided.innerRef}
                        style={getSplitScreenListStyle(
                          drop_snapshot.isDraggingOver,
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
                        {drop_provided.placeholder}
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
      <React.Fragment>
        <DropHandler
          key="dropHandler"
          importSequenceFromFile={this.props.importSequenceFromFile}
          disabled={ed.readOnly || hideSingleImport}
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
          className={`veEditor ${editorName} ${
            previewModeFullscreen ? "previewModeFullscreen" : ""
          }`}
        >
          <ToolBar
            ed={ed}
            openHotkeyDialog={this.openHotkeyDialog}
            key="toolbar"
            showMenuBar={showMenuBar}
            displayMenuBarAboveTools={displayMenuBarAboveTools}
            handleFullscreenClose={
              handleFullscreenClose || this.togglePreviewFullscreen
            }
            isProtein={ed.isProtein}
            userDefinedHandlersAndOpts={userDefinedHandlersAndOpts}
            annotationsToSupport={annotationsToSupport}
            closeFullscreen={
              !!(isFullscreen ? handleFullscreenClose : previewModeFullscreen)
            }
            {...{
              modifyTools: this.props.modifyTools,
              contentLeft: this.props.contentLeft
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
            ed={ed}
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
          {!hideStatusBar && <StatusBar ed={ed} {...StatusBarProps} />}
        </DropHandler>
        <GlobalDialog
          ed={ed}
          dialogOverrides={pick(this.props, [
            "AddOrEditFeatureDialogOverride",
            "AddOrEditPartDialogOverride",
            "AddOrEditPrimerDialogOverride"
          ])}
        />
      </React.Fragment>
    );
  }
}

Editor.childContextTypes = {
  blueprintPortalClassName: PropTypes.string
};

export default observer(Editor);
