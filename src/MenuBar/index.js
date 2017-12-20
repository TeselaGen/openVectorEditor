import React from "react";
import {
  Menu,
  MenuItem,
  // InputGroup,
  Popover,
  Position,
  Button
} from "@blueprintjs/core";
// import {Popover2 as Popover, Suggest} from '@blueprintjs/labs';

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
          popoverClassName="pt-minimal"
          tetherOptions={{
            constraints: [{ attachment: "together", to: "scrollParent" }]
          }}
          position={Position.BOTTOM}
        >
          <Button text={text} />
        </Popover>
      );
    });

    return (
      <div className={"pt-button-group"}>
        {inner}{" "}
        <Popover
          content={
            <Menu>
              {/* tnr comment the following back in once the momentjs issue is fixed https://github.com/palantir/blueprint/issues/1847 */}
              {/* <Suggest
                autoFocus
                items={["yo", "my", "dude"]}
                onItemSelect={(one) => {
                  console.log('chose this one:', one)
                }}
                onChange={yup => {
                  console.log('hup:')
                }}
                leftIconName={"search"}
              /> */}

              <MenuItem />
            </Menu>
          }
          popoverClassName="pt-minimal"
          tetherOptions={{
            constraints: [{ attachment: "together", to: "scrollParent" }]
          }}
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
