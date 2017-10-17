import React from "react";
import { withContentRect } from "react-measure";
import { compose } from "redux";
import VeToolBar from "../VeToolBar";
import CircularView from "../CircularView";
import RowView from "../RowView";
import StatusBar from "../StatusBar";
import FindBar from "../FindBar";
import withEditorProps from "../withEditorProps";
import "./style.css";

export class Editor extends React.Component {
  render() {
    const {
      VeToolBarProps = {},
      CircularViewProps = {},
      RowViewProps = {},
      StatusBarProps = {},
      FindBarProps = {},
      measureRef,
      contentRect: { bounds },
      panelsShown = { circular: true, sequence: true },
      editorName,
      findTool = {},
      height = 500,
      ...rest
    } = this.props;
    const { width } = bounds;
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
      <div ref={measureRef}>
        <VeToolBar {...sharedProps} {...VeToolBarProps} />
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
            {findTool.isOpen && <FindBar {...sharedProps} {...FindBarProps} />}
          </div>
        ) : (
          <div style={{ height }} />
        )}

        <StatusBar {...sharedProps} {...StatusBarProps} />
      </div>
    );
  }
}

export default compose(withEditorProps, withContentRect("bounds"))(Editor);
