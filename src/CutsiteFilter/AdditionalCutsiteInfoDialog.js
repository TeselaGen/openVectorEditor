import { compose } from "recompose";
import { wrapDialog, DropdownButton } from "teselagen-react-components";
import React from "react";
import { Classes, Icon, Menu, MenuItem, Tag } from "@blueprintjs/core";
import withEditorProps, { connectToEditor } from "../withEditorProps";
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

import restrictionEnzymesSelector from "../selectors/restrictionEnzymesSelector";

const sharedWrapper = compose(
  wrapDialog({ isDraggable: true }),
  withEditorProps,
  connectToEditor((editorState, ownProps) => {
    const allRestrictionEnzymes = restrictionEnzymesSelector(
      editorState,
      ownProps.additionalEnzymes,
      ownProps.enzymeGroupsOverride
    );
    return {
      allRestrictionEnzymes
    };
  })
);

export const AdditionalCutsiteInfoDialog = sharedWrapper(function (props) {
  const {
    dispatch,
    editorName,
    cutsiteOrGroupKey,
    filteredRestrictionEnzymes,
    allCutsites: { cutsitesByName },
    filteredCutsites: { cutsitesByName: cutsitesByNameActive },
    selectedAnnotationId,
    enzymeGroupsOverride,
    allRestrictionEnzymes
  } = props;

  const userEnzymeGroups =
    enzymeGroupsOverride || window.getExistingEnzymeGroups();

  const isUserCreatedGroup = cutsiteOrGroupKey.startsWith("__userCreatedGroup");
  let specialCutsiteFilterOption =
    specialCutsiteFilterOptions[cutsiteOrGroupKey];
  let inner;
  let enzymesThatCutInSeq = [];
  let enzymesThatDontCutInSeq = [];
  if (isUserCreatedGroup || specialCutsiteFilterOption) {
    //grour case
    const ret = getGroupElAndCutsites({
      cutsitesByName,
      filteredRestrictionEnzymes,
      groupKey: cutsiteOrGroupKey,
      userEnzymeGroups
    });
    enzymesThatCutInSeq = ret.enzymesThatCutInSeq;
    enzymesThatDontCutInSeq = ret.enzymesThatDontCutInSeq;
  } else if (
    //single enzyme case
    cutsitesByName[cutsiteOrGroupKey.toLowerCase()] ||
    allRestrictionEnzymes[cutsiteOrGroupKey.toLowerCase()]
  ) {
    const inTheseUserGroups = [];
    const cutsiteGroup = cutsitesByName[cutsiteOrGroupKey.toLowerCase()] || [];
    const enzyme = cutsiteGroup[0]
      ? cutsiteGroup[0].restrictionEnzyme
      : allRestrictionEnzymes[cutsiteOrGroupKey.toLowerCase()];

    if (cutsiteGroup.length && cutsiteGroup.length <= 3) {
      const { el } = getGroupElAndCutsites({
        cutsitesByName,
        userEnzymeGroups,
        groupKey: find(
          specialCutsiteFilterOptions,
          ({ cutsThisManyTimes }) => cutsThisManyTimes === cutsiteGroup.length
        ).value,
        filteredRestrictionEnzymes
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
        const groupKey = "__userCreatedGroup" + name;

        const { el } = getGroupElAndCutsites({
          cutsitesByName,
          userEnzymeGroups,
          groupKey,
          filteredRestrictionEnzymes
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

  if (!inner) {
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
                  // maxHeight: 400
                }}
              >
                {enzymesThatDontCutInSeq.map((e, i) => (
                  <CutsiteTag
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
  }
  return <div className={Classes.DIALOG_BODY}>{inner}</div>;
});

export const CompareEnzymeGroupsDialog = sharedWrapper(function (props) {
  const {
    group1,
    group2,
    enzymeGroupsOverride,
    filteredRestrictionEnzymes,
    allCutsites: { cutsitesByName },
    filteredCutsites: { cutsitesByName: cutsitesByNameActive }
  } = props;

  const userEnzymeGroups =
    enzymeGroupsOverride || window.getExistingEnzymeGroups();

  const g1 = getGroupElAndCutsites({
    cutsitesByName,
    userEnzymeGroups,
    groupKey: group1,
    filteredRestrictionEnzymes
  });

  const g2 = getGroupElAndCutsites({
    cutsitesByName,
    userEnzymeGroups,
    groupKey: group2,
    filteredRestrictionEnzymes
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
  userEnzymeGroups,
  groupKey,
  filteredRestrictionEnzymes,
  cutsitesByName
}) => {
  let isGroupActive;
  let label;

  let enzymesThatDontCutInSeq = [];
  let enzymesThatCutInSeq = [];
  forEach(filteredRestrictionEnzymes, (g) => {
    if (g.value === groupKey) {
      isGroupActive = true;
    }
  });

  if (isUserEnzymeGroup(groupKey)) {
    const name = groupKey.replace("__userCreatedGroup", "");
    const nameArray = userEnzymeGroups[name];
    label = getUserGroupLabel({ name, nameArray });

    sortBy(nameArray).forEach((name) => {
      let cutsites = cutsitesByName[name.toLowerCase()];
      if (!cutsites) {
        enzymesThatDontCutInSeq.push({ name, sites: [] });
      } else {
        enzymesThatCutInSeq.push({ name, sites: cutsites });
      }
    });
  } else {
    //it's a single/double/etc
    let specialCutsiteFilterOption = specialCutsiteFilterOptions[groupKey];
    label = specialCutsiteFilterOption.label;
    enzymesThatCutInSeq = map(cutsitesByName, (cutsites) =>
      cutsites.length === specialCutsiteFilterOption.cutsThisManyTimes
        ? { name: cutsites[0].name, sites: cutsites }
        : null
    ).filter((n) => n !== null);
  }

  const el = addCutsiteGroupClickHandler({
    cutsiteOrGroupKey: groupKey,
    el: (
      <Tag intent={isGroupActive && "primary"} style={{ margin: 3 }}>
        {label}
      </Tag>
    ),
    title: (
      <div>
        {label}
        {isGroupActive ? "" : " (inactive)"}
      </div>
    )
  });

  return {
    el,
    enzymesThatDontCutInSeq,
    enzymesThatCutInSeq,
    allEnzymesInGroup: [...enzymesThatCutInSeq, ...enzymesThatDontCutInSeq]
    // cutsitesInGroup: [] //tnrtodo
  };
};

export const CutsiteTag = ({
  cutsitesByNameActive,
  name,
  numCuts: _numCuts,
  sites
}) => {
  const numCuts = sites ? sites.length : _numCuts;

  const el = (
    <Tag
      intent={
        numCuts
          ? cutsitesByNameActive[name.toLowerCase()]
            ? "primary"
            : undefined
          : undefined
      }
      style={{ margin: 3 }}
    >
      {getCutsiteWithNumCuts({
        name,
        numCuts
      })}
    </Tag>
  );

  return addCutsiteGroupClickHandler({
    el,
    cutsiteOrGroupKey: name,
    title: el
  });
};

export const getUserGroupLabel = ({ name, nameArray }) => (
  <span title={`User created enzyme group ${name} -- ${nameArray.join(" ")}`}>
    <Icon size={10} icon="user"></Icon>&nbsp;{name}
  </span>
);

export const getCutsiteWithNumCuts = ({ name, numCuts }) => {
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
      <div style={{ fontSize: 12 }}>
        &nbsp;({numCuts} cut{numCuts === 1 ? "" : "s"})
      </div>
    </div>
  );
};

export const addCutsiteGroupClickHandler = ({
  closeDropDown = () => {},
  cutsiteOrGroupKey,
  el,
  title
}) => (
  <div
    className="tg-clickable-cutsite-label"
    style={{ cursor: "pointer" }}
    onClick={(e) => {
      const isInMultiSelect = e.target.closest(".bp3-multi-select-popover");
      if (isInMultiSelect) return true;
      closeDropDown();
      showDialog({
        dialogType: "AdditionalCutsiteInfoDialog",
        props: {
          dialogProps: {
            title: <div style={{ display: "flex" }}>{title || el}</div>
          },
          cutsiteOrGroupKey
        }
      });
    }}
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
