import React from "react";
import { Icon, Menu, Popover } from "@blueprintjs/core";
import { createCommandMenu } from "teselagen-react-components";
import getCommands from "../commands";

export default {
  updateKeys: ["toggleDropdown"],
  itemProps: props => {
    return {
      tooltip: "Export",
      Icon: (
        <Popover
          minimal
          inline
          transitionDuration={0}
          content={
            <Menu>
              {createCommandMenu(
                [
                  "exportSequenceAsGenbank",
                  "exportSequenceAsFasta",
                  "exportSequenceAsTeselagenJson"
                ],
                getCommands({ props })
              )}
            </Menu>
          }
        >
          <Icon icon="export" />
        </Popover>
      )
    };
  }
};
