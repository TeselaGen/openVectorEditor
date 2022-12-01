import React from "react";
// import uuid from "uniqid";

// import { reduxForm, formValues } from "redux-form";

import {
  InfoHelper,
  showConfirmationDialog,
  wrapDialog
} from "teselagen-react-components";
import { compose } from "redux";
import {
  Classes,
  ButtonGroup,
  InputGroup,
  Popover,
  HTMLSelect,
  Tooltip,
  AnchorButton,
  Intent,
  Button
} from "@blueprintjs/core";
import classNames from "classnames";
import withEditorProps from "../../withEditorProps";

import EnzymeViewer from "../../EnzymeViewer";
import "./style.css";

import { map, flatMap, countBy, reduce, uniq, omitBy } from "lodash";
import {
  aliasedEnzymesByName,
  defaultEnzymesByName,
  getCutsitesFromSequence
} from "ve-sequence-utils";
import { store, view } from "@risingstack/react-easy-state";
import { showDialog } from "../../GlobalDialogUtils";

const upsertLocalEnzymeGroups = (newGroups) => {
  const existingGroups = window.getExistingEnzymeGroups();
  const toUpsert = omitBy(
    //delete any groups that have a value of null/undefined
    {
      ...existingGroups,
      ...newGroups
    },
    (val) => {
      return !val;
    }
  );

  localStorage.setItem("enzymeGroups", JSON.stringify(toUpsert));
};

window.createNewEnzymeGroup =
  window.createNewEnzymeGroup ||
  ((newName) => {
    return upsertLocalEnzymeGroups({
      [newName]: []
    });
  });
window.editEnzymeGroupName =
  window.editEnzymeGroupName ||
  ((oldName, newName) => {
    upsertLocalEnzymeGroups({
      [newName]: window.getExistingEnzymeGroups()[oldName]
    });
    window.deleteEnzymeGroup(oldName);
  });
window.deleteEnzymeGroup =
  window.deleteEnzymeGroup ||
  ((nameToDelete) => {
    return upsertLocalEnzymeGroups({
      [nameToDelete]: null
    });
  });

window.updateEnzymeGroup =
  window.updateEnzymeGroup ||
  ((groupName, enzymes) => {
    return upsertLocalEnzymeGroups({
      [groupName]: enzymes
    });
  });

window.getExistingEnzymeGroups =
  window.getExistingEnzymeGroups ||
  (() => {
    const existingGroups = JSON.parse(
      localStorage.getItem("enzymeGroups") || "{}"
    );
    if (!Object.keys(existingGroups || {}).length) {
      return {};
    }
    map(existingGroups, (g, k) => {
      if (!g || !g.length) existingGroups[k] = [];
    });
    return existingGroups;
  });

// window.getExistingEnzymeGroupsWithEnzymeData = () => {
//   const toRet = {};
//   forEach(window.getExistingEnzymeGroups(), (group, name) => {
//     toRet[name] = flatMap(group, enzymeName => {
//       const enzyme = this.getAllEnzymesByName()[enzymeName.toLowerCase()];
//       if (!enzyme) {
//         console.warn("ruh roh");
//         return [];
//       } else {
//         return enzyme;
//       }
//     });
//   });
//   return toRet;
// };

const easyStore = store({ hoveredEnzyme: "" });
class EnzymesDialog extends React.Component {
  state = {
    selectedEnzymeGroup: "My Enzymes",
    searchInput: ""
  };
  componentDidMount() {
    this.refreshEnzymeGroups();
  }
  getAllEnzymesByName = () => {
    return {
      ...this.props.additionalEnzymes,
      ...aliasedEnzymesByName
    };
  };
  refreshEnzymeGroups = () => {
    const { sequenceData, additionalEnzymes } = this.props;
    const existingGroups = window.getExistingEnzymeGroups();
    const orderedExistingGroups = {};
    const groupedEnzymesNameMap = {};
    Object.keys(existingGroups)
      .sort()
      .forEach(function (key) {
        const group = existingGroups[key];
        orderedExistingGroups[key] = group;
        group.forEach((name) => {
          const lowerName = name.toLowerCase();
          groupedEnzymesNameMap[lowerName] =
            aliasedEnzymesByName[lowerName] || additionalEnzymes[lowerName];
        });
      });
    const myEnzymes = {
      ...groupedEnzymesNameMap,
      ...additionalEnzymes,
      ...defaultEnzymesByName
    };
    const hiddenEnzymes = omitBy(aliasedEnzymesByName, (p, i) => {
      return myEnzymes[i] || groupedEnzymesNameMap[i];
    });
    this.enzymeGroups = {
      "My Enzymes": {
        protected: true,
        name: "My Enzymes",
        enzymes: map(myEnzymes).sort((e) => e.name)
      },
      Hidden: {
        protected: true,
        name: "Hidden",
        tooltipInfo:
          "These less common enzymes are hidden by default. Adding them to a custom group will make them show up in the cutsite filter dropdown.",
        enzymes: map(hiddenEnzymes).sort((e) => e.name)
      },
      ...reduce(
        orderedExistingGroups,
        (acc, val, key) => {
          acc[key] = {
            name: key,
            enzymes: getEnzymesForNames(val, this.getAllEnzymesByName())
          };
          return acc;
        },
        {}
      )

      // "my special enzymes": {
      //   name: "my special enzymes",
      //   enzymes: getEnzymesForNames(["bamhi", "bsmbi"])
      // },

      // "my casual enzymes": {
      //   name: "my casual enzymes",
      //   enzymes: getEnzymesForNames(["bamhi", "bsmbi"])
      // }
    };
    this.cutsitesByEnzymeName = getCutsitesFromSequence(
      sequenceData.sequence,
      sequenceData.circular,
      map(this.getAllEnzymesByName())
    );
    this.forceUpdate();
  };

  clearSelection = () => {
    const { selectedEnzymeGroup } = this.state;
    const selectedEnzymesKey = `selectedEnzymes_${selectedEnzymeGroup}`;
    this.setState({
      [selectedEnzymesKey]: {}
    });
  };
  render() {
    const { hideModal } = this.props;
    if (!this.enzymeGroups) return null;
    const { selectedEnzymeGroup, searchInput, enzymeGroupToMoveTo } =
      this.state;
    const selectedEnzymesKey = `selectedEnzymes_${selectedEnzymeGroup}`;
    const selectedEnzymesForGroup = this.state[selectedEnzymesKey] || {};
    const selectedCount = countBy(selectedEnzymesForGroup, (e) => e).true || 0;
    const fullSelectedEnzGroup = this.enzymeGroups[selectedEnzymeGroup] || {};

    const enzymeList = flatMap(fullSelectedEnzGroup.enzymes, (enz, i) => {
      const name = `${enz.name} (${
        (this.cutsitesByEnzymeName &&
          this.cutsitesByEnzymeName[enz.name] &&
          this.cutsitesByEnzymeName[enz.name].length) ||
        0
      })`;
      if (
        searchInput &&
        !name.toLowerCase().includes(searchInput.toLowerCase())
      ) {
        return [];
      }
      return (
        <div
          onMouseOver={() => {
            easyStore.hoveredEnzyme = enz.name;
            clearTimeout(this.clearId);
          }}
          onMouseLeave={() => {
            this.clearId = setTimeout(() => {
              easyStore.hoveredEnzyme = "";
            }, 100);
          }}
          onClick={() => {
            this.setState({
              [selectedEnzymesKey]: {
                ...selectedEnzymesForGroup,
                [enz.name]: !selectedEnzymesForGroup[enz.name]
              }
            });
          }}
          className={classNames(Classes.MENU_ITEM, "veEnzymeDialogEnzyme", {
            [`${Classes.ACTIVE} ${Classes.INTENT_PRIMARY}`]:
              selectedEnzymesForGroup[enz.name]
          })}
          key={i}
        >
          {name}
        </div>
      );
    });
    // const enzymesForGroup =
    return (
      <div
        style={{ height: 500 }}
        className={classNames(
          Classes.DIALOG_BODY,
          "tg-min-width-dialog veEnzymeDialog"
        )}
      >
        <div
          className="veEnzymeDialogInner"
          style={{ display: "flex", height: "100%" }}
        >
          <div
            className="veEnzymeDialogEnzymeGroups"
            style={{
              minWidth: 150,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid lightgrey",
              paddingRight: 5
            }}
          >
            <h5>Enzyme Groups:</h5>
            <div style={{ overflowY: "auto" }}>
              {map(this.enzymeGroups, (group, i) => {
                return (
                  <React.Fragment>
                    <div
                      onClick={() => {
                        this.setState({
                          selectedEnzymeGroup: group.name
                        });
                      }}
                      className={classNames(Classes.MENU_ITEM, {
                        [Classes.ACTIVE]: selectedEnzymeGroup === group.name
                      })}
                      style={{ marginBottom: 5, cursor: "pointer" }}
                      key={i}
                    >
                      &nbsp; {group.name} &nbsp;{" "}
                      {group.tooltipInfo && (
                        <InfoHelper
                          color="grey"
                          isInline
                          content={group.tooltipInfo}
                        ></InfoHelper>
                      )}
                    </div>
                    {group.name === "Hidden" && (
                      <div className={Classes.MENU_DIVIDER}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <ButtonGroup style={{ width: "fit-content" }}>
              <Tooltip
                disabled={window.Cypress}
                position="bottom"
                content="Create New Group"
              >
                <Popover
                  content={
                    <div
                      className="veNewEnzymeGroupPopover"
                      style={{ padding: 10 }}
                    >
                      <h5>Create new enzyme group</h5>
                      <div style={{ display: "flex" }}>
                        <InputGroup
                          autoFocus
                          className="veNewEnzymeGroupName"
                        ></InputGroup>
                        <AnchorButton
                          className={Classes.POPOVER_DISMISS}
                          onClick={() => {
                            const newName = document.querySelector(
                              ".veNewEnzymeGroupName input"
                            ).value;
                            if (!newName) {
                              return window.toastr.error("Invalid name");
                            }
                            if (this.enzymeGroups[newName]) {
                              window.toastr.error(
                                "Choose a different group name"
                              );
                            } else {
                              window.toastr.success(
                                "Created New Enzyme Group " + newName
                              );
                              window.createNewEnzymeGroup(newName);
                              this.refreshEnzymeGroups();
                              this.setState({
                                selectedEnzymeGroup: newName
                              });
                            }
                          }}
                          icon="tick"
                          intent="success"
                        ></AnchorButton>
                      </div>
                    </div>
                  }
                >
                  <AnchorButton
                    className="veEnzymeDialogAddGroupBtn"
                    minimal
                    icon="add"
                  ></AnchorButton>
                </Popover>
              </Tooltip>
              <Popover
                content={
                  <div
                    className="veEditEnzymeGroupPopover"
                    style={{ padding: 10 }}
                  >
                    <h5>Edit group name</h5>
                    <div style={{ display: "flex" }}>
                      <InputGroup
                        defaultValue={selectedEnzymeGroup}
                        autoFocus
                        className="veEditEnzymeGroupName"
                      ></InputGroup>
                      <AnchorButton
                        className={Classes.POPOVER_DISMISS}
                        onClick={() => {
                          const newName = document.querySelector(
                            ".veEditEnzymeGroupName input"
                          ).value;
                          if (!newName) {
                            return window.toastr.error("Invalid name");
                          }
                          if (this.enzymeGroups[newName]) {
                            window.toastr.error(
                              "Choose a different group name"
                            );
                          } else {
                            window.toastr.success("Edit Successful");
                            window.editEnzymeGroupName(
                              selectedEnzymeGroup,
                              newName
                            );
                            this.refreshEnzymeGroups();
                            this.setState({
                              selectedEnzymeGroup: newName
                            });
                          }
                        }}
                        icon="tick"
                        intent="success"
                      ></AnchorButton>
                    </div>
                  </div>
                }
              >
                <Tooltip
                  disabled={window.Cypress}
                  position="bottom"
                  content="Edit Group Name"
                >
                  <AnchorButton
                    disabled={fullSelectedEnzGroup.protected}
                    minimal
                    icon="edit"
                  ></AnchorButton>
                </Tooltip>
              </Popover>
              <Tooltip
                disabled={window.Cypress}
                position="bottom"
                content="Delete Group"
              >
                <AnchorButton
                  disabled={fullSelectedEnzGroup.protected}
                  onClick={async () => {
                    const confirm = await showConfirmationDialog({
                      text: `Are you sure you want to delete this group, ${selectedEnzymeGroup}?`,
                      intent: Intent.DANGER
                    });
                    if (confirm) {
                      window.deleteEnzymeGroup(selectedEnzymeGroup);
                      this.refreshEnzymeGroups();
                      this.setState({
                        selectedEnzymeGroup: "My Enzymes"
                      });
                    }
                  }}
                  minimal
                  icon="trash"
                ></AnchorButton>
              </Tooltip>
            </ButtonGroup>
          </div>
          <div className="veEnzymeDialogEnzymes">
            <div
              className="veEnzymeDialogSearch"
              style={{ width: 250, paddingBottom: 5 }}
            >
              <InputGroup
                round
                placeholder="Search by name or # of cuts"
                onChange={(e) => {
                  this.setState({
                    searchInput: e.target.value
                  });
                }}
                value={searchInput}
                rightElement={
                  searchInput && (
                    <AnchorButton
                      icon="cross"
                      minimal
                      intent="danger"
                      onClick={(e) => {
                        this.setState({ searchInput: "" });
                        e.stopPropagation();
                      }}
                    ></AnchorButton>
                  )
                }
                leftIcon="search"
              ></InputGroup>
            </div>
            <div
              style={{
                height: "84%",
                display: "flex",
                flexFlow: "column",
                justifyContent: "space-between"
              }}
            >
              <div
                className="veEnzymeDialogEnzymesList"
                style={{
                  height: "fit-parent",
                  overflowY: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  maxWidth: "100%"
                }}
              >
                {/* <span style={{fontSize: 10}}>{fullSelectedEnzGroup.message || "Enzymes added here can be filtered for in the Cutsite Filter"}  </span> */}
                {enzymeList.length
                  ? enzymeList
                  : "Copy enzymes from other groups to your custom group"}
              </div>
              <HoverView
                allEnzymesByName={this.getAllEnzymesByName()}
              ></HoverView>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <ButtonGroup>
                <div>
                  <Tooltip
                    position="left"
                    content="Copy Selection To Another Group"
                  >
                    <Popover
                      canEscapeKeyClose
                      disabled={!selectedCount}
                      // targetClassName={"veEnzymeDialogEnzymeAddIcon"}
                      // targetProps={{style: {flex: "0 0 auto"}}}
                      // wrapperTagName="div"
                      position="top"
                      content={
                        <MoveToInner
                          {...{
                            clearSelection: this.clearSelection,
                            refreshEnzymeGroups: this.refreshEnzymeGroups,
                            selectedEnzymeGroup,
                            enzymeGroupToMoveTo,
                            selectedCount,
                            selectedEnzymesForGroup,
                            enzymeGroups: this.enzymeGroups,
                            setStateAbove: (val) => {
                              this.setState(val);
                            }
                          }}
                        ></MoveToInner>
                      }
                      target={
                        <AnchorButton
                          className="veEnzymeGroupAddEnzymesBtn"
                          disabled={!selectedCount}
                          icon="duplicate"
                        ></AnchorButton>
                      }
                    ></Popover>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip
                    disabled={window.Cypress}
                    position="bottom"
                    content="Remove Enzymes"
                  >
                    <AnchorButton
                      className="veRemoveEnzymeFromGroupBtn"
                      onClick={async () => {
                        const confirm = await showConfirmationDialog({
                          text: `Are you sure you want to remove ${selectedCount} enzyme(s) from ${selectedEnzymeGroup}`,
                          intent: Intent.DANGER
                        });
                        if (confirm) {
                          const enzymes = flatMap(
                            fullSelectedEnzGroup.enzymes,
                            (e) =>
                              selectedEnzymesForGroup[e.name] ? [] : e.name
                          );
                          window.updateEnzymeGroup(
                            selectedEnzymeGroup,
                            enzymes
                          );
                          this.setState({ [selectedEnzymesKey]: {} });
                          this.refreshEnzymeGroups();
                          window.toastr.success(
                            `${selectedCount} enzyme(s) removed`
                          );
                        }
                      }}
                      disabled={
                        fullSelectedEnzGroup.protected || !selectedCount
                      }
                      icon="trash"
                    ></AnchorButton>
                  </Tooltip>
                </div>

                <div>
                  {/* <Popover
                  autoFocus={false}
                  captureDismiss
                  content={
                    <Menu>
                      {createMenu([
                        {
                          text: "All",
                          onClick: () => {
                            const selectedEnzymes = {};
                            forEach(
                              fullSelectedEnzGroup.enzymes,
                              enzyme => {
                                selectedEnzymes[enzyme.name] = true;
                              }
                            );

                            this.setState({
                              [selectedEnzymesKey]: selectedEnzymes
                            });
                          }
                        },
                        {
                          text: "Single cutters"
                        },
                        {
                          text: "Double cutters"
                        },
                        {
                          text: "Cut X times",
                          submenu: [
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16
                          ].map(n => {
                            return {
                              text: `Cut ${n} times`
                            };
                          })
                        },
                        {
                          text: "Cut >X times",
                          submenu: [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16
                          ].map(n => {
                            return {
                              text: `Cut >${n} times`
                            };
                          })
                        },
                        {
                          text: "Cut <X times",
                          submenu: [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15,
                            16
                          ].map(n => {
                            return {
                              text: `Cut <${n} times`
                            };
                          })
                        },
                        {
                          text: "Blunt cutters"
                        },
                        {
                          text: "3' cutters"
                        },
                        {
                          text: "5' cutters"
                        },
                        {
                          text: "4 bp Recognition Site"
                        },
                        {
                          text: "5 bp Recognition Site"
                        },
                        {
                          text: "6 bp Recognition Site"
                        },
                        {
                          text: "Degenerate Recognition Site"
                        },
                        {
                          text: "Degenerate Cut"
                        }
                      ])}
                    </Menu>
                  }
                  position={Position.RIGHT_TOP}
                >
                  <AnchorButton>Select...</AnchorButton>
                </Popover> */}
                </div>
                <AnchorButton
                  onClick={() => {
                    this.setState({ [selectedEnzymesKey]: {} });
                  }}
                  disabled={!selectedCount}
                >
                  Deselect {selectedCount}
                </AnchorButton>
              </ButtonGroup>
              {selectedEnzymeGroup === "My Enzymes" && (
                <div>
                  <Tooltip
                    disabled={window.Cypress}
                    position="left"
                    content="Create Custom Enzyme"
                  >
                    <Button
                      minimal
                      onClick={() => {
                        hideModal();
                        showDialog({
                          dialogType: "CreateCustomEnzyme"
                        });
                      }}
                      className="veEnzymeCreateCustomEnzyme"
                      icon="add"
                    ></Button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  wrapDialog({ title: "Manage Enzymes" }),
  withEditorProps
  // reduxForm({
  //   form: "EnzymesDialog",
  //   validate: ({ id1, id2 }) => {
  //     const errors = {};
  //     if (!id1 || Array.isArray(id1)) {
  //       errors.id1 = "Please select a feature";
  //     }
  //     if (!id2 || Array.isArray(id2)) {
  //       errors.id2 = "Please select a feature";
  //     }
  //     return errors;
  //   }
  // }),
  // formValues("id1", "id2")
)(EnzymesDialog);

function getEnzymesForNames(names, allEnzymesByName) {
  return names.map((n) => {
    return (n && allEnzymesByName[n.toLowerCase()]) || { name: "Not Found!" };
  });
}

class MoveToInner extends React.Component {
  componentDidMount() {
    const {
      selectedEnzymeGroup,
      enzymeGroupToMoveTo,
      setStateAbove,
      enzymeGroups
    } = this.props;
    const enzymeOpts = flatMap(enzymeGroups, (g) => {
      if (g.protected || g.name === selectedEnzymeGroup) return [];
      return {
        value: g.name
      };
    });
    if (!enzymeGroupToMoveTo && enzymeOpts.length) {
      setStateAbove({ enzymeGroupToMoveTo: enzymeOpts[0].value });
    }
    this.setState({
      enzymeOpts
    });
  }
  state = { enzymeOpts: [] };
  render() {
    const {
      clearSelection,
      setStateAbove,
      selectedCount,
      enzymeGroupToMoveTo,
      enzymeGroups,
      refreshEnzymeGroups,
      selectedEnzymesForGroup
    } = this.props;
    const { enzymeOpts } = this.state;
    return (
      <div className="veEnzymeGroupMoveEnzymePopover" style={{ padding: 10 }}>
        {enzymeOpts && !enzymeOpts.length ? (
          <div style={{ maxWidth: 150 }}>
            No other custom enzyme groups exist. Please create a new enzyme
            group to add enzymes to it.
          </div>
        ) : (
          <div>
            <h5>Copy {selectedCount} Enzyme(s) To:</h5>

            <HTMLSelect
              onChange={(e) => {
                setStateAbove({
                  enzymeGroupToMoveTo: e.target.value
                });
              }}
              value={enzymeGroupToMoveTo}
              options={enzymeOpts}
            ></HTMLSelect>
            <AnchorButton
              className={Classes.POPOVER_DISMISS}
              onClick={() => {
                const enzymes = uniq([
                  ...map(
                    enzymeGroups[enzymeGroupToMoveTo].enzymes,
                    (e) => e.name
                  ),
                  ...flatMap(selectedEnzymesForGroup, (selected, name) =>
                    selected ? name : []
                  )
                ]);

                window.updateEnzymeGroup(enzymeGroupToMoveTo, enzymes);
                // setStateAbove({
                //   enzymeGroupToMoveTo: e.target.value
                // });
                refreshEnzymeGroups();
                clearSelection();
                window.toastr.success(
                  `${selectedCount} enzyme(s) moved to ${enzymeGroupToMoveTo}`
                );
              }}
              intent="success"
              icon="tick"
            ></AnchorButton>
          </div>
        )}
      </div>
    );
  }
}

const HoverView = view(({ allEnzymesByName }) => {
  const { hoveredEnzyme } = easyStore;
  return (
    <div
      className="hoveredEnzymeContainer"
      style={{
        overflow: "hidden",
        // maxWidth: "100%",
        minWidth: 0,
        // width: "100%",
        margin: "20px",
        minHeight: 30,
        maxHeight: 30,
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      {hoveredEnzyme}{" "}
      {hoveredEnzyme && (
        <EnzymeViewer
          {...{
            paddingEnd: "--",
            paddingStart: "--",
            sequence: allEnzymesByName[hoveredEnzyme.toLowerCase()].site,
            reverseSnipPosition:
              allEnzymesByName[hoveredEnzyme.toLowerCase()].bottomSnipOffset,
            forwardSnipPosition:
              allEnzymesByName[hoveredEnzyme.toLowerCase()].topSnipOffset
          }}
        ></EnzymeViewer>
      )}
    </div>
  );
});
