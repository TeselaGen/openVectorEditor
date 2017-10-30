import React from "react";
export interface EditorProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  height: number,//
  ToolBarProps: object, //props which will get passed directly to ToolBar
  CircularViewProps: object, //props which will get passed directly to CircularView
  RowViewProps: object, //props which will get passed directly to RowView
  StatusBarProps: object, //props which will get passed directly to StatusBar
}
export default class Editor extends React.Component <EditorProps> {}
