import React from "react";
import { MenuDivider, Tooltip, KeyCombo } from "@blueprintjs/core";
import { EnhancedMenuItem } from "teselagen-react-components";
import { startCase, omit } from "lodash";

// TODO move this file to TRC

// First Non-Undefined
function fnu(...args) {
  return args.find(v => v !== undefined);
}

// Sets a tick icons if items has a `checked` prop
export const tickMenuEnhancer = def => {
  const out = { ...def };
  if (out.checked !== undefined) {
    out.icon = out.checked ? "small-tick" : "blank";
  }
  return out;
};

// Derives various menu item props based on command objects matched via the `cmd`
// prop. Derived props include `text`, `icon`, `hotkey`, `onClick` and `disabled`.
export const commandMenuEnhancer = (commands, config = {}) => def => {
  const cmdId = typeof def === "string" ? def : def.cmd;
  let item = typeof def === "string" ? { cmd: def } : { ...def };

  const useTicks = fnu(item.useTicks, config.useTicks);
  delete item.useTicks;

  if (cmdId && commands[cmdId] && def.divider === undefined) {
    const command = commands[cmdId];

    const { isActive, isDisabled } = command;
    const toggles = isActive !== undefined;

    item.disabled = fnu(item.disabled, isDisabled);
    item.key = item.key || cmdId;

    if (toggles) {
      if (useTicks) {
        item.text = item.text || command.shortName || command.name;
        item.checked = isActive;
      } else {
        item.text =
          item.text ||
          (isActive ? command.name : command.inactiveName || command.name);
        item.icon =
          item.icon ||
          (isActive ? command.icon : command.inactiveIcon || command.icon);
      }
    } else {
      item.text = item.text || command.name;
      item.icon = item.icon || command.icon;
    }

    item.hotkey = item.hotkey || command.hotkey;
    item.onClick = command.execute;
  } else if (cmdId && !commands[cmdId]) {
    item.text = item.text || startCase(cmdId);
    item.disabled = true;
  }

  if (config.omitIcons) {
    item.icon = undefined;
  }

  if (config.forceIconAlignment !== false) {
    item.icon = item.icon || "blank";
  }

  if (useTicks) {
    item = tickMenuEnhancer(item);
  }

  return item;
};

const ident = x => x;

/** A menu item component that adds many features over the standard MenuItem
 * TODO: extend documentation
 */
export const DynamicMenuItem = ({ def, enhancers = [ident] }) => {
  const item = enhancers.reduce((v, f) => f(v), def);
  let out;

  if (item.divider !== undefined) {
    out = <MenuDivider {...(item.divider ? { title: item.divider } : {})} />;
  } else {
    out = (
      <EnhancedMenuItem
        {...omit(item, ["submenu", "hotkey"])}
        icon={item.icon || item.iconName}
        labelElement={item.hotkey && <KeyCombo minimal combo={item.hotkey} />}
        text={item.text}
      >
        {item.submenu
          ? item.submenu.map((def, index) => (
              <DynamicMenuItem {...{ def, enhancers }} key={index} />
            ))
          : undefined}
      </EnhancedMenuItem>
    );
  }

  if (item.tooltip) {
    out = <Tooltip content={item.tooltip}>{out}</Tooltip>;
  }

  return out;
};

// Map the passed item definition(s) to DynamicMenuItem elements
export const createDynamicMenu = (menuDef, enhancers) => {
  if (menuDef instanceof Array) {
    return menuDef.map((def, index) => (
      <DynamicMenuItem def={def} enhancers={enhancers} key={index} />
    ));
  } else {
    return <DynamicMenuItem def={menuDef} enhancers={enhancers} />;
  }
};

// Create a "bar" menu, keeping the top level array unchanged, and only
// map their submenus to DynamicMenuItem elements
export const createDynamicBarMenu = (topMenuDef, enhancers) => {
  return topMenuDef.map(topLevelItem => {
    const def = { ...topLevelItem };
    if (def.submenu) {
      def.submenu = def.submenu.map((subdef, index) => (
        <DynamicMenuItem def={subdef} enhancers={enhancers} key={index} />
      ));
    }
    return def;
  });
};

// Shorthand for command-based menus
export const createCommandMenu = (menuDef, commands, config) => {
  return createDynamicMenu(menuDef, [commandMenuEnhancer(commands, config)]);
};

// Shorthand for command-based bar menus
export const createCommandBarMenu = (menuDef, commands, config) => {
  return createDynamicBarMenu(menuDef, [commandMenuEnhancer(commands, config)]);
};
