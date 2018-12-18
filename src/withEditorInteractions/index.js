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
import { getContext, branch } from "recompose";

import {
  normalizePositionByRangeLength
  // convertRangeTo1Based
} from "ve-range-utils";
import React from "react";

// import handleCaretMoved from "./handleCaretMoved";
import Combokeys from "combokeys";
import PropTypes from "prop-types";
import {
  showContextMenu,
  showConfirmationDialog,
  commandMenuEnhancer
} from "teselagen-react-components";
import withEditorProps from "../withEditorProps";
import getCommands from "../commands";
import moveCaret from "./moveCaret";
import createSequenceInputPopup from "./createSequenceInputPopup";
import Keyboard from "./Keyboard";
import {
  handleCaretMoved,
  editorDragged,
  editorClicked,
  editorDragStarted,
  editorDragStopped,
  updateSelectionOrCaret
} from "./clickAndDragUtils";
import getBpsPerRow from "./getBpsPerRow";

//withEditorInteractions is meant to give "interaction" props like "onDrag, onCopy, onKeydown" to the circular/row/linear views
function VectorInteractionHOC(Component /* options */) {
  return class VectorInteractionWrapper extends React.Component {
    componentWillUnmount() {
      this.combokeys && this.combokeys.detach();
    }
    componentDidMount() {
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

      // TODO: move these into commands
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
            sequenceData: { circular } = {},
            circular: circular2,
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
            circular: circular || circular2,
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

      this.commandEnhancer = commandMenuEnhancer(getCommands(this));
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
      if (!(caretPosition > -1 || selectionLayer.start > -1)) {
        return window.toastr.warning("Please place the cursor before pasting");
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

    handleCut = e => {
      window.toastr.success("Selection Cut");
      const { sequenceData, selectionLayer, copyOptions } = this.props;

      const onCut = this.props.onCut || this.props.onCopy || (() => {});

      const sequenceDataToCopy =
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
        });

      this.handleDnaDelete(false);

      onCut(
        e,
        tidyUpSequenceData(sequenceDataToCopy, { annotationsAsObjects: true }),
        this.props
      );
      this.sequenceDataToCopy = undefined;
      document.body.removeEventListener("cut", this.handleCut);
    };

    handleCopy = e => {
      const {
        onCopy = () => {},
        sequenceData,
        selectionLayer,
        copyOptions
      } = this.props;
      const seqData = tidyUpSequenceData(
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
      );
      if (!seqData.sequence.length)
        return window.toastr.warning("No Sequence Selected To Copy");
      onCopy(e, seqData, this.props);

      this.sequenceDataToCopy = undefined;
      document.body.removeEventListener("copy", this.handleCopy);
      window.toastr.success("Selection Copied");
    };

    handleDnaInsert = ({ useEventPositioning }) => {
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
          useEventPositioning,
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
            window.toastr.success("Sequence Inserted Successfully");
          }
        });
      }
    };
    handleDnaDelete = (showToast = true) => {
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
        if (showToast) window.toastr.success("Sequence Deleted Successfully");
      }
    };

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
      const { start, end, forceUpdate } = newSelection;
      if (
        selectionLayer.start === start &&
        selectionLayer.end === end &&
        selectionLayer.forceUpdate === forceUpdate
      ) {
        return;
      }
      //we only call selectionLayerUpdate if we're actually changing something
      this.props.selectionLayerUpdate({
        ...newSelection,
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
        selectionLayer,
        annotationDeselectAll,
        propertiesViewTabUpdate
      } = this.props;
      let forceUpdate;
      if (
        annotation.start > -1 &&
        selectionLayer.start === annotation.start &&
        selectionLayer.end === annotation.end
      ) {
        forceUpdate = selectionLayer.forceUpdate === "end" ? "start" : "end";
      }
      this.updateSelectionOrCaret(event.shiftKey, {
        ...annotation,
        ...(forceUpdate && { forceUpdate })
      });
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
                features && "newFeature",
                parts && "newPart",
                primers && {
                  // TODO migrate this one to a command too
                  text: "Primer",
                  onClick: function() {
                    showAddOrEditPrimerDialog(rangeToUse);
                  }
                }
              ]
            }
          ];
    };

    // eslint-disable-next-line no-unused-vars
    getCopyOptions = annotation => {
      const {
        // sequenceData,
        selectionLayer,
        toggleCopyOption,
        editorName,
        store,
        readOnly,
        copyOptions
      } = this.props;
      const makeTextCopyable = (transformFunc, className, action = "copy") => {
        return new Clipboard(`.${className}`, {
          action: () => action,
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
            if (action === "copy") {
              document.body.addEventListener("copy", this.handleCopy);
            } else {
              document.body.addEventListener("cut", this.handleCut);
            }

            return sequenceDataToCopy.sequence;
          }
        });
      };
      // TODO: maybe stop using Clipboard.js and unify clipboard handling with
      // a more versatile approach
      return [
        ...(readOnly
          ? []
          : [
              {
                text: "Replace",
                onClick: e => {
                  this.handleDnaInsert({ useEventPositioning: e });
                }
              },
              {
                text: "Cut",
                className: "openVeCut",
                willUnmount: () => {
                  this.openVeCut && this.openVeCut.destroy();
                },
                didMount: ({ className }) => {
                  // TODO: Maybe use a cut action instead
                  this.openVeCut = makeTextCopyable(i => i, className, "cut");
                }
              }
            ]),
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
                  selectedSeqData => ({
                    sequence: getAminoAcidStringFromSequenceString(
                      selectedSeqData.sequence
                    )
                  }),
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
                  selectedSeqData => ({
                    sequence: getAminoAcidStringFromSequenceString(
                      getReverseComplementSequenceAndAnnotations(
                        selectedSeqData
                      ).sequence
                    )
                  }),
                  className
                );
              }
            },
            {
              text: "Copy Options",
              submenu: [
                <MenuItem disabled key="aghah" text="Include:" />
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
        upsertTranslation,
        annotationVisibilityShow
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
            annotationVisibilityShow("translations");
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
    enhanceRightClickAction = (action, key) => {
      return opts => {
        const { rightClickOverrides = {} } = this.props;
        const items = action(opts);
        const e = (items && items._event) || opts.event || opts;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        //override hook here
        const override = rightClickOverrides[key];
        showContextMenu(
          override ? override(items, opts, this.props) : items,
          [this.commandEnhancer],
          e,
          undefined,
          opts // context here
        );
      };
    };

    selectionLayerRightClicked = this.enhanceRightClickAction(
      ({ annotation }) => {
        return this.generateSelectionMenuOptions({
          //manually only pluck off the start and end so that if the selection layer was generated from say a feature, those properties won't be carried into the create part/feature/primer dialogs
          start: annotation.start,
          end: annotation.end
        });
      },
      "selectionLayerRightClicked"
    );

    backgroundRightClicked = this.enhanceRightClickAction(
      ({ nearestCaretPos, shiftHeld, event }) => {
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
                  text: "Insert",
                  onClick: e => {
                    this.handleDnaInsert({ useEventPositioning: e });
                  }
                },
                {
                  disabled: !circular,
                  text: "Rotate To Here",
                  tooltip: !circular
                    ? "Disabled because the sequence is linear"
                    : undefined,
                  onClick: this.props.handleRotateToCaretPosition
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
      },
      "backgroundRightClicked"
    );

    deletionLayerRightClicked = this.enhanceRightClickAction(
      ({ annotation }) => {
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
      },
      "deletionLayerRightClicked"
    );

    partRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
      const {
        readOnly,
        upsertTranslation,
        deletePart,
        annotationVisibilityShow,
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
            annotationVisibilityShow("translations");
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
    }, "partRightClicked");
    featureRightClicked = this.enhanceRightClickAction(
      ({ annotation, event }) => {
        this.props.selectionLayerUpdate({
          start: annotation.start,
          end: annotation.end
        });
        event.persist();
        const {
          readOnly,
          upsertTranslation,
          deleteFeature,
          showMergeFeaturesDialog,
          annotationVisibilityToggle,
          annotationVisibilityShow,
          // showAddOrEditFeatureDialog,
          propertiesViewOpen,
          annotationsToSupport: { parts } = {},
          propertiesViewTabUpdate
        } = this.props;
        return [
          ...(readOnly
            ? []
            : [
                "editFeature",
                // {
                //   text: "Edit Feature",
                //   onClick: function() {
                //     showAddOrEditFeatureDialog(annotation);
                //   }
                // },
                // TODO: migrate others as commands too
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
              annotationVisibilityShow("translations");
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
      },
      "featureRightClicked"
    );

    cutsiteRightClicked = this.enhanceRightClickAction(({ annotation }) => {
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
    }, "cutsiteRightClicked");
    primerRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
      const {
        showAddOrEditPrimerDialog,
        readOnly,
        upsertTranslation,
        propertiesViewOpen,
        annotationVisibilityShow,
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
            annotationVisibilityShow("translations");
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
    }, "primerRightClicked");
    orfRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
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
    }, "orfRightClicked");
    translationRightClicked = this.enhanceRightClickAction(
      ({ event, annotation }) => {
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
        this.props.selectionLayerUpdate({
          start: annotation.start,
          end: annotation.end
        });
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
              selectionLayerUpdate({
                start: annotation.start,
                end: annotation.end
              });
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
      },
      "translationRightClicked"
    );

    render() {
      const {
        closePanelButton,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        tabHeight //height of the little clickable tabs (passed because they are measured together with the editor panels and thus need to be subtracted)
        // fitHeight //used to allow the editor to expand to fill the height of its containing component
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
      propsToPass.height = height - tabHeight;
      // if (fitHeight) {
      // }
      let selectedBps = getSequenceWithinRange(
        selectionLayer,
        sequenceData.sequence
      );
      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          selectionLayerRightClicked: this.selectionLayerRightClicked,
          backgroundRightClicked: this.backgroundRightClicked,
          featureRightClicked: this.featureRightClicked,
          partRightClicked: this.partRightClicked,
          orfRightClicked: this.orfRightClicked,
          deletionLayerRightClicked: this.deletionLayerRightClicked,
          cutsiteRightClicked: this.cutsiteRightClicked,
          translationRightClicked: this.translationRightClicked,
          primerRightClicked: this.primerRightClicked,
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
      // propsToPass.triggerClipboardCommand = this.triggerClipboardCommand;

      return (
        <div
          tabIndex={-1} //this helps with focusing using Keyboard's parentElement.focus()
          ref={c => (this.node = c)}
          className="veVectorInteractionWrapper"
          style={{ position: "relative", ...vectorInteractionWrapperStyle }}
          onFocus={this.handleWrapperFocus}
        >
          {closePanelButton}
          <Keyboard
            value={selectedBps}
            onCopy={this.handleCopy}
            onPaste={this.handlePaste}
            onCut={this.handleCut}
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
  branch(({ noInteractions }) => !noInteractions, VectorInteractionHOC)
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
