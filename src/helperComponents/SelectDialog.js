import { convertRangeTo0Based } from "ve-range-utils";
import classNames from "classnames";
import React from "react";

import { reduxForm } from "redux-form";
import { wrapDialog } from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";

import { NumericInputField } from "teselagen-react-components";
import { get } from "lodash";
import { getRangeLength } from "ve-range-utils";
import { tryToRefocusEditor } from "../utils/editorUtils";
import tgFormValues from "../utils/tgFormValues";

// Single validation function - from & to have the same range
const validate = (val, vals, props) => {
  const { min, max } = get(props, "extraProps.from", {});
  const circular = get(props, "extraProps.circular");
  if ((min && val < min) || (max && val > max)) {
    return "Invalid position";
  }
  if (!circular && Number(vals.from) > Number(vals.to)) {
    return "Wrong from/to order";
  }
};
// const selector = formValueSelector("selectDialog");
export default compose(
  wrapDialog({
    isDraggable: true,
    width: 400,
    title: "Select Range",
    height: 270,
    onCloseHook: tryToRefocusEditor
  }),
  reduxForm({
    form: "selectDialog"
  }),
  tgFormValues("from", "to")
)(
  class SelectDialog extends React.Component {
    updateTempHighlight =
      ({ isStart, isEnd } = {}) =>
      (val) => {
        const { selectionLayerUpdate, from, to, invalid } = this.props;
        if (invalid) return;
        selectionLayerUpdate(
          convertRangeTo0Based({
            start: isStart ? Math.round(val) : from,
            end: isEnd ? Math.round(val) : to
          })
        );
      };
    componentDidMount() {
      const { from, to, initialCaretPosition } = this.props;
      this.initialSelection = { from, to, initialCaretPosition };
      this.updateTempHighlight()();
    }
    render() {
      const {
        hideModal,
        onSubmit,
        selectionLayerUpdate,
        from,
        to,
        initialCaretPosition,
        caretPositionUpdate,
        sequenceLength,
        extraProps,
        isProtein,
        invalid,
        handleSubmit
      } = this.props;
      const selectionLength = getRangeLength(
        {
          start: Number(from),
          end: Number(to)
        },
        sequenceLength
      );

      return (
        <form
          onSubmit={handleSubmit((data) => {
            if (onSubmit) onSubmit(data);
            hideModal();
            tryToRefocusEditor();
          })}
          className={classNames(
            Classes.DIALOG_BODY,
            "tg-min-width-dialog simple-dialog"
          )}
        >
          <NumericInputField
            autoFocus
            minorStepSize={1}
            label="From:"
            clampValueOnBlur
            {...extraProps.to}
            validate={validate}
            //tnrtodo this normalization will actually work when https://github.com/palantir/blueprint/issues/3553 gets resolved
            normalize={normalizeToInt}
            onAnyNumberChange={this.updateTempHighlight({ isStart: true })}
            name="from"
          />
          <NumericInputField
            label="To:"
            clampValueOnBlur
            minorStepSize={1}
            {...extraProps.from}
            validate={validate}
            normalize={normalizeToInt}
            onAnyNumberChange={this.updateTempHighlight({ isEnd: true })}
            name="to"
          />
          <div className="dialog-buttons">
            <Button
              onClick={() => {
                if (initialCaretPosition > -1) {
                  caretPositionUpdate(initialCaretPosition);
                } else {
                  selectionLayerUpdate({
                    start: this.initialSelection.from,
                    end: this.initialSelection.to
                  });
                }
                hideModal();
                tryToRefocusEditor();
              }}
              text="Cancel"
            />
            <Button
              type="submit"
              intent={Intent.PRIMARY}
              text={`Select ${invalid ? 0 : selectionLength} ${
                isProtein ? "AA" : "BP"
              }${selectionLength === 1 ? "" : "s"}`}
              disabled={invalid}
            />
          </div>
        </form>
      );
    }
  }
);

const normalizeToInt = (val) => {
  const int = Math.round(val);
  const normalizedVal = `${int >= 0 ? int : 1}`;
  return normalizedVal;
};
