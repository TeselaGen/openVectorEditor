import createSimpleDialog from "./createSimpleDialog";
import { NumericInputField } from "teselagen-react-components";
import { get } from "lodash";

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
  dialogProps: { title: "Go To", height: 190 }
});
