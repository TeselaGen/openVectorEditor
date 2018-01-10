import { ContextMenu, Menu, MenuItem } from "@blueprintjs/core";
import React from "react";
import { lifecycle } from "recompose";
import { KeyCombo } from "@blueprintjs/core/dist/esm/components/hotkeys/keyCombo";

function filterMenuForCorrectness(menu) {
  return menu && menu.length && menu.filter(item => item);
}
export default function bpContext(_menu, e) {
  const menu = filterMenuForCorrectness(_menu);
  if (!menu || !menu.length) return;
  const menuToRender = (
    <Menu className={"openVeContextMenu"}>{getChildren(menu)}</Menu>
  );

  // mouse position is available on event
  ContextMenu.show(menuToRender, { left: e.clientX, top: e.clientY }, () => {
    // menu was closed; callback optional
  });
}

function getChildren(menu) {
  return menu.map((menu, i) => {
    return <Child key={i} {...menu} />;
  });
}

const Child = lifecycle({
  componentDidMount: function() {
    const { didMount = () => {}, className } = this.props;
    didMount({ className });
  },
  componentWillUnmount: function() {
    const { willUnmount = () => {}, className } = this.props;
    willUnmount({ className });
  }
})(
  ({
    className = "openVeContextMenuItem",
    innerJsx,
    hotkey,
    menu,
    ...rest
  }) => {
    const filteredMenu = filterMenuForCorrectness(menu);
    const innerMenu =
      innerJsx ||
      (filteredMenu && filteredMenu.length && getChildren(filteredMenu));
    return (
      <MenuItem
        {...hotkey && {
          label: (
            <span style={{ paddingLeft: 3 }}>
              <KeyCombo combo={hotkey} />
            </span>
          )
        }}
        {...{ className, ...rest }}
      >
        {innerMenu}
      </MenuItem>
    );
  }
);
