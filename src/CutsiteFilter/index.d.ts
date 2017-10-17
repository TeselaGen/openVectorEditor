import React from "react";
export declare interface CutsiteFilterProps {
  /* //the name of the editor instance (this should match what you've set up in your redux store) */
  editorName: String, 
  onChangeHook: function
}
export default class CutsiteFilter extends React.Component <CutsiteFilterProps> {}
