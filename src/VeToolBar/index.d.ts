import React from "react";
export interface VeToolBarProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  additionalTools: [additionalTool],
  excludeObj: {},
  modifyTools: (tools) => tools //you can filter/add/remove enhance any tools here!
}

export interface excludeObj { //an object of ids of the default tool
  download: boolean,
  print: boolean,
  cutsites: boolean,
  features: boolean,
  primers: boolean,
  orfs: boolean,
  toggleViews: boolean,
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
export default class VeToolBar extends React.Component <VeToolBarProps> {}
