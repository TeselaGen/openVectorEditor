/* eslint-disable jsx-a11y/anchor-is-valid */
import { connect } from "react-redux";
import { compose } from "redux";
import {
  AnchorButton,
  Button,
  Callout,
  Icon,
  Popover,
  Tooltip
} from "@blueprintjs/core";
import tgUseLocalStorageState from "tg-use-local-storage-state";

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
import { aliasedEnzymesByName } from "ve-sequence-utils";
import deepEqual from "deep-equal";

const NoResults = withRestrictionEnzymes(
  ({
    cutsitesByName,
    cutsitesByNameActive,
    closeDropDown,
    allRestrictionEnzymes,
    queryString = ""
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
          These Hidden enzymes match, add them via the Manage Enzymes link
          <br></br>
          <div style={{ display: "flex" }}>
            {flatMap(hiddenEnzymesByNameThatMatch, (e, i) => {
              if (i > 3) return [];
              return (
                <CutsiteTag
                  onWrapperClick={closeDropDown}
                  allRestrictionEnzymes={allRestrictionEnzymes}
                  forceOpenCutsiteInfo
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
            JSON.stringify(enzymes)
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(`err 872g4e setting enzymes for sequence:`, err);
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
          value={filteredRestrictionEnzymes.map((filteredOpt) => {
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
          <Popover
            position="bottom"
            minimal
            content={
              <PersistPopover
                filteredRestrictionEnzymes={filteredRestrictionEnzymes}
              ></PersistPopover>
            }
          >
            <a
              className="tg-persist-cutsite-filter"
              style={{ width: "fit-content", fontSize: 11 }}
            >
              Set as Default...
            </a>
          </Popover>
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

function PersistPopover({ filteredRestrictionEnzymes }) {
  // const [filterForJustThisSeq] = tgUseLocalStorageState(
  //   `tgInitialCutsiteFilter-${seqId}`
  // );
  const [filterForAllSeqs] = tgUseLocalStorageState("tgInitialCutsiteFilter");
  return (
    <div
      style={{
        padding: 15,
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center"
      }}
    >
      <h6 style={{ maxWidth: 250 }}>
        Use the current filter as the default filter for:
      </h6>
      {/* {seqId && (
        <div
          className={"tg-this-seq-filter-ctrls"}
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Button
            style={{ minWidth: 200 }}
            text="This sequence"
            disabled={deepEqual(
              filterForJustThisSeq,
              filteredRestrictionEnzymes
            )}
            onClick={() => {
              try {
                window.localStorage.setItem(
                  `tgInitialCutsiteFilter-${seqId}`,
                  JSON.stringify(filteredRestrictionEnzymes)
                );
                window.toastr.success(
                  `Successfully set a default filter for this sequence`
                );
              } catch (error) {
                window.toastr.error(
                  `Error setting a default filter for this sequence`
                );
              }
            }}
          ></Button>{" "}
          <Tooltip
            content={
              <div style={{ maxWidth: 300 }}>
                Unset default filter for this sequence - &nbsp;
                {filterForJustThisSeq
                  ? map(filterForJustThisSeq, (i) => i.label || i.value).join(
                      ", "
                    )
                  : "None Set"}
              </div>
            }
          >
            <AnchorButton
              onClick={() => {
                localStorage.removeItem(`tgInitialCutsiteFilter-${seqId}`);
              }}
              disabled={!filterForJustThisSeq}
              icon="trash"
              intent="danger"
            ></AnchorButton>
          </Tooltip>{" "}
        </div>
      )} */}
      <div
        className="tg-all-seqs-filter-ctrls"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          style={{ minWidth: 200 }}
          text="All Sequences"
          disabled={deepEqual(filterForAllSeqs, filteredRestrictionEnzymes)}
          onClick={() => {
            try {
              window.localStorage.setItem(
                "tgInitialCutsiteFilter",
                JSON.stringify(filteredRestrictionEnzymes)
              );
              window.toastr.success(
                `Successfully set a new global default filter`
              );
            } catch (error) {
              window.toastr.error("Error setting a new default filter");
            }
          }}
        ></Button>{" "}
        <Tooltip
          content={
            <div style={{ maxWidth: 300 }}>
              Unset default global filter for all sequences - &nbsp;
              {filterForAllSeqs
                ? map(filterForAllSeqs, (i) => i.label || i.value).join(", ")
                : "None Set"}
            </div>
          }
        >
          <AnchorButton
            onClick={() => {
              localStorage.removeItem(`tgInitialCutsiteFilter`);
            }}
            disabled={!filterForAllSeqs}
            icon="trash"
            intent="danger"
          ></AnchorButton>
        </Tooltip>{" "}
      </div>
      <br></br>
      <Callout style={{ maxWidth: 250 }} intent="primary">
        This default will only be applied to sequences that have NOT already had
        an enzyme selection applied to them. Also note, this setting is stored
        in your browser so will not transfer between devices or affect other
        users{" "}
      </Callout>
    </div>
  );
}
