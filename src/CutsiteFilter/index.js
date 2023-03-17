/* eslint-disable jsx-a11y/anchor-is-valid */
import { connect } from "react-redux";
import { compose } from "recompose";
import { Icon, Tag, Tooltip } from "@blueprintjs/core";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import React, { useState } from "react";
import "./style.css";
import { popoverOverflowModifiers, TgSelect } from "teselagen-react-components";

import { map, flatMap, includes, pickBy, isEmpty } from "lodash";
import { omit } from "lodash";
import { showDialog } from "../GlobalDialogUtils";
import {
  addCutsiteGroupClickHandler,
  CutsiteTag,
  getCutsiteWithNumCuts,
  getUserGroupLabel
} from "./AdditionalCutsiteInfoDialog";
import { aliasedEnzymesByName, defaultEnzymesByName } from "ve-sequence-utils";
import { observer } from "mobx-react-lite";

const NoResults = observer((props) => {
  const { ed, closeDropDown, queryString = "" } = props;
  const enzymesByNameThatMatch = pickBy(ed.restictionEnzymes, function (v, k) {
    if (ed.cutsites.cutsitesByName[k]) {
      return false;
    }
    return includes(k.toLowerCase(), queryString.toLowerCase());
  });
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
                ed={ed}
                onWrapperClick={closeDropDown}
                forceOpenCutsiteInfo
                name={e.name}
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
      if (ed.cutsites.cutsitesByName[k]) {
        return false;
      }
      return includes(k.toLowerCase(), queryString.toLowerCase());
    }
  );
  if (!isEmpty(hiddenEnzymesByNameThatMatch)) {
    return (
      <div>
        {ed.onHiddenEnzymeAdd
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
                  ed.onHiddenEnzymeAdd
                    ? () => {
                        ed.onHiddenEnzymeAdd(e, props);
                      }
                    : closeDropDown
                }
                ed={ed}
                forceOpenCutsiteInfo={!ed.onHiddenEnzymeAdd}
                name={e.name}
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
});

export function CutsiteFilter(props) {
  const {
    ed,
    onChangeHook,
    style = {},
    filteredRestrictionEnzymes,
    isEnzymeFilterAndUpdate,
    filteredRestrictionEnzymesUpdate: _filteredRestrictionEnzymesUpdate,
    
    filteredCutsites,

    closeDropDown = () => {},
    enzymeManageOverride,
  } = props;
  const { isEnzymeFilterAnd, sequenceData } = ed;
  const showAndOr =
    filteredCutsites.cutsiteIntersectionCount > 0 &&
    filteredRestrictionEnzymes.length > 1;
  const [queryTracker, setQueryTracker] = useState("");

  const renderOptions = ({ label, value, canBeHidden }, props) => {
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
  const options = [
    ...map(specialCutsiteFilterOptions, (opt) => opt),
    ...map(ed.enzymeGroups, (nameArray, name) => {
      return {
        label: getUserGroupLabel({ nameArray, name }),
        value: "__userCreatedGroup" + name,
        nameArray
      };
    }),

    ...Object.keys(ed.cutsites.cutsitesByName)
      .sort()
      .map(function (key) {
        const numCuts = (ed.cutsites.cutsitesByName[key] || []).length;
        const label = getCutsiteWithNumCuts({
          numCuts,
          name: numCuts ? ed.cutsites.cutsitesByName[key][0].name : key
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
      const numCuts = (ed.cutsites.cutsitesByName[filteredOpt.value] || []).length;
      const label = getCutsiteWithNumCuts({
        numCuts,
        name: numCuts
          ? ed.cutsites.cutsitesByName[filteredOpt.value][0].name
          : defaultEnzymesByName[filteredOpt.value]?.name || filteredOpt.value
      });
      toRet = {
        ...filteredOpt,
        label
      };
    }
    return addClickableLabel(toRet, { closeDropDown });
  });
  const numEnzymesInAnd = filteredCutsites.cutsiteIntersectionCount;
  const numEnzymesInOr = filteredCutsites.cutsiteTotalCount;
  const numGroups = filteredRestrictionEnzymes.length;
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
        additionalRightEl={
          showAndOr ? (
            <Tooltip
              modifiers={popoverOverflowModifiers}
              content={
                isEnzymeFilterAnd
                  ? `AND -- Viewing ${numEnzymesInAnd} enzymes that are shared by ${
                      numGroups === 2
                        ? "both groups"
                        : `all ${numGroups} groups`
                    }`
                  : `OR -- Viewing ${numEnzymesInOr} enzymes that are in any of the ${numGroups} groups`
              }
            >
              <Tag
                minimal
                interactive
                style={{ display: "flex", marginTop: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  isEnzymeFilterAndUpdate(!isEnzymeFilterAnd);
                }}
              >
                <span
                  style={{ color: isEnzymeFilterAnd ? "#ce5bce" : "darkgray" }}
                >
                  AND
                </span>
                /
                <span
                  style={{ color: !isEnzymeFilterAnd ? "#ce5bce" : "darkgray" }}
                >
                  OR
                </span>
              </Tag>
            </Tooltip>
          ) : (
            false
          )
        }
        multi
        allowCreate
        wrapperStyle={{ zIndex: 11 }}
        noResultsText={
          <NoResults
            {...{
              closeDropDown,
              queryString: queryTracker,
              ed
            }}
          ></NoResults>
        }
        onInputChange={(queryTracker) => {
          setQueryTracker(queryTracker);
        }}
        placeholder="Filter cut sites..."
        options={options}
        filteredRestrictionEnzymes={filteredRestrictionEnzymes}
        filteredRestrictionEnzymesUpdate={filteredRestrictionEnzymesUpdate}
        optionRenderer={renderOptions}
        isSimpleSearch
        onChange={(filteredRestrictionEnzymes) => {
          onChangeHook && onChangeHook(filteredRestrictionEnzymes);
          filteredRestrictionEnzymesUpdate(
            map(filteredRestrictionEnzymes, (r) => {
              return omit(r, ["label"]);
            })
          );
          // setShowFilterEnzymes(showAndOr);
        }}
        value={value}
      />
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <a
          onClick={() => {
            enzymeManageOverride
              ? enzymeManageOverride(props)
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

export default observer(CutsiteFilter);

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
