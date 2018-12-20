import React from "react";
import { MenuBar, commandMenuEnhancer } from "teselagen-react-components";
import { compose } from "redux";
import withEditorProps from "../withEditorProps";
import menuDef from "./defaultConfig";
import getCommands from "../commands";
import pureNoFunc from "../utils/pureNoFunc";

const ident = x => x;

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

    const { menuFilter = ident } = props;
    // Clone original menu def to protect it from accidental mutation
    this.filteredMenuDef = menuFilter(JSON.parse(JSON.stringify(menuDef)));
  }

  render() {
    return (
      <div
        className="veMenuBarContainer"
        style={{ display: "flex" /* height: "100%" */ }}
      >
        <MenuBar menu={this.filteredMenuDef} enhancers={this.enhancers} />
        <div
          className="menuBarDivider"
          style={{
            height: "87%",
            width: 2,
            margin: 2,
            background: "lightgrey"
          }}
        />
      </div>
    );
  }
}

export default compose(withEditorProps)(pureNoFunc(OveMenuBar));
