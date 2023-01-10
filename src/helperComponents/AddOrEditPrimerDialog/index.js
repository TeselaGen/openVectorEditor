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
import { flatMap } from "lodash";
import CaretPositioning, {
  selectionSaveCaretPosition
} from "./EditCaretPosition";
import { Menu, MenuItem } from "@blueprintjs/core";

import MeltingTemp from "../../StatusBar/MeltingTemp";
import { getStructuredBases } from "../../RowItem/StackedAnnotations/getStructuredBases";

const CustomContentEditable = generateField(function CustomContentEditable({
  input,
  disabled,
  sequenceData,
  sequenceLength,
  start,
  end,
  primerBindsOn,
  bases,
  forward
}) {
  const [hasTempError, setTempError] = useState(false);
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

  const basesToUse = bases || "";
  const { allBasesWithMetaData } = getStructuredBases({
    annotationRange: { start: start - 1, end: end - 1 },
    forward,
    bases: basesToUse,
    start: start - 1,
    end: end - 1,
    fullSequence: sequenceData.sequence,
    primerBindsOn,
    sequenceLength
  });
  let html = flatMap(
    allBasesWithMetaData,
    ({ b, isMatch, isAmbiguousMatch }) => {
      if (b === "&") return [];
      return `<span class="${
        isMatch
          ? ""
          : isAmbiguousMatch
          ? "tg-ambiguous-match-seq"
          : "tg-no-match-seq"
      }">${b}</span>`;
    }
  );
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
        spellCheck="false"
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
    readOnly,
    start,
    end,
    linkedOligo,
    getLinkedOligoLink,
    useLinkedOligo,
    sequenceLength,
    primerBindsOn,
    bases,
    forward,
    defaultLinkedOligoMessage,
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
          tooltipInfo={`Check this box if you'd like to link this primer to an oligo in your Oligo Library.`}
          noMarginBottom
          defaultValue={true}
          disabled={readOnly}
        ></CheckboxField>
        {useLinkedOligo && (
          <div
            className="tg-linked-oligo-holder"
            style={{ marginTop: -5, fontStyle: "italic", fontSize: 11 }}
          >
            {(getLinkedOligoLink && getLinkedOligoLink(props)) ||
              linkedOligo ||
              (defaultLinkedOligoMessage !== undefined
                ? defaultLinkedOligoMessage
                : "Will Be Created On Save")}
          </div>
        )}
      </div>
      {useLinkedOligo && (
        <div>
          <CustomContentEditable
            // inlineLabel
            showErrorIfUntouched
            tooltipError
            primerBindsOn={primerBindsOn}
            validate={validate}
            sequenceLength={sequenceLength}
            disabled={readOnly}
            {...props}
            {...(defaultValue
              ? {
                  defaultValue
                }
              : {})}
            name="bases"
            label={
              <div className="tg-bases-label">
                <div style={{ display: "flex" }}>
                  Bases{" "}
                  <div style={{ fontSize: 10 }}>
                    {" "}
                    &nbsp; (Length: {bases ? bases.length : 0})
                  </div>
                </div>
                <div style={{ width: "fit-content" }}>
                  <DropdownButton
                    disabled={readOnly}
                    intent="primary"
                    small
                    menu={
                      <Menu>
                        <MenuItem
                          onClick={() => {
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
              disabled={readOnly}
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
