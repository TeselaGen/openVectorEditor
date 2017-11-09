import React from "react";
export interface CircularViewProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  maxAnnotationsToDisplay,
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

export default class CircularView extends React.Component <CircularViewProps> {}
