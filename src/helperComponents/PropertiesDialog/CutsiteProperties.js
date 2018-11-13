import React from "react";
import { DataTable, withSelectedEntities } from "teselagen-react-components";
import { map } from "lodash";
import EnzymeViewer from "../../EnzymeViewer";
import enzymeList from "../../redux/utils/defaultEnzymeList.json";
import CutsiteFilter from "../../CutsiteFilter";
import { Button, KeyCombo, Switch } from "@blueprintjs/core";

// import { Button } from "@blueprintjs/core";
// import { getRangeLength, convertRangeTo1Based } from "ve-range-utils";

class CutsiteProperties extends React.Component {
  onRowSelect = ([record]) => {
    if (!record) return;
    const { dispatch, editorName } = this.props;
    dispatch({
      type: "CARET_POSITION_UPDATE",
      payload: record.topSnipPosition,
      meta: {
        editorName
      }
    });
  };
  SubComponent = row => {
    // const { selectionLayerUpdate } = this.props;
    const { name, cutsiteGroup } = row.original;
    const entities = cutsiteGroup.map(
      ({
        restrictionEnzyme: { forwardRegex, reverseRegex } = {},
        forward,
        topSnipBeforeBottom,
        topSnipPosition,
        bottomSnipPosition
      }) => {
        return {
          topSnipPosition,
          position: topSnipBeforeBottom
            ? topSnipPosition + " - " + bottomSnipPosition
            : bottomSnipPosition + " - " + topSnipPosition,
          strand:
            forwardRegex === reverseRegex
              ? "Palindromic"
              : forward
                ? "1"
                : "-1forward"
        };
      }
    );
    const enzyme = enzymeList[name.toLowerCase()];
    // return <div>yooo</div>
    return (
      <div>
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          {enzyme && <EnzymeViewer
            {...{
              sequence: enzyme.site,
              reverseSnipPosition: enzyme.bottomSnipOffset,
              forwardSnipPosition: enzyme.topSnipOffset
            }}
          />}
          <div style={{ width: 300 }}>
            <h3>Cuts At: </h3>
            <DataTable
              //defaults={{order: ["numberOfCuts"]}}
              maxHeight={300}
              onRowSelect={this.onRowSelect}
              formName={"cutLocations"}
              isSingleSelect
              compact
              noRouter
              noHeader
              isSimple
              noFullscreenButton
              isInfinite
              withSearch={false}
              withFilter={false}
              schema={this.subComponentSchemna}
              entities={entities}
            />
          </div>
        </div>
      </div>
    );
  };

  subComponentSchemna = {
    fields: [
      { path: "position", type: "string" },
      { path: "strand", type: "string" }
    ]
  };

  schema = {
    fields: [
      { path: "name", type: "string" },
      { path: "numberOfCuts", type: "number" }
    ]
  };

  render() {
    const {
      // sequenceData = {},
      // allCutsites,
      editorName,
      annotationVisibilityShow,
      createNewDigest,
      filteredCutsites: allCutsites
      // sequenceData: {cutsites: {cutsitesByName}}={}
      // cutsitePropertiesSelectedEntities
    } = this.props;
    /* eslint-disable */

    // if (!allCutsites) debugger;
    /* eslint-enable */

    const { cutsitesByName } = allCutsites;

    const cutsitesToUse = map(cutsitesByName, (cutsiteGroup, name) => {
      return {
        cutsiteGroup,
        id: name,
        name,
        numberOfCuts: cutsiteGroup.length
        // size: getRangeLength(cutsiteGroup, sequenceData.sequence.length)
      };
    });
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            style={{ marginBottom: 0 }}
            checked={this.props.annotationVisibility.cutsites}
            onChange={() => {
              this.props.annotationVisibilityToggle("cutsites");
            }}
          >
            Hide/Show
          </Switch>

          <Button
            style={{ marginLeft: 10, cursor: "auto" }}
            disabled
            minimal
            icon="filter"
          />
          <CutsiteFilter
            style={{ flexGrow: 2 }}
            editorName={editorName}
            onChangeHook={function() {
              annotationVisibilityShow("cutsites");
            }}
          />

          <Button
            style={{ marginLeft: 15, flexGrow: -1 }}
            onClick={() => {
              createNewDigest();
            }}
          >
            Virtual Digest
          </Button>
        </div>
        <DataTable
          compact
          noSelect
          withExpandAndCollapseAllButton
          noFullscreenButton
          noPadding
          defaults={{ order: ["numberOfCuts"] }}
          maxHeight={400}
          formName={"cutsiteProperties"}
          noRouter
          withSearch={false}
          SubComponent={this.SubComponent}
          isInfinite
          schema={this.schema}
          entities={cutsitesToUse}
        />
      </div>
    );
  }
}

export default withSelectedEntities("cutsiteProperties")(CutsiteProperties);
