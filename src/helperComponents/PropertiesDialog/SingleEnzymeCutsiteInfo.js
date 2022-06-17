import React from "react";
import { DataTable } from "teselagen-react-components";

import { CutsiteTag } from "../../CutsiteFilter/AdditionalCutsiteInfoDialog";

import EnzymeViewer from "../../EnzymeViewer";
import { getEnzymeAliases } from "../../utils/editorUtils";

export default function SingleEnzymeCutsiteInfo({
  cutsiteGroup,
  enzyme,
  dispatch,
  allRestrictionEnzymes,
  editorName,
  selectedAnnotationId,
  allCutsites,
  filteredCutsites: { cutsitesByName: cutsitesByNameActive }
}) {
  const onRowSelect = ([record]) => {
    if (!record) return;

    dispatch({
      type: "CARET_POSITION_UPDATE",
      payload: record.topSnipPosition,
      meta: {
        editorName
      }
    });
  };
  const aliases = getEnzymeAliases(enzyme);
  const entities = cutsiteGroup
    .sort((a, b) => a.topSnipPosition - b.topSnipPosition)
    .map(
      ({
        restrictionEnzyme: { forwardRegex, reverseRegex } = {},
        forward,
        id,
        topSnipBeforeBottom,
        topSnipPosition,
        bottomSnipPosition
      }) => {
        return {
          id,
          topSnipPosition,
          position: topSnipBeforeBottom
            ? topSnipPosition + " - " + bottomSnipPosition
            : bottomSnipPosition + " - " + topSnipPosition,
          strand:
            forwardRegex === reverseRegex ? "Palindromic" : forward ? "1" : "-1"
        };
      }
    );

  return (
    <div>
      <div
        className="ve-enzymeSubrow"
        style={{
          margin: 10
        }}
      >
        {enzyme && (
          <EnzymeViewer
            {...{
              sequence: enzyme.site,
              reverseSnipPosition: enzyme.bottomSnipOffset,
              forwardSnipPosition: enzyme.topSnipOffset
            }}
          />
        )}
        <br></br>
        {entities && !!entities.length && (
          <div>
            <DataTable
              style={{ minHeight: 0, maxHeight: 200 }}
              selectedIds={selectedAnnotationId}
              maxHeight={300}
              onRowSelect={onRowSelect}
              formName="cutLocations"
              isSingleSelect
              compact
              noRouter
              minimalStyle
              scrollToSelectedRowRelativeToDom
              noHeader
              isSimple
              noFullscreenButton
              isInfinite
              withSearch={false}
              withFilter={false}
              schema={schema}
              entities={entities}
            />
          </div>
        )}
        {aliases && aliases.length && (
          <div style={{ marginTop: 10 }}>
            Aliases:
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {aliases.map((n, i) => {
                return (
                  <CutsiteTag
                    allRestrictionEnzymes={allRestrictionEnzymes}
                    cutsitesByNameActive={cutsitesByNameActive}
                    cutsitesByName={allCutsites.cutsitesByName}
                    key={i}
                    name={n}
                    doNotShowCuts
                  ></CutsiteTag>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const schema = {
  fields: [
    { path: "topSnipPosition", displayName: "Top Snip", type: "string" },
    { path: "position", type: "string" },
    { path: "strand", type: "string" }
  ]
};

// export default compose(
//   withEditorProps,
//   withRestrictionEnzymes
// )(SingleEnzymeCutsiteInfo);
