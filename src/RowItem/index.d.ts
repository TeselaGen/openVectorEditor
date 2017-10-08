import React from "react";
export interface RowItemProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  annotationHeight: number, // default = 14,
  featureHeight: number, // default = 16,
  primerHeight: number, // default = 16,
  tickSpacing: number, // default = 10,
  sequenceHeight: number, // default = 16,
  spaceBetweenAnnotations: number, // default = 2,
  width: number, // default = autosized for ya,
  annotationVisibility: RowItemAnnotationVisibility,
  componentOverrides,
}

export interface RowItemAnnotationVisibility {
  features: boolean,
  primers: boolean,
  // featureLabels: boolean,
  translations: boolean,
  // translationLabels: boolean,
  // parts: boolean,
  // partLabels: boolean,
  orfs: boolean,
  lineageLines: boolean,
  // orfLabels: boolean,
  cutsites: boolean,
  cutsiteLabels: boolean,
  axis: boolean,
  yellowAxis: boolean,
  caret: boolean,
  reverseSequence: boolean,
  sequence: boolean,
}

export interface componentOverrides {
  Sequence: any,
  Axis: any,
  Orfs: any,
  Translations: any,
  Features: any,
  Primers: any,
  CutsiteLabels: any,
  Cutsites: any,
  // Caret: any,
}


export default class RowItem extends React.Component <RowItemProps> {}
