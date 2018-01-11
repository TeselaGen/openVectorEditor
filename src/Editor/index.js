import LinearView from "../LinearView";
import Dialogs from "../Dialogs";
import "react-reflex/styles.css";
import React from "react";

import { compose } from "redux"; //tnr: this can be removed once https://github.com/leefsmp/Re-Flex/pull/30 is merged and deployed
// import Dimensions from "react-dimensions";
/* eslint-disable */ import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from "react-reflex";
/* eslint-enable */

import {
  Hotkey,
  Hotkeys,
  HotkeysTarget
  // Button
  // Tab2,
  // Tabs2
} from "@blueprintjs/core";

import {
  flatMap,
  // startCase,
  map,
  filter
} from "lodash";

// import SplitPane from "react-split-pane";
// import SplitPane from "../helperComponents/SplitPane/SplitPane";
import ToolBar from "../ToolBar";
import CircularView from "../CircularView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import FindBar from "../FindBar";
import withEditorProps from "../withEditorProps";
import DropHandler from "./DropHandler";
import { PropertiesInner } from "../helperComponents/PropertiesDialog";
import MenuBar from "../MenuBar";
import "./style.css";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DigestTool } from "../DigestTool/DigestTool";
import { insertItem, removeItem } from "../utils/arrayUtils";

// fake data generator
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// using some little inline style helpers to make the app look okay
// const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "none",
  cursor: "move",
  flex: "0 0 auto",
  // styles we need to apply on draggables
  ...draggableStyle
});
const sharedListStyles = {
  position: "absolute",
  // top: "-20px",
  height: "100%",
  // background: "lightgreen",
  width: "50%",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  wordWrap: "normal",
  opacity: 0.5
};
const getListStyle = isDraggingOver => {
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
    ...(isDraggingOver && { background: "#e5f3ff" })
  };
};

const getSplitScreenListStyle = (isDraggingOver, isDragging) => {
  return {
    ...sharedListStyles,
    ...(isDragging && { zIndex: 10000, background: "lightgrey" }),
    ...(isDraggingOver && { background: "lightblue" }),
    left: "50%"
  };
};

export class Editor extends React.Component {
  state = {
    tabDragging: false
  };
  handlePrint = () => {
    console.warn("handlePrint");
  };
  handleReverseComplementSelection = () => {
    // const {selectionLayerUpdate}
    console.warn("handleReverseComplementSelection");
  };
  handleRotateToCaretPosition = () => {
    console.warn("handleRotateToCaretPosition");
  };
  handleNewPrimer = () => {
    const {
      selectionLayer,
      caretPosition,
      showAddOrEditPrimerDialog,
      readOnly
    } = this.props;
    const rangeToUse =
      selectionLayer.start > -1
        ? selectionLayer
        : caretPosition > -1
          ? { start: caretPosition, end: caretPosition }
          : undefined;
    if (readOnly) {
      window.toastr.warning(
        "Sorry, can't create new primers in read-only mode"
      );
    } else {
      showAddOrEditPrimerDialog(rangeToUse);
    }
  };
  handleNewFeature = () => {
    const {
      selectionLayer,
      caretPosition,
      showAddOrEditFeatureDialog,
      readOnly
    } = this.props;
    const rangeToUse =
      selectionLayer.start > -1
        ? selectionLayer
        : caretPosition > -1
          ? { start: caretPosition, end: caretPosition }
          : undefined;
    if (readOnly) {
      window.toastr.warning(
        "Sorry, can't create new features in read-only mode"
      );
    } else {
      showAddOrEditFeatureDialog(rangeToUse);
    }
  };
  handleNewPart = () => {
    const {
      selectionLayer,
      caretPosition,
      showAddOrEditPartDialog,
      readOnly
    } = this.props;
    const rangeToUse =
      selectionLayer.start > -1
        ? selectionLayer
        : caretPosition > -1
          ? { start: caretPosition, end: caretPosition }
          : undefined;
    if (readOnly) {
      window.toastr.warning("Sorry, can't create new parts in read-only mode");
    } else {
      showAddOrEditPartDialog(rangeToUse);
    }
  };

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

  renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey
          preventDefault
          stopPropagation
          global={true}
          combo={"cmd+s"}
          label="Save"
          onKeyDown={this.props.handleSave}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Print"
          global
          combo="cmd+p"
          onKeyDown={this.handlePrint}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Toggle Edit Mode"
          global
          combo="cmd+e"
          onKeyDown={this.props.toggleReadOnlyMode}
        />
        {/* TNR: these are here just to be added to the blueprint generated hotkey dialog but their actual handlers live elsewhere */}
        <Hotkey
          preventDefault
          stopPropagation
          label="Cut"
          global
          combo="cmd+x"
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Copy"
          global
          combo="cmd+c"
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Paste"
          global
          combo="cmd+p"
        />
        {/* see above comment */}
        <Hotkey
          preventDefault
          stopPropagation
          label="Undo"
          global
          combo="cmd+z"
          onKeyDown={this.props.undo}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Redo"
          global
          combo="cmd+shift+z"
          onKeyDown={this.props.redo}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Find"
          global
          combo="cmd+f"
          onKeyDown={this.props.toggleFindTool}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Select All"
          global
          combo="cmd+a"
          onKeyDown={this.props.selectAll}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Reverse Complement Selection"
          global
          combo="cmd+e"
          onKeyDown={this.handleReverseComplementSelection}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="Rotate To Caret Position"
          global
          combo="cmd+b"
          onKeyDown={this.handleRotateToCaretPosition}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="New Feature"
          global
          combo="cmd+k"
          onKeyDown={this.handleNewFeature}
        />
        <Hotkey
          preventDefault
          stopPropagation
          label="New Part"
          global
          combo="cmd+l"
          onKeyDown={this.handleNewPart}
        />
      </Hotkeys>
    );
  }

  getPanelsToShow = () => {
    const {
      // propertiesTool = {},
      panelsShown
    } = this.props;
    // const panelsToShow = [];
    // if (panelsShown.circular) panelsToShow.push("circular");
    // if (panelsShown.sequence) panelsToShow.push("sequence");
    // if (panelsShown.rail) panelsToShow.push("rail");
    // if (propertiesTool.propertiesSideBarOpen) panelsToShow.push("properties");
    return map(panelsShown);
  };

  render() {
    const {
      doNotUseAbsolutePosition = false,
      PropertiesProps = {},
      ToolBarProps = {},
      CircularViewProps = {},
      RowViewProps = {},
      LinearViewProps = {},
      StatusBarProps = {},
      FindBarProps = {},
      editorName,
      findTool = {},
      // containerWidth,
      height = 500,
      showMenuBar,
      updateSequenceData,
      setPanelAsActive,
      closePanel
      // ...rest
    } = this.props;
    let editorDimensions = {
      height
    };
    const sharedProps = {
      editorName,
      ...this.props
    };
    const { tabDragging } = this.state;

    const panelsToShow = this.getPanelsToShow();
    const panels = flatMap(panelsToShow, (panelGroup, index) => {
      // let activePanelId
      let activePanelId;
      panelGroup.forEach(({ id, active }) => {
        if (active) {
          activePanelId = id;
        }
      });
      let panel;

      if (activePanelId === "circular") {
        panel = (
          <CircularView
            key="circularView"
            {...sharedProps}
            {...CircularViewProps}
            {...editorDimensions}
          />
        );
      } else if (activePanelId === "sequence") {
        panel = (
          <RowView
            key="rowView"
            {...sharedProps}
            {...RowViewProps}
            {...editorDimensions}
          />
        );
      } else if (activePanelId === "rail") {
        panel = (
          <LinearView
            key="linearView"
            {...sharedProps}
            {...LinearViewProps}
            {...editorDimensions}
          />
        );
      } else if (activePanelId === "digestTool") {
        panel = (
          <DigestTool key="DigestTool" {...sharedProps} {...editorDimensions} />
        );
      } else if (activePanelId === "properties") {
        panel = (
          <PropertiesInner
            key={"Properties"}
            {...{ ...this.props, height, ...PropertiesProps }}
          />
        );
      } else {
        panel = <div> No Panel Found!</div>;
      }
      const toReturn = [];
      if (index > 0) {
        toReturn.push(
          <ReflexSplitter
            key={index + "splitter"}
            style={{ height: height + 38, zIndex: 1 }}
            propagate
          />
        );
      }
      toReturn.push(
        <ReflexElement
          key={index}
          minSize="100"
          propagateDimensions={true}
          renderOnResizeRate={50}
          renderOnResize={true}
          className="left-pane"
        >
          {[
            // <Tabs2
            //   key={activePanelId}
            //       // style={{ paddingLeft:15 }}
            //       renderActiveTabPanelOnly
            //       selectedTabId={activePanelId}
            //       onChange={setPanelAsActive}
            //     >
            <Droppable
              key={"asdfasdf"}
              direction="horizontal"
              droppableId={index.toString()}
            >
              {(provided, snapshot) => (
                <div
                  className={"ve-draggable-tabs"}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver, tabDragging)}
                >
                  {/* {console.log('snapshot:',JSON.stringify(snapshot,null,4))}
                  {console.log('provided:',JSON.stringify(provided,null,4))} */}
                  {panelGroup.map(({ id, name, canClose }) => {
                    return (
                      <Draggable key={id} draggableId={id}>
                        {(provided, snapshot) => (
                          <div
                            style={{
                              // overflow: 'hidden',
                              // textOverflow: 'ellipsis',
                              // whiteSpace: 'nowrap',
                              wordWrap: "normal",
                              flex: "0 0 auto",
                              // position: 'relative',
                              maxWidth: "100%",
                              // verticalAlign: 'top',
                              fontSize: "14px"
                            }}
                            onClick={() => {
                              setPanelAsActive(id);
                            }}
                          >
                            <div
                              ref={provided.innerRef}
                              style={getItemStyle(
                                provided.draggableStyle,
                                snapshot.isDragging
                              )}
                              {...provided.dragHandleProps}
                            >
                              <div
                                style={{
                                  padding: 3,
                                  borderBottom:
                                    id === activePanelId
                                      ? "2px solid #106ba3"
                                      : "none",
                                  color:
                                    id === activePanelId ? "#106ba3" : "black",
                                  marginLeft: 13,
                                  marginRight: 13
                                }}
                              >
                                {/* <span onClick={() => {
                                closePanel(id)
                              }} style={{paddingRight: 3, paddingBottom: 3, fontSize: 10}} className={"pt-icon-menu"}></span> */}
                                {name || id}
                                {canClose && (
                                  <span
                                    onClick={() => {
                                      closePanel(id);
                                    }}
                                    style={{ paddingLeft: 5 }}
                                    className={"pt-icon-small-cross"}
                                  />
                                )}
                              </div>
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    );
                    //   return <Tab2
                    //   key={id}
                    //   title={startCase(name || id)}
                    //   id={id}
                    // />
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ]),

            panel
          ]}
        </ReflexElement>
      );
      return toReturn;
    });
    return (
      <DropHandler
        updateSequenceData={updateSequenceData}
        style={{ width: "100%", position: "relative" }}
        className={"veEditor"}
      >
        <div
          style={{
            width: "100%",
            ...(doNotUseAbsolutePosition ? {} : { position: "absolute" })
          }}
        >
          {/* <button
            onClick={() => {
              document.body.addEventListener("keydown", e => {
                console.log("e:", e);
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
          {showMenuBar && <MenuBar />}
          <ToolBar {...sharedProps} {...ToolBarProps} />

          <div
            style={{ position: "relative" }}
            className="tg-editor-container"
            id="section-to-print"
          >
            <DragDropContext
              onDragStart={this.onTabDragStart}
              onDragEnd={this.onTabDragEnd}
            >
              <ReflexContainer /* style={{}} */ orientation="vertical">
                {panels}
              </ReflexContainer>
            </DragDropContext>

            {findTool.isOpen && <FindBar {...sharedProps} {...FindBarProps} />}
          </div>

          <StatusBar {...sharedProps} {...StatusBarProps} />
        </div>
      </DropHandler>
    );
  }
}

HotkeysTarget(Editor);

export default compose(withEditorProps)(Editor);
// export default compose(withEditorProps, reactDimensions())(Editor);
