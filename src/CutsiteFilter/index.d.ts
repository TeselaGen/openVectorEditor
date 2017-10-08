import React from "react";
export interface CutsiteFilterProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  onChangeHook: function
}
export default class CutsiteFilter extends React.Component <CutsiteFilterProps> {}
