import React from "react";
import {
  MenuDivider,
  Tooltip,
  KeyCombo,
  ContextMenu,
  MenuItem
} from "@blueprintjs/core";
import { omit } from "lodash";

export function EnhancedMenuItem({ navTo, ...props }, context) {
  let clickHandler = props.onClick;
  if (navTo) {
    clickHandler = e => {
      context.router.history.push(navTo);
      if (props.onClick) props.onClick(e);
    };
  }
  return <MenuItem {...props} onClick={clickHandler} />;
}

/**
 * Creates the contents of a Blueprint menu based on a given menu structure.
 *
 * The input can be an array of item objects, where each may contain:
 * text: text to show
 * key: React key to use (optional)
 * divider: indicates it's a divider instead of an item. Use an empty string
 *   for a normal divider, or some label text for a labeled one
 * icon: name of icon to show (optional)
 * label: right-aligned label, used mostly for shortcuts (optional)
 * hotkey: right-aligned label formatted with <KeyCombo> (optional)
 * tooltip: tooltip text to use (optional)
 * submenu: nested menu structure describing submenu (i.e. array of item objects),
 *   or array of MenuItem elements
 * onClick: click handler
 * navTo: a url to navigate to (assumes react-router)
 * href: a url to link to
 * target: link target
 *
 * Since this function is recursive (to handle nested submenus), and React
 * elements passed as input are returned unchanged, it is possible to freely mix
 * item objects and MenuItem elements. That also makes it safe to call the function
 * with its own output.
 *
 * A customize function may also be provided, and allows customization or
 * replacement of the created MenuItems, allowing for custom props or behavior.
 * That function receives the original created element and the item object, and
 * must return an element.
 *
 * Usage example:
 *
 * const menu = createMenu([
 *   { text: 'Item One', icon: 'add', onClick: () => console.log('Clicked 1') },
 *   { text: 'Item One', onClick: () => console.log('Clicked 2') },
 *   { divider: '' },
 *   { text: 'Item Three', icon: 'numerical', onClick: () => console.log('Clicked 3') },
 *   { divider: '' },
 *   { text: 'Submenus', submenu: [
 *     { text: 'Sub One' },
 *     { text: 'Sub Two' },
 *   ]},
 * ]);
 *
 */
export default function createMenu(_structure, customize, event) {
  const structure = filterMenuForCorrectness(_structure);

  if (!structure || !structure.length) return;

  const menuToRender = _createMenu(structure, 0, customize);
  if (event) {
    // mouse position is available on event
    ContextMenu.show(
      menuToRender,
      { left: event.clientX, top: event.clientY },
      () => {
        // menu was closed; callback optional
      }
    );
  } else {
    return menuToRender;
  }
}

function _createMenu(input, i, customize) {
  let out;
  if (React.isValidElement(input)) {
    // Assume it's already a <MenuItem> element
    out = input;
  } else if (input instanceof Array) {
    out = input.map((item, i) => _createMenu(item, i, customize));
  } else {
    const item = input;
    const key = item.key || item.text || item.divider || i;
    if (item.divider !== undefined) {
      out = (
        <MenuDivider
          key={key}
          {...(item.divider ? { title: item.divider } : {})}
        />
      );
    } else {
      if (!item.key && !item.text) {
        console.warn("Menu item with no key", item);
      }
      out = (
        <EnhancedMenuItem
          key={key}
          {...omit(item, ["submenu", "hotkey"])}
          icon={item.icon || item.iconName}
          labelElement={item.hotkey && <KeyCombo minimal combo={item.hotkey} />}
          text={item.text}
        >
          {item.submenu ? _createMenu(item.submenu, 0, customize) : undefined}
        </EnhancedMenuItem>
      );
    }

    if (customize) {
      out = customize(out, item);
    }

    if (item.tooltip) {
      out = (
        <Tooltip key={key} content={item.tooltip}>
          {out}
        </Tooltip>
      );
    }
  }
  return out;
}

function filterMenuForCorrectness(menu) {
  return menu && menu.length && menu.filter(item => item);
}
