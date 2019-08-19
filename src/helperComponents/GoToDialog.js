import createSimpleDialog from "./createSimpleDialog";
import { NumericInputField } from "teselagen-react-components";
import { get } from "lodash";
import { tryToRefocusEditor } from "../utils/editorUtils";

export default createSimpleDialog({
  formName: "goToDialog",
  fields: [
    {
      name: "sequencePosition",
      component: NumericInputField,
      validate: (val, vals, props) => {
        const { min, max } = get(props, "extraProps.sequencePosition", {});
        return (min && val < min) || (max && val > max)
          ? "Invalid position"
          : undefined;
      }
    }
  ],
  withDialogProps: { title: "Go To", height: 190, onCloseHook: tryToRefocusEditor }
});
