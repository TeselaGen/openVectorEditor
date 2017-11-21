import reactDimensions from "react-dimensions";
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

import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";

import { flatMap } from "lodash";

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

export class Editor extends React.Component {
  handlePrint = () => {
    console.log("handlePrint");
  };
  handleReverseComplementSelection = () => {
    // const {selectionLayerUpdate}
    console.log("handleReverseComplementSelection");
  };
  handleRotateToCaretPosition = () => {
    console.log("handleRotateToCaretPosition");
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
      window.toastr.warning("Sorry, can't create new parts in read-only mode");
    } else {
      showAddOrEditPrimerDialog(rangeToUse);
    }
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
          onKeyDown={this.props.onSave}
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
      propertiesTool = {},
      panelsShown = { circular: true, sequence: true }
    } = this.props;
    const panelsToShow = [];
    if (panelsShown.circular) panelsToShow.push("circular");
    if (panelsShown.sequence) panelsToShow.push("sequence");
    if (panelsShown.rail) panelsToShow.push("rail");
    if (propertiesTool.propertiesSideBarOpen) panelsToShow.push("properties");
    return panelsToShow;
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
      containerWidth,
      height = 500,
      showMenuBar,
      updateSequenceData,
      ...rest
    } = this.props;
    let editorDimensions = {
      height
    };
    const sharedProps = {
      editorName,
      ...rest
    };
    const panelsToShow = this.getPanelsToShow();

    const panels = flatMap(panelsToShow, (panelName, index) => {
      let panel;
      if (panelName === "circular") {
        panel = (
          <CircularView
            key="circularView"
            {...sharedProps}
            {...CircularViewProps}
            {...{
              ...editorDimensions,
              hideName: true
            }}
          />
        );
      }
      if (panelName === "sequence") {
        panel = (
          <RowView
            key="rowView"
            {...sharedProps}
            {...RowViewProps}
            {...{
              ...editorDimensions
            }}
          />
        );
      }
      if (panelName === "rail") {
        panel = (
          <LinearView
            key="linearView"
            {...sharedProps}
            {...LinearViewProps}
            {...{
              ...editorDimensions
            }}
          />
        );
      }
      if (panelName === "properties") {
        panel = <PropertiesInner {...{ ...this.props, ...PropertiesProps }} />;
      }
      const toReturn = [];
      if (index > 0) {
        toReturn.push(
          <ReflexSplitter
            key={index + "splitter"}
            style={{ height, zIndex: 1 }}
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
          {panel}
        </ReflexElement>
      );
      return toReturn;
    });
    return (
      <DropHandler
        updateSequenceData={updateSequenceData}
        style={{ width: "100%", position: "relative", height: "100%" }}
        className={"veEditor"}
      >
        <div
          style={{
            width: "100%",
            ...(doNotUseAbsolutePosition ? {} : { position: "absolute" })
          }}
        >
          <button
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
          </button>
          <Dialogs editorName={editorName} />
          {showMenuBar && <MenuBar />}
          <ToolBar {...sharedProps} {...ToolBarProps} />

          <div
            style={{ position: "relative" }}
            className="tg-editor-container"
            id="section-to-print"
          >
            <ReflexContainer /* style={{}} */ orientation="vertical">
              {panels}
            </ReflexContainer>

            {findTool.isOpen && <FindBar {...sharedProps} {...FindBarProps} />}
          </div>

          <StatusBar {...sharedProps} {...StatusBarProps} />
        </div>
      </DropHandler>
    );
  }
}

HotkeysTarget(Editor);

export default compose(withEditorProps, reactDimensions())(Editor);
// export default compose(withEditorProps, reactDimensions())(Editor);
