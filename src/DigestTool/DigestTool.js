import React from "react";
import CutsiteFilter from "../CutsiteFilter";
import withEditorProps from "../withEditorProps";
import Ladder from "./LadderContainer";

export class DigestTool extends React.Component {
  render() {
    const { editorName, height = "100%" } = this.props;
    return (
      <div style={{ height, margin: 10 }}>
        Choose your enzymes:
        <CutsiteFilter editorName={editorName} />
        <br />
        Ladder:
        <Ladder editorName={editorName} />
      </div>
    );
  }
}

export default withEditorProps(DigestTool);
