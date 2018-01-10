import React from "react";
import CutsiteFilter from "../CutsiteFilter";
import withEditorProps from "../withEditorProps";
import Ladder from "./Ladder";

export class DigestTool extends React.Component {
  render() {
    const { editorName } = this.props;
    return (
      <div>
        Choose your enzyme:
        <CutsiteFilter editorName={editorName} />
        Ladder:
        <Ladder />
      </div>
    );
  }
}

export default withEditorProps(DigestTool);
