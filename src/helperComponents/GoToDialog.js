import createSimpleDialog from "./createSimpleDialog";
import { NumericInputField } from "teselagen-react-components";

export default createSimpleDialog({
  formName: "goToDialog",
  fields: [{ name: "sequencePosition", component: NumericInputField }],
  dialogProps: { title: "Go To", height: 180 }
});
