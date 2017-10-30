import React from "react";
export interface ToolBarProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  additionalTools: [additionalTool],
  toolList: [string], //array of strings
  // saveTool
  // downloadTool
  // undoTool
  // redoTool
  // cutsiteTool
  // featureTool
  // oligoTool
  // orfTool
  // viewTool
  // editTool
  // findTool
  // visibilityTool
  // propertiesTool
  modifyTools: (tools) => tools //you can filter/add/remove enhance any tools here!
}

export interface additionalTool {
  Icon: jsx,
  toggled: boolean,
  tooltip: string | jsx,
  tooltipToggled: string | jsx,
  Dropdown: jsx,
  dropdowntooltip: string| jsx, 
  id: string //a unique id
}
export default class ToolBar extends React.Component <ToolBarProps> {}
