import React from "react";
export interface StatusBarProps {
  editorName: String, //the name of the editor instance (this should match what you've set up in your redux store)
  showReadOnly: boolean
}
export default class StatusBar extends React.Component <StatusBarProps> {}
