import reactDimensions from "react-dimensions";
import "react-reflex/styles.css";
import React from "react";
import { compose } from "redux";
// import Dimensions from "react-dimensions";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
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
      PropertiesProps = {},
      ToolBarProps = {},
      CircularViewProps = {},
      RowViewProps = {},
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
        <div style={{ width: "100%", position: "absolute" }}>
          {showMenuBar && <MenuBar />}
          <ToolBar {...sharedProps} {...ToolBarProps} />

          <div
            style={{ position: "relative" }}
            className="tg-editor-container"
            id="section-to-print"
          >
            <ReflexContainer /* style={{}} */
            orientation="vertical">
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

export default compose(withEditorProps, reactDimensions())(Editor);
// export default compose(withEditorProps, reactDimensions())(Editor);
