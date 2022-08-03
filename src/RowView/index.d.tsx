import React from "react";
export interface RowViewProps {
  editorName: string, //the name of the editor instance (this should match what you've set up in your redux store)
  height: number, //default = 400
  width: number,
  marginWidth: number,
  charWidth: number,
  RowItemProps: object, //props passed to RowItem
}
export default class RowView extends React.Component <RowViewProps> {}
