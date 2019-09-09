import map from "lodash/map";

// import enzymeListFull from '../../../enzymeListFull.json';
import { connect } from "react-redux";
// import defaultEnzymeList from '../../../../enzymeListFull.json';
// import {reduxForm, Field, formValueSelector} from 'redux-form'
import React from "react";
import { Button } from "@blueprintjs/core";
import { InfoHelper, TgSelect } from "teselagen-react-components";

import enzymeListFull from "../redux/utils/expandedEnzymeList.json";
import defaultEnzymeList from "../redux/utils/defaultEnzymeList.json";
// import './style.css';
import { cutSequenceByRestrictionEnzyme } from "ve-sequence-utils";
// import QuestionTooltip from '../../components/QuestionTooltip';
import "./style.css";
import { getReverseComplementSequenceString } from "ve-sequence-utils";
import EnzymeViewer from "../EnzymeViewer";
import { addAdditionalEnzymesClose } from "../redux/addAdditionalEnzymes";
let AddAdditionalEnzyme = function(props) {
  const paddingStart = "-------";
  const paddingEnd = "-------";
  const {
    // filteredRestrictionEnzymesAdd,
    // addRestrictionEnzyme,
    inputSequenceToTestAgainst = "", //pass this prop in!
    addAdditionalEnzymesClose: hideModal,
    seqName = "Destination Vector",
    addAdditionalEnzymes,
    dispatch,
    editorName,
    stopAddingYourOwnEnzyme
  } = props;

  addAdditionalEnzymes.chop_top_index = Number(
    addAdditionalEnzymes.chop_top_index
  );
  addAdditionalEnzymes.chop_bottom_index = Number(
    addAdditionalEnzymes.chop_bottom_index
  );

  const {
    sequence = "",
    chop_top_index = 0,
    chop_bottom_index = 0,
    name = ""
  } = addAdditionalEnzymes;
  const regexString = bpsToRegexString(sequence);
  const enzyme = {
    name: name,
    site: sequence,
    forwardRegex: regexString,
    reverseRegex: getReverseComplementSequenceString(regexString),
    topSnipOffset: chop_top_index,
    bottomSnipOffset: chop_bottom_index,
    usForward: 0,
    usReverse: 0,
    color: "black"
  };
  let invalid;
  if (
    !enzyme.name ||
    !enzyme.site ||
    !enzyme.forwardRegex ||
    !enzyme.reverseRegex ||
    (!enzyme.topSnipOffset && enzyme.topSnipOffset !== 0) ||
    (!enzyme.bottomSnipOffset && enzyme.bottomSnipOffset !== 0)
  ) {
    invalid = true;
  }

  let matches;
  if (regexString.length === 0) {
    matches = [];
  } else {
    matches = cutSequenceByRestrictionEnzyme(
      inputSequenceToTestAgainst,
      true,
      enzyme
    );
  }

  const errors = validate(addAdditionalEnzymes);
  if (Object.keys(errors || {}).length) {
    invalid = true;
  }
  function onChange(updatedVal) {
    dispatch({
      type: "ADD_ADDITIONAL_ENZYMES_UPDATE",
      payload: {
        ...addAdditionalEnzymes,
        ...updatedVal
      }
    });
  }

  return (
    <div className="createYourOwnEnzyme">
      <h2>Create your own enzyme</h2>
      <CustomInput
        error={errors["name"]}
        value={name}
        onChange={onChange}
        name="name"
        label="Name:"
      />
      <CustomInput
        error={errors["sequence"]}
        value={sequence}
        onChange={onChange}
        name="sequence"
        label={
          <div className="labelWithIcon">
            <InfoHelper>
              <div className="taLineHolder">
                <Line> Special Characters: </Line>
                <Line> R = G A (purine) </Line>
                <Line> Y = T C (pyrimidine) </Line>
                <Line> K = G T (keto) </Line>
                <Line> M = A C (amino) </Line>
                <Line> S = G C (strong bonds) </Line>
                <Line> W = A T (weak bonds) </Line>
                <Line> B = G T C (all but A) </Line>
                <Line> D = G A T (all but C) </Line>
                <Line> H = A C T (all but G) </Line>
                <Line> V = G C A (all but T) </Line>
                <Line> N = A G C T (any) </Line>
              </div>
            </InfoHelper>
            <span>Recognition sequence:</span>
          </div>
        }
        onInput={function(input) {
          const inputValue = input.target.value;
          const cleanInput = inputValue.replace(/[^rykmswbdhvnagct]/gi, "");
          input.target.value = cleanInput;
        }}
      />

      <CustomInput
        error={errors["chop_top_index"]}
        value={chop_top_index}
        onChange={onChange}
        name="chop_top_index"
        label="Chop top index:"
        type="number"
      />
      <CustomInput
        error={errors["chop_bottom_index"]}
        value={chop_bottom_index}
        onChange={onChange}
        name="chop_bottom_index"
        label="Chop bottom index:"
        type="number"
      />

      <EnzymeViewer
        {...{
          forwardSnipPosition: chop_top_index,
          paddingEnd,
          paddingStart,
          reverseSnipPosition: chop_bottom_index,
          sequence
        }}
      />
      <br />
      {/* <RowItem
  {
    ...{
      // width: 400,
      tickSpacing: 1,
      annotationVisibility:  {
        cutsites: true,
        cutsiteLabels: false,
        axis: false,
      },
      sequenceLength: seqPlusPadding.length,
      bpsPerRow: seqPlusPadding.length,
      row: {
        sequence: seqPlusPadding,
        start: 0,
        end: seqPlusPadding.length-1,
        cutsites: {
          'fake1': {
            annotation: {
              recognitionSiteRange: {
                start: paddingStart.length,
                end: paddingStart.length + sequence.length - 1,
              },
              topSnipBeforeBottom: chop_top_index < chop_bottom_index,
              bottomSnipPosition: paddingStart.length + chop_bottom_index,
              topSnipPosition: paddingStart.length +  chop_top_index,
              id: 'fake1',
              restrictionEnzyme: {
              }
            }
          }
        },
      },
    }
  }
  /> */}

      <h3 className={"cutnumber " + (matches.length === 0 && "invalid")}>
        {matches.length > 10
          ? `Cuts more than 10 times in your ${seqName}`
          : `Cuts ${matches.length} time${
              matches.length === 1 ? "" : "s"
            } in your ${seqName}`}
      </h3>
      <div className="buttonHolder">
        <Button
          className="addAdditionalEnzymeBtn"
          onClick={stopAddingYourOwnEnzyme}
        >
          Back
        </Button>
        <Button
          className={
            " ta_useCutsite addAdditionalEnzymeBtn " + (invalid && "disabled")
          }
          onClick={function() {
            if (invalid) {
              return;
            }
            dispatch({
              type: "ADD_RESTRICTION_ENZYME",
              payload: enzyme,
              meta: {
                editorName
              }
            });
            dispatch({
              type: "FILTERED_RESTRICTION_ENZYMES_ADD",
              payload: {
                value: name
              },
              meta: {
                editorName
              }
            });
            // addRestrictionEnzyme(enzyme)
            // filteredRestrictionEnzymesAdd({
            //   label: name,
            //   value: name,
            // })
            hideModal && hideModal();
          }}
        >
          Use Enzyme
        </Button>
      </div>
    </div>
  );
};

AddAdditionalEnzyme = connect(
  function(state) {
    return {
      addAdditionalEnzymes:
        state.VectorEditor.__allEditorsOptions.addAdditionalEnzymes
    };
  },
  { addAdditionalEnzymesClose }
)(AddAdditionalEnzyme);

class AddAdditionalEnzymes extends React.Component {
  state = {
    addAdditionalEnzymes: false,
    enzymesToAdd: []
  };

  startAddingYourOwnEnzyme = () => {
    this.setState({ addAdditionalEnzymes: true });
  };

  stopAddingYourOwnEnzyme = () => {
    this.setState({ addAdditionalEnzymes: false });
  };

  render() {
    if (this.state.addAdditionalEnzymes) {
      return (
        <AddAdditionalEnzyme
          {...this.props}
          stopAddingYourOwnEnzyme={this.stopAddingYourOwnEnzyme}
        />
      );
    }
    const {
      dispatch,
      addAdditionalEnzymesClose: hideModal,
      inputSequenceToTestAgainst = ""
    } = this.props;
    const { enzymesToAdd } = this.state;
    return (
      <div className="addAdditionalEnzyme">
        <h2>Add additional enzymes</h2>
        <span>
          Our default list contains just the most common enzymes. Search here to
          add less common ones:
        </span>
        <div className="filterAndButton">
          <TgSelect
            multi
            placeholder="Select cut sites..."
            options={map(enzymeListFull, function(enzyme) {
              return { label: enzyme.name, value: enzyme };
            })}
            onChange={enzymesToAdd => {
              this.setState({
                enzymesToAdd: enzymesToAdd.map(function({ value }) {
                  const times = cutSequenceByRestrictionEnzyme(
                    inputSequenceToTestAgainst,
                    true,
                    value
                  ).length;
                  return {
                    label:
                      value.name +
                      ` (Cuts ${times} time${times === 1 ? "" : "s"})`,
                    value
                  };
                })
              });
            }}
            value={enzymesToAdd}
          />
          <Button
            className="addAdditionalEnzymeBtn"
            onClick={function() {
              enzymesToAdd.forEach(function(enzyme) {
                dispatch({
                  type: "ADD_RESTRICTION_ENZYME",
                  payload: enzyme.value
                  // meta: {}
                });
                dispatch({
                  type: "FILTERED_RESTRICTION_ENZYMES_ADD",
                  payload: {
                    value: enzyme.value.name
                  }
                  // meta: {}
                });
              });
              hideModal && hideModal();
            }}
            disabled={
              this.state.enzymesToAdd && this.state.enzymesToAdd.length < 1
            }
          >
            Add Enzyme
            {this.state.enzymesToAdd && this.state.enzymesToAdd.length > 1
              ? "s"
              : ""}
          </Button>
        </div>
        <div className="createYourOwnButton">
          <span>Still not finding what you want?</span>
          <Button
            className="addAdditionalEnzymeBtn"
            onClick={this.startAddingYourOwnEnzyme}
          >
            Create your own enzyme
          </Button>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Input cannot be blank";
  } else if (defaultEnzymeList[values.name.toLowerCase()]) {
    errors.name = `The name ${values.name} is already taken.`;
  }

  if (
    !values.sequence ||
    values.sequence.trim() === "" ||
    values.sequence.trim().length < 4
  ) {
    errors.sequence = "Enzyme recognition sequence must be at least 4bps long";
  }

  if (
    values.sequence &&
    values.sequence.replace(/[^atgcrykmswbdhvn]/gi, "").length !==
      values.sequence.length
  ) {
    errors.sequence = "Sequence must only contain valid bases";
  }

  if (!values.chop_top_index && values.chop_top_index !== 0) {
    errors.chop_top_index = "Input cannot be blank";
  }
  if (!values.chop_bottom_index && values.chop_bottom_index !== 0) {
    errors.chop_bottom_index = "Input cannot be blank";
  }
  return errors;
}

AddAdditionalEnzymes = connect(
  function(state) {
    return {
      inputSequenceToTestAgainst:
        state.VectorEditor.__allEditorsOptions.addAdditionalEnzymes
          .inputSequenceToTestAgainst
    };
  },
  { addAdditionalEnzymesClose }
)(AddAdditionalEnzymes);

export default AddAdditionalEnzymes;

function bpsToRegexString(bps) {
  let regexString = "";
  if (typeof bps === "string") {
    bps.split("").forEach(function(bp) {
      if (bp === "r") {
        regexString += "[ga]";
      } else if (bp === "y") {
        regexString += "[tc]";
      } else if (bp === "k") {
        regexString += "[gt]";
      } else if (bp === "m") {
        regexString += "[ac]";
      } else if (bp === "s") {
        regexString += "[gc]";
      } else if (bp === "w") {
        regexString += "[at]";
      } else if (bp === "b") {
        regexString += "[gtc]";
      } else if (bp === "d") {
        regexString += "[gat]";
      } else if (bp === "h") {
        regexString += "[act]";
      } else if (bp === "v") {
        regexString += "[gca]";
      } else if (bp === "n") {
        regexString += "[agct]";
      } else {
        regexString += bp;
      }
    });
  }
  return regexString;
}

// function CustomInput({name, type, label, onInput}) {
// return <Field name={name} label={label} type={type} onInput={onInput} component={RenderInput} >
// </Field>
// }

function CustomInput({ name, value, onChange, onInput, label, error, type }) {
  return (
    <div className={"inputHolder " + (error && "error")}>
      <div>
        <span>{label}</span>
        <input
          value={value}
          onChange={function(e) {
            onChange({
              [name]: e.target.value
            });
          }}
          onInput={onInput}
          type={type}
        />
      </div>
      {error && <p className="errorMessage">{error}</p>}
    </div>
  );
}

function Line({ children }) {
  return <div className="taLine"> {children}</div>;
}
