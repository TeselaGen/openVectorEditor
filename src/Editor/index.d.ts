import React from "react";
export interface EditorProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  height: number,//
  //default=false - because of issues with certain layouts the editor renders as absolute position by default
  //if you want the editor to take up space you can pass doNotUseAbsolutePosition=true
  doNotUseAbsolutePosition: boolean, 
  PropertiesProps: object, //props which will get passed directly to Properties view
  ToolBarProps: object, //props which will get passed directly to ToolBar
  CircularViewProps: object, //props which will get passed directly to CircularView
  RowViewProps: object, //props which will get passed directly to RowView
  StatusBarProps: object, //props which will get passed directly to StatusBar
}
export default class Editor extends React.Component <EditorProps> {}
