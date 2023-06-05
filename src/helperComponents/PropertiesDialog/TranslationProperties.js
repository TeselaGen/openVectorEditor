import { Tooltip, AnchorButton } from "@blueprintjs/core";
import React from "react";
import {
  DataTable,
  withSelectedEntities,
  createCommandMenu
} from "teselagen-react-components";
import getCommands from "../../commands";
import { map } from "lodash";
import { getRangeLength } from "@teselagen/range-utils";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import selectors from "../../selectors";
import { getMassOfAaString } from "@teselagen/sequence-utils";
import { translationsSubmenu } from "../../MenuBar/viewSubmenu";
import { getVisFilter } from "./GenericAnnotationProperties";

class TranslationProperties extends React.Component {
  constructor(props) {
    super(props);
    this.commands = getCommands(this);
  }
  onRowSelect = ([record]) => {
    if (!record) return;
    const { dispatch, editorName } = this.props;
    dispatch({
      type: "SELECTION_LAYER_UPDATE",
      payload: record,
      meta: {
        editorName
      }
    });
  };
  render() {
    const {
      readOnly,
      translations,
      translationPropertiesSelectedEntities,
      deleteTranslation,
      sequenceLength,
      selectedAnnotationId,
      annotationVisibility
    } = this.props;
    const translationsToUse = map(translations, (translation) => {
      let aaString = "";
      for (let i = 0; i < translation.aminoAcids.length; i++) {
        aaString += translation.aminoAcids[i].aminoAcid.value;
      }
      return {
        ...translation,
        sizeBps: getRangeLength(translation, sequenceLength),
        sizeAa:
          translation.translationType === "ORF"
            ? Math.floor(getRangeLength(translation, sequenceLength) / 3 - 1)
            : Math.floor(getRangeLength(translation, sequenceLength) / 3),
        ...(translation.strand === undefined && {
          strand: translation.forward ? 1 : -1
        }),
        mass: getMassOfAaString(aaString, 2, true)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          withCheckboxes
          noPadding
          onRowSelect={this.onRowSelect}
          selectedIds={selectedAnnotationId}
          formName="translationProperties"
          noRouter
          compact
          topLeftItems={getVisFilter(
            createCommandMenu(translationsSubmenu, this.commands, {
              useTicks: true
            })
          )}
          leftOfSearchBarItems={
            !readOnly && (
              <Tooltip
                content={
                  translationPropertiesSelectedEntities.length &&
                  translationPropertiesSelectedEntities[0].translationType !==
                    "User Created"
                    ? `Only "User Created" translations can be deleted`
                    : undefined
                }
              >
                <AnchorButton
                  onClick={() => {
                    deleteTranslation(translationPropertiesSelectedEntities);
                  }}
                  intent="danger"
                  icon="trash"
                  style={{ marginLeft: 10, marginRight: 15, height: 30 }}
                  disabled={
                    !translationPropertiesSelectedEntities.length ||
                    translationPropertiesSelectedEntities[0].translationType !==
                      "User Created"
                  }
                ></AnchorButton>
              </Tooltip>
            )
          }
          annotationVisibility={annotationVisibility} //we need to pass this in order to force the DT to rerender
          hideSelectedCount
          noFooter
          noFullscreenButton
          isInfinite
          schema={{
            fields: [
              {
                path: "translationType",
                displayName: "Type",
                type: "string"
              },
              {
                path: "sizeAa",
                displayName: "Size (aa)",
                type: "number"
              },
              {
                path: "mass",
                displayName: "Mass (g/mol)",
                type: "number"
              },
              { path: "strand", type: "number" }
            ]
          }}
          entities={translationsToUse}
        />
      </div>
    );
  }
}

export default compose(
  connectToEditor((editorState) => {
    const { readOnly, annotationVisibility = {}, sequenceData } = editorState;
    return {
      readOnly,
      translations: selectors.translationsSelector(editorState),
      orfs: selectors.orfsSelector(editorState),
      annotationVisibility,
      sequenceLength: (sequenceData.sequence || "").length,
      sequenceData
    };
  }),
  withSelectedEntities("translationProperties")
)(TranslationProperties);
