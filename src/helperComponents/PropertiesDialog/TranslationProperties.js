import { Checkbox, Switch } from "@blueprintjs/core";
import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class TranslationProperties extends React.Component {
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
      sequenceData = {},
      translationPropertiesSelectedEntities,
      // showAddOrEditTranslationDialog,
      deleteTranslation,
      selectedAnnotationId,
      annotationVisibilityToggle,
      annotationVisibilityShow,
      annotationVisibility
    } = this.props;
    const { translations } = sequenceData;
    const translationsToUse = map(translations, translation => {
      return {
        ...translation,
        sizeBps: getRangeLength(translation, sequenceData.sequence.length),
        sizeAa: Math.floor(
          getRangeLength(translation, sequenceData.sequence.length) / 3
        ),
        ...(translation.strand === undefined && {
          strand: translation.forward ? 1 : -1
        })
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          noPadding
          onRowSelect={this.onRowSelect}
          maxHeight={400}
          selectedIds={selectedAnnotationId}
          formName={"translationProperties"}
          noRouter
          compact
          topLeftItems={
            <Switch
              checked={annotationVisibility.translations}
              onChange={() => {
                annotationVisibilityToggle("translations");
              }}
            >
              Hide/Show
            </Switch>
          }
          hideSelectedCount
          noFullscreenButton
          isInfinite
          schema={{
            fields: [
              // { path: "name", type: "string" },
              // { path: "type", type: "string" },
              {
                path: "translationType",
                displayName: "Type",
                type: "string"
              },
              {
                path: "sizeAa",
                displayName: "Size (aa)",
                type: "string"
              },
              {
                path: "sizeBps",
                displayName: "Size (bps)",
                type: "string",
                render: (val, record) => {
                  const base1Range = convertRangeTo1Based(record);
                  return (
                    <span>
                      {val}{" "}
                      <span style={{ fontSize: 10 }}>
                        ({base1Range.start}-{base1Range.end})
                      </span>
                    </span>
                  );
                }
              },
              { path: "strand", type: "number" }
            ]
          }}
          entities={translationsToUse}
        />
        <div>
          <Checkbox
            onChange={function() {
              annotationVisibilityToggle("orfTranslations");
              !annotationVisibility.orfTranslations &&
                annotationVisibilityShow("orfs");
            }}
            checked={annotationVisibility.orfTranslations}
            label={"Show translations for ORFs"}
          />
          <Checkbox
            onChange={function() {
              annotationVisibilityToggle("cdsFeatureTranslations");
            }}
            checked={annotationVisibility.cdsFeatureTranslations}
            label={"Show translations for CDS features"}
          />
        </div>
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* <Button
              style={{ marginRight: 15 }}
              onClick={() => {
                showAddOrEditTranslationDialog();
              }}
            >
              New
            </Button>
            <Button
              onClick={() => {
                showAddOrEditTranslationDialog(
                  translationPropertiesSelectedEntities[0]
                );
              }}
              style={{ marginRight: 15 }}
              disabled={translationPropertiesSelectedEntities.length !== 1}
            >
              Edit
            </Button> */}

            <Button
              onClick={() => {
                deleteTranslation(translationPropertiesSelectedEntities);
              }}
              style={{ marginLeft: 10, marginRight: 15, height: 30 }}
              disabled={
                !translationPropertiesSelectedEntities.length ||
                translationPropertiesSelectedEntities[0].translationType !==
                  "User Created"
              }
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withSelectedEntities("translationProperties")(
  TranslationProperties
);
