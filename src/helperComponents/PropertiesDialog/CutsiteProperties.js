import React from "react";
import {
  CmdCheckbox,
  DataTable,
  withSelectedEntities
} from "teselagen-react-components";
import { map, get } from "lodash";
import CutsiteFilter from "../../CutsiteFilter";
import { Button, Tag, Tooltip } from "@blueprintjs/core";
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
  state = {
    notLogic: false
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
      selectedAnnotationId,
      allRestrictionEnzymes
    } = this.props;
    const { cutsitesByName, cutsitesById } = allCutsites;
    

    let cutsitesToUse = map(cutsitesByName, (cutsiteGroup) => {
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
    if (this.state && this.state.notLogic) {
      const allRestrictionEnzymesLower = Object.keys(allRestrictionEnzymes).reduce((acc, key) => {
        acc[key.toLowerCase()] = allRestrictionEnzymes[key]
        return acc
      }, {})
      const filteredEnzymes = Object.keys(allRestrictionEnzymesLower).filter((key) => {
        return !cutsitesByName[key]
      }).map((key) => {
        return allRestrictionEnzymesLower[key]
      })
      const filteredEnzymesObj = filteredEnzymes.reduce((acc, enzyme) => {
        acc[enzyme.name] = enzyme
        return acc
      }, {})

      cutsitesToUse = map(filteredEnzymesObj, (enzyme) => {
        const name = enzyme.name;
        return {
          numberOfCuts: 0,
          cutsiteGroup: [],
          id: name,
          name,
          enzyme,
        };
      })
    }
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
        <Tooltip
          content={
            this.state.notLogic
            ?`Display enzymes that are not in the groups selected`:
            `Display enzymes that are in the groups selected` 
          }
        >
          <Tag 
            style={{width: "10vw", textAlign: "center", marginBottom: "2%"}}
            onClick={(e) => {
              e.stopPropagation()
              this.setState({notLogic: !this.state.notLogic})}}>
            {this.state.notLogic ? "NOT Included" : "Included"}
          </Tag>
        </Tooltip>
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
