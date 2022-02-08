import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  AdvancedOptions,
  CheckboxField,
  DropdownButton,
  generateField,
  RadioGroupField
} from "teselagen-react-components";
import { getReverseComplementSequenceString } from "ve-sequence-utils";

import AddOrEditAnnotationDialog from "../AddOrEditAnnotationDialog";
import { convertRangeTo0Based } from "ve-range-utils";
import { getAcceptedChars } from "../../utils/editorUtils";
import classNames from "classnames";
import "./style.css";
import { getSequenceWithinRange } from "ve-range-utils";

import CaretPositioning, {
  selectionSaveCaretPosition
} from "./EditCaretPosition";
import { Menu, MenuItem } from "@blueprintjs/core";
import { getComplementSequenceString } from "ve-sequence-utils";
import MeltingTemp from "../../StatusBar/MeltingTemp";

// function getHtmlFromVal(val) {
//   let html = "";
//   val.split("").forEach((b, i) => {
//     if (i % 2 === 0) {
//       html += `<span class="match">${b}</span>`;
//     } else {
//       html += `<span class="no-match">${b}</span>`;
//     }
//   });
//   return html;
// }

// export default function CustomEditable({setVal, val, getHtmlFromVal}) {
//   // const [val, setVal] = useState("gaga");

//   const inputRef = useRef(null);
//   const [caretPosition, setCaretPosition] = useState({ start: 0, end: 0 });

//   const emitChange = (e) => {
//     const newVal = e.target.innerText;
//     let savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);
//     setCaretPosition(savedCaretPosition);
//     setVal(newVal);
//   };

//   useEffect(() => {
//     CaretPositioning.restoreSelection(inputRef.current, caretPosition);
//   }, [val]);

//   return (
//     <div
//         ref={inputRef}
//         contentEditable
//         className="tg-contenteditable"
//         onInput={emitChange}
//         dangerouslySetInnerHTML={{ __html: (getHtmlFromVal(val)) }} // innerHTML of the editable div
//       />
//   );
// }

const CustomContentEditable = generateField(function CustomContentEditable({
  input,
  disabled,
  sequenceData,
  start,
  end,
  bases,
  // threePrimeLocation,
  forward
}) {
  const [hasTempError, setTempError] = useState(false);
  const threePrimeLocation = forward ? end : start;
  const inputRef = useRef(null);
  const [caretPosition, setCaretPosition] = useState({ start: 0, end: 0 });

  const emitChange = (e) => {
    const newVal = e.target.innerText;
    const savedCaretPosition = CaretPositioning.saveSelection(e.currentTarget);
    setCaretPosition(savedCaretPosition);
    const acceptedChars = getAcceptedChars(sequenceData);
    let newBases = "";
    newVal.split("").forEach((letter) => {
      if (acceptedChars.includes(letter.toLowerCase())) {
        newBases += letter;
      }
    });
    if (newVal.length !== newBases.length) {
      setTempError(true);
      setTimeout(() => {
        setTempError(false);
      }, 200);
    }
    const restore = selectionSaveCaretPosition(inputRef.current);

    input.onChange(newBases || "");
    setTimeout(() => {
      restore();
    }, 0);
  };

  useEffect(() => {
    CaretPositioning.restoreSelection(inputRef.current, caretPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bases]);
  let html = [];
  let basesToUse = bases || "";
  if (forward) basesToUse = basesToUse.split("").reverse().join("");
  basesToUse.split("").forEach((b, i) => {
    const index = forward
      ? threePrimeLocation - i - 1
      : threePrimeLocation + basesToUse.length - i - 2;
    let baseAtIndex = sequenceData.sequence[index] || "";
    if (!forward) baseAtIndex = getComplementSequenceString(baseAtIndex);
    if (!baseAtIndex) {
      return html[forward ? "unshift" : "push"](
        `<span class="tg-no-match-seq">${b}</span>`
      );
    }
    if (baseAtIndex.toLowerCase() === b.toLowerCase()) {
      html[forward ? "unshift" : "push"](
        `<span class="tg-match-seq">${b}</span>`
      );
    } else {
      html[forward ? "unshift" : "push"](
        `<span class="tg-no-match-seq">${b}</span>`
      );
    }
  });
  html = html.join("");

  return (
    <div
      style={{
        display: "flex",
        ...(disabled ? { pointerEvents: "none" } : {})
      }}
    >
      <span
        style={{
          verticalAlign: "top",
          marginTop: 9,
          marginRight: 3,
          fontSize: 12,
          color: "grey"
        }}
      >
        5'
      </span>
      <span
        ref={inputRef}
        spellcheck="false"
        contentEditable={!disabled}
        className={classNames("bp3-input tg-custom-sequence-editable", {
          hasTempError
        })}
        onInput={emitChange}
        dangerouslySetInnerHTML={{ __html: html }} // innerHTML of the editable div
      />
      <span
        style={{
          alignSelf: "end",
          marginBottom: 9,
          marginLeft: 3,
          fontSize: 12,
          color: "grey"
        }}
      >
        3'
      </span>
    </div>
  );
});

const RenderBases = (props) => {
  const {
    sequenceData,
    // readOnly,
    start,
    end,
    linkedOligo,
    useLinkedOligo,
    // threePrimeLocation,
    bases,
    forward,
    change
  } = props;
  let defaultValue;
  const seqLen = sequenceData.sequence.length;
  const validate = useMemo(() => {
    return (val /* vals, props */) => {
      if (!val) return;
      if (val.length > seqLen) {
        return "Primer cannot be longer than sequence";
      }
      return;
    };
  }, [seqLen]);
  const normalizedSelection = convertRangeTo0Based({
    start,
    end
  });
  if (!bases) {
    let bps = getSequenceWithinRange(
      normalizedSelection,
      sequenceData.sequence
    );
    if (!forward) {
      bps = getReverseComplementSequenceString(bps);
    }
    defaultValue = bps;
  }
  return (
    <div
      style={{
        borderTop: "1px solid #A7B6C2",
        borderBottom: "1px solid #A7B6C2"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <CheckboxField
          name="useLinkedOligo"
          label="Linked Oligo?"
          noMarginBottom
          disabled={props.readOnly}
        ></CheckboxField>
        {useLinkedOligo && (
          <div style={{ marginTop: -5, fontStyle: "italic", fontSize: 11 }}>
            {linkedOligo || "Will Be Created On Save"}
          </div>
        )}
      </div>
      {useLinkedOligo && (
        <div>
          <CustomContentEditable
            // inlineLabel
            showErrorIfUntouched
            tooltipError
            validate={validate}
            disabled={props.readOnly}
            {...props}
            {...(defaultValue
              ? {
                  defaultValue
                }
              : {})}
            name="bases"
            label={
              <div className="tg-bases-label">
                <div>Bases</div>
                <div style={{ width: "fit-content" }}>
                  <DropdownButton
                    disabled={props.readOnly}
                    intent="primary"
                    small
                    menu={
                      <Menu>
                        <MenuItem
                          onClick={() => {
                            // change("threePrimeLocation", end);
                            change("forward", true);
                            change(
                              "bases",
                              getSequenceWithinRange(
                                normalizedSelection,
                                sequenceData.sequence
                              )
                            );
                          }}
                          key="forward"
                          text="Forward"
                        ></MenuItem>
                        <MenuItem
                          onClick={() => {
                            change("forward", false);
                            // change("threePrimeLocation", start);
                            change(
                              "bases",
                              getReverseComplementSequenceString(
                                getSequenceWithinRange(
                                  normalizedSelection,
                                  sequenceData.sequence
                                )
                              )
                            );
                          }}
                          key="reverse"
                          text="Reverse"
                        ></MenuItem>
                      </Menu>
                    }
                  >
                    Set From Selection
                  </DropdownButton>
                </div>
              </div>
            }
          />
          <AdvancedOptions style={{ marginBottom: 10 }}>
            <RadioGroupField
              name="primerBindsOn"
              inline
              inlineLabel
              disabled={props.readOnly}
              label="Oligo Binds On"
              tooltipError
              options={[
                { label: "5' End", value: "5prime" },
                { label: "3' End", value: "3prime" }
              ]}
            ></RadioGroupField>
          </AdvancedOptions>

          <MeltingTemp
            InnerWrapper={InnerWrapperMeltingTemp}
            sequence={bases}
          ></MeltingTemp>
        </div>
      )}
      {/* <NumericInputField
        inlineLabel
        disabled={readOnly}
        tooltipError
        defaultValue={forward ? end : start}
        min={1}
        max={seqLen || 1}
        name="threePrimeLocation"
        label="3' Location"
      /> */}
    </div>
  );
};

export default AddOrEditAnnotationDialog({
  formName: "AddOrEditPrimerDialog",
  getProps: (props) => ({
    upsertAnnotation: props.upsertPrimer,
    annotationTypePlural: "primers",
    RenderBases
  })
});

const InnerWrapperMeltingTemp = (p) => (
  <div
    className="bp3-text-muted bp3-text-small"
    style={{ marginBottom: 15, marginTop: -5, fontStyle: "italic" }}
  >
    {p.children}
  </div>
);
