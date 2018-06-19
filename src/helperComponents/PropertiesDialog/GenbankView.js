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
        style={{ width: 540, height: 350 }}
        value={genbankString}
      />
    );
  }
}

export default withEditorProps(GenbankView);
