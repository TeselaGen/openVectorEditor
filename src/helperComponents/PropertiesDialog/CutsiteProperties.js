import React from "react";
import {
  CmdCheckbox,
  DataTable,
  withSelectedEntities
} from "teselagen-react-components";
import { map, get } from "lodash";
import CutsiteFilter from "../../CutsiteFilter";
import { Button } from "@blueprintjs/core";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";
import selectors from "../../selectors";
import commands from "../../commands";
import { userDefinedHandlersAndOpts } from "../../Editor/userDefinedHandlersAndOpts";
import { pick } from "lodash";
import SingleEnzymeCutsiteInfo from "./SingleEnzymeCutsiteInfo";
import { withRestrictionEnzymes } from "../../CutsiteFilter/withRestrictionEnzymes";

class CutsiteProperties extends React.Component {
  constructor(props) {
    super(props);
    this.commands = commands(this);
  }

  SubComponent = (row) => {
    return (
      <SingleEnzymeCutsiteInfo
        {...{
          allRestrictionEnzymes: this.props.allRestrictionEnzymes,
          allCutsites: this.props.allCutsites,
          filteredCutsites: this.props.filteredCutsites,
          editorName: this.props.editorName,
          dispatch: this.props.dispatch,
          selectedAnnotationId: this.props.selectedAnnotationId,
          cutsiteGroup: row.original.cutsiteGroup,
          enzyme: row.original.enzyme
        }}
      ></SingleEnzymeCutsiteInfo>
    );
  };

  schema = {
    fields: [
      { path: "name", type: "string" },
      { path: "numberOfCuts", type: "number" },
      { path: "groups", type: "string" }
    ]
  };

  onChangeHook = () => {
    this.props.annotationVisibilityShow("cutsites");
  };
  render() {
    const {
      editorName,
      createNewDigest,
      filteredCutsites: allCutsites,
      selectedAnnotationId
    } = this.props;

    const { cutsitesByName, cutsitesById } = allCutsites;
    const cutsitesToUse = map(cutsitesByName, (cutsiteGroup) => {
      const name = cutsiteGroup[0].restrictionEnzyme.name;
      let groups = "";
      const exisitingEnzymeGroups = window.getExistingEnzymeGroups();

      Object.keys(exisitingEnzymeGroups).forEach((key) => {
        if (exisitingEnzymeGroups[key].includes(name)) groups += key;
        groups += " ";
      });

      return {
        cutsiteGroup,
        id: name,
        name,
        numberOfCuts: cutsiteGroup.length,
        enzyme: cutsiteGroup[0].restrictionEnzyme,
        groups
        // size: getRangeLength(cutsiteGroup, sequenceData.sequence.length)
      };
    });
    return (
      <>
        <div
          style={{
            marginBottom: 10,
            paddingTop: 10,
            display: "flex",
            alignItems: "center"
          }}
        >
          <CmdCheckbox prefix="Show " cmd={this.commands.toggleCutsites} />
          <Button
            style={{ marginLeft: 10, cursor: "auto" }}
            disabled
            minimal
            icon="filter"
          />
          <CutsiteFilter
            {...pick(this.props, userDefinedHandlersAndOpts)}
            style={{ flexGrow: 2 }}
            editorName={editorName}
            onChangeHook={this.onChangeHook}
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
          selectedIds={get(
            cutsitesById[selectedAnnotationId],
            "restrictionEnzyme.name"
          )}
          compact
          noSelect
          noHeader
          noFooter
          withExpandAndCollapseAllButton
          noFullscreenButton
          noPadding
          defaults={{ order: ["numberOfCuts"] }}
          formName="cutsiteProperties"
          noRouter
          withSearch={false}
          SubComponent={this.SubComponent}
          isInfinite
          schema={this.schema}
          entities={cutsitesToUse}
        />
      </>
    );
  }
}

export default compose(
  connectToEditor((editorState, ownProps) => {
    const cutsites = selectors.filteredCutsitesSelector(
      editorState,
      ownProps.additionalEnzymes,
      ownProps.enzymeGroupsOverride
    );
    const allCutsites = selectors.cutsitesSelector(
      editorState,
      ownProps.additionalEnzymes
    );
    return {
      annotationVisibility: editorState.annotationVisibility || {},
      filteredCutsites: cutsites,
      allCutsites,
      cutsites: cutsites.cutsitesArray
    };
  }),
  withRestrictionEnzymes,
  withSelectedEntities("cutsiteProperties")
)(CutsiteProperties);
