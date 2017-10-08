import React from "react";
export interface StatusBarProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  showReadOnly = true
}
export default class StatusBar extends React.Component <StatusBarProps> {}
