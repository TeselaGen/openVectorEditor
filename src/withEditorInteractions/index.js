import {
  getSequenceDataBetweenRange,
  tidyUpSequenceData,
  getAminoAcidStringFromSequenceString
} from "ve-sequence-utils";
import { getSequenceWithinRange } from "ve-range-utils";
import Clipboard from "clipboard";
import { compose } from "redux";
import {
  getReverseComplementSequenceAndAnnotations,
  getComplementSequenceAndAnnotations
} from "ve-sequence-utils";
import { some, map } from "lodash";
import { Menu } from "@blueprintjs/core";
import { getContext, branch } from "recompose";

import { normalizePositionByRangeLength } from "ve-range-utils";
import React from "react";

import Combokeys from "combokeys";
import PropTypes from "prop-types";
import {
  showContextMenu,
  showConfirmationDialog,
  commandMenuEnhancer
} from "teselagen-react-components";
import { bioData } from "ve-sequence-utils";
import { jsonToGenbank } from "bio-parsers";
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
import {
  copyOptionsMenu,
  createNewAnnotationMenu
} from "../MenuBar/defaultConfig";
import { fullSequenceTranslationMenu } from "../MenuBar/viewSubmenu";
import { getNodeToRefocus } from "../utils/editorUtils";

function getAcceptedChars(isProtein) {
  return isProtein
    ? bioData.extended_protein_letters.toLowerCase()
    : bioData.ambiguous_dna_letters.toLowerCase();
}

const annotationClickHandlers = [
  "orfClicked",
  "primerClicked",
  "lineageAnnotationClicked",
  "assemblyPieceClicked",
  "translationClicked",
  "primaryProteinSequenceClicked",
  "cutsiteClicked",
  "translationDoubleClicked",
  "deletionLayerClicked",
  "replacementLayerClicked",
  "featureClicked",
  "warningClicked",
  "partClicked",
  "searchLayerClicked"
];
//withEditorInteractions is meant to give "interaction" props like "onDrag, onCopy, onKeydown" to the circular/row/linear views
function VectorInteractionHOC(Component /* options */) {
  return class VectorInteractionWrapper extends React.Component {
    constructor(props) {
      super(props);
      annotationClickHandlers.forEach(handler => {
        this[handler] = (...args) => {
          const { clickOverrides = {} } = this.props;
          let preventDefault;
          const defaultHandler = this[handler + "_localOverride"]
            ? this[handler + "_localOverride"]
            : this.annotationClicked;
          if (clickOverrides[handler]) {
            preventDefault = clickOverrides[handler](...args);
          }
          !preventDefault && defaultHandler(...args);
        };
      });

      const ConnectedMenu = withEditorProps(({ children }) => (
        <Menu>{children}</Menu>
      ));
      this.ConnectedMenu = props => (
        <ConnectedMenu store={this.props.store} {...props} />
      );
    }
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
        getAcceptedChars(
          this.props.sequenceData && this.props.sequenceData.isProtein
        ).split(""),
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
            sequenceData: { isProtein, circular } = {},
            circular: circular2,
            caretPositionUpdate,
            selectionLayerUpdate
          } = this.props;
          let moveBy = moveCaret({
            sequenceLength,
            bpsPerRow,
            caretPosition,
            selectionLayer,
            isProtein,
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

      this.commandEnhancer = commandMenuEnhancer(getCommands(this), {
        useTicks: true,
        omitIcons: true
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
        readOnly,
        onPaste
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

      insertAndSelectHelper({
        seqDataToInsert,
        props: this.props
      });

      window.toastr.success("Sequence Pasted Successfully");
      e.preventDefault();
    };

    handleCutOrCopy = isCut => e => {
      const {
        onCopy = () => {},
        sequenceData,
        selectionLayer,
        copyOptions
      } = this.props;
      const onCut = this.props.onCut || this.props.onCopy || (() => {});

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
        return window.toastr.warning(
          `No Sequence Selected To ${isCut ? "Cut" : "Copy"}`
        );

      const clipboardData = e.clipboardData;
      clipboardData.setData(
        "text/plain",
        seqData.isProtein ? seqData.proteinSequence : seqData.sequence
      );
      clipboardData.setData("application/json", JSON.stringify(seqData));
      e.preventDefault();

      if (isCut) {
        this.handleDnaDelete(false);
        onCut(
          e,
          tidyUpSequenceData(seqData, { annotationsAsObjects: true }),
          this.props
        );
        document.body.removeEventListener("cut", this.handleCut);
      } else {
        onCopy(e, seqData, this.props);
        document.body.removeEventListener("copy", this.handleCopy);
      }
      window.toastr.success(`Selection ${isCut ? "Cut" : "Copied"}`);
      this.sequenceDataToCopy = undefined;
    };
    handleCut = this.handleCutOrCopy(true);

    handleCopy = this.handleCutOrCopy();

    handleDnaInsert = ({ useEventPositioning }) => {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly
        // updateSequenceData,
        // wrappedInsertSequenceDataAtPositionOrRange
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
          acceptedChars: getAcceptedChars(sequenceData.isProtein),
          isProtein: sequenceData.isProtein,
          selectionLayer,
          sequenceLength,
          caretPosition,
          handleInsert: seqDataToInsert => {
            insertAndSelectHelper({
              props: this.props,
              seqDataToInsert
            });

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
        wrappedInsertSequenceDataAtPositionOrRange,
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
              caretPosition - (sequenceData.isProtein ? 3 : 1),
              sequenceLength
            ),
            end: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            )
          };
        }
        const [newSeqData] = wrappedInsertSequenceDataAtPositionOrRange(
          {},
          sequenceData,
          rangeToDelete
        );
        updateSequenceData(newSeqData);
        caretPositionUpdate(
          rangeToDelete.start > newSeqData.sequence.length
            ? //we're deleting around the origin so set the cursor to the 0 position
              0
            : normalizePositionByRangeLength(
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
      this.updateSelectionOrCaret(event.shiftKey || event.metaKey, {
        ...annotation,
        ...(forceUpdate && { forceUpdate })
      });
      !event.shiftKey && annotationDeselectAll(undefined);
      annotation.id && annotationSelect(annotation);
      annotation.annotationTypePlural &&
        propertiesViewTabUpdate(annotation.annotationTypePlural, annotation);
    };

    cutsiteClicked_localOverride = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { annotationSelect, annotationDeselectAll } = this.props;
      this.updateSelectionOrCaret(event.shiftKey, annotation.topSnipPosition);
      annotationDeselectAll(undefined);
      annotationSelect(annotation);
    };
    warningClicked_localOverride = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { annotationSelect, annotationDeselectAll } = this.props;
      showConfirmationDialog({
        cancelButtonText: "Cancel",
        confirmButtonText: "Okay",

        canEscapeKeyCancel: true,
        // intent: Intent.NONE,

        // onCancel: undefined,
        text: (
          <React.Fragment>
            <h3>{annotation.name}:</h3>
            {annotation.message}
          </React.Fragment>
        )
      });
      this.updateSelectionOrCaret(event.shiftKey, annotation);
      annotationDeselectAll(undefined);
      annotationSelect(annotation);
    };

    getCreateItems = () => {
      const { readOnly, sequenceLength } = this.props;
      return sequenceLength && readOnly
        ? []
        : [
            {
              text: "Create",
              submenu: ["newFeature", "newPart", "newPrimer"]
            }
          ];
    };
    insertHelper = {
      onClick: (e, ctxInfo) => {
        this.handleDnaInsert({
          useEventPositioning: {
            e,
            nodeToReFocus: getNodeToRefocus(ctxInfo.event.target)
          }
        });
      }
    };

    // eslint-disable-next-line no-unused-vars
    getCopyOptions = annotation => {
      const { sequenceData, readOnly } = this.props;
      const { isProtein } = sequenceData;
      const makeTextCopyable = (transformFunc, className, action = "copy") => {
        return new Clipboard(`.${className}`, {
          action: () => action,
          text: () => {
            const { selectionLayer, editorName, store } = this.props;
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
            const sequenceDataToCopy = transformFunc(
              selectedSeqData,
              sequenceData
            );

            this.sequenceDataToCopy = sequenceDataToCopy;
            if (action === "copy") {
              document.body.addEventListener("copy", this.handleCopy);
            } else {
              document.body.addEventListener("cut", this.handleCut);
            }
            if (window.Cypress) {
              window.__tg_copiedSeqData = sequenceDataToCopy;
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
                ...this.insertHelper
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
          submenu: !isProtein && [
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
              text: "Copy Genbank For Selection",
              className: "openVeCopyGenbankForSelection",
              willUnmount: () => {
                this.openVeCopyGenbankForSelection &&
                  this.openVeCopyGenbankForSelection.destroy();
              },
              didMount: ({ className }) => {
                this.openVeCopyGenbankForSelection = makeTextCopyable(
                  getGenbankFromSelection,
                  className
                );
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
            copyOptionsMenu
          ]
        },
        isProtein && copyOptionsMenu
      ];
    };

    getSelectionMenuOptions = annotation => {
      let items = [
        ...this.getCopyOptions(annotation),
        createNewAnnotationMenu,
        "--",
        "selectInverse",
        "--",
        "reverseComplementSelection",
        "complementSelection",
        {
          cmd: "changeCaseCmd",
          text: "Change Case",
          submenu: [
            // "upperCaseSequence",
            // "lowerCaseSequence",
            "upperCaseSelection",
            "lowerCaseSelection"
          ]
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
        const lastFocusedEl = document.activeElement;
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
          () => {
            if (
              lastFocusedEl &&
              document.activeElement &&
              (document.activeElement.classList.contains(
                "bp3-popover-enter-done"
              ) ||
                (document.activeElement.type === "textarea" && //this is the clipboard textarea created by clipboardjs
                  document.activeElement.offsetLeft === -9999))
            ) {
              lastFocusedEl.focus();
            }
          },
          opts, // context here
          this.ConnectedMenu
        );
      };
    };

    selectionLayerRightClicked = this.enhanceRightClickAction(
      ({ annotation }) => {
        return this.getSelectionMenuOptions({
          //manually only pluck off the start and end so that if the selection layer was generated from say a feature, those properties won't be carried into the create part/feature/primer dialogs
          start: annotation.start,
          end: annotation.end
        });
      },
      "selectionLayerRightClicked"
    );
    searchLayerRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
      return this.getSelectionMenuOptions({
        //manually only pluck off the start and end so that if the selection layer was generated from say a feature, those properties won't be carried into the create part/feature/primer dialogs
        start: annotation.start,
        end: annotation.end
      });
    }, "searchLayerRightClicked");

    backgroundRightClicked = this.enhanceRightClickAction(
      ({ nearestCaretPos, shiftHeld, event }) => {
        this.updateSelectionOrCaret(shiftHeld, nearestCaretPos);
        const {
          readOnly
          // sequenceData: { circular }
        } = this.props;
        const menu = [
          ...(readOnly
            ? []
            : [
                {
                  text: "Insert",
                  ...this.insertHelper
                }
              ]),
          "rotateToCaretPosition",
          ...this.getCreateItems(),
          {
            ...fullSequenceTranslationMenu,
            text: "View Full Sequence Translations"
          }
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
      return [
        "editPart",
        "deletePart",
        "--",
        ...this.getSelectionMenuOptions(annotation),
        "--",
        "newTranslation",
        "newReverseTranslation",
        "--",
        "showRemoveDuplicatesDialogParts",
        "viewPartProperties"
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
          showMergeFeaturesDialog,
          annotationsToSupport: { parts } = {}
        } = this.props;
        return [
          "editFeature",
          "deleteFeature",
          ...this.getSelectionMenuOptions(annotation),
          ...(readOnly
            ? []
            : [
                ...(parts && [
                  "--",
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
                        type: annotation.type,
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
                },
                "showRemoveDuplicatesDialogFeatures",
                "--"
              ]),
          "toggleCdsFeatureTranslations",
          "--",
          "newTranslation",
          "newReverseTranslation",
          "--",
          "viewFeatureProperties"
        ];
      },
      "featureRightClicked"
    );

    cutsiteRightClicked = this.enhanceRightClickAction(
      () => ["viewCutsiteProperties"],
      "cutsiteRightClicked"
    );
    primerRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
      return [
        "editPrimer",
        "deletePrimer",
        ...this.getSelectionMenuOptions(annotation),
        "newTranslation",
        "newReverseTranslation",
        "showRemoveDuplicatesDialogPrimers",
        "viewPrimerProperties"
      ];
    }, "primerRightClicked");
    orfRightClicked = this.enhanceRightClickAction(({ annotation }) => {
      this.props.selectionLayerUpdate({
        start: annotation.start,
        end: annotation.end
      });
      return [
        "toggleOrfTranslations",
        ...this.getSelectionMenuOptions(annotation),
        "viewOrfProperties"
      ];
    }, "orfRightClicked");
    translationRightClicked = this.enhanceRightClickAction(
      ({ event, annotation }) => {
        event.preventDefault();
        event.stopPropagation();
        const { selectionLayerUpdate, annotationVisibilityToggle } = this.props;
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
            "viewOrfProperties"
          ];
        }
        return [
          "deleteTranslation",
          {
            text: "Select Translation",
            onClick: function() {
              selectionLayerUpdate({
                start: annotation.start,
                end: annotation.end
              });
            }
          },
          ...this.getSelectionMenuOptions(annotation),
          "viewTranslationProperties"
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
          searchLayerRightClicked: this.searchLayerRightClicked,
          backgroundRightClicked: this.backgroundRightClicked,
          featureRightClicked: this.featureRightClicked,
          partRightClicked: this.partRightClicked,
          orfRightClicked: this.orfRightClicked,
          deletionLayerRightClicked: this.deletionLayerRightClicked,
          cutsiteRightClicked: this.cutsiteRightClicked,
          translationRightClicked: this.translationRightClicked,
          primerRightClicked: this.primerRightClicked,
          ...annotationClickHandlers.reduce((acc, handler) => {
            acc[handler] = this[handler];
            return acc;
          }, {}),
          editorDragged: this.editorDragged,
          editorDragStarted: this.editorDragStarted,
          editorClicked: this.editorClicked,
          editorDragStopped: this.editorDragStopped
        };
      }
      // propsToPass.triggerClipboardCommand = this.triggerClipboardCommand;

      return (
        <div
          tabIndex={0} //this helps with focusing using Keyboard's parentElement.focus()
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
  // connect(),
  withEditorProps,
  branch(({ noInteractions }) => !noInteractions, VectorInteractionHOC)
);

function getGenbankFromSelection(selectedSeqData, sequenceData) {
  const spansEntireSeq =
    sequenceData.sequence.length === selectedSeqData.sequence.length;
  const feats = map(selectedSeqData.features);
  const just1Feat = feats.length === 1;

  return {
    sequence: jsonToGenbank({
      ...selectedSeqData,
      name: spansEntireSeq
        ? selectedSeqData.name
        : just1Feat
        ? feats[0].name
        : selectedSeqData.name + "_partial",
      circular: spansEntireSeq ? selectedSeqData.circular : false
    })
  };
}

const insertAndSelectHelper = ({ seqDataToInsert, props }) => {
  const {
    updateSequenceData,
    wrappedInsertSequenceDataAtPositionOrRange,
    sequenceData,
    selectionLayerUpdate,
    caretPosition,
    selectionLayer
  } = props;

  // sequenceData,
  //             caretPosition,
  //             selectionLayer

  // updateSequenceData(
  //   wrappedInsertSequenceDataAtPositionOrRange(
  //     seqDataToInsert,
  //     sequenceData,
  //     caretPosition > -1 ? caretPosition : selectionLayer
  //   )
  // );

  // const newSelectionLayerStart =
  //   caretPosition > -1 ? caretPosition : (selectionLayer.start > selectionLayer.end ? 0 : selectionLayer.start);
  // selectionLayerUpdate({
  //   start: newSelectionLayerStart,
  //   end: newSelectionLayerStart + seqDataToInsert.sequence.length - 1
  // });
  const [
    newSeqData,
    { maintainOriginSplit }
  ] = wrappedInsertSequenceDataAtPositionOrRange(
    seqDataToInsert,
    sequenceData,
    caretPosition > -1 ? caretPosition : selectionLayer
  );
  updateSequenceData(newSeqData);
  const seqDataInsertLength = seqDataToInsert.sequence
    ? seqDataToInsert.sequence.length
    : null;
  const selectionStartDistanceFromEnd =
    Math.min(sequenceData.size - selectionLayer.start, seqDataInsertLength) ||
    seqDataInsertLength;

  const newSelectionLayerStart =
    caretPosition > -1
      ? caretPosition
      : selectionLayer.start > selectionLayer.end
      ? maintainOriginSplit
        ? newSeqData.size - selectionStartDistanceFromEnd
        : 0
      : selectionLayer.start;
  const newSelectionLayerEnd =
    newSelectionLayerStart +
    (seqDataToInsert.sequence
      ? seqDataToInsert.sequence.length - 1
      : seqDataToInsert.proteinSequence
      ? seqDataToInsert.proteinSequence.length * 3 - 1
      : 0);
  selectionLayerUpdate({
    start: newSelectionLayerStart,
    end: newSelectionLayerEnd % newSeqData.sequence.length
  });
};
