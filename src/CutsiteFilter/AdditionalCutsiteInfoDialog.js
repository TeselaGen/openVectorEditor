import { compose } from "recompose";
import { wrapDialog, DropdownButton } from "teselagen-react-components";
import React from "react";
import { Classes, Icon, Menu, MenuItem, Tag } from "@blueprintjs/core";
import withEditorProps from "../withEditorProps";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
import {
  differenceBy,
  find,
  flatMap,
  forEach,
  intersectionBy,
  map,
  sortBy
} from "lodash";
import SingleEnzymeCutsiteInfo from "../helperComponents/PropertiesDialog/SingleEnzymeCutsiteInfo";
import { showDialog } from "../GlobalDialogUtils";

import { aliasedEnzymesByName } from "ve-sequence-utils";
import { withRestrictionEnzymes } from "./withRestrictionEnzymes";
import { getEnzymeAliases } from "../utils/editorUtils";

function getUserEnzymeGroups(p) {
  return p.enzymeGroupsOverride || window.getExistingEnzymeGroups();
}

function isGroup({ cutsiteOrGroupKey }) {
  const isUserCreatedGroup = cutsiteOrGroupKey.startsWith("__userCreatedGroup");
  const specialCutsiteFilterOption =
    specialCutsiteFilterOptions[cutsiteOrGroupKey];

  return isUserCreatedGroup || specialCutsiteFilterOption;
}

export const AdditionalCutsiteInfoDialog = compose(
  withEditorProps,
  withRestrictionEnzymes,
  wrapDialog({
    isDraggable: true,
    getDialogProps: (props) => {
      if (isGroup(props)) {
        return {
          title: (
            <div style={{ display: "flex" }}>
              Group - &nbsp;
              {getGroupElAndCutsites(props).title}
            </div>
          )
        };
      } else {
        return {
          title: (
            <div style={{ display: "flex" }}>
              Enzyme - &nbsp;
              <CutsiteTag
                noClick
                showActiveText
                allRestrictionEnzymes={props.allRestrictionEnzymes}
                cutsitesByNameActive={props.filteredCutsites.cutsitesByName}
                cutsitesByName={props.allCutsites.cutsitesByName}
                name={props.cutsiteOrGroupKey}
              ></CutsiteTag>
            </div>
          )
        };
      }
    }
  })
)(function (props) {
  const {
    dispatch,
    editorName,
    cutsiteOrGroupKey,
    allCutsites: { cutsitesByName },
    filteredCutsites: { cutsitesByName: cutsitesByNameActive },
    selectedAnnotationId,
    allRestrictionEnzymes
  } = props;

  let inner;

  const userEnzymeGroups = getUserEnzymeGroups(props);
  if (isGroup(props)) {
    //group case
    const ret = getGroupElAndCutsites(props);
    const enzymesThatCutInSeq = ret.enzymesThatCutInSeq;
    const enzymesThatDontCutInSeq = ret.enzymesThatDontCutInSeq;
    inner = (
      <div>
        <div>
          <DropdownButton
            minimal
            menu={
              <Menu>
                {flatMap(
                  [
                    ...map(specialCutsiteFilterOptions),
                    ...map(userEnzymeGroups, (v, key) => ({
                      label: key,
                      value: "__userCreatedGroup" + key
                    }))
                  ],
                  ({ label, value }, key, i) => {
                    if (value === cutsiteOrGroupKey) return [];
                    return (
                      <MenuItem
                        onClick={() => {
                          showDialog({
                            dialogType: "CompareEnzymeGroupsDialog",
                            props: {
                              dialogProps: {
                                title: "Comparing Groups",
                                width: 450
                              },
                              group1: cutsiteOrGroupKey,
                              group2: value
                            }
                          });
                        }}
                        key={i}
                        text={`vs ${label}`}
                      ></MenuItem>
                    );
                  }
                )}
              </Menu>
            }
            text="Compare.."
          ></DropdownButton>
          <br></br>
          <br></br>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {!!enzymesThatCutInSeq.length && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto"
                  // maxHeight: 400
                }}
              >
                {enzymesThatCutInSeq.map((e, i) => (
                  <CutsiteTag
                    allRestrictionEnzymes={props.allRestrictionEnzymes}
                    cutsitesByName={props.allCutsites.cutsitesByName}
                    cutsitesByNameActive={cutsitesByNameActive}
                    key={i}
                    {...e}
                  ></CutsiteTag>
                ))}
              </div>
            </div>
          )}
          {enzymesThatDontCutInSeq && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto"
                }}
              >
                {enzymesThatDontCutInSeq.map((e, i) => (
                  <CutsiteTag
                    allRestrictionEnzymes={props.allRestrictionEnzymes}
                    cutsitesByName={props.allCutsites.cutsitesByName}
                    cutsitesByNameActive={cutsitesByNameActive}
                    key={i}
                    {...e}
                  ></CutsiteTag>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else if (
    //single enzyme case
    cutsitesByName[cutsiteOrGroupKey.toLowerCase()] ||
    allRestrictionEnzymes[cutsiteOrGroupKey.toLowerCase()] ||
    aliasedEnzymesByName[cutsiteOrGroupKey.toLowerCase()]
  ) {
    const inTheseUserGroups = [];
    const cutsiteGroup = cutsitesByName[cutsiteOrGroupKey.toLowerCase()] || [];
    const enzyme = cutsiteGroup[0]
      ? cutsiteGroup[0].restrictionEnzyme
      : allRestrictionEnzymes[cutsiteOrGroupKey.toLowerCase()] ||
        aliasedEnzymesByName[cutsiteOrGroupKey.toLowerCase()];

    if (cutsiteGroup.length && cutsiteGroup.length <= 3) {
      const { el } = getGroupElAndCutsites({
        ...props,
        cutsiteOrGroupKey: find(
          specialCutsiteFilterOptions,
          ({ cutsThisManyTimes }) => cutsThisManyTimes === cutsiteGroup.length
        ).value
      });

      inTheseUserGroups.push(el);
    }

    const enzymeName = enzyme.name;

    forEach(userEnzymeGroups, (nameArray, name) => {
      let isInGroup;
      forEach(nameArray, (n) => {
        if (n.toLowerCase() === enzymeName.toLowerCase()) {
          isInGroup = true;
        }
      });
      if (isInGroup) {
        const cutsiteOrGroupKey = "__userCreatedGroup" + name;

        const { el } = getGroupElAndCutsites({
          ...props,
          cutsiteOrGroupKey
        });

        inTheseUserGroups.push(el);
      }
    });
    inner = (
      <div>
        {!!inTheseUserGroups.length && (
          <div style={{ marginBottom: 20 }}>{inTheseUserGroups}</div>
        )}
        <SingleEnzymeCutsiteInfo
          {...{
            dispatch,
            editorName,
            selectedAnnotationId,
            cutsiteGroup,
            enzyme
          }}
        ></SingleEnzymeCutsiteInfo>
      </div>
    );
  } else {
    console.error(`we shouldn't be here!:`, cutsiteOrGroupKey);
    return null;
  }

  return <div className={Classes.DIALOG_BODY}>{inner}</div>;
});

export const CompareEnzymeGroupsDialog = compose(
  withEditorProps,
  withRestrictionEnzymes,
  wrapDialog({
    isDraggable: true
  })
)(function (props) {
  const {
    group1,
    group2,
    filteredCutsites: { cutsitesByName: cutsitesByNameActive }
  } = props;

  const g1 = getGroupElAndCutsites({
    ...props,
    cutsiteOrGroupKey: group1
  });

  const g2 = getGroupElAndCutsites({
    ...props,
    cutsiteOrGroupKey: group2
  });
  const byNameLower = (n) => n.name.toLowerCase();
  const shared = intersectionBy(
    g1.allEnzymesInGroup,
    g2.allEnzymesInGroup,
    byNameLower
  );

  const g1Only = differenceBy(g1.allEnzymesInGroup, shared, byNameLower);
  const g2Only = differenceBy(g2.allEnzymesInGroup, shared, byNameLower);
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between" }}
      className={Classes.DIALOG_BODY}
    >
      <Column
        dataTest="tg-column-1"
        title="In"
        header={g1.el}
        body={g1Only.map((e, i) => {
          return (
            <CutsiteTag
              allRestrictionEnzymes={props.allRestrictionEnzymes}
              cutsitesByName={props.allCutsites.cutsitesByName}
              cutsitesByNameActive={cutsitesByNameActive}
              key={i}
              {...e}
            ></CutsiteTag>
          );
        })}
      />

      <Column
        dataTest="tg-column-2"
        title="In Both"
        header={
          <div>
            {g1.el} {g2.el}
          </div>
        }
        body={shared.map((e, i) => {
          return (
            <CutsiteTag
              allRestrictionEnzymes={props.allRestrictionEnzymes}
              cutsitesByName={props.allCutsites.cutsitesByName}
              cutsitesByNameActive={cutsitesByNameActive}
              key={i}
              {...e}
            ></CutsiteTag>
          );
        })}
      />

      <Column
        dataTest="tg-column-3"
        title="In"
        header={g2.el}
        body={g2Only.map((e, i) => {
          return (
            <CutsiteTag
              allRestrictionEnzymes={props.allRestrictionEnzymes}
              cutsitesByName={props.allCutsites.cutsitesByName}
              cutsitesByNameActive={cutsitesByNameActive}
              key={i}
              {...e}
            ></CutsiteTag>
          );
        })}
      />
    </div>
  );
});

function isUserEnzymeGroup(group) {
  const isUserCreatedGroup = group.startsWith("__userCreatedGroup");
  return isUserCreatedGroup;
}

const getGroupElAndCutsites = ({
  enzymeGroupsOverride,
  cutsiteOrGroupKey,
  filteredRestrictionEnzymes,
  allCutsites
}) => {
  const userEnzymeGroups =
    enzymeGroupsOverride || window.getExistingEnzymeGroups();

  let isGroupActive;
  let label;

  const enzymesThatDontCutInSeq = [];
  let enzymesThatCutInSeq = [];
  forEach(filteredRestrictionEnzymes, (g) => {
    if (g.value === cutsiteOrGroupKey) {
      isGroupActive = true;
    }
  });

  if (isUserEnzymeGroup(cutsiteOrGroupKey)) {
    const name = cutsiteOrGroupKey.replace("__userCreatedGroup", "");
    const nameArray = userEnzymeGroups[name];
    label = getUserGroupLabel({ name, nameArray });

    sortBy(nameArray).forEach((name) => {
      const cutsites = allCutsites.cutsitesByName[name.toLowerCase()];
      if (!cutsites) {
        enzymesThatDontCutInSeq.push({ name, sites: [] });
      } else {
        enzymesThatCutInSeq.push({ name, sites: cutsites });
      }
    });
  } else {
    //it's a single/double/etc
    const specialCutsiteFilterOption =
      specialCutsiteFilterOptions[cutsiteOrGroupKey];
    label = specialCutsiteFilterOption.label;
    enzymesThatCutInSeq = map(allCutsites.cutsitesByName, (cutsites) =>
      cutsites.length === specialCutsiteFilterOption.cutsThisManyTimes
        ? { name: cutsites[0].name, sites: cutsites }
        : null
    ).filter((n) => n !== null);
  }
  const title = (
    <div style={{ display: "flex" }}>
      {label} &nbsp;
      {isGroupActive ? "" : "(inactive)"}
    </div>
  );
  const el = addCutsiteGroupClickHandler({
    cutsiteOrGroupKey,
    el: (
      <Tag minimal intent={isGroupActive && "primary"} style={{ margin: 3 }}>
        {label}
      </Tag>
    ),
    title
  });

  return {
    el,
    title,
    enzymesThatDontCutInSeq,
    enzymesThatCutInSeq,
    allEnzymesInGroup: [...enzymesThatCutInSeq, ...enzymesThatDontCutInSeq]
    // cutsitesInGroup: [] //tnrtodo
  };
};

export const CutsiteTag = ({
  allRestrictionEnzymes,
  showActiveText,
  cutsitesByNameActive,
  cutsitesByName,
  name,
  onWrapperClick,
  doNotShowCuts,
  noClick,
  forceOpenCutsiteInfo
}) => {
  const isHidden = getIsEnzymeHidden({ name, allRestrictionEnzymes });

  let numCuts = (cutsitesByName[name.toLowerCase()] || []).length;

  const aliases = getEnzymeAliases(name);
  aliases.forEach((alias) => {
    if (numCuts === 0) {
      numCuts = (cutsitesByName[alias.toLowerCase()] || []).length;
    }
  });
  const isActive = numCuts
    ? cutsitesByNameActive[name.toLowerCase()]
      ? "primary"
      : undefined
    : undefined;

  const el = (
    <Tag
      onClick={onWrapperClick}
      intent={isActive}
      style={{ margin: 3, opacity: isHidden ? 0.5 : 1 }}
    >
      <div style={{ display: "flex" }}>
        {getCutsiteWithNumCuts({
          name,
          numCuts,
          doNotShowCuts
        })}
        {showActiveText ? (
          isHidden ? (
            <span>&nbsp; hidden</span>
          ) : isActive ? (
            <span>&nbsp; active</span>
          ) : (
            <span>&nbsp; inactive</span>
          )
        ) : null}
      </div>
    </Tag>
  );

  return addCutsiteGroupClickHandler({
    el,
    noClick,
    cutsiteOrGroupKey: name,
    forceOpenCutsiteInfo
  });
};

export const getUserGroupLabel = ({ name, nameArray }) => (
  <span
    style={{ display: "flex", alignItems: "center" }}
    title={`User created enzyme group ${name} -- ${nameArray.join(" ")}`}
  >
    <Icon size={10} icon="user"></Icon>&nbsp;{name}
  </span>
);

export const getCutsiteWithNumCuts = ({ name, numCuts, doNotShowCuts }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {" "}
      <div>{name}</div>{" "}
      {!doNotShowCuts && (
        <div style={{ fontSize: 12 }}>
          &nbsp;({numCuts} cut{numCuts === 1 ? "" : "s"})
        </div>
      )}
    </div>
  );
};

export const addCutsiteGroupClickHandler = ({
  closeDropDown = () => {},
  cutsiteOrGroupKey,
  el,
  noClick,
  forceOpenCutsiteInfo
}) => (
  <div
    className={noClick ? "tg-cutsite-label" : "tg-clickable-cutsite-label"}
    style={noClick ? {} : { cursor: "pointer" }}
    onClick={
      noClick
        ? undefined
        : (e) => {
            const isInMultiSelect = e.target.closest(
              ".bp3-multi-select-popover"
            );
            if (!forceOpenCutsiteInfo && isInMultiSelect) return true;
            closeDropDown();
            showDialog({
              dialogType: "AdditionalCutsiteInfoDialog",
              props: {
                cutsiteOrGroupKey
              }
            });
          }
    }
  >
    {el}
  </div>
);

function Column({ dataTest, header, body, title }) {
  return (
    <div data-test={dataTest} style={{ flexGrow: "1", flexBasis: "0" }}>
      {title}:
      <div
        style={{
          height: 60,

          marginBottom: 20,
          borderBottom: "1px solid lightgrey"
        }}
      >
        {header}
      </div>
      {body}
    </div>
  );
}

function getIsEnzymeHidden({ name, allRestrictionEnzymes }) {
  let isHidden = true;
  if (allRestrictionEnzymes[name.toLowerCase()]) {
    isHidden = false;
  }
  return isHidden;
}
