import React from "react";
import { Icon, Menu, Popover } from "@blueprintjs/core";
import { createMenu } from "teselagen-react-components";
import { applyCommandsToMenu } from "../utils/__temp_menuUtils";
import getCommands from "../commands";

export default {
  updateKeys: ["toggleDropdown"],
  itemProps: (props) => {
    return {
      tooltip: "Export",
      Icon: (
        <Popover
          minimal
          inline
          transitionDuration={0}
          content={
            <Menu>
              {createMenu(
                applyCommandsToMenu(
                  [{ cmd: "exportSequenceAsGenbank" }, { cmd: "exportSequenceAsFasta" }],
                  getCommands({ props })
                )
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
