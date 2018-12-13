import createSimpleDialog from "./createSimpleDialog";
import { NumericInputField } from "teselagen-react-components";
import { get } from "lodash";

// Single validation function - from & to have the same range
const validate = (val, vals, props) => {
  const { min, max } = get(props, "extraProps.from", {});
  if ((min && val < min) || (max && val > max)) {
    return "Invalid position";
  }
  if (vals.from > vals.to) {
    return "Wrong from/to order";
  }
};

export default createSimpleDialog({
  formName: "selectDialog",
  fields: [
    { name: "from", component: NumericInputField, validate },
    { name: "to", component: NumericInputField, validate }
  ],
  dialogProps: { title: "Select Range", height: 270 }
});
