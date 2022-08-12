import React from "react";

import { connect } from "react-redux";

import exampleSequenceData from "./exampleData/exampleSequenceData";
import { Dialog, Button } from "@blueprintjs/core";
// import ab1ParsedGFPuv54 from "../../src/ToolBar/ab1ParsedGFPuv54.json";
// import ab1ParsedGFPuv58 from "../../src/ToolBar/ab1ParsedGFPuv58.json";
import ab1ParsedGFPvv50 from "../../scratch/ab1ParsedGFPvv50.json";
import ab1ParsedGFPvv60 from "../../scratch/ab1ParsedGFPvv60.json";
import alignmentDataPairwise from "./exampleData/alignmentDataPairwise.json";

// import exampleSequenceData from './exampleData/simpleSequenceData';

connect(
  (/* state, ownProps */) => {},
  (dispatch) => {
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
      editor = window.createVectorEditor(
        this.node, // or you can pass "createDomNodeForMe" but make sure to use editor.close() to clean up the dom node!
        {
          //you can also pass a DOM node as the first arg here
          // showReadOnly: false,
          // disableSetReadOnly: true,
          shouldAutosave: true,
          showAvailability: true, //set to tru to show the material availabilty status
          rightClickOverrides: {
            selectionLayerRightClicked: (items /* { annotation }, props */) => {
              return [
                ...items,
                {
                  text: "Create Part",
                  onClick: () => console.info("hey!≈")
                }
              ];
            }
          },
          // handleFullscreenClose: () => { //comment this function in to make the editor fullscreen by default
          //   editor.close() //this calls reactDom.unmountComponent at the node you passed as the first arg
          // },
          onRename: () => {}, //this option should be shown by default
          onNew: () => {}, //unless this callback is defined, don't show the option to create a new seq
          onDuplicate: () => {}, //unless this callback is defined, don't show the option to create a new seq
          onSave: function (
            opts = {},
            sequenceDataToSave,
            editorState,
            onSuccessCallback
          ) {
            console.info("opts:", opts);
            console.info("sequenceData:", sequenceDataToSave);
            console.info("editorState:", editorState);
            // To disable the save button after successful saving
            // either call the onSuccessCallback or return a successful promise :)
            onSuccessCallback();
            //or
            // return myPromiseBasedApiCall()
          },
          onDelete: (data) => {
            console.warn("would delete", data);
          },
          onCopy: function (event, copiedSequenceData /* , editorState */) {
            //the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
            const clipboardData = event.clipboardData;
            clipboardData.setData(
              "application/json",
              //for example here you could change teselagen parts into jbei parts
              JSON.stringify(copiedSequenceData)
            );
            event.preventDefault();
            //in onPaste in your app you can do:
            // e.clipboardData.getData('application/json')
          },
          onPaste: function (event /* , editorState */) {
            //the onPaste here must return sequenceData in the teselagen data format
            const clipboardData = event.clipboardData;
            let jsonData = clipboardData.getData("application/json");
            if (jsonData) {
              jsonData = JSON.parse(jsonData);
              if (jsonData.isJbeiSeq) {
                jsonData = convertJbeiToTeselagen(jsonData);
              }
            }
            const sequenceData = jsonData || {
              sequence: clipboardData.getData("text/plain")
            };
            return sequenceData;
          },
          getSequenceAtVersion: (versionId) => {
            if (versionId === 2) {
              return {
                sequence: "thomaswashere"
              };
            } else if ((versionId = 3)) {
              return {
                features: [{ start: 4, end: 6 }],
                sequence:
                  "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
              };
            } else {
              console.error("we shouldn't be here...");
              return {
                sequence: "taa"
              };
            }
          },
          getVersionList: () => {
            return [
              {
                dateChanged: "12/30/2211",
                editedBy: "Nara",
                // revisionType: "Sequence Deletion",
                versionId: 2
              },
              {
                dateChanged: "8/30/2211",
                editedBy: "Ralph",
                // revisionType: "Feature Edit",
                versionId: 3
              }
            ];
          },
          showMenuBar: true,
          PropertiesProps: {
            propertiesList: [
              "general",
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
              "alignmentTool",
              "versionHistoryTool",
              // "oligoTool",
              "orfTool",
              // "viewTool",
              "editTool",
              "findTool",
              "visibilityTool"
              // "propertiesTool"
            ]
          }
        }
      );
      setTimeout(() => {
        console.info("editor.getState():", editor.getState());
      }, 5000);
    }, 100);

    //simulate a little bit of lag to make sure the editor can render even when it has no sequence data yet
    setTimeout(() => {
      editor.updateEditor({
        sequenceData: exampleSequenceData,
        sequenceDataHistory: {}, //clear the sequenceDataHistory if there is any left over from a previous sequence
        annotationVisibility: {
          // features: false,
          orfTranslations: false
        },
        readOnly: false,
        alignments: {
          jbeiAlignment1: {
            // alignmentTracks,
            // alignmentAnnotationVisibility: defaultAlignmentAnnotationVisibility,
            // alignmentAnnotationLabelVisibility: defaultAlignmentAnnotationLabelVisibility
          }
        },
        selectionLayer: { start: 500, end: 550 },
        panelsShown: [
          [
            {
              // fullScreen: true,
              active: true,
              id: "circular",
              name: "Circular Map"
            },
            {
              id: "jbeiAlignment1",
              type: "alignment",
              name: "Jbei Alignment p1243124"
              // active: true,
              // fullScreen: true
            },
            {
              id: "jbeiAlignment2",
              type: "alignment",
              name: "Jbei Alignment 2 "
              // active: true,
              // fullScreen: true
            },
            {
              id: "pairwiseRun1",
              type: "alignment",
              name: "Pairwise Alignment"
              // active: true
              // fullScreen: true
            }
          ],
          [
            {
              id: "sequence",
              name: "Sequence Map",
              active: true
            },
            {
              id: "alignmentTool",
              name: "New Alignment",
              canClose: true
            },
            {
              id: "digestTool",
              name: "New Digest",
              canClose: true
            },
            {
              id: "rail",
              name: "Linear Map"
            },
            {
              id: "properties",
              name: "Properties"

              // active: true
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
      editor.addAlignment({
        ...alignmentDataPairwise,
        id: "pairwiseRun1"
      });
      editor.addAlignment({
        id: "jbeiAlignment1",
        alignmentTracks: [
          // {
          //   //JBEI sequence 'GFPuv54'
          //   chromatogramData: ab1ParsedGFPuv54,
          //   sequenceData: {
          //     id: "1",
          //     name: "GFPuv54",
          //     features: [{start: 12, end: 24, id: "asdfa", name: "feat1"}],
          //     sequence:
          //       "CAGAAAGCGTCACAAAAGATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCGGCTTCAGCCGGTTTGCCGGCTGAAAGCGCTATTTCTTCCAGAATTGCCATGATTTTTTCCCCACGGGAGGCGTCACTGGCTCCCGTGTTGTCGGCAGCTTTGATTCGATAAGCAGCATCGCCTGTTTCAGGCTGTCTATGTGTGACTGTTGAGCTGTAACAAGTTGTCTCAGGTGTTCAATTTCATGTTCTAGTTGCTTTGTTTTACTGGTTTCACCTGTTCTATTAGGTGTTACATGCTGTTCATCTGTTACATTGTCGATCTGTTCATGGTGAACAGCTTTGAATGCACCAAAAACTCGTAAAAGCTCTGATGTATCTATCTTTTTTACACCGTTTTCATCTGTGCATATGGACAGTTTTCCCTTTGATATGTAACGGTGAACAGTTGTTCTACTTTTGTTTGTTAGTCTTGATGCTTCACTGATAGATACAAGAGCCATAAGAACCTCAGATCCTTCCGTATTTAGCCAGTATGTTCTCTAGTGTGGTTCGTTGTTTTGCCGTGGAGCAATGAGAACGAGCCATTGAGATCATACTTACCTTTGCATGTCACTCAAAATTTTGCCTCAAAACTGGGTGAGCTGAATTTTTGCAGTAGGCATCGTGTAAGTTTTTCTAGTCGGAATGATGATAGATCGTAAGTTATGGATGGTTGGCATTTGTCCAGTTCATGTTATCTGGGGTGTTCGTCAGTCGGTCAGCAGATCCACATAGTGGTTCATCTAGATCACAC"
          //   },
          //   alignmentData: {
          //     id: "1",
          //     sequence:
          //       "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------cagaaagcgtcacaaaagatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacag-tttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgttttgccgtggagcaatgagaacgagccattgagatcatacttacctttgcatgtcactcaaaattttgcctcaaaactgggtgagctgaatttttgcagtaggcatcgtgtaagtttttctagtcggaatgatgatagatcgtaagttatggatggttggcatttgtccagttcatgttatctggggtgttcgtcagtcggtcagcagatccacatagtggttcatctagatcacac"
          //   }
          // },
          // {
          //   //JBEI sequence 'GFPuv58'
          //   chromatogramData: ab1ParsedGFPuv58,
          //   sequenceData: {
          //     id: "2",
          //     name: "GFPuv58",
          //     sequence:
          //       "CGAAAAATGTCAATTCTTGTTGATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGAAGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCACACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGATCTCGGCGGCGGCGTCAGCAAGGTCTACGGCAAGGAACAGTTTTTTGCGGATGCCCCATATCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACCACAGGCTCAGTCTAAAGACTGGCCCTTTCTTTGATCTGTTGTTTGCC"
          //   },
          //   alignmentData: {
          //     id: "2",
          //     sequence:
          //       "cgaaaaatgtcaattcttgttgattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgaagcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccacacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgatctcggcggcggcgtcagcaaggtctacggcaaggaacagttttttgcggatgccccatatcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaaccacaggctcagtctaaagactggccctttc-tttgatctgttgtttgcc--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"
          //   }
          // },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv60'
            chromatogramData: ab1ParsedGFPvv60,
            sequenceData: {
              id: "2",
              name: "GFPvv60",
              sequence:
                "CTGTCTGCTACGACGCACTGTTCTTGCCGTAGACCTTGCTGCCGCCGCCGCCGAGCTCATCCATGCCATGTGTAATCCCAGCAGCAGTTACAAACTCAAGAAGGACCATGTGGTCACGCTTTTCGTTGGGATCTTTCGAAAGGGCAGATTGTGTCGACAGGTAATGGTTGTCTGGTAAAAGGACAGGGCCATCGCCAATTGGAGTATTTTGTTGATAATGGTCTGCTAGTTGAACAGATCCATCTTCAATGTTGTGGCGAATTTTGAAGTTAGCTTTGATTCCATTCTTTTGTTTGTCTGCCGTGATGTATACATTGTGTGAGTTATAGTTGTATTCGAGTTTGTGTCCGAGAATGTTTCCATCTTCTTTAAAATCAATACCTTTTAACTCGATACGATTAACAAGGGTATCACCTTCAAACTTGACTTCAGCACGCGTCTTGTAGTTCCCGTCATCTTTGAAAGATATAGTGCGTTCCTGTACATAACCTTCGGGCATGGCACTCTTGAAAAAGTCATGCCGTTTCATATGATCCGGATAACGGGAAAAGCATTGAACACCATAAGAGAAAGTAGTGACAAGTGTTGGCCATGGAACAGGTAGTTTTCCAGTAGTGCAAATAAATTTAAGGGTAAGTTTTCCGTATGTTGCATCACCTTCACCCTCTCCACTGACAGAAAATTTGTGCCCATTAACATCACCATCTAATTCAACAAGAATTGGGACAACTCCAGTGAAAAGTTCTTCTCCTTTACTCATATGTATATCTCCTTCTTAAAAATTCCCAAAAAAACGGGTATGGAGAAACAGTAGAGAGTTGCGATAAAAAGCGTCAGGTAGAATCCGCTAATCTTATGGATAAAAATGCTATGGCATAGCAAAGTGTGACGCCGTGCAAATAATCAATGTGGACTTTTTCTGCCGTGATTATAGACACTTTTGTTACGCGTTTTTGTCATGGGCTTGGGTCCCGCTTTGTTACAGAATGCTTTTAATAAG"
            },
            alignmentData: {
              id: "2",
              sequence:
                "ctgtctgctacgacgcactgttcttgccgtagaccttgctgccgccgccgccgagctcatccatgccatgtgtaatcccagcagcagttacaaactcaagaaggaccatgtggtcacgcttttcgttgggatctttcgaaagggcagattgtgtcgacaggtaatggttgtctggtaaaaggacagggccatcgccaattggagtattttgttgataatggtctgctagttgaacagatccatcttcaatgttgtggcgaattttgaagttagctttgattccattcttttgtttgtctgccgtgatgtatacattgtgtgagttatagttgtattcgagtttgtgtccgagaatgtttccatcttctttaaaatcaataccttttaactcgatacgattaacaagggtatcaccttcaaacttgacttcagcacgcgtcttgtagttcccgtcatctttgaaagatatagtgcgttcctgtacataaccttcgggcatggcactcttgaaaaagtcatgccgtttcatatgatccggataacgggaaaagcattgaacaccataagagaaagtagtgacaagtgttggccatggaacaggtagttttc------cagtagtgcaaataaatttaagggtaagttttccgtatgttgcatcacc-----ttcaccctctccactgacagaaaatttgtgcccattaacatcaccatctaattcaacaagaattgggacaactccagtgaaaagttcttctcctttactcatatgtatatctccttcttaaaaattcccaaaaaaa---------------------cgggtatggagaaacagtagagagttgcgataaaaagcgtca-------ggtagaatccgctaatcttatggataaaaatgctat-----ggcatagcaaagtgtgacgccgtgcaaataatcaatgtggactttttctgccgt----gattatagacacttttgttacgcgtttttgtcatgggcttgggtcccgctttgttacagaatgcttttaataag-----------------------------------------------------------------------------------------------------------------------------------"
            }
          }
        ]
      });
      editor.addAlignment({
        id: "jbeiAlignment2",
        alignmentTracks: [
          // {
          //   //JBEI sequence 'GFPuv54'
          //   chromatogramData: ab1ParsedGFPuv54,
          //   sequenceData: {
          //     id: "1",
          //     name: "GFPuv54",
          //     features: [{start: 12, end: 24, id: "asdfa", name: "feat1"}],
          //     sequence:
          //       "CAGAAAGCGTCACAAAAGATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCGGCTTCAGCCGGTTTGCCGGCTGAAAGCGCTATTTCTTCCAGAATTGCCATGATTTTTTCCCCACGGGAGGCGTCACTGGCTCCCGTGTTGTCGGCAGCTTTGATTCGATAAGCAGCATCGCCTGTTTCAGGCTGTCTATGTGTGACTGTTGAGCTGTAACAAGTTGTCTCAGGTGTTCAATTTCATGTTCTAGTTGCTTTGTTTTACTGGTTTCACCTGTTCTATTAGGTGTTACATGCTGTTCATCTGTTACATTGTCGATCTGTTCATGGTGAACAGCTTTGAATGCACCAAAAACTCGTAAAAGCTCTGATGTATCTATCTTTTTTACACCGTTTTCATCTGTGCATATGGACAGTTTTCCCTTTGATATGTAACGGTGAACAGTTGTTCTACTTTTGTTTGTTAGTCTTGATGCTTCACTGATAGATACAAGAGCCATAAGAACCTCAGATCCTTCCGTATTTAGCCAGTATGTTCTCTAGTGTGGTTCGTTGTTTTGCCGTGGAGCAATGAGAACGAGCCATTGAGATCATACTTACCTTTGCATGTCACTCAAAATTTTGCCTCAAAACTGGGTGAGCTGAATTTTTGCAGTAGGCATCGTGTAAGTTTTTCTAGTCGGAATGATGATAGATCGTAAGTTATGGATGGTTGGCATTTGTCCAGTTCATGTTATCTGGGGTGTTCGTCAGTCGGTCAGCAGATCCACATAGTGGTTCATCTAGATCACAC"
          //   },
          //   alignmentData: {
          //     id: "1",
          //     sequence:
          //       "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------cagaaagcgtcacaaaagatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacag-tttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgttttgccgtggagcaatgagaacgagccattgagatcatacttacctttgcatgtcactcaaaattttgcctcaaaactgggtgagctgaatttttgcagtaggcatcgtgtaagtttttctagtcggaatgatgatagatcgtaagttatggatggttggcatttgtccagttcatgttatctggggtgttcgtcagtcggtcagcagatccacatagtggttcatctagatcacac"
          //   }
          // },
          // {
          //   //JBEI sequence 'GFPuv58'
          //   chromatogramData: ab1ParsedGFPuv58,
          //   sequenceData: {
          //     id: "2",
          //     name: "GFPuv58",
          //     sequence:
          //       "CGAAAAATGTCAATTCTTGTTGATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGAAGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCACACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGATCTCGGCGGCGGCGTCAGCAAGGTCTACGGCAAGGAACAGTTTTTTGCGGATGCCCCATATCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACCACAGGCTCAGTCTAAAGACTGGCCCTTTCTTTGATCTGTTGTTTGCC"
          //   },
          //   alignmentData: {
          //     id: "2",
          //     sequence:
          //       "cgaaaaatgtcaattcttgttgattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgaagcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccacacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgatctcggcggcggcgtcagcaaggtctacggcaaggaacagttttttgcggatgccccatatcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaaccacaggctcagtctaaagactggccctttc-tttgatctgttgtttgcc--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------"
          //   }
          // },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv50'
            chromatogramData: ab1ParsedGFPvv50,
            sequenceData: {
              id: "1",
              name: "GFPvv50",
              sequence:
                "TTGTACACTTTTTTGTTGATATGTCATTCTTGTTGATTACATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTCGGACACAAACTCGAATACAACTATAACTCACACAATGTATACATCACGGCAGACAAACAAAAGAATGGAATCAAAGCTAACTTCAAAATTCGCCACAACATTGAAGATGGATCTGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCGACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGCGTGACCACATGGTCCTTCTTGAGTTTGTAACTGCTGCTGGGATTACACATGGCATGGATGAGCTCGGCGGCGGCGGCAGCAAGGTCTACGGCAAGGAACAGTTTTTGCGGATGCGCCAGAGCATGTTCCCCGATCGCTAAATCGAGTAAGGATCTCCAGGCATCAAATAAAACGAAAGGCTCAGTCGAAAGACTGGGCCTTTCGTTTTATCTGTTGTTTGTCGGTGAACGCTCTCTACTAGAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATACCTAGGGTACGGGTTTTGCTGCCCGCAAACGGGCTGTTCTGGTGTTGCTAGTTTGTTATCAGAATCGCAGATCCCGGCTTCAGCCGGG"
            },
            alignmentData: {
              id: "1",
              sequence:
                "ttgtacact------------------------------------------------------------------------------------------------------------------------------------------tttttgttgatatgtcattcttgttgattacatgg-----------------tgatgttaatgggcacaaattttctgtcagtggagagggtgaa-----ggtgatgcaacatacggaaaacttacccttaaatttatttgcactactg------gaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcaga----------ccattatca--acaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacaca-atctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatcccggcttcagccggg"
            }
          },
          {
            //JBEI sequence 'GFPvv60'
            chromatogramData: ab1ParsedGFPvv60,
            sequenceData: {
              id: "2",
              name: "GFPvv60",
              sequence:
                "CTGTCTGCTACGACGCACTGTTCTTGCCGTAGACCTTGCTGCCGCCGCCGCCGAGCTCATCCATGCCATGTGTAATCCCAGCAGCAGTTACAAACTCAAGAAGGACCATGTGGTCACGCTTTTCGTTGGGATCTTTCGAAAGGGCAGATTGTGTCGACAGGTAATGGTTGTCTGGTAAAAGGACAGGGCCATCGCCAATTGGAGTATTTTGTTGATAATGGTCTGCTAGTTGAACAGATCCATCTTCAATGTTGTGGCGAATTTTGAAGTTAGCTTTGATTCCATTCTTTTGTTTGTCTGCCGTGATGTATACATTGTGTGAGTTATAGTTGTATTCGAGTTTGTGTCCGAGAATGTTTCCATCTTCTTTAAAATCAATACCTTTTAACTCGATACGATTAACAAGGGTATCACCTTCAAACTTGACTTCAGCACGCGTCTTGTAGTTCCCGTCATCTTTGAAAGATATAGTGCGTTCCTGTACATAACCTTCGGGCATGGCACTCTTGAAAAAGTCATGCCGTTTCATATGATCCGGATAACGGGAAAAGCATTGAACACCATAAGAGAAAGTAGTGACAAGTGTTGGCCATGGAACAGGTAGTTTTCCAGTAGTGCAAATAAATTTAAGGGTAAGTTTTCCGTATGTTGCATCACCTTCACCCTCTCCACTGACAGAAAATTTGTGCCCATTAACATCACCATCTAATTCAACAAGAATTGGGACAACTCCAGTGAAAAGTTCTTCTCCTTTACTCATATGTATATCTCCTTCTTAAAAATTCCCAAAAAAACGGGTATGGAGAAACAGTAGAGAGTTGCGATAAAAAGCGTCAGGTAGAATCCGCTAATCTTATGGATAAAAATGCTATGGCATAGCAAAGTGTGACGCCGTGCAAATAATCAATGTGGACTTTTTCTGCCGTGATTATAGACACTTTTGTTACGCGTTTTTGTCATGGGCTTGGGTCCCGCTTTGTTACAGAATGCTTTTAATAAG"
            },
            alignmentData: {
              id: "2",
              sequence:
                "ctgtctgctacgacgcactgttcttgccgtagaccttgctgccgccgccgccgagctcatccatgccatgtgtaatcccagcagcagttacaaactcaagaaggaccatgtggtcacgcttttcgttgggatctttcgaaagggcagattgtgtcgacaggtaatggttgtctggtaaaaggacagggccatcgccaattggagtattttgttgataatggtctgctagttgaacagatccatcttcaatgttgtggcgaattttgaagttagctttgattccattcttttgtttgtctgccgtgatgtatacattgtgtgagttatagttgtattcgagtttgtgtccgagaatgtttccatcttctttaaaatcaataccttttaactcgatacgattaacaagggtatcaccttcaaacttgacttcagcacgcgtcttgtagttcccgtcatctttgaaagatatagtgcgttcctgtacataaccttcgggcatggcactcttgaaaaagtcatgccgtttcatatgatccggataacgggaaaagcattgaacaccataagagaaagtagtgacaagtgttggccatggaacaggtagttttc------cagtagtgcaaataaatttaagggtaagttttccgtatgttgcatcacc-----ttcaccctctccactgacagaaaatttgtgcccattaacatcaccatctaattcaacaagaattgggacaactccagtgaaaagttcttctcctttactcatatgtatatctccttcttaaaaattcccaaaaaaa---------------------cgggtatggagaaacagtagagagttgcgataaaaagcgtca-------ggtagaatccgctaatcttatggataaaaatgctat-----ggcatagcaaagtgtgacgccgtgcaaataatcaatgtggactttttctgccgt----gattatagacacttttgttacgcgtttttgtcatgggcttgggtcccgctttgttacagaatgcttttaataag-----------------------------------------------------------------------------------------------------------------------------------"
            }
          }
        ]
      });
    }, 1000);
  };
  componentDidMount() {
    this.mountEditor();
  }
  render() {
    const inner = (
      <div
        className="standaloneDemoNode"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1050,
          flexGrow: 1
        }}
        ref={(node) => {
          this.node = node;
        }}
      />
    );
    const { isDialogOpen } = this.state;
    return (
      <div style={{ flexGrow: "1", display: "flex", flexDirection: "column" }}>
        <Button
          onClick={() => {
            this.setState({ isDialogOpen: !isDialogOpen });
            this.mountEditor();
          }}
        >
          Open in a dialog
        </Button>
        {isDialogOpen ? (
          <Dialog
            style={{ width: 600 }}
            onClose={() => {
              this.setState({ isDialogOpen: false });
              this.mountEditor();
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

function convertJbeiToTeselagen(seq) {
  return seq;
}
