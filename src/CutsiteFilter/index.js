import { connect } from "react-redux";
import { compose } from "redux";
import { Icon } from "@blueprintjs/core";

import withEditorProps from "../withEditorProps";
import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";

import React from "react";
import "./style.css";
import { TgSelect } from "teselagen-react-components";

import map from "lodash/map";

export class CutsiteFilter extends React.Component {
  static defaultProps = {
    onChangeHook: () => {},
    filteredRestrictionEnzymes: [],
    filteredRestrictionEnzymesUpdate: [],
    allCutsites: { cutsitesByName: {} },
    sequenceData: {
      sequence: ""
    },
    dispatch: () => {}
  };

  render() {
    let {
      onChangeHook,
      style = {},
      filteredRestrictionEnzymes,
      filteredRestrictionEnzymesUpdate,
      allCutsites: { cutsitesByName },
      sequenceData: { sequence: inputSequenceToTestAgainst },
      dispatch
      // ...rest
    } = this.props;
    // var {handleOpen, handleClose} = this
    let options = [
      ...map(specialCutsiteFilterOptions, opt => opt),
      ...Object.keys(cutsitesByName).map(function(key) {
        const label = getLabel(cutsitesByName[key], key);
        return {
          label,
          value: key
        };
      })
    ];
    function openAddYourOwn() {
      dispatch({
        type: "ADD_ADDITIONAL_ENZYMES_RESET",
        payload: {
          inputSequenceToTestAgainst,
          isOpen: true
        }
      });
    }
    return (
      <div style={style}>
        <TgSelect
          multi
          allowCreate
          wrapperStyle={{ zIndex: 11 }}
          noResultsText={
            <div className="noResultsTextPlusButton">
              No matching enzymes found that cut in the sequence.{" "}
              <AddAdditionalEnzymeLink onClick={openAddYourOwn} />{" "}
            </div>
          }
          placeholder="Filter cut sites..."
          options={options}
          optionRenderer={renderOptions}
          onChange={filteredRestrictionEnzymes => {
            if (
              filteredRestrictionEnzymes &&
              filteredRestrictionEnzymes.some(
                enzyme =>
                  enzyme.value === specialCutsiteFilterOptions.addYourOwn.value
              )
            ) {
              return openAddYourOwn();
            }
            onChangeHook && onChangeHook(filteredRestrictionEnzymes);
            filteredRestrictionEnzymesUpdate(filteredRestrictionEnzymes);
          }}
          value={filteredRestrictionEnzymes.map(filteredOpt => {
            if (filteredOpt.cutsThisManyTimes) {
              return filteredOpt;
            }

            const label = getLabel(
              cutsitesByName[filteredOpt.value],
              filteredOpt.value
            );
            return {
              ...filteredOpt,
              label
            };
          })}
        />
      </div>
    );
  }
}

export default compose(
  withEditorProps,
  connect()
)(CutsiteFilter);
function renderOptions({ label, value }) {
  if (value === "addYourOwn") {
    return <AddAdditionalEnzymeLink />;
  }

  return label;
}

function AddAdditionalEnzymeLink({ onClick }) {
  return (
    <span onClick={onClick} className="ta_link">
      Add additional enzymes <Icon iconSize={14} icon="plus" />
    </span>
  );
}

const getLabel = (maybeCutsites = [], val) => {
  const cutNumber = maybeCutsites.length;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {" "}
      <div>{val}</div>{" "}
      <div style={{ fontSize: 12 }}>
        &nbsp;({cutNumber} cut{cutNumber === 1 ? "" : "s"})
      </div>
    </div>
  );
};
