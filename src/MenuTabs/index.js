import React, { Component } from "react";
import { compose } from "redux";
import { EuiTabbedContent } from "@elastic/eui";
import buildTabs from "./tabs";
import withEditorProps from "../withEditorProps";
import getCommands from "../commands";

class MenuTabs extends Component {
  constructor(props) {
    super(props);
    this.commands = getCommands(this);
    this.tabs = buildTabs(this.commands);
    this.state = { selectedTab: this.tabs.at(0) };

    this.onSelectTabChanged = this.onSelectTabChanged.bind(this);
  }

  onSelectTabChanged(id) {
    this.setState({ selectedTab: id });
  }

  render() {
    return (
      <EuiTabbedContent
        tabs={this.tabs}
        selectedTab={this.state.selectedTab}
        onTabClick={this.onSelectTabChanged}
      />
    );
  }
}

export default compose(withEditorProps)(MenuTabs);
