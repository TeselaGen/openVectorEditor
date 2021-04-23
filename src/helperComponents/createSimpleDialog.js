import React from "react";

import { reduxForm } from "redux-form";
import { startCase } from "lodash";
import { withProps } from "recompose";
import { InputField, wrapDialog } from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import "./simpleDialog.css";
import { tryToRefocusEditor } from "../utils/editorUtils";

// TODO: move to TRC
class SimpleGenericDialogForm extends React.Component {
  render() {
    const {
      hideModal,
      handleSubmit,
      fields,
      buttonText = "OK",
      showCancel = true,
      onSubmit,
      invalid,
      extraProps = {}
    } = this.props;
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
        {fields.map((field, i) => {
          const { component, isRequired, ...props } = field;
          const FieldComp = component || InputField;
          const fieldProps = {
            autoFocus: i === 0,
            ...props,
            ...extraProps[props.name]
          };
          fieldProps.label =
            fieldProps.label || startCase(fieldProps.name) + ":";
          if (isRequired) fieldProps.validate = required;
          return <FieldComp key={field.name} {...fieldProps} />;
        })}
        <div className="dialog-buttons">
          {showCancel && (
            <Button
              onClick={() => {
                hideModal();
                tryToRefocusEditor();
              }}
              text="Cancel"
            />
          )}
          <Button
            type="submit"
            intent={Intent.PRIMARY}
            text={buttonText}
            disabled={invalid}
          />
        </div>
      </form>
    );
  }
}

function required(val) {
  if (!val) return "Required";
}

export default function createSimpleDialog(props) {
  return compose(
    wrapDialog({
      isDraggable: true,
      width: 400,
      ...props.withDialogProps
    }),
    reduxForm({
      form: props.formName
    }),
    withProps(props)
  )(SimpleGenericDialogForm);
}
