import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import { Button } from "@blueprintjs/core";
import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class TranslationProperties extends React.Component {
  render() {
    const {
      readOnly,
      sequenceData = {},
      translationPropertiesSelectedEntities,
      showAddOrEditTranslationDialog,
      deleteTranslation
    } = this.props;
    const { translations } = sequenceData;
    const translationsToUse = map(translations, translation => {
      return {
        ...translation,
        size: getRangeLength(translation, sequenceData.sequence.length)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DataTable
          withCheckboxes
          noPadding
          maxHeight={400}
          formName={"translationProperties"}
          noRouter
          compact
          isInfinite
          schema={{
            fields: [
              { path: "name", type: "string" },
              { path: "type", type: "string" },
              {
                path: "size",
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
              { path: "strand", type: "string" }
            ]
          }}
          entities={translationsToUse}
        />
        {!readOnly && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
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
            </Button>
            <Button
              onClick={() => {
                deleteTranslation(translationPropertiesSelectedEntities);
              }}
              style={{ marginRight: 15 }}
              disabled={!translationPropertiesSelectedEntities.length}
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
