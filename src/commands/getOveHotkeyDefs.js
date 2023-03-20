import getCommands from "./index";
import { getCommandHotkeys } from "teselagen-react-components";

export default function getOveHotkeyDefs({ store, editorClassName }) {
  const commands = getCommands({
    props: {
      store,
      editorClassName
    }
  });
  return getCommandHotkeys(commands);
}
