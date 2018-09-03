import React from "react";
// import { Button } from "@blueprintjs/core";
import { jsonToGenbank } from "bio-parsers";
import withEditorProps from "../../withEditorProps";

class GenbankView extends React.Component {
  render() {
    const { sequenceData = {} } = this.props;
    const genbankString = jsonToGenbank(sequenceData);
    return (
      <textarea
        readOnly
        // wrap="soft"
        style={{
          whiteSpace: "pre",
          overflowWrap: "normal",
          overflowX: "scroll",
          fontSize: 11,
          fontFamily: "monospace",
          width: 540,
          height: 350
        }}
        value={genbankString}
      />
    );
  }
}

export default withEditorProps(GenbankView);
