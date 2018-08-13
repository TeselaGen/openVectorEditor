import createSimpleDialog from "./createSimpleDialog";
import { NumericInputField } from "teselagen-react-components";

export default createSimpleDialog({
  formName: "selectDialog",
  fields: [
    { name: "from", component: NumericInputField },
    { name: "to", component: NumericInputField },
  ],
  dialogProps: { title: "Select Range", height: 250 }
});
