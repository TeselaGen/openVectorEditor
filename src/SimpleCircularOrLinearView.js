import React from "react";
import {
  showContextMenu,
  commandMenuEnhancer,
  FillWindow
} from "teselagen-react-components";

import { CircularView } from "./CircularView";
import { LinearView } from "./LinearView";
import { RowView } from "./RowView";

import { SimpleOligoPreview } from "./SimpleOligoPreview";
import { flatMap, map, startCase } from "lodash";
import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Popover,
  Tooltip
} from "@blueprintjs/core";
import getCommands from "./commands";
import { withHandlers } from "recompose";
import {
  editorClicked,
  updateSelectionOrCaret
} from "./withEditorInteractions/clickAndDragUtils";

//this view is meant to be a helper for showing a simple (non-redux connected) circular or linear view!
export default ({ ed, hoveredId, noWarnings = true }) => {
  function annotationClicked({ annotation, event }) {
    event.stopPropagation();
    event.preventDefault();
    ed.withSelectionEnabled &&
      updateSelectionOrCaret({
        doNotWrapOrigin: !ed.circular,
        shiftHeld: event.shiftKey,
        sequenceLength: ed.size,
        newRangeOrCaret: annotation,
        caretPosition: ed.caretPosition,
        selectionLayer: ed.selectionLayer,
        selectionLayerUpdate: ed.selectionLayerUpdate,
        caretPositionUpdate: ed.caretPositionUpdate
      });
  }

  let tickSpacing = undefined;
  let Component = (
    ed.withChoosePreviewType ? ed.previewType === "circular" : ed.circular
  )
    ? CircularView
    : ed.isOligo && ed.sequence
    ? SimpleOligoPreview
    : LinearView;
  if (ed.withChoosePreviewType && ed.previewType === "row") {
    Component = RowView;
    tickSpacing = undefined;
  }

  //here we're making it possible to not pass a ed.sequence
  //we can just pass a .size property to save having to send the whole sequence if it isn't needed!
  // if (ed.noSequence) {
  //   ed.annotationVisibility.sequence = false;
  //   ed.annotationVisibility.reverseSequence = false;
  //   if (ed.size === undefined) {
  //     return (
  //       <div>
  //         Error: No ed.size detected when using noSequence flag{" "}
  //       </div>
  //     );
  //   }
  //   ed = {
  //     ...ed,
  //     sequence: {
  //       length: ed.size
  //     }
  //   };
  // }
  // ed.parts = addWrappedAddons(
  //   ed.parts,
  //   ed.sequence.length
  // );
  const inner = ({ width, height }) => (
    <div style={{ width: "fit-content" }}>
      {(ed.withDownload ||
        ed.withChoosePreviewType ||
        ed.withFullscreen ||
        VisibilityOptions) && (
        <div
          style={{
            marginLeft: 10,
            marginBottom: 5,
            ...(ed.isFullscreen && {
              marginRight: 10,
              paddingTop: 10
            }),
            display: "flex",
            justifyContent: "end"
          }}
        >
          {ed.withDownload && <DownloadBtn ed={ed}></DownloadBtn>}
          {ed.withVisibilityOptions && (
            <VisibilityOptions ed={ed}></VisibilityOptions>
          )}

          {ed.withChoosePreviewType && (
            <ButtonGroup>
              <Tooltip content="Circular View">
                <Button
                  minimal={ed.minimalPreviewTypeBtns}
                  className="tgPreviewTypeCircular"
                  active={ed.previewType === "circular"}
                  intent="primary"
                  onClick={() => ed.setPreviewType("circular")}
                  icon="circle"
                ></Button>
              </Tooltip>
              <Tooltip content="Linear View">
                <Button
                  minimal={ed.minimalPreviewTypeBtns}
                  className="tgPreviewTypeLinear"
                  active={ed.previewType === "linear"}
                  intent="primary"
                  onClick={() => ed.setPreviewType("linear")}
                  icon="layout-linear"
                ></Button>
              </Tooltip>
              <Tooltip content="Sequence View">
                <Button
                  minimal={ed.minimalPreviewTypeBtns}
                  className="tgPreviewTypeRow"
                  active={ed.previewType === "row"}
                  intent="primary"
                  onClick={() => ed.setPreviewType("row")}
                  icon="menu"
                ></Button>
              </Tooltip>
            </ButtonGroup>
          )}
          {ed.withFullscreen && (
            <FullscreenBtn
              {...{
                setFullscreen: ed.setFullscreen,
                isFullscreen: ed.isFullscreen
              }}
            ></FullscreenBtn>
          )}
        </div>
      )}
      <Component
        ed={ed}
        {...{
          width: 300,
          height: 300,
          noWarnings,
          partClicked: annotationClicked,
          featureClicked: annotationClicked,
          primerClicked: annotationClicked,
          smartCircViewLabelRender: true,
          hoveredId,
          showTitle: true,

          readOnly: true,
          editorClicked: ({ nearestCaretPos, event } = {}) => {
            if (!ed.withCaretEnabled) {
              if (!ed.withSelectionEnabled) return;
              if (!event.shiftKey) return;
              if (!(ed.selectionLayer.start > -1)) return;
            }

            editorClicked({
              nearestCaretPos,
              shiftHeld: !ed.withSelectionEnabled ? false : event.shiftKey,
              updateSelectionOrCaret: (shiftHeld, newRangeOrCaret) => {
                updateSelectionOrCaret({
                  doNotWrapOrigin: !ed.circular,
                  sequenceLength: ed.sequenceLength,
                  shiftHeld,
                  newRangeOrCaret,
                  caretPosition: ed.caretPosition,
                  selectionLayer: ed.selectionLayer,
                  selectionLayerUpdate: ed.selectionLayerUpdate,
                  caretPositionUpdate: ed.caretPositionUpdate
                });
              }
            });
          }
        }}
      />
    </div>
  );
  if (ed.isFullscreen) {
    return (
      <FillWindow asPortal className="tgSimpleViewFullscreen">
        {inner}
      </FillWindow>
    );
  }
  return inner({});
};

const DownloadBtn = ((props) => {
  return (
    <Tooltip content="Download">
      <Button
        className="veDownloadButton"
        style={{ marginRight: 10 }}
        onClick={(event) =>
          showContextMenu(
            [
              "exportSequenceAsGenbank",
              "exportSequenceAsFasta",
              "exportSequenceAsTeselagenJson"
            ],
            [
              commandMenuEnhancer(getCommands({ props }), {
                useTicks: true,
                omitIcons: true
              })
            ],
            event
          )
        }
        minimal
        intent="primary"
        icon="download"
      ></Button>
    </Tooltip>
  );
});
const FullscreenBtn = ({ setFullscreen, isFullscreen }) => {
  return (
    <Tooltip content={`${isFullscreen ? "Close " : ""}Fullscreen`}>
      <Button
        className="veFullscreenButton"
        style={{ marginLeft: 10, marginRight: 10 }}
        onClick={() => {
          setFullscreen(!isFullscreen);
        }}
        minimal
        intent="primary"
        icon={!isFullscreen ? "maximize" : "minimize"}
      ></Button>
    </Tooltip>
  );
};
const VisibilityOptions = ({ ed }) => {
  return (
    <Tooltip disabled={ed.isVisPopoverOpen} content="Visibility Options">
      <Popover
        minimal
        onInteraction={(isOpen) => {
          ed.setVisPopoverOpen(isOpen);
        }}
        isOpen={ed.isVisPopoverOpen}
        content={
          <Menu>
            {flatMap(
              ["features", "parts", "primers", "translations", "cutsites"],
              (name) => {
                if (!map(ed[name])?.length) return [];
                return (
                  <MenuItem
                    onClick={(e) => {
                      ed.annotationVisibility.toggleAnnotationVisibility(name);
                      e.stopPropagation();
                    }}
                    icon={ed.annotationVisibility[name] ? "tick" : "blank"}
                    key={name}
                    text={startCase(name)}
                  ></MenuItem>
                );
              }
            )}
          </Menu>
        }
      >
        <Button
          className="veSimpleVisibilityBtn"
          style={{ marginLeft: 10, marginRight: 10 }}
          minimal
          intent="primary"
          icon="eye-open"
        ></Button>
      </Popover>
    </Tooltip>
  );
};
