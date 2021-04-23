import React from "react";
import { compose } from "redux";
import withEditorProps from "../withEditorProps";
import { withHotkeys } from "teselagen-react-components";
import getCommands from "../commands";
import {
  getCommandHotkeys,
  getCommandHotkeyHandlers,
  HotkeysDialog
} from "teselagen-react-components";

class CommandHotkeyHandler extends React.Component {
  constructor(props) {
    super(props);
    const commands = getCommands(this);
    // Don't bind clipboard shortcuts (use native ones directly)
    ["cut", "copy", "paste"].forEach((cmdId) => delete commands[cmdId]);
    this.hotkeyDefs = getCommandHotkeys(commands);
    this.handlers = getCommandHotkeyHandlers(commands);

    this.Handler = withHotkeys(this.hotkeyDefs, this.handlers);
  }

  render() {
    return (
      <React.Fragment>
        <this.Handler key="handla" />
        <HotkeysDialog
          dialogTitle="Editor Hotkeys"
          key="hotkeyDialog"
          hotkeySets={{
            Editor: {
              "Search File Menu": this.props.menuSearchHotkey || "cmd+/",
              ...this.hotkeyDefs
            }
          }}
          {...this.props.hotkeyDialogProps}
        />
      </React.Fragment>
    );
  }
}

export default compose(withEditorProps)(CommandHotkeyHandler);
