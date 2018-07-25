import React from "react";
import {
  Menu,
  MenuItem,
  // InputGroup,
  Popover,
  Position,
  Button,
  Classes
} from "@blueprintjs/core";

import withEditorProps from "../withEditorProps";
import defaultConfig from "./defaultConfig";

export class MenuBar extends React.Component {
  // state = {
  //   openItem: -1
  // };

  // toggleOpen = index => {
  //   if (this.state.openItem === index) {
  //     this.setState({
  //       openItem: -1
  //     });
  //   } else {
  //     this.setState({
  //       openItem: index
  //     });
  //   }
  // };

  render() {
    // const {} = this.props;

    const inner = defaultConfig.map(({ text, menu }, index) => {
      return (
        <Popover
          key={index}
          content={<Menu text={text}>{getMenu(menu)}</Menu>}
          minimal
          position={Position.BOTTOM}
        >
          <Button text={text} />
        </Popover>
      );
    });

    return (
      <div className={Classes.BUTTON_GROUP}>
        {inner}{" "}
        <Popover
          minimal
          content={
            <Menu>
              <MenuItem />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <Button text={"Help"} />
        </Popover>{" "}
      </div>
    );
  }
}

export default withEditorProps(MenuBar);

function getMenu(menu) {
  return menu.map(({ text, menu }, index) => {
    return (
      <MenuItem key={index} text={text}>
        {menu ? getMenu(menu) : null}
      </MenuItem>
    );
  });
}
