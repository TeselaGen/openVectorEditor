import { startCase } from 'lodash';

//TODO move to TRC

export function createGenericCommandHandlers(config) {
  const out = {};
  for (let cmd in config.handlers) {
    out[cmd] = () => {
      config.handleReturn(
        cmd,
        config.handlers[cmd].apply(out, config.getArguments(cmd))
      )
    };
  }
  return out;
}

export function createReduxCommandHandlers(store, handlers) {
  return createGenericCommandHandlers({
    getArguments() {
      return [store.getState(), store.dispatch, store];
    },
    handleReturn(cmd, value) {
      if (value) {
        store.dispatch(value);
      }
    },
    handlers
  });
}

export function genericCommandFactory(config) {
  const out = {};
  for (let cmdId in config.commandDefs) {
    const def = config.commandDefs[cmdId];
    const command = { id: cmdId };
    command.execute = () => {
      config.handleReturn(
        cmdId,
        def.handler.apply(command, config.getArguments(cmdId))
      );
    };

    const properties = ['icon', 'name', 'description', 'hotkey', 'hotkeyProps',
      'isDisabled', 'isActive', 'inactiveIcon', 'inactiveName'];

    properties.forEach(prop => {
      if (def[prop] !== undefined) {
        if (typeof def[prop] === 'function') {
          Object.defineProperty(command, prop, { get: () => {
            return def[prop].apply(command, config.getArguments(cmdId));
          }});
        } else {
          command[prop] = def[prop];
        }
      }
    });

    if (!def.name) {
      command.name = startCase(cmdId);
    }

    if (def.toggle && cmdId.startsWith('toggle')) {
      command.name = startCase(cmdId.replace('toggle', def.toggle[0] || ''));
      command.inactiveName = startCase(cmdId.replace('toggle', def.toggle[1] || ''));
      command.shortName = startCase(cmdId.replace('toggle', ''));
    }

    out[cmdId] = command;
  }

  return out;
}

export function oveCommandFactory(instance, commandDefs) {
  return genericCommandFactory({
    getArguments() {
      const args = [instance.props];
      const { store, editorName } = instance.props;
      if (store && editorName) {
        args.push(store.getState().VectorEditor[editorName]);
      }
      return args;
    },
    handleReturn: () => {},
    commandDefs
  })
}

export function getCommandHotkeys(commandsOrDefs) {
  const hotkeyDefs = {};
  Object.keys(commandsOrDefs).forEach(cmdId => {
    if (commandsOrDefs[cmdId].hotkey) {
      hotkeyDefs[cmdId] = {
        combo: commandsOrDefs[cmdId].hotkey,
        label: commandsOrDefs[cmdId].name || startCase(cmdId),
        ...commandsOrDefs[cmdId].hotkeyProps
      };
    }
  });

  return hotkeyDefs;
}

export function getCommandHandlers(commands) {
  const handlers = {};
  Object.keys(commands).forEach(cmdId => {
    if (commands[cmdId].hotkey) {
      handlers[cmdId] = commands[cmdId].execute;
    }
  });

  return handlers;
}


// export function createOveCommandHandlers(instance, handlers) {
//   return createGenericCommandHandlers({
//     getArguments() {
//       return [instance.props];
//     },
//     handleReturn: () => {},
//     handlers
//   });
// }
