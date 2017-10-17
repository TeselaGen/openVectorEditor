import React from "react";
export default class StandaloneDemo extends React.Component {
  componentDidMount() {
    const editor = window.tg_createEditor(this.node, {
      onSave: function(event, sequenceData, editorState) {
        console.log("event:", event);
        console.log("sequenceData:", sequenceData);
        console.log("editorState:", editorState);
      },
      onCopy: function(event, sequenceData, editorState) {
        console.log("event:", event);
        console.log("sequenceData:", sequenceData);
        console.log("editorState:", editorState);
        
        
        event.clipboardData.setData('application/json', JSON.stringify(sequenceData));
        event.preventDefault();
        //in onPaste in your app you can do: 
        // e.clipboardData.getData('application/json')
      }
    });
    editor.updateEditor({
      sequenceData: { //note, sequence data passed here will be coerced to fit the Teselagen Open Vector Editor data model
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
