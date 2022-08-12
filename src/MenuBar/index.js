import React from "react";
import { MenuBar, commandMenuEnhancer } from "teselagen-react-components";
import { compose } from "redux";
import { memoize } from "lodash";
import withEditorProps from "../withEditorProps";
import menuDef from "./defaultConfig";
import getCommands from "../commands";
import { Icon, Spinner } from "@blueprintjs/core";

const ident = (x) => x;

class OveMenuBar extends React.Component {
  constructor(props) {
    super(props);
    const commands = getCommands(this);
    window.oveMenuToastrSuccess = this.oveMenuToastrSuccess;
    this.enhancers = [
      commandMenuEnhancer(commands, {
        useTicks: true,
        omitIcons: true
      })
    ];
    this.counter = 0;
  }
  state = {
    // successMessage: "asdfasdf",
    // successMessageLoading: true
  };

  getFilteredMenu = memoize((menuFilter, menuDef) => {
    this.counter++;
    if (this.counter === 50)
      console.warn(
        `It's likely you're passing a new "menuFilter" function every time. This will cause unecessary re-renders. Try not to recreate a new function each time!`
      );
    return menuFilter(menuDef);
  });
  oveMenuToastrSuccess = (message, { loading } = {}) => {
    this.setState({ successMessage: message, successMessageLoading: loading });
    if (this.clearId) {
      clearTimeout(this.clearId);
    }
    this.clearId = setTimeout(() => {
      this.setState({ successMessage: "", successMessageLoading: false });
    }, 5000);
  };

  render() {
    const { menuFilter = ident } = this.props;

    // Clone original menu def to protect it from accidental mutation
    return (
      <div
        className="veMenuBarContainer"
        style={{ display: "flex", width: "100%" /* height: "100%" */ }}
      >
        <MenuBar
          extraContent={
            this.state.successMessage && (
              <div
                className="ove-menu-toast"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: 10
                }}
              >
                {this.state.successMessageLoading ? (
                  <div>
                    <Spinner size={15}></Spinner>
                  </div>
                ) : (
                  <Icon icon="tick-circle" intent="success"></Icon>
                )}{" "}
                &nbsp;
                {this.state.successMessage}
              </div>
            )
          }
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
