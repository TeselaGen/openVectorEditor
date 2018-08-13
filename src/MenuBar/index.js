import React from "react";
import { MenuBar } from "teselagen-react-components";
import { compose } from "redux";
import withEditorInteractions from "../withEditorInteractions";
import getMenuDef from "./defaultConfig";
import getCommands from "../commands";


class OveMenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.commands = getCommands(this);
  }

  render() {
    return <MenuBar menu={getMenuDef(this.commands)} />;
  }
}

export default compose(withEditorInteractions)(OveMenuBar)
