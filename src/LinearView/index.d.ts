import React from "react";
export interface LinearViewProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  hideName: boolean,
  marginWidth: number,
  width: number,
  height: number,
  RowItemProps: object, //props to pass to RowItem
}
export default class LinearView extends React.Component <LinearViewProps> {}
