import React from "react";
import { MenuBar, commandMenuEnhancer } from "teselagen-react-components";
import { compose } from "redux";
import { memoize } from "lodash";
import withEditorProps from "../withEditorProps";
import menuDef from "./defaultConfig";
import getCommands from "../commands";

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
    this.counter = 0;
  }

  getFilteredMenu = memoize((menuFilter, menuDef) => {
    this.counter++;
    if (this.counter === 50)
      console.warn(
        `It's likely you're passing a new "menuFilter" function every time. This will cause unecessary re-renders. Try not to recreate a new function each time!`
      );
    return menuFilter(JSON.parse(JSON.stringify(menuDef)));
  });

  render() {
    const { menuFilter = ident } = this.props;
    // Clone original menu def to protect it from accidental mutation
    return (
      <div
        className="veMenuBarContainer"
        style={{ display: "flex" /* height: "100%" */ }}
      >
        <MenuBar
          menu={this.getFilteredMenu(menuFilter, menuDef)}
          enhancers={this.enhancers}
        />
        {/* <div
          className="menuBarDivider"
          style={{
            height: "87%",
            width: 2,
            margin: 2,
            background: "lightgrey"
          }}
        /> */}
      </div>
    );
  }
}

export default compose(withEditorProps)(OveMenuBar);
