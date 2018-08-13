import { startCase } from "lodash";

// TODO move this file to TRC


// TODO remove - copied from TRC
// Recursively walk the given menu and run each item through func
function walkMenu(menuDef, func) {
  if (menuDef instanceof Array) {
    return menuDef.map(item => walkMenu(item, func));
  }
  const out = func(menuDef);
  if (out.submenu) {
    out.submenu = out.submenu.map(item => walkMenu(item, func));
  }
  return out;
}

// First Non-Undefined
function fnu(...args) {
  return args.find(v => v !== undefined);
}

export const applyCommandsToMenu = (menu, commands, config = {}) => walkMenu(menu, _item => {
  const cmdId = typeof _item === 'string' ? _item : _item.cmd;
  if (!cmdId || !commands[cmdId] || _item.divider !== undefined) return { ..._item };
  const command = commands[cmdId];
  const item = typeof _item === 'string' ? {} : { ..._item };

  const { isActive, isDisabled } = command;
  const toggles = isActive !== undefined;

  const useTicks = fnu(item.useTicks, config.useTicks);
  delete item.useTicks;

  item.disabled = fnu(item.disabled, isDisabled);
  item.key = item.key || cmdId;

  if (toggles) {
    if (useTicks) {
      item.text = item.text || command.shortName || command.name;
      item.checked = isActive;
    } else {
      item.text = item.text || (isActive ? command.name : (command.inactiveName || command.name));
      item.icon = item.icon || (isActive ? command.icon : (command.inactiveIcon || command.icon));
    }
  } else {
    item.text = item.text || command.name;
    item.icon = item.icon || command.icon;
  }

  if (config.omitIcons) {
    item.icon = undefined;
  }

  item.hotkey = item.hotkey || command.hotkey;
  item.onClick = command.execute;
  return item;

});


// TODO move into TRC's createMenu or a new menu util
export const addMenuTicks = menu => walkMenu(menu, item => {
  const out = { ...item };
  out.key = out.key || out.cmd; // TODO remove
  out.icon = out.icon || "blank";
  if (out.checked !== undefined) {
    out.icon = out.checked ? "small-tick" : "blank";
  }
  return out;
});

export const addMenuTexts = menu => walkMenu(menu, item => {
  const out = { ...item };
  out.text = out.text || startCase(out.cmd);
  return out;
});
