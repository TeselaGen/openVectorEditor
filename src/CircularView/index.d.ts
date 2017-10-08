import React from "react";
export interface CircularViewProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  maxAnnotationsToDisplay,
  componentOverries,
  circularAndLinearTickSpacing: number, 
  spaceBetweenAnnotations: number, // default = 2,
  annotationHeight: number, // default = 15,
  hideName: boolean,
}

export interface maxAnnotationsToDisplay {
  features: number,
  primers: number,
  // translations: number,
  // parts: number,
  orfs: number,
  cutsites: number,
}

export interface componentOverrides {
  Labels: any, //a react component
  SelectionLayer: any, //a react component
  Caret: any, //a react component
  Axis: any, //a react component
  Features: any, //a react component
  Primers: any, //a react component
  Orfs: any, //a react component
  Cutsites: any, //a react component
}

export default class CircularView extends React.Component <CircularViewProps> {}
