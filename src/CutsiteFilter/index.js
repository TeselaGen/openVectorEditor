import { connect } from "react-redux";
import { compose } from "redux";
import { Icon } from "@blueprintjs/core";

import withEditorProps from "../withEditorProps";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";

import React from "react";

import "./style.css";
import { TgSelect } from "teselagen-react-components";

import map from "lodash/map";
import { flatMap } from "lodash";
import { omit } from "lodash";
import { showDialog } from "../GlobalDialogUtils";
import {
  addCutsiteGroupClickHandler,
  getCutsiteWithNumCuts,
  getUserGroupLabel
} from "./AdditionalCutsiteInfoDialog";

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

  renderOptions = ({ label, value, canBeHidden }, props) => {
    // if (value === "manageEnzymes") {
    //   return this.getManageEnzymesLink();
    // }
    const {
      filteredRestrictionEnzymes,
      filteredRestrictionEnzymesUpdate
    } = props;

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
    let {
      onChangeHook,
      style = {},
      filteredRestrictionEnzymes,
      filteredRestrictionEnzymesUpdate,
      allCutsites: { cutsitesByName },
      closeDropDown = () => {},
      enzymeManageOverride,
      enzymeGroupsOverride
    } = this.props;
    const userEnzymeGroups =
      enzymeGroupsOverride || window.getExistingEnzymeGroups();
    let options = [
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
            // hiddenEnzyme: false,
            value: key
          };
        })
    ].map((n) => addClickableLabel(n, { closeDropDown }));
    // function openManageEnzymes() {
    //   dispatch({
    //     type: "CREATE_YOUR_OWN_ENZYME_RESET"
    //   });
    //   dispatch({
    //     type: "CREATE_YOUR_OWN_ENZYME_RESET",
    //     payload: {
    //       inputSequenceToTestAgainst
    //     }
    //   });
    // }
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
            <div className="noResultsTextPlusButton">
              No results... Add enzymes to your list via the Manage Enzymes link{" "}
            </div>
          }
          placeholder="Filter cutsites..."
          options={options}
          filteredRestrictionEnzymes={filteredRestrictionEnzymes}
          filteredRestrictionEnzymesUpdate={filteredRestrictionEnzymesUpdate}
          optionRenderer={this.renderOptions}
          isSimpleSearch
          onChange={(filteredRestrictionEnzymes) => {
            // if (
            //   filteredRestrictionEnzymes &&
            //   filteredRestrictionEnzymes.some(
            //     enzyme =>
            //       enzyme.value ===
            //       specialCutsiteFilterOptions.manageEnzymes.value
            //   )
            // ) {
            //   return;
            // }
            onChangeHook && onChangeHook(filteredRestrictionEnzymes);
            filteredRestrictionEnzymesUpdate(
              map(filteredRestrictionEnzymes, (r) => {
                return omit(r, ["label"]);
              })
            );
          }}
          value={filteredRestrictionEnzymes.map((filteredOpt) => {
            let toRet;
            if (filteredOpt.cutsThisManyTimes) {
              toRet = filteredOpt;
            } else if (filteredOpt.value.includes("__userCreatedGroup")) {
              toRet = filteredOpt;
            } else {
              const numCuts = (cutsitesByName[filteredOpt.value] || []).length;
              const label = getCutsiteWithNumCuts({
                numCuts,
                name: numCuts
                  ? cutsitesByName[filteredOpt.value][0].name
                  : filteredOpt.value
              });
              toRet = {
                ...filteredOpt,
                label
              };
            }
            return addClickableLabel(toRet, { closeDropDown });
          })}
        />
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
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
