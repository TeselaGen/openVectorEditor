import { FileUploadField, wrapDialog } from "teselagen-react-components";
import React from "react";
import { compose } from "recompose";
import { reduxForm } from "redux-form";
import useLadders from "../utils/useLadders";
import { MenuItem } from "@blueprintjs/core";
import downloadjs from "downloadjs";
import { isArray } from "lodash";
import { hideDialog } from "../GlobalDialogUtils";

export const AddLaddersDialog = compose(
  wrapDialog({ title: "Add Ladder" }),
  reduxForm({ form: "AddLaddersDialog" })
)(function AddLaddersDialog({ setSelectedLadder }) {
  const [additionalLadders, setLadders] = useLadders();
  return (
    <div className="bp3-dialog-body">
      <FileUploadField
        fileLimit={1}
        threeDotMenuItems={
          <MenuItem
            text="Download Example File"
            onClick={() => {
              downloadjs(
                `{
  "value": "exampleRuler",
  "label": "Example Ladder 2Kb",
  "markings": [
    40000, 20000, 8000, 3000, 1500, 900, 440, 333,
    222, 17
  ]
}
`,
                `exampleLadderFile.json`,
                "text/plain"
              );
            }}
          />
        }
        name="ladderUpload"
        innerText="Upload a new ladder .json file"
        accept={[".json"]}
        readBeforeUpload
        style={{ maxWidth: 400 }}
        beforeUpload={async (files) => {
          try {
            const newLadder = JSON.parse(files[0].parsedString);
            if (!newLadder) {
              throw new Error(
                "No new ladder found. Use the example file for the proper JSON format"
              );
            }
            if (typeof newLadder.value !== "string") {
              throw new Error(
                "Incorrect value. Use the example file for the proper JSON format"
              );
            }
            if (typeof newLadder.label !== "string") {
              throw new Error(
                "Incorrect label. Use the example file for the proper JSON format"
              );
            }
            if (!isArray(newLadder.markings)) {
              throw new Error(
                "Incorrect markings. Use the example file for the proper JSON format"
              );
            }
            setLadders([...additionalLadders, newLadder]);
            window.toastr.success(`Added New Ladder ${newLadder.label}`);
            setSelectedLadder(newLadder.value);
          } catch (e) {
            console.error(`e:`, e);
            window.toastr.error(
              "Something went wrong with the file upload. Check the dev console for more details. Use the example file for the proper JSON format"
            );
          }
          hideDialog();
        }}
      />
    </div>
  );
});
