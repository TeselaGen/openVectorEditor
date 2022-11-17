/* eslint-disable jsx-a11y/anchor-is-valid */
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon } from "@blueprintjs/core";
import withEditorProps from "../withEditorProps";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";

import React from "react";

import "./style.css";
import { TgSelect } from "teselagen-react-components";

import { map, flatMap, includes, pickBy, isEmpty } from "lodash";
import { omit } from "lodash";
import { showDialog } from "../GlobalDialogUtils";
import {
  addCutsiteGroupClickHandler,
  CutsiteTag,
  getCutsiteWithNumCuts,
  getUserGroupLabel
} from "./AdditionalCutsiteInfoDialog";
import { withRestrictionEnzymes } from "./withRestrictionEnzymes";
import { aliasedEnzymesByName, defaultEnzymesByName } from "ve-sequence-utils";

const NoResults = withRestrictionEnzymes(
  ({
    cutsitesByName,
    cutsitesByNameActive,
    closeDropDown,
    allRestrictionEnzymes,
    queryString = "",
    onHiddenEnzymeAdd
  }) => {
    const enzymesByNameThatMatch = pickBy(
      allRestrictionEnzymes,
      function (v, k) {
        if (cutsitesByName[k]) {
          return false;
        }
        return includes(k.toLowerCase(), queryString.toLowerCase());
      }
    );
    if (!isEmpty(enzymesByNameThatMatch)) {
      return (
        <div>
          No Active Results.. These inactive enzymes match:
          <br></br>
          <div style={{ display: "flex" }}>
            {flatMap(enzymesByNameThatMatch, (e, i) => {
              if (i > 3) return [];
              return (
                <CutsiteTag
                  onWrapperClick={closeDropDown}
                  allRestrictionEnzymes={allRestrictionEnzymes}
                  forceOpenCutsiteInfo
                  name={e.name}
                  cutsitesByName={cutsitesByName}
                  cutsitesByNameActive={cutsitesByName}
                  key={i}
                ></CutsiteTag>
              );
            })}
          </div>
        </div>
      );
    }
    const hiddenEnzymesByNameThatMatch = pickBy(
      aliasedEnzymesByName,
      function (v, k) {
        if (cutsitesByName[k]) {
          return false;
        }
        return includes(k.toLowerCase(), queryString.toLowerCase());
      }
    );
    if (!isEmpty(hiddenEnzymesByNameThatMatch)) {
      return (
        <div>
          {onHiddenEnzymeAdd
            ? `These Hidden enzymes match, ${
                map(hiddenEnzymesByNameThatMatch).length > 1
                  ? `click one`
                  : "click it"
              } to add it to your enzyme library`
            : `These Hidden enzymes match, add them via the Manage Enzymes link`}
          <br></br>
          <div style={{ display: "flex" }}>
            {flatMap(hiddenEnzymesByNameThatMatch, (e, i) => {
              if (i > 3) return [];
              return (
                <CutsiteTag
                  onWrapperClick={
                    onHiddenEnzymeAdd
                      ? () => {
                          onHiddenEnzymeAdd(e);
                          closeDropDown();
                        }
                      : closeDropDown
                  }
                  allRestrictionEnzymes={allRestrictionEnzymes}
                  forceOpenCutsiteInfo={!onHiddenEnzymeAdd}
                  name={e.name}
                  cutsitesByName={cutsitesByName}
                  cutsitesByNameActive={cutsitesByNameActive}
                  key={i}
                ></CutsiteTag>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="noResultsTextPlusButton">
        No results... Add enzymes to your list via the Manage Enzymes link{" "}
      </div>
    );
  }
);

export class CutsiteFilter extends React.Component {
  static defaultProps = {
    onChangeHook: () => {},
    closeDropDown: () => {},
    filteredRestrictionEnzymes: [],
    filteredRestrictionEnzymesUpdate: () => {},
    allCutsites: { cutsitesByName: {} },
    sequenceData: {
      sequence: ""
    }
  };
  //the queryTracker is just used for tracking purposes
  state = { queryTracker: "" };

  renderOptions = ({ label, value, canBeHidden }, props) => {
    // if (value === "manageEnzymes") {
    //   return this.getManageEnzymesLink();
    // }
    const { filteredRestrictionEnzymes, filteredRestrictionEnzymesUpdate } =
      props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        {label}{" "}
        {canBeHidden && (
          <Icon
            onClick={(e) => {
              e.stopPropagation();

              filteredRestrictionEnzymesUpdate(
                flatMap(filteredRestrictionEnzymes, (e) => {
                  if (e.value === value) return [];
                  return e;
                }).concat({
                  label,
                  className: "veHiddenEnzyme",
                  value,
                  // hiddenEnzyme: true,
                  isHidden: true,
                  canBeHidden
                })
              );
            }}
            htmlTitle="Hide this enzyme"
            className="veHideEnzymeBtn"
            style={{ paddingTop: 5 }}
            iconSize={14}
            icon="eye-off"
          ></Icon>
        )}
      </div>
    );
  };

  render() {
    const {
      onChangeHook,
      style = {},
      filteredRestrictionEnzymes,
      filteredRestrictionEnzymesUpdate: _filteredRestrictionEnzymesUpdate,
      allCutsites: { cutsitesByName },
      allCutsites,
      filteredCutsites,
      closeDropDown = () => {},
      enzymeManageOverride,
      enzymeGroupsOverride,
      onHiddenEnzymeAdd,
      editorName,
      additionalEnzymes,
      sequenceData
    } = this.props;
    const filteredRestrictionEnzymesUpdate = (enzymes) => {
      _filteredRestrictionEnzymesUpdate(enzymes);
      if (sequenceData?.id) {
        try {
          window.localStorage.setItem(
            `tgInitialCutsiteFilter-${sequenceData.id}`,
            JSON.stringify(
              enzymes.map((e) => omit(e, "canBeHidden", "nameArray", "label"))
            )
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`err 872g4e setting enzymes for sequence:`, err);
        }
      }
    };
    const userEnzymeGroups =
      enzymeGroupsOverride || window.getExistingEnzymeGroups();
    const options = [
      ...map(specialCutsiteFilterOptions, (opt) => opt),
      ...map(userEnzymeGroups, (nameArray, name) => {
        return {
          label: getUserGroupLabel({ nameArray, name }),
          value: "__userCreatedGroup" + name,
          nameArray
        };
      }),

      ...Object.keys(cutsitesByName)
        .sort()
        .map(function (key) {
          const numCuts = (cutsitesByName[key] || []).length;
          const label = getCutsiteWithNumCuts({
            numCuts,
            name: numCuts ? cutsitesByName[key][0].name : key
          });
          return {
            canBeHidden: true,
            label,
            value: key
          };
        })
    ].map((n) => addClickableLabel(n, { closeDropDown }));

    const value = filteredRestrictionEnzymes.map((filteredOpt) => {
      let toRet;
      if (filteredOpt.cutsThisManyTimes || filteredOpt.isSpecialGroup) {
        toRet = filteredOpt;
      } else if (filteredOpt.value.includes("__userCreatedGroup")) {
        toRet = filteredOpt;
      } else {
        const numCuts = (cutsitesByName[filteredOpt.value] || []).length;
        const label = getCutsiteWithNumCuts({
          numCuts,
          name: numCuts
            ? cutsitesByName[filteredOpt.value][0].name
            : defaultEnzymesByName[filteredOpt.value]?.name || filteredOpt.value
        });
        toRet = {
          ...filteredOpt,
          label
        };
      }
      return addClickableLabel(toRet, { closeDropDown });
    });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          ...style
        }}
      >
        <TgSelect
          multi
          allowCreate
          wrapperStyle={{ zIndex: 11 }}
          noResultsText={
            <NoResults
              {...{
                closeDropDown,
                onHiddenEnzymeAdd,
                queryString: this.state.queryTracker,
                additionalEnzymes,
                enzymeGroupsOverride,
                cutsitesByNameActive: filteredCutsites.cutsitesByName,
                cutsitesByName: allCutsites.cutsitesByName,
                editorName
              }}
            ></NoResults>
          }
          onInputChange={(queryTracker) => {
            this.setState({ queryTracker });
          }}
          placeholder="Filter cut sites..."
          options={options}
          filteredRestrictionEnzymes={filteredRestrictionEnzymes}
          filteredRestrictionEnzymesUpdate={filteredRestrictionEnzymesUpdate}
          optionRenderer={this.renderOptions}
          isSimpleSearch
          onChange={(filteredRestrictionEnzymes) => {
            onChangeHook && onChangeHook(filteredRestrictionEnzymes);
            filteredRestrictionEnzymesUpdate(
              map(filteredRestrictionEnzymes, (r) => {
                return omit(r, ["label"]);
              })
            );
          }}
          value={value}
        />
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <a
            onClick={() => {
              enzymeManageOverride
                ? enzymeManageOverride(this.props)
                : showDialog({
                    dialogType: "EnzymesDialog"
                    // inputSequenceToTestAgainst: sequenceData ? sequenceData.sequence : ""
                  });
              closeDropDown();
            }}
            style={{ width: "fit-content", fontSize: 11 }}
          >
            Manage Enzymes...
          </a>
        </div>
      </div>
    );
  }
}

export default compose(withEditorProps, connect())(CutsiteFilter);

function addClickableLabel(toRet, { closeDropDown }) {
  return {
    ...toRet,
    ...(toRet.label
      ? {
          label: addCutsiteGroupClickHandler({
            closeDropDown,
            cutsiteOrGroupKey: toRet.value,
            el: toRet.label
          })
        }
      : {})
  };
}
