import React from "react";
import { MenuBar, commandMenuEnhancer } from "teselagen-react-components";
import { compose } from "redux";
import withEditorInteractions from "../withEditorInteractions";
import menuDef from "./defaultConfig";
import getCommands from "../commands";

class OveMenuBar extends React.Component {
  constructor(props) {
    super(props);
    const commands = getCommands(this);
    this.enhancers = [
      commandMenuEnhancer(commands, {
        useTicks: true,
        omitIcons: true
      })
    ];
  }

  render() {
    return <MenuBar menu={menuDef} enhancers={this.enhancers} />;
  }
}

export default compose(withEditorInteractions)(OveMenuBar);
