import React from "react";

import { connect } from "react-redux";

import exampleSequenceData from "./exampleData/exampleSequenceData";
import { Dialog, Button } from "@blueprintjs/core";
// import exampleSequenceData from './exampleData/simpleSequenceData';

connect(
  (/* state, ownProps */) => {},
  dispatch => {
    dispatch();
  }
);

export default class StandaloneDemo extends React.Component {
  state = {
    isDialogOpen: false
  };
  mountEditor = () => {

    let editor;
    setTimeout(() => {
      editor = window.createVectorEditor(this.node, {
        doNotUseAbsolutePosition: true,
        rightClickOverrides: {
          selectionLayerRightClicked: (items, {annotation}, props) => {
            return [...items, {
              text: "Create Part",
              onClick: () => console.log('hey!≈')
            }]
          }
        },
        onSave: function(event, copiedSequenceData, editorState) {
          console.log("event:", event);
          console.log("sequenceData:", copiedSequenceData);
          console.log("editorState:", editorState);
        },
        onCopy: function(event, copiedSequenceData, editorState) {
          //the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
          console.log("event:", event);
          console.log("sequenceData:", copiedSequenceData);
          console.log("editorState:", editorState);
          const clipboardData = event.clipboardData;
          clipboardData.setData("text/plain", copiedSequenceData.sequence);
          clipboardData.setData(
            "application/json",
            JSON.stringify(copiedSequenceData)
          );
          event.preventDefault();
          //in onPaste in your app you can do:
          // e.clipboardData.getData('application/json')
        },
        onPaste: function(event, editorState) {
          //the onPaste here must return sequenceData in the teselagen data format
          const clipboardData = event.clipboardData;
          let jsonData = clipboardData.getData("application/json")
          if (jsonData) {
            jsonData = JSON.parse(jsonData)
            if (jsonData.isJbeiSeq) {
              jsonData = convertJbeiToTeselagen(jsonData)
            }
          }
          const sequenceData = jsonData || {sequence: clipboardData.getData("text/plain")}
          return sequenceData
        },
        showMenuBar: true,
        PropertiesProps: {
          propertiesList: [
            "features",
            "parts",
            "primers",
            "translations",
            "cutsites",
            "orfs",
            "genbank"
          ]
        },
        ToolBarProps: {
          toolList: [
            "saveTool",
            "downloadTool",
            "importTool",
            "undoTool",
            "redoTool",
            "cutsiteTool",
            "featureTool",
            // "oligoTool",
            "orfTool",
            // "viewTool",
            "editTool",
            "findTool",
            "visibilityTool",
            // "propertiesTool"
          ]
        }
      });
    }, 100);

    //simulate a little bit of lag to make sure the editor can render even when it has no sequence data yet
    setTimeout(() => {
      editor.updateEditor({
        sequenceData: exampleSequenceData,
        annotationVisibility: {
          features: false,
          orfTranslations: false,
        },
        panelsShown: [
          [
            {
              id: "sequence",
              name: "Sequence Map",
              active: true
            }
          ],
          [
            {
              id: "circular",
              name: "Plasmid",
              active: true
            },
            {
              id: "rail",
              name: "Linear Map",
              active: false
            },
            {
              id: "properties",
              name: "Properties",
              active: false
            }
          ]
        ],
        annotationsToSupport: {
          //these are the defaults, change to false to exclude
          features: true,
          translations: true,
          parts: true,
          orfs: true,
          cutsites: true,
          primers: false
        }
      });
    }, 1000);
  
  }
  componentDidMount() {
    this.mountEditor()
  }
  render() {
    const inner = (
      <div
        className={"standaloneDemoNode"}
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          zIndex: 1050
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
    const { isDialogOpen } = this.state;
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({ isDialogOpen: !isDialogOpen });
            this.mountEditor()
          }}
        >
          Open in a dialog
        </Button>
        {isDialogOpen ? (
          <Dialog
            style={{width: 600}}
            onClose={() => {
              this.setState({ isDialogOpen: false });
              this.mountEditor()
            }}
            backdropProps={{ style: { zIndex: 1050 } }}
            title="yooo"
            isOpen={isDialogOpen}
          >
            {inner}
          </Dialog>
        ) : (
          inner
        )}
      </div>
    );
  }
}


function convertJbeiToTeselagen (seq) {
  return seq
}