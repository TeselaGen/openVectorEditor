import React, { useState } from "react";
import {
  showContextMenu,
  commandMenuEnhancer
} from "teselagen-react-components";

import { CircularView } from "./CircularView";
import { LinearView } from "./LinearView";
import { RowView } from "./RowView";

import { HoveredIdContext } from "./helperComponents/withHover";
import { visibilityDefaultValues } from "./redux/annotationVisibility";
import { addWrappedAddons } from "./utils/addWrappedAddons";
import { SimpleOligoPreview } from "./SimpleOligoPreview";
import { cloneDeep } from "lodash";
import { Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import getCommands from "./commands";
import { withHandlers } from "recompose";
import { exportSequenceToFile } from "./withEditorProps";

//this view is meant to be a helper for showing a simple (non-redux connected) circular or linear view!
export default (props) => {
  const {
    sequenceData: _sequenceData,
    annotationVisibility: _annotationVisibility = {},
    noWarnings = true,
    withDownload,
    withChoosePreviewType,
    withCaretEnabled,
    smallSlider
  } = props;
  const [previewType, setPreviewType] = useState(
    _sequenceData.circular ? "circular" : "linear"
  );
  const [caretPosition, setCaret] = useState(withCaretEnabled ? -1 : undefined);
  let tickSpacing = undefined;
  let Component = (
    withChoosePreviewType ? previewType === "circular" : _sequenceData.circular
  )
    ? CircularView
    : _sequenceData.isOligo && _sequenceData.sequence
    ? SimpleOligoPreview
    : LinearView;
  if (withChoosePreviewType && previewType === "row") {
    Component = RowView;
    tickSpacing = undefined;
  }

  let sequenceData = cloneDeep(_sequenceData);
  const annotationVisibility = {
    ...visibilityDefaultValues,
    ..._annotationVisibility
  };

  //here we're making it possible to not pass a sequenceData.sequence
  //we can just pass a .size property to save having to send the whole sequence if it isn't needed!
  if (sequenceData.noSequence) {
    annotationVisibility.sequence = false;
    annotationVisibility.reverseSequence = false;
    if (sequenceData.size === undefined) {
      return (
        <div>
          Error: No sequenceData.size detected when using noSequence flag{" "}
        </div>
      );
    }
    sequenceData = {
      ...sequenceData,
      sequence: {
        length: sequenceData.size
      }
    };
  }
  sequenceData.parts = addWrappedAddons(
    sequenceData.parts,
    sequenceData.sequence.length
  );
  return (
    <HoveredIdContext.Provider value={{ hoveredId: props.hoveredId }}>
      <div style={{ width: "fit-content" }}>
        {(withDownload || withChoosePreviewType) && (
          <div
            style={{
              marginLeft: 10,
              marginBottom: 5,
              display: "flex",
              justifyContent: "end"
            }}
          >
            {withDownload && <DownloadBtn {...props}></DownloadBtn>}
            {withChoosePreviewType && (
              <ButtonGroup>
                <Tooltip content="Circular">
                  <Button
                    className="tgPreviewTypeCircular"
                    active={previewType === "circular"}
                    intent="primary"
                    onClick={() => setPreviewType("circular")}
                    icon="circle"
                  ></Button>
                </Tooltip>
                <Tooltip content="Linear">
                  <Button
                    className="tgPreviewTypeLinear"
                    active={previewType === "linear"}
                    intent="primary"
                    onClick={() => setPreviewType("linear")}
                    icon="layout-linear"
                  ></Button>
                </Tooltip>
                <Tooltip content="Row">
                  <Button
                    className="tgPreviewTypeRow"
                    active={previewType === "row"}
                    intent="primary"
                    onClick={() => setPreviewType("row")}
                    icon="menu"
                  ></Button>
                </Tooltip>
              </ButtonGroup>
            )}
          </div>
        )}
        <Component
          {...{
            className: "tg-simple-dna-view veEditor",
            width: 300,
            height: 300,
            noWarnings,
            ...props,
            caretPosition,
            smallSlider,
            editorClicked: ({ nearestCaretPos } = {}) => {
              withCaretEnabled && setCaret(nearestCaretPos);
            },
            instantiated: true,
            tickSpacing,
            hoveredId: props.hoveredId,
            annotationVisibility,
            sequenceData,
            showTitle: true
          }}
        />
      </div>
    </HoveredIdContext.Provider>
  );
};

const DownloadBtn = withHandlers({ exportSequenceToFile })((props) => {
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
