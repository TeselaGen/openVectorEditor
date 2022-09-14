import React from "react";
import {
  DialogFooter,
  InputField,
  wrapDialog
} from "teselagen-react-components";
import { compose } from "recompose";
import { reduxForm } from "redux-form";

export const EditTrackNameDialog = compose(
  wrapDialog({
    title: "Edit Track Name"
  }),
  reduxForm({ form: "EditTrackNameDialog" })
)(function ({ handleSubmit, updateName, hideModal }) {
  return (
    <div>
      <div className="bp3-dialog-body">
        <InputField
          autoFocus
          label="New Name"
          isRequired
          name="name"
        ></InputField>
      </div>
      <DialogFooter
        onClick={handleSubmit(async ({ name }) => {
          await updateName({ newName: name });
          hideModal();
        })}
      ></DialogFooter>
    </div>
  );
});
