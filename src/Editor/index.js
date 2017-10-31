import React from "react";
import { compose } from "redux";
import Dimensions from "react-dimensions";
import ToolBar from "../ToolBar";
import CircularView from "../CircularView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import FindBar from "../FindBar";
import withEditorProps from "../withEditorProps";
import DropHandler from "./DropHandler";
import { PropertiesInner } from "../helperComponents/PropertiesDialog";
import "./style.css";

export class Editor extends React.Component {
  render() {
    const {
      ToolBarProps = {},
      CircularViewProps = {},
      RowViewProps = {},
      StatusBarProps = {},
      FindBarProps = {},
      containerWidth: width,
      panelsShown = { circular: true, sequence: true },
      editorName,
      findTool = {},
      height = 500,
      propertiesTool = {},
      updateSequenceData,
      ...rest
    } = this.props;
    const { propertiesSideBarOpen } = propertiesTool;
    const showBoth = panelsShown.circular && panelsShown.sequence;
    let editorDimensions = {
      width: showBoth ? width / 2 : width,
      height
    };
    const sharedProps = {
      editorName,
      ...rest
    };

    return (
      <DropHandler
        updateSequenceData={updateSequenceData}
        style={{ width: "100%" }}
        className={"veEditor"}
      >
        <ToolBar {...sharedProps} {...ToolBarProps} />
        {width ? (
          <div
            style={{ position: "relative" }}
            className="tg-editor-container"
            id="section-to-print"
          >
            {panelsShown.circular && (
              <div
                style={{ borderRight: showBoth ? "1px solid lightgrey" : "" }}
                className="CircularViewSide"
              >
                <CircularView
                  {...sharedProps}
                  {...CircularViewProps}
                  {...{
                    ...editorDimensions,
                    hideName: true
                  }}
                />
              </div>
            )}
            {panelsShown.sequence && (
              <div className="RowViewSide">
                <div>
                  <RowView
                    {...sharedProps}
                    {...RowViewProps}
                    {...{
                      ...editorDimensions
                    }}
                  />
                </div>
              </div>
            )}
            {propertiesSideBarOpen && (
              <div
                style={{
                  borderLeft: "1px solid lightgrey",
                  display: "flex",
                  flexDirection: "column",
                  padding: 10,
                  background: "white",
                  zIndex: 10,
                  position: "absolute",
                  right: 0,
                  width: width / 3,
                  height
                }}
              >
                <PropertiesInner {...{ ...this.props }} />
              </div>
            )}
            {findTool.isOpen && <FindBar {...sharedProps} {...FindBarProps} />}
          </div>
        ) : (
          <div style={{ height }} />
        )}

        <StatusBar {...sharedProps} {...StatusBarProps} />
      </DropHandler>
    );
  }
}

export default compose(withEditorProps, Dimensions())(Editor);
