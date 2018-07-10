import { rotateSequenceDataToPosition } from "ve-sequence-utils";
import {
  getSequenceDataBetweenRange,
  tidyUpSequenceData,
  getAminoAcidStringFromSequenceString
} from "ve-sequence-utils";
import { getSequenceWithinRange } from "ve-range-utils";
import Clipboard from "clipboard";
import { compose } from "redux";
import {
  insertSequenceDataAtPositionOrRange,
  deleteSequenceDataAtRange,
  getReverseComplementSequenceAndAnnotations,
  getComplementSequenceAndAnnotations
} from "ve-sequence-utils";
import { map, get, startCase, some } from "lodash";

import { MenuItem } from "@blueprintjs/core";
import { connect } from "react-redux";
import { getContext } from "recompose";
import Keyboard from "./Keyboard";

import withEditorProps from "../withEditorProps";
import {
  normalizePositionByRangeLength
  // convertRangeTo1Based
} from "ve-range-utils";
import React from "react";
import createSequenceInputPopup from "./createSequenceInputPopup";

import moveCaret from "./moveCaret";
// import handleCaretMoved from "./handleCaretMoved";
import Combokeys from "combokeys";
import PropTypes from "prop-types";
import { createMenu, showConfirmationDialog } from "teselagen-react-components";
import {
  handleCaretMoved,
  editorDragged,
  editorClicked,
  editorDragStarted,
  editorDragStopped,
  updateSelectionOrCaret
} from "./clickAndDragUtils";

// import draggableClassnames from "../constants/draggableClassnames";

function noop() {}

let defaultContainerWidth = 400;
let defaultCharWidth = 12;
let defaultMarginWidth = 50;

function getBpsPerRow({
  charWidth = defaultCharWidth,
  width = defaultContainerWidth,
  marginWidth = defaultMarginWidth
}) {
  return Math.floor((width - marginWidth) / charWidth);
}

//withEditorInteractions is meant to give "interaction" props like "onDrag, onCopy, onKeydown" to the circular/row/linear views
function VectorInteractionHOC(Component /* options */) {
  return class VectorInteractionWrapper extends React.Component {
    componentWillUnmount() {
      this.combokeys && this.combokeys.detach();
    }
    componentDidMount() {
      let {
        // sequenceDataInserted = noop,
        selectAll = noop,
        selectInverse = noop
      } = {
        ...this.props
      };
      this.editorDragged = editorDragged.bind(this);
      this.editorClicked = editorClicked.bind(this);
      this.editorDragStarted = editorDragStarted.bind(this);
      this.editorDragStopped = editorDragStopped.bind(this);

      // combokeys.stop();
      // combokeys.watch(this.node)
      if (!this.node) return;
      this.combokeys = new Combokeys(this.node);
      // bindGlobalPlugin(this.combokeys);

      // bind a bunch of this.combokeys shortcuts we're interested in catching
      // we're using the "combokeys" library which extends mousetrap (available thru npm: https://www.npmjs.com/package/br-mousetrap)
      // documentation: https://craig.is/killing/mice
      this.combokeys.bind(
        [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z"
        ],
        event => {
          this.handleDnaInsert(event);
        }
      );

      let moveCaretBindings = [
        { keyCombo: ["left", "shift+left"], type: "moveCaretLeftOne" },
        { keyCombo: ["right", "shift+right"], type: "moveCaretRightOne" },
        { keyCombo: ["up", "shift+up"], type: "moveCaretUpARow" },
        { keyCombo: ["down", "shift+down"], type: "moveCaretDownARow" },
        {
          keyCombo: ["alt+right", "alt+shift+right"],
          type: "moveCaretToEndOfRow"
        },
        {
          keyCombo: ["alt+left", "alt+shift+left"],
          type: "moveCaretToStartOfRow"
        },
        {
          keyCombo: ["alt+up", "alt+shift+up"],
          type: "moveCaretToStartOfSequence"
        },
        {
          keyCombo: ["alt+down", "alt+shift+down"],
          type: "moveCaretToEndOfSequence"
        }
      ];

      moveCaretBindings.forEach(({ keyCombo, type }) => {
        this.combokeys.bind(keyCombo, event => {
          let shiftHeld = event.shiftKey;
          let bpsPerRow = getBpsPerRow(this.props);
          let {
            selectionLayer,
            caretPosition,
            sequenceLength,
            circular,
            caretPositionUpdate,
            selectionLayerUpdate
          } = this.props;
          let moveBy = moveCaret({
            sequenceLength,
            bpsPerRow,
            caretPosition,
            selectionLayer,
            shiftHeld,
            type
          });
          handleCaretMoved({
            moveBy,
            circular,
            sequenceLength,
            bpsPerRow,
            caretPosition,
            selectionLayer,
            shiftHeld,
            type,
            caretPositionUpdate,
            selectionLayerUpdate
          });
          event.stopPropagation();
        });
      });

      this.combokeys.bind(["backspace", "del"], event => {
        // Handle shortcut
        this.handleDnaDelete(event);
      });
      this.combokeys.bind("command+a", event => {
        // Handle shortcut
        selectAll();
        event.stopPropagation();
      });
      this.combokeys.bind("command+ctrl+i", event => {
        // Handle shortcut
        selectInverse();
        event.stopPropagation();
      });
    }
    updateSelectionOrCaret = (shiftHeld, newRangeOrCaret) => {
      const {
        selectionLayer,
        caretPosition,
        sequenceData = { sequence: "" }
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      updateSelectionOrCaret({
        shiftHeld,
        sequenceLength,
        newRangeOrCaret,
        caretPosition,
        selectionLayer,
        selectionLayerUpdate: this.selectionLayerUpdate,
        caretPositionUpdate: this.caretPositionUpdate
      });
    };

    handlePaste = e => {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly,
        onPaste,
        updateSequenceData,
        selectionLayerUpdate
        // handleInsert
      } = this.props;

      if (readOnly) {
        return window.toastr.warning("Sorry the sequence is Read-Only");
      }

      let seqDataToInsert;
      if (onPaste) {
        seqDataToInsert = onPaste(e, this.props);
      } else {
        const clipboardData = e.clipboardData;
        let jsonData = clipboardData.getData("application/json");
        if (jsonData) {
          jsonData = JSON.parse(jsonData);
        }
        seqDataToInsert = jsonData || {
          sequence: clipboardData.getData("text/plain") || e.target.value
        };
      }

      seqDataToInsert = tidyUpSequenceData(seqDataToInsert, {
        provideNewIdsForAnnotations: true,
        annotationsAsObjects: true,
        removeUnwantedChars: true
      });
      if (!seqDataToInsert.sequence.length)
        return window.toastr.warning("Sorry no valid base pairs to paste");

      updateSequenceData(
        insertSequenceDataAtPositionOrRange(
          seqDataToInsert,
          sequenceData,
          caretPosition > -1 ? caretPosition : selectionLayer
        )
      );
      const newSelectionLayerStart =
        caretPosition > -1 ? caretPosition : selectionLayer.start;
      selectionLayerUpdate({
        start: newSelectionLayerStart,
        end: newSelectionLayerStart + seqDataToInsert.sequence.length - 1
      });

      window.toastr.success("Sequence Pasted Successfully");
      e.preventDefault();
    };

    handleCopy = e => {
      window.toastr.success("Selection Copied");
      const {
        onCopy = () => {},
        sequenceData,
        selectionLayer,
        copyOptions
      } = this.props;

      onCopy(
        e,
        tidyUpSequenceData(
          this.sequenceDataToCopy ||
            getSequenceDataBetweenRange(sequenceData, selectionLayer, {
              excludePartial: {
                features: !copyOptions.partialFeatures,
                parts: !copyOptions.partialParts
              },
              exclude: {
                features: !copyOptions.features,
                parts: !copyOptions.parts
              }
            }),
          { annotationsAsObjects: true }
        ),
        this.props
      );
      this.sequenceDataToCopy = undefined;
      document.body.removeEventListener("copy", this.handleCopy);
    };

    handleDnaInsert() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly,
        updateSequenceData
        // handleInsert
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      const isReplace = selectionLayer.start > -1;
      if (readOnly) {
        window.toastr.warning("Sorry the sequence is Read-Only");
      } else {
        createSequenceInputPopup({
          isReplace,
          selectionLayer,
          sequenceLength,
          caretPosition,
          handleInsert: seqDataToInsert => {
            updateSequenceData(
              insertSequenceDataAtPositionOrRange(
                seqDataToInsert,
                sequenceData,
                caretPosition > -1 ? caretPosition : selectionLayer
              )
            );
            window.toastr.success("Sequence Updated Successfully");
          }
        });
      }
    }
    handleDnaDelete() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly,
        updateSequenceData,
        caretPositionUpdate
        // handleInsert
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      if (readOnly) {
        return window.toastr.warning("Sorry the sequence is Read-Only");
      }
      if (sequenceLength > 0) {
        let rangeToDelete = selectionLayer;
        if (caretPosition > 0) {
          rangeToDelete = {
            start: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            ),
            end: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            )
          };
        }
        const newSeqData = deleteSequenceDataAtRange(
          sequenceData,
          rangeToDelete
        );
        updateSequenceData(newSeqData);
        caretPositionUpdate(
          normalizePositionByRangeLength(
            rangeToDelete.start,
            newSeqData.sequence.length
          )
        );
        window.toastr.success("Sequence Deleted Successfully");
      }
    }

    caretPositionUpdate = position => {
      let { caretPosition = -1 } = this.props;
      if (caretPosition === position) {
        return;
      }
      //we only call caretPositionUpdate if we're actually changing something
      this.props.caretPositionUpdate(position);
    };
    selectionLayerUpdate = newSelection => {
      let {
        selectionLayer = { start: -1, end: -1 },
        ignoreGapsOnHighlight
      } = this.props;
      if (!newSelection) return;
      const { start, end } = newSelection;
      if (selectionLayer.start === start && selectionLayer.end === end) {
        return;
      }
      //we only call selectionLayerUpdate if we're actually changing something
      this.props.selectionLayerUpdate({
        start,
        end,
        ignoreGaps: ignoreGapsOnHighlight
      });
    };

    annotationClicked = ({ event, annotation }) => {
      event.preventDefault && event.preventDefault();
      event.stopPropagation && event.stopPropagation();
      const {
        annotationSelect,
        annotationDeselectAll,
        propertiesViewTabUpdate
      } = this.props;
      this.updateSelectionOrCaret(event.shiftKey, annotation);
      !event.shiftKey && annotationDeselectAll(undefined);
      annotation.id && annotationSelect(annotation);
      annotation.annotationTypePlural &&
        propertiesViewTabUpdate(annotation.annotationTypePlural, annotation);
    };

    cutsiteClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { annotationSelect, annotationDeselectAll } = this.props;
      this.updateSelectionOrCaret(event.shiftKey, annotation.topSnipPosition);
      annotationDeselectAll(undefined);
      annotationSelect(annotation);
    };

    getViewFrameTranslationsItems = () => {
      const {
        frameTranslations,
        editorName,
        store,
        annotationsToSupport: { translations } = {},
        frameTranslationToggle
      } = this.props;
      return !translations
        ? []
        : [
            {
              text: "View AA Frames",
              submenu: map(frameTranslations, (unused, frame) => {
                return (
                  <FrameTranslationMenuItem
                    key={frame}
                    {...{
                      text: "Frame " + frame,
                      frame,
                      editorName,
                      store,
                      onClick: function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        frameTranslationToggle(frame);
                      }
                    }}
                  />
                );
              })
            }
          ];
    };
    getCreateItems = range => {
      const {
        readOnly,
        showAddOrEditFeatureDialog,
        showAddOrEditPartDialog,
        showAddOrEditPrimerDialog,
        annotationsToSupport: { parts, primers, features } = {},
        selectionLayer,
        caretPosition,
        sequenceLength
      } = this.props;
      let rangeToUse =
        range ||
        (selectionLayer.start > -1
          ? selectionLayer
          : caretPosition > -1
            ? { start: caretPosition, end: caretPosition }
            : { start: 0, end: 0 });
      rangeToUse = { ...rangeToUse, forward: true };
      return sequenceLength && readOnly
        ? []
        : [
            {
              text: "Create",
              submenu: [
                features && {
                  text: "Feature",
                  onClick: function() {
                    showAddOrEditFeatureDialog(rangeToUse);
                  }
                },
                parts && {
                  text: "Part",
                  onClick: function() {
                    showAddOrEditPartDialog(rangeToUse);
                  }
                },
                primers && {
                  text: "Primer",
                  onClick: function() {
                    showAddOrEditPrimerDialog(rangeToUse);
                  }
                }
              ]
            }
          ];
    };
    getCopyOptions = annotation => {
      const {
        // sequenceData,
        selectionLayer,
        toggleCopyOption,
        editorName,
        store,
        copyOptions
      } = this.props;
      const makeTextCopyable = (transformFunc, className) => {
        return new Clipboard(`.${className}`, {
          text: () => {
            const { sequenceData, copyOptions } = store.getState().VectorEditor[
              editorName
            ];
            const selectedSeqData = getSequenceDataBetweenRange(
              sequenceData,
              selectionLayer,
              {
                excludePartial: {
                  features: !copyOptions.partialFeatures,
                  parts: !copyOptions.partialParts
                },
                exclude: {
                  features: !copyOptions.features,
                  parts: !copyOptions.parts
                }
              }
            );
            const sequenceDataToCopy = transformFunc(selectedSeqData);

            this.sequenceDataToCopy = sequenceDataToCopy;
            document.body.addEventListener("copy", this.handleCopy);
            return sequenceDataToCopy.sequence;
          }
        });
      };
      return [
        {
          text: "Copy",
          className: "openVeCopy1",
          willUnmount: () => {
            this.openVeCopy1 && this.openVeCopy1.destroy();
          },
          didMount: ({ className }) => {
            this.openVeCopy1 = makeTextCopyable(i => i, className);
          },
          submenu: [
            {
              text: "Copy",
              className: "openVeCopy2",
              willUnmount: () => {
                this.openVeCopy2 && this.openVeCopy2.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopy2 = makeTextCopyable(i => i, className);
              }
            },
            {
              text: "Copy Complement",
              className: "openVeCopyComplement",
              willUnmount: () => {
                this.openVeCopyComplement &&
                  this.openVeCopyComplement.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopyComplement = makeTextCopyable(
                  getComplementSequenceAndAnnotations,
                  className
                );
              }
            },
            {
              text: "Copy Reverse Complement",
              className: "openVeCopyReverse",
              willUnmount: () => {
                this.openVeCopyReverse && this.openVeCopyReverse.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopyReverse = makeTextCopyable(
                  getReverseComplementSequenceAndAnnotations,
                  className
                );
              }
            },
            {
              text: "Copy AA Sequence",
              className: "openVeCopyAA",
              willUnmount: () => {
                this.openVeCopyAA && this.openVeCopyAA.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopyAA = makeTextCopyable(
                  {
                    sequence: selectedSeqData => {
                      return getAminoAcidStringFromSequenceString(
                        selectedSeqData.sequence
                      );
                    }
                  },
                  className
                );
              }
            },
            {
              text: "Copy Reverse Complement AA Sequence",
              className: "openVeCopyAAReverse",
              willUnmount: () => {
                this.openVeCopyAAReverse && this.openVeCopyAAReverse.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopyAAReverse = makeTextCopyable(
                  {
                    sequence: selectedSeqData => {
                      return getAminoAcidStringFromSequenceString(
                        getReverseComplementSequenceAndAnnotations(
                          selectedSeqData
                        ).sequence
                      );
                    }
                  },
                  className
                );
              }
            },
            {
              text: "Copy Options",
              submenu: [
                <MenuItem disabled key={"aghah"} text={"Include:"} />
              ].concat(
                map(copyOptions, (unused, copyOption) => {
                  return (
                    <CopyOptionMenuItem
                      key={copyOption}
                      {...{
                        text: startCase(copyOption),
                        copyOption,
                        editorName,
                        store,
                        onClick: function(e) {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCopyOption(copyOption);
                        }
                      }}
                    />
                  );
                })
              )
            }
          ]
        }
      ];
    };

    generateSelectionMenuOptions = annotation => {
      const {
        // sequenceData,
        upsertTranslation
      } = this.props;

      let items = [
        ...this.getCopyOptions(annotation),
        ...this.getCreateItems(annotation),
        {
          text: "View Translation",
          onClick: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: true
            });
          }
        }
      ];
      return items;
    };
    normalizeAction = ({ event, ...rest }, handler) => {
      event.preventDefault();
      event.stopPropagation();
      return handler({ event, ...rest }, this.props);
    };
    enhanceRightClickActions = actions => {
      const normalizedActions = {};
      const { rightClickOverrides = {} } = this.props;
      Object.keys(actions).forEach(key => {
        const action = actions[key];
        normalizedActions[key] = opts => {
          const items = action(opts);
          const e = (items && items._event) || opts.event || opts;
          e.preventDefault && e.preventDefault();
          e.stopPropagation && e.stopPropagation();
          //override hook here
          const override = rightClickOverrides[key];
          createMenu(
            override ? override(items, opts, this.props) : items,
            undefined,
            e
          );
        };
      });
      return normalizedActions;
    };

    selectionLayerRightClicked = ({ annotation }) => {
      return this.generateSelectionMenuOptions(annotation);
    };

    handleRotateToCaretPosition = () => {
      const {
        caretPosition,
        readOnly,
        sequenceData,
        updateSequenceData,
        caretPositionUpdate
      } = this.props;
      if (readOnly) {
        return;
      }
      if (caretPosition < 0) return;
      updateSequenceData(
        rotateSequenceDataToPosition(sequenceData, caretPosition)
      );
      caretPositionUpdate(0);
    };

    backgroundRightClicked = ({ nearestCaretPos, shiftHeld, event }) => {
      this.updateSelectionOrCaret(shiftHeld, nearestCaretPos);
      const {
        readOnly,
        sequenceData: { circular }
      } = this.props;
      const menu = [
        ...(readOnly
          ? []
          : [
              {
                disabled: !circular,
                text: "Rotate To Here",
                tooltip: !circular
                  ? "Disabled because the sequence is linear"
                  : undefined,
                onClick: this.handleRotateToCaretPosition
              }
            ]),
        ...this.getCreateItems(),
        ...this.getViewFrameTranslationsItems()
        // {
        //   text: "Toggle Properties Panel",
        //   onClick: function() {
        //     propertiesViewToggle();
        //   }
        // }
      ];
      menu._event = event;
      return menu;
    };

    deletionLayerRightClicked = ({ annotation }) => {
      const { editorName, dispatch } = this.props;
      return [
        {
          text: "Remove Deletion",
          // icon: "ion-plus-round",
          onClick: function() {
            dispatch({
              type: "DELETION_LAYER_DELETE",
              meta: { editorName },
              payload: { ...annotation }
            });
          }
        }
      ];
    };

    partRightClicked = ({ annotation }) => {
      this.props.selectionLayerUpdate(annotation)
      const {
        readOnly,
        upsertTranslation,
        deletePart,
        showAddOrEditPartDialog,
        propertiesViewOpen,
        propertiesViewTabUpdate
      } = this.props;
      return [
        ...(readOnly
          ? []
          : [
              {
                text: "Edit Part",
                onClick: function() {
                  showAddOrEditPartDialog(annotation);
                }
              },
              {
                text: "Delete Part",
                onClick: function() {
                  deletePart(annotation);
                }
              }
            ]),
        ...this.getCopyOptions(annotation),
        {
          text: "View Translation",
          // icon: "ion-plus-round",
          onClick: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        },
        {
          text: "View Part Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("parts", annotation);
          }
        }
      ];
    };
    featureRightClicked = ({ annotation, event }) => {
      this.props.selectionLayerUpdate(annotation)
      event.persist();
      const {
        readOnly,
        upsertTranslation,
        deleteFeature,
        showMergeFeaturesDialog,
        annotationVisibilityToggle,
        showAddOrEditFeatureDialog,
        propertiesViewOpen,
        annotationsToSupport: { parts } = {},
        propertiesViewTabUpdate
      } = this.props;
      return [
        ...(readOnly
          ? []
          : [
              {
                text: "Edit Feature",
                onClick: function() {
                  showAddOrEditFeatureDialog(annotation);
                }
              },
              {
                text: "Delete Feature",
                onClick: function() {
                  deleteFeature(annotation);
                }
              },
              ...this.getCopyOptions(annotation),
              ...(parts && [
                {
                  text: "Make a Part from Feature",
                  onClick: async () => {
                    const { sequenceData, upsertPart } = this.props;
                    if (
                      some(sequenceData.parts, part => {
                        if (
                          part.start === annotation.start &&
                          part.end === annotation.end
                        ) {
                          return true;
                        }
                      })
                    ) {
                      const doAction = await showConfirmationDialog({
                        text:
                          "A part already exists that matches this feature's range. Do you want to make one anyways?",
                        confirmButtonText: "Create Part",
                        canEscapeKeyCancel: true //this is false by default
                      });
                      if (!doAction) return; //early return
                    }
                    upsertPart({
                      start: annotation.start,
                      end: annotation.end,
                      forward: annotation.forward,
                      name: annotation.name
                    });
                  }
                }
              ]),
              {
                text: "Merge With Another Feature",
                onClick: () => {
                  this.annotationClicked({
                    annotation,
                    event: { ...event, shiftHeld: true }
                  });
                  // annotationSelect(annotation)
                  showMergeFeaturesDialog(annotation);
                }
              }
            ]),
        {
          text: "Toggle CDS Feature Translations",
          onClick: () => {
            annotationVisibilityToggle("cdsFeatureTranslations");
          }
        },
        {
          text: "View Translation",
          // icon: "ion-plus-round",
          onClick: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        },
        {
          text: "View Feature Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("features", annotation);
          }
        }
      ];
    };

    cutsiteRightClicked = ({ annotation }) => {
      const { propertiesViewOpen, propertiesViewTabUpdate } = this.props;
      return [
        {
          text: "View Cutsite Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("cutsites", annotation);
          }
        }
      ];
    };
    primerRightClicked = ({ annotation }) => {
      this.props.selectionLayerUpdate(annotation)
      const {
        showAddOrEditPrimerDialog,
        readOnly,
        upsertTranslation,
        propertiesViewOpen,
        propertiesViewTabUpdate
      } = this.props;
      return [
        ...(readOnly
          ? []
          : [
              {
                text: "Edit Primer",
                onClick: function() {
                  showAddOrEditPrimerDialog(annotation);
                }
              }
            ]),
        ...this.getCopyOptions(annotation),
        {
          text: "View Translation",
          // icon: "ion-plus-round",
          onClick: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        },
        {
          text: "View Primer Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("primers", annotation);
          }
        }
      ];
    };
    orfRightClicked = ({ annotation }) => {
      this.props.selectionLayerUpdate(annotation)
      const {
        // upsertTranslation,
        propertiesViewOpen,
        propertiesViewTabUpdate,
        annotationVisibilityToggle
      } = this.props;
      return [
        {
          text: "Toggle Orf Translations",
          onClick: () => {
            annotationVisibilityToggle("orfTranslations");
          }
        },
        ...this.getCopyOptions(annotation),
        {
          text: "View Orf Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("orfs", annotation);
          }
        }
      ];
    };
    translationRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const {
        // readOnly,
        deleteTranslation,
        propertiesViewOpen,
        selectionLayerUpdate,
        propertiesViewTabUpdate,
        annotationVisibilityToggle
      } = this.props;
      this.props.selectionLayerUpdate(annotation)
      if (annotation.isOrf) {
        return [
          {
            text: "Hide Orf Translations",
            onClick: () => {
              annotationVisibilityToggle("orfTranslations");
            }
          },
          {
            text: "View Orf Properties",
            onClick: function() {
              propertiesViewOpen();
              propertiesViewTabUpdate("orfs", annotation);
            }
          }
        ];
      }
      return [
        {
          text: "Delete Translation",
          onClick: function() {
            deleteTranslation(annotation);
          }
        },
        {
          text: "Select Translation",
          onClick: function() {
            selectionLayerUpdate(annotation);
          }
        },
        ...this.getCopyOptions(annotation),
        {
          text: "View Translation Properties",
          onClick: function() {
            propertiesViewOpen();
            propertiesViewTabUpdate("translations", annotation);
          }
        }
      ];
    };

    render() {
      const {
        closePanelButton,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        tabHeight, //height of the little clickable tabs (passed because they are measured together with the editor panels and thus need to be subtracted)
        fitHeight //used to allow the editor to expand to fill the height of its containing component
      } = this.props;
      //do this in two steps to determine propsToPass
      let {
        children,
        vectorInteractionWrapperStyle = {},
        disableEditorClickAndDrag = false,
        ...propsToPass
      } = this.props;
      const { width, height } = this.props.dimensions || {};
      propsToPass.width = width;
      if (fitHeight) {
        propsToPass.height = height - tabHeight;
      }
      let selectedBps = getSequenceWithinRange(
        selectionLayer,
        sequenceData.sequence
      );
      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          ...this.enhanceRightClickActions({
            selectionLayerRightClicked: this.selectionLayerRightClicked,
            backgroundRightClicked: this.backgroundRightClicked,
            featureRightClicked: this.featureRightClicked,
            partRightClicked: this.partRightClicked,
            orfRightClicked: this.orfRightClicked,
            deletionLayerRightClicked: this.deletionLayerRightClicked,
            cutsiteRightClicked: this.cutsiteRightClicked,
            translationRightClicked: this.translationRightClicked,
            primerRightClicked: this.primerRightClicked
          }),
          handleRotateToCaretPosition: this.handleRotateToCaretPosition,
          orfClicked: this.annotationClicked,
          primerClicked: this.annotationClicked,
          translationClicked: this.annotationClicked,
          cutsiteClicked: this.cutsiteClicked,
          translationDoubleClicked: this.annotationClicked,
          deletionLayerClicked: this.annotationClicked,
          replacementLayerClicked: this.annotationClicked,
          featureClicked: this.annotationClicked,
          partClicked: this.annotationClicked,
          searchLayerClicked: this.annotationClicked,

          editorDragged: this.editorDragged,
          editorDragStarted: this.editorDragStarted,
          editorClicked: this.editorClicked,
          editorDragStopped: this.editorDragStopped
        };
      }
      return (
        <div
          tabIndex={-1} //this helps with focusing using Keyboard's parentElement.focus()
          ref={c => (this.node = c)}
          className={"veVectorInteractionWrapper"}
          style={{ position: "relative", ...vectorInteractionWrapperStyle }}
        >
          {closePanelButton}
          <Keyboard
            value={selectedBps}
            onCopy={this.handleCopy}
            onPaste={this.handlePaste}
          />

          {/* we pass this dialog here */}
          <Component {...propsToPass} />
        </div>
      );
    }
  };
}

export default compose(
  //tnr: get the store from the context somehow and pass it to the FrameTranslationMenuItems
  // withContext({ store: PropTypes.object }, ({ store }) => {
  //   return { store };
  // }),
  getContext({
    store: PropTypes.object
  }),
  withEditorProps,
  VectorInteractionHOC
);

const FrameTranslationMenuItem = connect((state, { editorName, frame }) => {
  return {
    isActive: get(state, `VectorEditor[${editorName}].frameTranslations`, {})[
      frame
    ]
  };
})(({ isActive, ...rest }) => {
  return <MenuItem {...{ label: isActive ? "✓" : undefined, ...rest }} />;
});

const CopyOptionMenuItem = connect((state, { editorName, copyOption }) => {
  return {
    isActive: get(state, `VectorEditor[${editorName}].copyOptions`, {})[
      copyOption
    ]
  };
})(({ isActive, ...rest }) => {
  return <MenuItem {...{ label: isActive ? "✓" : undefined, ...rest }} />;
});
