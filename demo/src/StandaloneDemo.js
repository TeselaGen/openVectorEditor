import React from "react";

import {connect} from 'react-redux';

import exampleSequenceData from './exampleData/exampleSequenceData';
// import exampleSequenceData from './exampleData/simpleSequenceData';

connect((state, ownProps) => {}, (dispatch) => {
  dispatch()
})


export default class StandaloneDemo extends React.Component {
  componentDidMount() {
    const editor = window.createVectorEditor(this.node, {
      onSave: function(event, copiedSequenceData, editorState) {
        console.log("event:", event);
        console.log("sequenceData:", copiedSequenceData);
        console.log("editorState:", editorState);
      },
      onCopy: function(event, copiedSequenceData, editorState) {
        console.log("event:", event);
        console.log("sequenceData:", copiedSequenceData);
        console.log("editorState:", editorState);
        const clipboardData  = event.clipboardData
        clipboardData.setData('text/plain', copiedSequenceData.sequence);
        clipboardData.setData('application/json', JSON.stringify(copiedSequenceData));
        event.preventDefault();
        //in onPaste in your app you can do: 
        // e.clipboardData.getData('application/json')
      },
      
      ToolBarProps: {
        toolList: [
          "saveTool",
          "downloadTool",
          "undoTool",
          "redoTool",
          "cutsiteTool",
          "featureTool",
          "oligoTool",
          "orfTool",
          "viewTool",
          "editTool",
          "findTool",
          "visibilityTool",
          "propertiesTool",
        ]
      }
    });
    
    //simulate a little bit of lag to make sure the editor can render even when it has no sequence data yet
    setTimeout(() => {
      editor.updateEditor({
        sequenceData: exampleSequenceData,
        annotationsToSupport: { 
          //these are the defaults, change to false to exclude 
          features: true,
          translations: true,
          parts: true,
          orfs: true,
          cutsites: true,
          primers: true,
        },
      });
    }, 10)
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
