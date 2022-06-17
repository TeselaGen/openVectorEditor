import { connect } from "react-redux";
// import {reduxForm, Field, formValueSelector} from 'redux-form'
import React from "react";
import {
  DialogFooter,
  InfoHelper,
  wrapDialog
} from "teselagen-react-components";

// import './style.css';
import { cutSequenceByRestrictionEnzyme } from "ve-sequence-utils";
// import QuestionTooltip from '../../components/QuestionTooltip';
import {
  defaultEnzymesByName,
  getReverseComplementSequenceString
} from "ve-sequence-utils";
import EnzymeViewer from "../EnzymeViewer";
import "./style.css";
import { connectToEditor } from "../withEditorProps";
import { compose } from "recompose";
import { Callout } from "@blueprintjs/core";
import { addCustomEnzyme } from "../utils/editorUtils";

const CreateCustomEnzyme = function (props) {
  const paddingStart = "-------";
  const paddingEnd = "-------";
  const {
    inputSequenceToTestAgainst = "", //pass this prop in!
    seqName = "Destination Vector",
    createYourOwnEnzyme,
    dispatch,
    hideModal,
    editorName
  } = props;

  createYourOwnEnzyme.chop_top_index = Number(
    createYourOwnEnzyme.chop_top_index
  );
  createYourOwnEnzyme.chop_bottom_index = Number(
    createYourOwnEnzyme.chop_bottom_index
  );

  const {
    sequence = "",
    chop_top_index = 0,
    chop_bottom_index = 0,
    name = ""
  } = createYourOwnEnzyme;
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

  const errors = validate(createYourOwnEnzyme);
  if (Object.keys(errors || {}).length) {
    invalid = true;
  }
  function onChange(updatedVal) {
    dispatch({
      type: "CREATE_YOUR_OWN_ENZYME_UPDATE",
      payload: {
        ...createYourOwnEnzyme,
        ...updatedVal
      }
    });
  }

  return (
    <div className="createYourOwnEnzyme">
      <Callout intent="primary">
        This enzyme will be added to the "My Enzymes" group
      </Callout>
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
        onInput={function (input) {
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

      <h3 className={"cutnumber " + (matches.length === 0 && "invalid")}>
        {matches.length > 10
          ? `Cuts more than 10 times in ${seqName}`
          : `Cuts ${matches.length} time${
              matches.length === 1 ? "" : "s"
            } in ${seqName}`}
      </h3>
      <DialogFooter
        hideModal={hideModal}
        disabled={invalid}
        onClick={() => {
          addCustomEnzyme(enzyme);
          dispatch({
            type: "FILTERED_RESTRICTION_ENZYMES_ADD", //filteredRestrictionEnzymesAdd
            payload: {
              value: name
            },
            meta: {
              editorName
            }
          });
          hideModal && hideModal();
        }}
      ></DialogFooter>
      {/* <div className="buttonHolder">
        <Button
          className="addAdditionalEnzymeBtn"
          onClick={stopCreatingYourOwnEnzyme}
        >
          Back
        </Button>
        <Button
          className={
            " ta_useCutsite addAdditionalEnzymeBtn " + (invalid && "disabled")
          }
          onClick={function () {}}
        >
          Use Enzyme
        </Button>
      </div> */}
    </div>
  );
};

export default compose(
  wrapDialog({
    title: "Create Custom Enzyme"
  }),
  connectToEditor(({ sequenceData = {} }) => {
    return {
      seqName: sequenceData.name,
      inputSequenceToTestAgainst: sequenceData.sequence || ""
    };
  }),
  connect(function (state) {
    return {
      createYourOwnEnzyme:
        state.VectorEditor.__allEditorsOptions.createYourOwnEnzyme
    };
  })
)(CreateCustomEnzyme);

function validate(values) {
  const errors = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Input cannot be blank";
  } else if (defaultEnzymesByName[values.name.toLowerCase()]) {
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

// connect(
//   function(state, props) {
//     const editorState = state.VectorEditor[props.editorName];
//     let selectedEnzymes = s.restrictionEnzymesSelector(editorState, props.additionalEnzymes);
//     return {
//       selectedEnzymes
//     };
//   },
//   { createYourOwnEnzymeClose }
// )(ManageEnzymes);

// export default ManageEnzymes;

function bpsToRegexString(bps) {
  let regexString = "";
  if (typeof bps === "string") {
    bps.split("").forEach(function (bp) {
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

function CustomInput({ name, value, onChange, onInput, label, error, type }) {
  return (
    <div className={"inputHolder " + (error && "error")}>
      <div>
        <span>{label}</span>
        <input
          value={value}
          onChange={function (e) {
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
