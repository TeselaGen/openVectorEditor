import React from "react";
export default class StandaloneDemo extends React.Component {
  componentDidMount() {
    const editor = window.tg_createEditor(this.node);
    editor.updateEditor({
      sequenceData: {
        sequence: "atagatagagaggcccg",
        features: [
          {
            start: 0, //start and end are 0-based inclusive for all annotations
            end: 10,
            forward: true //strand
          }
        ],
        parts: []
      }
    });
  }
  render() {
    return (
      <div
        className={"standaloneDemoNode"}
        style={{ width: "100%", height: "100%" }}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}
